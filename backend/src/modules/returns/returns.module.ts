import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReturnOrder } from "./entities/return-order.entity";
import { ReturnOrderItem } from "./entities/return-order-item.entity";
import { ReturnsService } from "./returns.service";
import { ReturnsController } from "./returns.controller";
import { InboundModule } from "../inbound/inbound.module";
import { AccountingModule } from "../accounting/accounting.module";
import { MasterDataModule } from "../master-data/master-data.module";
import { OutboundModule } from "../outbound/outbound.module";
import { CustomersModule } from "../customers/customers.module";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";
import { ProductBatch } from "../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";
import { Product } from "../master-data/entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReturnOrder,
      ReturnOrderItem,
      InventoryStock,
      InventoryTransaction,
      ProductBatch,
      FreezerLocation,
      Product,
    ]),
    InboundModule,
    AccountingModule,
    MasterDataModule,
    OutboundModule,
    CustomersModule,
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}

