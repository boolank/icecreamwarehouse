import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, In } from "typeorm";
import { StockOpname } from "./entities/stock-opname.entity";
import { StockOpnameItem } from "./entities/stock-opname-item.entity";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";
import { ProductBatch } from "../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";
import { JournalEngineService } from "../accounting/journal-engine.service";
import { CreateOpnameDto } from "./dto/create-opname.dto";
import { SubmitCountDto } from "./dto/submit-count.dto";

@Injectable()
export class OpnameService {
  constructor(
    @InjectRepository(StockOpname)
    private readonly opnameRepo: Repository<StockOpname>,
    @InjectRepository(StockOpnameItem)
    private readonly itemRepo: Repository<StockOpnameItem>,
    @InjectRepository(InventoryStock)
    private readonly stockRepo: Repository<InventoryStock>,
    @InjectRepository(InventoryTransaction)
    private readonly txRepo: Repository<InventoryTransaction>,
    @InjectRepository(ProductBatch)
    private readonly batchRepo: Repository<ProductBatch>,
    @InjectRepository(FreezerLocation)
    private readonly freezerRepo: Repository<FreezerLocation>,
    private readonly journalEngine: JournalEngineService,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Menghasilkan kode opname otomatis: OPN-YYYYMM-XXXX
   */
  async generateOpnameCode(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `OPN-${yearMonth}-`;

    const last = await this.opnameRepo
      .createQueryBuilder("o")
      .where("o.opname_code LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("o.id", "DESC")
      .getOne();

    let seq = 1;
    if (last) {
      const parts = last.opnameCode.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * Menginisialisasi lembar Stock Opname baru dengan snapshot kuantitas sistem
   */
  async createOpname(
    dto: CreateOpnameDto,
    userId: number = 1
  ): Promise<StockOpname> {
    const opnameCode = await this.generateOpnameCode();

    // Query stok aktif
    let stockQuery = this.stockRepo
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.product", "p")
      .innerJoinAndSelect("s.batch", "b")
      .innerJoinAndSelect("s.freezerLocation", "fl")
      .where("s.quantity_in_base_uom > 0")
      .andWhere("fl.is_quarantine = FALSE");

    if (dto.freezerLocationIds && dto.freezerLocationIds.length > 0) {
      stockQuery = stockQuery.andWhere("fl.id IN (:...locIds)", {
        locIds: dto.freezerLocationIds,
      });
    }

    const currentStocks = await stockQuery.getMany();

    const opname = this.opnameRepo.create({
      opnameCode,
      opnameDate: dto.opnameDate,
      status: "COUNTING",
      notes: dto.notes || "Stock Opname Periodik Gudang Es Krim",
      created_by: userId,
    });

    const savedOpname = await this.opnameRepo.save(opname);

    const items: StockOpnameItem[] = currentStocks.map((stock) => {
      const unitCost = Number(stock.batch.costPricePerBaseUom || 0);
      const systemQty = Number(stock.quantityInBaseUom);

      return this.itemRepo.create({
        opnameId: savedOpname.id,
        productId: stock.productId,
        batchId: stock.batchId,
        freezerLocationId: stock.freezerLocationId,
        systemQtyBaseUom: systemQty,
        physicalQtyBaseUom: systemQty, // Default inisial sama sebelum verifikasi fisik
        differenceBaseUom: 0,
        unitCost,
        createdBy: userId,
      });
    });

    if (items.length > 0) {
      await this.itemRepo.save(items);
    }

    return this.findOne(savedOpname.id);
  }

  /**
   * Menginput hasil hitung fisik lapangan per item opname
   */
  async submitCount(
    opnameId: number,
    dto: SubmitCountDto
  ): Promise<StockOpname> {
    const opname = await this.findOne(opnameId);
    if (opname.status === "POSTED" || opname.status === "CANCELLED") {
      throw new BadRequestException(
        `Opname ${opname.opnameCode} sudah berstatus ${opname.status} dan tidak dapat diubah.`
      );
    }

    for (const countItem of dto.items) {
      const item = opname.items.find((i) => i.id === countItem.itemId);
      if (item) {
        item.physicalQtyBaseUom = countItem.physicalQtyBaseUom;
        item.differenceBaseUom =
          countItem.physicalQtyBaseUom - item.systemQtyBaseUom;
        await this.itemRepo.save(item);
      }
    }

    return this.findOne(opnameId);
  }

  /**
   * Menyetujui hasil hitung opname, memperbarui saldo fisik atomik, dan menerbitkan jurnal penyesuaian
   */
  async approveAndPost(
    opnameId: number,
    userId: number = 1
  ): Promise<StockOpname> {
    const opname = await this.findOne(opnameId);
    if (opname.status === "POSTED") {
      throw new BadRequestException(
        `Opname ${opname.opnameCode} sudah diposting sebelumnya.`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalVarianceAmount = 0;

      for (const item of opname.items) {
        const diff = item.differenceBaseUom;
        const itemVarianceValue = diff * Number(item.unitCost);
        totalVarianceAmount += itemVarianceValue;

        if (diff !== 0) {
          // Sesuaikan saldo fisik di inventory_stocks
          let stock = await queryRunner.manager.findOne(InventoryStock, {
            where: {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: item.freezerLocationId,
            },
          });

          if (stock) {
            stock.quantityInBaseUom = item.physicalQtyBaseUom;
            await queryRunner.manager.save(stock);
          } else if (item.physicalQtyBaseUom > 0) {
            stock = queryRunner.manager.create(InventoryStock, {
              productId: item.productId,
              batchId: item.batchId,
              freezerLocationId: item.freezerLocationId,
              quantityInBaseUom: item.physicalQtyBaseUom,
            });
            await queryRunner.manager.save(stock);
          }

          // Catat audit mutasi persediaan
          const tx = queryRunner.manager.create(InventoryTransaction, {
            productId: item.productId,
            batchId: item.batchId,
            freezerLocationId: item.freezerLocationId,
            transactionType: "OPNAME_ADJUSTMENT",
            quantityInBaseUom: diff,
            referenceType: "STOCK_OPNAME",
            referenceId: opname.id,
            notes: `Penyesuaian Opname ${opname.opnameCode}: Fisik ${item.physicalQtyBaseUom} vs Sistem ${item.systemQtyBaseUom} (${diff > 0 ? "+" : ""}${diff} Pcs)`,
            createdBy: userId,
          });
          await queryRunner.manager.save(tx);
        }
      }

      // Terbitkan Jurnal Penyesuaian jika terdapat selisih moneter
      if (Math.abs(totalVarianceAmount) > 0) {
        await this.journalEngine.createOpnameAdjustmentJournal({
          opnameCode: opname.opnameCode,
          varianceAmount: totalVarianceAmount,
          notes: opname.notes || undefined,
          userId,
          queryRunner,
        });
      }

      opname.status = "POSTED";
      opname.approvedAt = new Date();
      opname.approvedBy = userId;
      opname.updated_by = userId;

      const saved = await queryRunner.manager.save(opname);

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
   * Mengambil semua daftar stock opname
   */
  async findAll(): Promise<StockOpname[]> {
    return this.opnameRepo.find({
      relations: [
        "items",
        "items.product",
        "items.batch",
        "items.freezerLocation",
      ],
      order: { id: "DESC" },
    });
  }

  /**
   * Mengambil detail satu dokumen stock opname
   */
  async findOne(id: number): Promise<StockOpname> {
    const op = await this.opnameRepo.findOne({
      where: { id },
      relations: [
        "items",
        "items.product",
        "items.batch",
        "items.freezerLocation",
      ],
    });
    if (!op) {
      throw new NotFoundException(`Stock Opname ID ${id} tidak ditemukan.`);
    }
    return op;
  }
}

