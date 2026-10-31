import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { SalesOrder } from "./entities/sales-order.entity";
import { SalesOrderItem } from "./entities/sales-order-item.entity";
import { PickingList } from "./entities/picking-list.entity";
import { PickingListItem } from "./entities/picking-list-item.entity";
import { DeliveryOrder } from "./entities/delivery-order.entity";
import { Customer } from "../customers/entities/customer.entity";
import { Product } from "../master-data/entities/product.entity";
import { ProductUom } from "../master-data/entities/product-uom.entity";
import { ProductCustomerPrice } from "../pricing/entities/product-customer-price.entity";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { ProductBatch } from "../inbound/entities/product-batch.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";
import { JournalEngineService } from "../accounting/journal-engine.service";
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto";
import { BreakdownUomDto } from "./dto/breakdown-uom.dto";

@Injectable()
export class OutboundService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly soRepo: Repository<SalesOrder>,
    @InjectRepository(SalesOrderItem)
    private readonly soItemRepo: Repository<SalesOrderItem>,
    @InjectRepository(PickingList)
    private readonly plRepo: Repository<PickingList>,
    @InjectRepository(PickingListItem)
    private readonly plItemRepo: Repository<PickingListItem>,
    @InjectRepository(DeliveryOrder)
    private readonly doRepo: Repository<DeliveryOrder>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductUom)
    private readonly uomRepo: Repository<ProductUom>,
    @InjectRepository(ProductCustomerPrice)
    private readonly priceRepo: Repository<ProductCustomerPrice>,
    @InjectRepository(InventoryStock)
    private readonly stockRepo: Repository<InventoryStock>,
    @InjectRepository(ProductBatch)
    private readonly batchRepo: Repository<ProductBatch>,
    @InjectRepository(InventoryTransaction)
    private readonly trxRepo: Repository<InventoryTransaction>,
    private readonly journalEngine: JournalEngineService,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Menghasilkan nomor SO otomatis: SO-YYYYMM-XXXX
   */
  private async generateSoNumber(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `SO-${yearMonth}-`;

    const last = await this.soRepo
      .createQueryBuilder("so")
      .where("so.so_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("so.id", "DESC")
      .getOne();

    let seq = 1;
    if (last) {
      const parts = last.soNumber.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * Menghasilkan nomor Picking List otomatis: PL-YYYYMM-XXXX
   */
  private async generatePlNumber(): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `PL-${yearMonth}-`;

    const last = await this.plRepo
      .createQueryBuilder("pl")
      .where("pl.pl_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("pl.id", "DESC")
      .getOne();

    let seq = 1;
    if (last) {
      const parts = last.plNumber.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * 1. Buat Sales Order (SO) dengan penguncian harga otomatis dari Matriks Harga Segmen Pelanggan
   */
  async createSalesOrder(dto: CreateSalesOrderDto, userId?: number): Promise<SalesOrder> {
    const customer = await this.customerRepo.findOne({
      where: { id: dto.customerId },
      relations: ["category"],
    });
    if (!customer) {
      throw new NotFoundException(`Pelanggan dengan ID ${dto.customerId} tidak ditemukan.`);
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException("Item pesanan penjualan tidak boleh kosong.");
    }

    const soNumber = await this.generateSoNumber();
    let subtotal = 0;
    const soItems: SalesOrderItem[] = [];

    for (const item of dto.items) {
      // Cari harga jual otomatis dari matriks harga segmen pelanggan
      let unitPrice = 0;
      if (customer.category_id) {
        const matrixPrice = await this.priceRepo.findOne({
          where: {
            product_id: item.productId,
            product_uom_id: item.productUomId,
            category_id: customer.category_id,
            is_active: true,
          },
        });
        if (matrixPrice) {
          unitPrice = Number(matrixPrice.price);
        }
      }

      // Fallback default jika belum terset di matriks
      if (unitPrice <= 0) {
        unitPrice = 120000; // Standar harga Dus
      }

      const discountPct = item.discountPct || 0;
      const lineTotal = item.orderedQty * unitPrice * (1 - discountPct / 100);
      subtotal += lineTotal;

      const soItem = this.soItemRepo.create({
        productId: item.productId,
        productUomId: item.productUomId,
        orderedQty: item.orderedQty,
        deliveredQty: 0,
        unitPrice,
        discountPct,
        subtotal: lineTotal,
        createdBy: userId,
      });
      soItems.push(soItem);
    }

    const totalAmount = subtotal; // Tanpa PPN tambahan atau PPN include

    const so = this.soRepo.create({
      soNumber,
      customerId: dto.customerId,
      orderDate: new Date().toISOString().split("T")[0],
      requestedDate: dto.requestedDate,
      paymentType: dto.paymentType || "CREDIT",
      status: "DRAFT",
      subtotal,
      discountAmount: 0,
      totalAmount,
      notes: dto.notes,
      createdBy: userId,
      items: soItems,
    });

    return this.soRepo.save(so);
  }

  /**
   * 2. Ambil Semua Sales Orders
   */
  async findAllSalesOrders(): Promise<SalesOrder[]> {
    return this.soRepo.find({
      relations: ["customer", "customer.category", "items", "items.product", "items.productUom"],
      order: { id: "DESC" },
    });
  }

  /**
   * 3. Ambil Detail Sales Order
   */
  async findSalesOrderById(id: number): Promise<SalesOrder> {
    const so = await this.soRepo.findOne({
      where: { id },
      relations: [
        "customer",
        "customer.category",
        "items",
        "items.product",
        "items.productUom",
        "pickingLists",
        "pickingLists.items",
        "deliveryOrders",
      ],
    });
    if (!so) {
      throw new NotFoundException(`Sales Order ID ${id} tidak ditemukan.`);
    }
    return so;
  }

  /**
   * 4. Konfirmasi Sales Order
   */
  async confirmSalesOrder(id: number, userId?: number): Promise<SalesOrder> {
    const so = await this.findSalesOrderById(id);
    if (so.status !== "DRAFT") {
      throw new BadRequestException(`Hanya SO berstatus DRAFT yang dapat dikonfirmasi.`);
    }
    so.status = "CONFIRMED";
    so.approvedBy = userId;
    so.approvedAt = new Date();
    return this.soRepo.save(so);
  }

  /**
   * 5. Generate FEFO Picking List:
   * Mengalokasikan nomor batch dan lokasi rak freezer berdasarkan tanggal kedaluwarsa terdekat (expired_date ASC)
   */
  async generateFefoPickingList(soId: number, userId?: number): Promise<PickingList> {
    const so = await this.findSalesOrderById(soId);
    if (so.status !== "CONFIRMED") {
      throw new BadRequestException(
        `Picking list hanya dapat dibuat untuk SO yang telah berstatus CONFIRMED (Status saat ini: ${so.status}).`
      );
    }

    const plNumber = await this.generatePlNumber();
    const pickingItems: PickingListItem[] = [];

    for (const item of so.items) {
      const uom = await this.uomRepo.findOne({ where: { id: item.productUomId } });
      const conversionRatio = uom?.conversion_factor || 1;
      let remainingNeededBase = item.orderedQty * conversionRatio;

      // Query alokasi stok aktif non-karantina terurut FEFO (expiredDate ASC)
      const availableStocks = await this.stockRepo
        .createQueryBuilder("s")
        .innerJoinAndSelect("s.batch", "b")
        .innerJoinAndSelect("s.freezerLocation", "fl")
        .where("s.product_id = :productId", { productId: item.productId })
        .andWhere("s.quantity_in_base_uom > 0")
        .andWhere("fl.is_quarantine = false")
        .orderBy("b.expired_date", "ASC")
        .getMany();

      if (availableStocks.length === 0) {
        throw new BadRequestException(
          `Stok produk SKU ${item.product?.sku} tidak mencukupi untuk memenuhi pesanan.`
        );
      }

      for (const stock of availableStocks) {
        if (remainingNeededBase <= 0) break;

        const allocQty = Math.min(stock.quantityInBaseUom, remainingNeededBase);
        remainingNeededBase -= allocQty;

        const plItem = this.plItemRepo.create({
          soItemId: item.id,
          productId: item.productId,
          batchId: stock.batchId,
          freezerLocationId: stock.freezerLocationId,
          qtyToPickBase: allocQty,
          qtyPickedBase: allocQty, // Default target
          isDone: false,
        });
        pickingItems.push(plItem);
      }

      if (remainingNeededBase > 0) {
        throw new BadRequestException(
          `Stok produk SKU ${item.product?.sku} tidak mencukupi di seluruh freezer (kurang ${remainingNeededBase} Pcs).`
        );
      }
    }

    const pickingList = this.plRepo.create({
      plNumber,
      soId: so.id,
      status: "PENDING",
      assignedTo: userId,
      createdBy: userId,
      items: pickingItems,
    });

    const savedPl = await this.plRepo.save(pickingList);

    // Update SO status to PICKING
    so.status = "PICKING";
    await this.soRepo.save(so);

    return savedPl;
  }

  /**
   * 6. Konfirmasi Selesai Picking & Otomasi Pemotongan Stok + Jurnal Ganda Penjualan
   */
  async completePicking(pickingListId: number, userId?: number) {
    const pl = await this.plRepo.findOne({
      where: { id: pickingListId },
      relations: ["items", "items.batch", "items.product", "salesOrder", "salesOrder.customer", "salesOrder.customer.category"],
    });

    if (!pl) {
      throw new NotFoundException(`Picking List ID ${pickingListId} tidak ditemukan.`);
    }

    if (pl.status === "DONE") {
      throw new BadRequestException("Picking List ini telah diselesaikan sebelumnya.");
    }

    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      let totalHppMonetary = 0;

      for (const item of pl.items) {
        const stock = await runner.manager.findOne(InventoryStock, {
          where: {
            productId: item.productId,
            batchId: item.batchId,
            freezerLocationId: item.freezerLocationId,
          },
        });

        if (!stock || stock.quantityInBaseUom < item.qtyPickedBase) {
          throw new BadRequestException(
            `Stok fisik pada lokasi batch ${item.batch?.batchNumber} tidak mencukupi untuk pemotongan.`
          );
        }

        // 6.1 Pemotongan stok fisik secara atomik
        stock.quantityInBaseUom -= item.qtyPickedBase;
        stock.updatedBy = userId;
        await runner.manager.save(stock);

        // Hitung HPP FEFO per batch
        const batchCostPerPcs = Number(item.batch?.costPricePerBaseUom || 0);
        const lineHpp = item.qtyPickedBase * batchCostPerPcs;
        totalHppMonetary += lineHpp;

        // Catat Inventory Transaction OUTBOUND
        const trxCode = `TRX-OUT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
        const trx = runner.manager.create(InventoryTransaction, {
          transactionCode: trxCode,
          transactionType: "OUTBOUND",
          referenceDoc: pl.salesOrder?.soNumber,
          productId: item.productId,
          batchId: item.batchId,
          freezerLocationId: item.freezerLocationId,
          customerId: pl.salesOrder?.customerId,
          inputQuantity: item.qtyPickedBase,
          inputUomId: 1, // Base UOM (PCS)
          qtyInBaseUom: item.qtyPickedBase,
          unitCost: batchCostPerPcs,
          totalCost: lineHpp,
          totalAmount: 0,
          notes: `Picking FEFO Outbound SO ${pl.salesOrder?.soNumber}`,
          createdBy: userId,
        });
        await runner.manager.save(trx);

        item.isDone = true;
        await runner.manager.save(item);
      }

      pl.status = "DONE";
      pl.completedAt = new Date();
      pl.completedBy = userId;
      await runner.manager.save(pl);

      // Update status SO jadi PACKED
      const so = pl.salesOrder;
      so.status = "PACKED";
      await runner.manager.save(so);

      // 6.2 OTOMASI MESIN JURNAL GANDA OUTBOUND (PENDAPATAN & HPP FEFO)
      const journals = await this.journalEngine.createOutboundJournals({
        soNumber: so.soNumber,
        customerName: so.customer?.name || "Pelanggan",
        categoryCode: so.customer?.category?.category_code || "GT",
        revenueAmount: Number(so.totalAmount),
        cogsAmount: totalHppMonetary > 0 ? totalHppMonetary : Number(so.totalAmount) * 0.7, // fallback estimasi jika batch 0
        userId,
        queryRunner: runner,
      });

      await runner.commitTransaction();

      return {
        message: "Picking list FEFO selesai dikonfirmasi, stok fisik terpotong, dan 2 jurnal otomatis diterbitkan seimbang.",
        plNumber: pl.plNumber,
        soNumber: so.soNumber,
        totalRevenue: so.totalAmount,
        totalHpp: totalHppMonetary,
        estimatedGrossProfit: Number(so.totalAmount) - totalHppMonetary,
        journals: {
          revenueJournal: journals.revenueJournal.entryNumber,
          cogsJournal: journals.cogsJournal.entryNumber,
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
   * 7. Breakdown / Repacking UOM: Buka 1 Dus -> 24 Pcs (tanpa mengubah total nilai moneter)
   */
  async breakdownUom(dto: BreakdownUomDto, userId?: number) {
    const uom = await this.uomRepo.findOne({ where: { id: dto.sourceUomId } });
    if (!uom) {
      throw new NotFoundException(`Satuan UOM ID ${dto.sourceUomId} tidak ditemukan.`);
    }

    const conversionRatio = uom.conversion_factor || 1;
    const baseQtyGenerated = dto.breakdownQuantity * conversionRatio;

    // Mutasi dicatat sebagai transaksi BREAKDOWN
    const trxCode = `TRX-BRK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const trx = this.trxRepo.create({
      transactionCode: trxCode,
      transactionType: "BREAKDOWN",
      referenceDoc: `BREAKDOWN-${uom.uom_name}`,
      productId: dto.productId,
      batchId: dto.batchId,
      freezerLocationId: dto.toFreezerLocationId,
      inputQuantity: dto.breakdownQuantity,
      inputUomId: dto.sourceUomId,
      qtyInBaseUom: baseQtyGenerated,
      notes: dto.notes || `Breakdown ${dto.breakdownQuantity} ${uom.uom_name} menjadi ${baseQtyGenerated} Pcs Base Unit`,
      createdBy: userId,
    });

    await this.trxRepo.save(trx);

    return {
      message: `Pemecahan satuan berhasil: ${dto.breakdownQuantity} ${uom.uom_name} dibuka menjadi ${baseQtyGenerated} Pcs. Total nilai moneter persediaan tetap sama (tidak ada jurnal).`,
      sourceUom: uom.uom_name,
      baseQtyGenerated,
    };
  }

  /**
   * 8. Ambil Seluruh Picking List
   */
  async findAllPickingLists(): Promise<PickingList[]> {
    return this.plRepo.find({
      relations: ["salesOrder", "salesOrder.customer", "items", "items.product", "items.batch", "items.freezerLocation"],
      order: { id: "DESC" },
    });
  }
}
