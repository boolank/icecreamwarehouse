import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { ReturnOrder } from "./entities/return-order.entity";
import { ReturnOrderItem } from "./entities/return-order-item.entity";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";
import { ProductBatch } from "../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";
import { Product } from "../master-data/entities/product.entity";
import { JournalEngineService } from "../accounting/journal-engine.service";
import { CreateReturnOrderDto } from "./dto/create-return-order.dto";
import { DisposeReturnOrderDto } from "./dto/dispose-return-order.dto";

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(ReturnOrder)
    private readonly returnRepo: Repository<ReturnOrder>,
    @InjectRepository(ReturnOrderItem)
    private readonly returnItemRepo: Repository<ReturnOrderItem>,
    @InjectRepository(InventoryStock)
    private readonly stockRepo: Repository<InventoryStock>,
    @InjectRepository(InventoryTransaction)
    private readonly txRepo: Repository<InventoryTransaction>,
    @InjectRepository(ProductBatch)
    private readonly batchRepo: Repository<ProductBatch>,
    @InjectRepository(FreezerLocation)
    private readonly freezerRepo: Repository<FreezerLocation>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly journalEngine: JournalEngineService,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Menghasilkan nomor dokumen retur otomatis: RTN-YYYYMM-XXXX
   */
  async generateReturnNumber(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `RTN-${yearMonth}-`;

    const last = await this.returnRepo
      .createQueryBuilder("r")
      .where("r.return_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("r.id", "DESC")
      .getOne();

    let seq = 1;
    if (last) {
      const parts = last.returnNumber.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * Mencatat retur pelanggan dan mengalokasikan fisik ke ruang/rak Karantina
   */
  async createCustomerReturn(
    dto: CreateReturnOrderDto,
    userId: number = 1
  ): Promise<ReturnOrder> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException("Item retur tidak boleh kosong.");
    }

    const defaultQuarantine = await this.freezerRepo.findOne({
      where: { is_quarantine: true },
    });

    const returnNumber = await this.generateReturnNumber();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalValue = 0;
      const returnItems: ReturnOrderItem[] = [];

      for (const itemDto of dto.items) {
        const batch = await queryRunner.manager.findOne(ProductBatch, {
          where: { id: itemDto.batchId },
        });
        if (!batch) {
          throw new NotFoundException(
            `Nomor Batch ID ${itemDto.batchId} tidak ditemukan.`
          );
        }

        // Tentukan lokasi karantina
        let locId = itemDto.freezerLocationId;
        if (!locId) {
          if (!defaultQuarantine) {
            throw new BadRequestException(
              "Gudang belum memiliki lokasi freezer karantina (is_quarantine = true)."
            );
          }
          locId = defaultQuarantine.id;
        } else {
          const loc = await queryRunner.manager.findOne(FreezerLocation, {
            where: { id: locId },
          });
          if (!loc || !loc.is_quarantine) {
            throw new BadRequestException(
              "Barang retur wajib ditempatkan pada lokasi rak berstatus Karantina."
            );
          }
        }

        const unitCost = Number(batch.costPricePerBaseUom || 0);
        const itemTotal = itemDto.returnQtyBaseUom * unitCost;
        totalValue += itemTotal;

        const returnItem = queryRunner.manager.create(ReturnOrderItem, {
          productId: itemDto.productId,
          batchId: itemDto.batchId,
          freezerLocationId: locId,
          returnQtyBaseUom: itemDto.returnQtyBaseUom,
          unitCost: unitCost,
          totalCost: itemTotal,
          condition: itemDto.condition,
          createdBy: userId,
        });
        returnItems.push(returnItem);

        // Tambahkan stok fisik ke zona karantina
        let qStock = await queryRunner.manager.findOne(InventoryStock, {
          where: {
            productId: itemDto.productId,
            batchId: itemDto.batchId,
            freezerLocationId: locId,
          },
        });

        if (qStock) {
          qStock.quantityInBaseUom =
            Number(qStock.quantityInBaseUom) + itemDto.returnQtyBaseUom;
        } else {
          qStock = queryRunner.manager.create(InventoryStock, {
            productId: itemDto.productId,
            batchId: itemDto.batchId,
            freezerLocationId: locId,
            quantityInBaseUom: itemDto.returnQtyBaseUom,
          });
        }
        await queryRunner.manager.save(qStock);

        // Catat transaksi mutasi stok RETURN_IN
        const tx = queryRunner.manager.create(InventoryTransaction, {
          productId: itemDto.productId,
          batchId: itemDto.batchId,
          freezerLocationId: locId,
          transactionType: "RETURN_IN",
          quantityInBaseUom: itemDto.returnQtyBaseUom,
          referenceType: "RETURN_ORDER",
          referenceId: 0,
          notes: `Penerimaan Retur ${returnNumber} - Kondisi: ${itemDto.condition}`,
          createdBy: userId,
        });
        await queryRunner.manager.save(tx);
      }

      const returnOrder = queryRunner.manager.create(ReturnOrder, {
        returnNumber,
        returnType: dto.returnType,
        soId: dto.soId || null,
        customerId: dto.customerId || null,
        supplierId: dto.supplierId || null,
        reason: dto.reason,
        status: "QUARANTINE",
        totalValue,
        created_by: userId,
        items: returnItems,
      });

      const savedReturn = await queryRunner.manager.save(returnOrder);

      await queryRunner.commitTransaction();
      return savedReturn;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Eksekusi disposisi retur & pemusnahan (Write-Off) atau klaim pemasok
   */
  async disposeReturn(
    id: number,
    dto: DisposeReturnOrderDto,
    userId: number = 1
  ): Promise<ReturnOrder> {
    const returnOrder = await this.returnRepo.findOne({
      where: { id },
      relations: ["items", "items.product", "items.batch", "customer"],
    });

    if (!returnOrder) {
      throw new NotFoundException(`Dokumen Retur ID ${id} tidak ditemukan.`);
    }

    if (returnOrder.status !== "QUARANTINE") {
      throw new BadRequestException(
        `Dokumen retur ini sudah berstatus ${returnOrder.status} dan tidak dapat didisposisi ulang.`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (dto.disposition === "WRITE_OFF") {
        // 1. Kurangi stok karantina untuk setiap item
        for (const item of returnOrder.items) {
          const qStock = await queryRunner.manager.findOne(InventoryStock, {
            where: {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: item.freezerLocationId,
            },
          });

          if (qStock) {
            const currentQty = Number(qStock.quantityInBaseUom);
            const deductQty = Math.min(currentQty, item.returnQtyBaseUom);
            qStock.quantityInBaseUom = currentQty - deductQty;
            await queryRunner.manager.save(qStock);
          }

          // Catat audit mutasi pemusnahan
          const tx = queryRunner.manager.create(InventoryTransaction, {
            productId: item.productId,
            batchId: item.batchId,
            freezerLocationId: item.freezerLocationId,
            transactionType: "WRITE_OFF",
            quantityInBaseUom: -item.returnQtyBaseUom,
            referenceType: "RETURN_ORDER",
            referenceId: returnOrder.id,
            notes: `Pemusnahan Berita Acara ${returnOrder.returnNumber}: ${dto.dispositionNotes}`,
            createdBy: userId,
          });
          await queryRunner.manager.save(tx);
        }

        // 2. Terbitkan Jurnal Beban Kerugian Barang Rusak / Spoilage
        const totalLoss = Number(returnOrder.totalValue);
        if (totalLoss > 0) {
          await this.journalEngine.createSpoilageJournal({
            returnNumber: returnOrder.returnNumber,
            totalLossAmount: totalLoss,
            reason: dto.dispositionNotes,
            userId,
            queryRunner,
          });
        }

        returnOrder.status = "DISPOSED";
        returnOrder.disposition = "WRITE_OFF";
      } else if (dto.disposition === "RESTOCK") {
        // Pindahkan dari karantina ke lokasi rak aktif
        const targetLocId = dto.targetFreezerLocationId;
        if (!targetLocId) {
          throw new BadRequestException(
            "Wajib memilih lokasi rak freezer tujuan untuk restock."
          );
        }

        const targetLoc = await queryRunner.manager.findOne(FreezerLocation, {
          where: { id: targetLocId },
        });
        if (!targetLoc || targetLoc.is_quarantine) {
          throw new BadRequestException(
            "Lokasi tujuan restock harus merupakan lokasi freezer aktif non-karantina."
          );
        }

        for (const item of returnOrder.items) {
          // Kurangi dari karantina
          const qStock = await queryRunner.manager.findOne(InventoryStock, {
            where: {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: item.freezerLocationId,
            },
          });
          if (qStock) {
            qStock.quantityInBaseUom =
              Number(qStock.quantityInBaseUom) - item.returnQtyBaseUom;
            await queryRunner.manager.save(qStock);
          }

          // Tambah ke rak aktif tujuan
          let activeStock = await queryRunner.manager.findOne(InventoryStock, {
            where: {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: targetLocId,
            },
          });
          if (activeStock) {
            activeStock.quantityInBaseUom =
              Number(activeStock.quantityInBaseUom) + item.returnQtyBaseUom;
          } else {
            activeStock = queryRunner.manager.create(InventoryStock, {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: targetLocId,
              quantityInBaseUom: item.returnQtyBaseUom,
            });
          }
          await queryRunner.manager.save(activeStock);

          const tx = queryRunner.manager.create(InventoryTransaction, {
            productId: item.productId,
            batchId: item.batchId,
            freezerLocationId: targetLocId,
            transactionType: "RESTOCK",
            quantityInBaseUom: item.returnQtyBaseUom,
            referenceType: "RETURN_ORDER",
            referenceId: returnOrder.id,
            notes: `Restock lolos QC ${returnOrder.returnNumber} ke ${targetLoc.location_code}`,
            createdBy: userId,
          });
          await queryRunner.manager.save(tx);
        }

        returnOrder.status = "DISPOSED";
        returnOrder.disposition = "RESTOCK";
      } else if (dto.disposition === "RETURN_TO_SUPPLIER") {
        for (const item of returnOrder.items) {
          const qStock = await queryRunner.manager.findOne(InventoryStock, {
            where: {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: item.freezerLocationId,
            },
          });
          if (qStock) {
            qStock.quantityInBaseUom =
              Number(qStock.quantityInBaseUom) - item.returnQtyBaseUom;
            await queryRunner.manager.save(qStock);
          }

          const tx = queryRunner.manager.create(InventoryTransaction, {
            productId: item.productId,
            batchId: item.batchId,
            freezerLocationId: item.freezerLocationId,
            transactionType: "SUPPLIER_CLAIM",
            quantityInBaseUom: -item.returnQtyBaseUom,
            referenceType: "RETURN_ORDER",
            referenceId: returnOrder.id,
            notes: `Klaim retur ke supplier: ${returnOrder.returnNumber}`,
            createdBy: userId,
          });
          await queryRunner.manager.save(tx);
        }

        returnOrder.status = "APPROVED_CLAIM";
        returnOrder.disposition = "RETURN_TO_SUPPLIER";
      }

      returnOrder.reason = returnOrder.reason
        ? `${returnOrder.reason} | Disposisi: ${dto.dispositionNotes}`
        : dto.dispositionNotes;
      returnOrder.approvedAt = new Date();
      returnOrder.approvedBy = userId;

      const saved = await queryRunner.manager.save(returnOrder);

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Mengambil semua daftar dokumen retur
   */
  async findAll(): Promise<ReturnOrder[]> {
    return this.returnRepo.find({
      relations: [
        "items",
        "items.product",
        "items.batch",
        "items.freezerLocation",
        "customer",
        "salesOrder",
      ],
      order: { id: "DESC" },
    });
  }

  /**
   * Mengambil detail satu dokumen retur
   */
  async findOne(id: number): Promise<ReturnOrder> {
    const ro = await this.returnRepo.findOne({
      where: { id },
      relations: [
        "items",
        "items.product",
        "items.batch",
        "items.freezerLocation",
        "customer",
        "salesOrder",
      ],
    });
    if (!ro) {
      throw new NotFoundException(`Dokumen retur ID ${id} tidak ditemukan.`);
    }
    return ro;
  }

  /**
   * Mengambil saldo fisik inventaris yang sedang berada di zona karantina
   */
  async getQuarantineInventory(): Promise<any[]> {
    return this.stockRepo
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.product", "p")
      .innerJoinAndSelect("s.batch", "b")
      .innerJoinAndSelect("s.freezerLocation", "fl")
      .where("fl.is_quarantine = TRUE")
      .andWhere("s.quantity_in_base_uom > 0")
      .orderBy("b.expired_date", "ASC")
      .getMany();
  }
}
