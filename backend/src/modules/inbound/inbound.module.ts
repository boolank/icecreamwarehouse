import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PurchaseOrder } from "./entities/purchase-order.entity";
import { PurchaseOrderItem } from "./entities/purchase-order-item.entity";
import { ProductBatch } from "./entities/product-batch.entity";
import { InventoryStock } from "./entities/inventory-stock.entity";
import { InventoryTransaction } from "./entities/inventory-transaction.entity";
import { TemperatureLog } from "./entities/temperature-log.entity";
import { ProductUom } from "../master-data/entities/product-uom.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";
import { Supplier } from "../master-data/entities/supplier.entity";
import { InboundService } from "./inbound.service";
import { InboundController } from "./inbound.controller";
import { AccountingModule } from "../accounting/accounting.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseOrderItem,
      ProductBatch,
      InventoryStock,
      InventoryTransaction,
      TemperatureLog,
      ProductUom,
      FreezerLocation,
      Supplier,
    ]),
    AccountingModule,
  ],
  controllers: [InboundController],
  providers: [InboundService],
  exports: [InboundService],
})
export class InboundModule {}

