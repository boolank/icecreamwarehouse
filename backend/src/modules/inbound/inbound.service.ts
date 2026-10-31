import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { PurchaseOrder } from "./entities/purchase-order.entity";
import { PurchaseOrderItem } from "./entities/purchase-order-item.entity";
import { ProductBatch } from "./entities/product-batch.entity";
import { InventoryStock } from "./entities/inventory-stock.entity";
import { InventoryTransaction } from "./entities/inventory-transaction.entity";
import { TemperatureLog } from "./entities/temperature-log.entity";
import { ProductUom } from "../master-data/entities/product-uom.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";
import { Supplier } from "../master-data/entities/supplier.entity";
import { JournalEngineService } from "../accounting/journal-engine.service";
import { CreatePoDto } from "./dto/create-po.dto";
import { InboundReceiveDto } from "./dto/inbound-receive.dto";

@Injectable()
export class InboundService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly poItemRepo: Repository<PurchaseOrderItem>,
    @InjectRepository(ProductBatch)
    private readonly batchRepo: Repository<ProductBatch>,
    @InjectRepository(InventoryStock)
    private readonly stockRepo: Repository<InventoryStock>,
    @InjectRepository(InventoryTransaction)
    private readonly trxRepo: Repository<InventoryTransaction>,
    @InjectRepository(TemperatureLog)
    private readonly tempRepo: Repository<TemperatureLog>,
    @InjectRepository(ProductUom)
    private readonly uomRepo: Repository<ProductUom>,
    @InjectRepository(FreezerLocation)
    private readonly freezerRepo: Repository<FreezerLocation>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    private readonly journalEngine: JournalEngineService,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Menghasilkan nomor PO otomatis: PO-YYYYMM-XXXX
   */
  private async generatePoNumber(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `PO-${yearMonth}-`;

    const last = await this.poRepo
      .createQueryBuilder("po")
      .where("po.po_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("po.id", "DESC")
      .getOne();

    let seq = 1;
    if (last) {
      const parts = last.poNumber.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * 1. Buat Purchase Order (PO)
   */
  async createPo(dto: CreatePoDto, userId?: number): Promise<PurchaseOrder> {
    const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
    if (!supplier) {
      throw new NotFoundException(`Pemasok dengan ID ${dto.supplierId} tidak ditemukan.`);
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException("Item pesanan pembelian tidak boleh kosong.");
    }

    const poNumber = await this.generatePoNumber();
    let totalAmount = 0;

    const poItems: PurchaseOrderItem[] = [];
    for (const item of dto.items) {
      const uom = await this.uomRepo.findOne({ where: { id: item.productUomId } });
      if (!uom) {
        throw new NotFoundException(`Satuan UOM ID ${item.productUomId} tidak ditemukan.`);
      }

      const lineTotal = Number(item.orderedQty) * Number(item.unitPrice);
      totalAmount += lineTotal;

      const poItem = this.poItemRepo.create({
        productId: item.productId,
        productUomId: item.productUomId,
        orderedQty: item.orderedQty,
        receivedQty: 0,
        unitPrice: item.unitPrice,
        totalPrice: lineTotal,
        createdBy: userId,
      });
      poItems.push(poItem);
    }

    const po = this.poRepo.create({
      poNumber,
      supplierId: dto.supplierId,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: dto.expectedDate,
      status: "DRAFT",
      notes: dto.notes,
      totalAmount,
      createdBy: userId,
      items: poItems,
    });

    return this.poRepo.save(po);
  }

  /**
   * 2. Ambil Semua PO
   */
  async findAllPo(): Promise<PurchaseOrder[]> {
    return this.poRepo.find({
      relations: ["supplier", "items", "items.product", "items.productUom"],
      order: { id: "DESC" },
    });
  }

  /**
   * 3. Ambil Detail PO
   */
  async findPoById(id: number): Promise<PurchaseOrder> {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: ["supplier", "items", "items.product", "items.productUom"],
    });
    if (!po) {
      throw new NotFoundException(`PO ID ${id} tidak ditemukan.`);
    }
    return po;
  }

  /**
   * 4. Konfirmasi PO
   */
  async confirmPo(id: number, userId?: number): Promise<PurchaseOrder> {
    const po = await this.findPoById(id);
    if (po.status !== "DRAFT") {
      throw new BadRequestException(`Hanya PO berstatus DRAFT yang dapat dikonfirmasi.`);
    }
    po.status = "CONFIRMED";
    po.approvedBy = userId;
    po.approvedAt = new Date();
    return this.poRepo.save(po);
  }

  /**
   * 5. Eksekusi Penerimaan Inbound, QC Suhu Dingin, Penambahan Stok & Jurnal Otomatis
   */
  async receiveInbound(dto: InboundReceiveDto, userId?: number) {
    // 5.1 VALIDASI KRITIS SUHU RANTAI DINGIN (COLD CHAIN INTEGRITY)
    if (dto.truckTemperature > -18.0) {
      throw new UnprocessableEntityException(
        `KONTROL MUTU GAGAL: Suhu truk pendingin (${dto.truckTemperature}°C) melebihi batas aman rantai dingin es krim (maksimal -18°C). Risiko refreezing/pencairan tinggi!`
      );
    }

    const po = await this.findPoById(dto.poId);
    if (po.status !== "CONFIRMED" && po.status !== "PARTIAL") {
      throw new BadRequestException(
        `PO ${po.poNumber} berstatus '${po.status}'. Penerimaan hanya dapat diproses untuk status CONFIRMED atau PARTIAL.`
      );
    }

    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      let totalInboundMonetaryValue = 0;
      const createdBatches: ProductBatch[] = [];

      for (const item of dto.items) {
        // Ambil data UOM konversi
        const uom = await runner.manager.findOne(ProductUom, {
          where: { id: item.inputUomId },
        });
        if (!uom) {
          throw new NotFoundException(`Satuan UOM ID ${item.inputUomId} tidak ditemukan.`);
        }

        const conversionRatio = uom.conversion_factor || 1;
        const qtyInBaseUom = item.receivedQty * conversionRatio;

        // Ambil PO Item untuk acuan harga beli
        const poItem = po.items.find((pi) => pi.id === item.poItemId);
        if (!poItem) {
          throw new NotFoundException(`PO Item ID ${item.poItemId} tidak cocok dengan PO ini.`);
        }

        // Hitung harga modal beli per Base Unit (PCS)
        const costPricePerBaseUom = Number(poItem.unitPrice) / conversionRatio;
        const lineMonetaryValue = item.receivedQty * Number(poItem.unitPrice);
        totalInboundMonetaryValue += lineMonetaryValue;

        // Cek atau buat batch
        let batch = await runner.manager.findOne(ProductBatch, {
          where: {
            productId: item.productId,
            batchNumber: item.batchNumber,
          },
        });

        if (!batch) {
          batch = runner.manager.create(ProductBatch, {
            productId: item.productId,
            supplierId: po.supplierId,
            batchNumber: item.batchNumber,
            productionDate: item.productionDate,
            expiredDate: item.expiredDate,
            costPricePerBaseUom,
            isActive: true,
            createdBy: userId,
          });
          batch = await runner.manager.save(batch);
        }
        createdBatches.push(batch);

        // Update saldo fisik di inventory_stocks (atomik)
        let stock = await runner.manager.findOne(InventoryStock, {
          where: {
            productId: item.productId,
            batchId: batch.id,
            freezerLocationId: item.freezerLocationId,
          },
        });

        if (!stock) {
          stock = runner.manager.create(InventoryStock, {
            productId: item.productId,
            batchId: batch.id,
            freezerLocationId: item.freezerLocationId,
            quantityInBaseUom: qtyInBaseUom,
            updatedBy: userId,
          });
        } else {
          stock.quantityInBaseUom += qtyInBaseUom;
          stock.updatedBy = userId;
        }
        await runner.manager.save(stock);

        // Catat Inventory Transaction
        const trxCode = `TRX-IN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const trx = runner.manager.create(InventoryTransaction, {
          transactionCode: trxCode,
          transactionType: "INBOUND",
          referenceDoc: po.poNumber,
          productId: item.productId,
          batchId: batch.id,
          freezerLocationId: item.freezerLocationId,
          supplierId: po.supplierId,
          inputQuantity: item.receivedQty,
          inputUomId: item.inputUomId,
          qtyInBaseUom,
          unitCost: costPricePerBaseUom,
          unitPrice: poItem.unitPrice,
          totalCost: lineMonetaryValue,
          totalAmount: lineMonetaryValue,
          tempCheck: dto.truckTemperature,
          notes: item.notes || `Inbound PO ${po.poNumber}`,
          createdBy: userId,
        });
        await runner.manager.save(trx);

        // Update akumulasi receivedQty pada poItem
        poItem.receivedQty = (poItem.receivedQty || 0) + item.receivedQty;
        await runner.manager.save(poItem);
      }

      // Evaluasi status PO
      const allReceived = po.items.every((pi) => pi.receivedQty >= pi.orderedQty);
      po.status = allReceived ? "RECEIVED" : "PARTIAL";
      await runner.manager.save(po);

      // 5.2 OTOMASI MESIN JURNAL PEMBELIAN (BALANCED DOUBLE-ENTRY)
      const journal = await this.journalEngine.createInboundJournal({
        poNumber: po.poNumber,
        supplierName: po.supplier?.name || "Supplier",
        totalAmount: totalInboundMonetaryValue,
        userId,
        queryRunner: runner,
      });

      await runner.commitTransaction();

      return {
        message: "Penerimaan barang dan QC suhu dingin berhasil diproses.",
        poNumber: po.poNumber,
        status: po.status,
        truckTemperature: dto.truckTemperature,
        totalAmount: totalInboundMonetaryValue,
        batchesCreated: createdBatches.length,
        journal: {
          entryNumber: journal.entryNumber,
          totalDebit: journal.totalDebit,
          totalCredit: journal.totalCredit,
          isBalanced: journal.isBalanced,
          description: journal.description,
        },
      };
    } catch (err) {
      await runner.rollbackTransaction();
      throw err;
    } finally {
      await runner.release();
    }
  }

  /**
   * 6. Pencatatan Log Suhu Freezer
   */
  async logTemperature(data: {
    freezerLocationId: number;
    temperatureCelsius: number;
    notes?: string;
    userId?: number;
  }): Promise<TemperatureLog> {
    const isAnomaly = data.temperatureCelsius > -18.0 || data.temperatureCelsius < -25.0;
    const log = this.tempRepo.create({
      freezerLocationId: data.freezerLocationId,
      temperatureCelsius: data.temperatureCelsius,
      recordedBy: data.userId,
      isAnomaly,
      notes: data.notes,
    });
    return this.tempRepo.save(log);
  }

  /**
   * 7. Ambil Log Suhu
   */
  async getTemperatureLogs(freezerId?: number): Promise<TemperatureLog[]> {
    const query = this.tempRepo
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.freezerLocation", "fl")
      .orderBy("t.recordedAt", "DESC")
      .take(100);

    if (freezerId) {
      query.where("t.freezer_location_id = :freezerId", { freezerId });
    }

    return query.getMany();
  }
}
