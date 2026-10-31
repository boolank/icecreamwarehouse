import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
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
import { OutboundService } from "./outbound.service";
import { OutboundController } from "./outbound.controller";
import { AccountingModule } from "../accounting/accounting.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrder,
      SalesOrderItem,
      PickingList,
      PickingListItem,
      DeliveryOrder,
      Customer,
      Product,
      ProductUom,
      ProductCustomerPrice,
      InventoryStock,
      ProductBatch,
      InventoryTransaction,
    ]),
    AccountingModule,
  ],
  controllers: [OutboundController],
  providers: [OutboundService],
  exports: [OutboundService],
})
export class OutboundModule {}

