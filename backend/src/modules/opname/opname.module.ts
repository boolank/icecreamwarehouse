import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockOpname } from "./entities/stock-opname.entity";
import { StockOpnameItem } from "./entities/stock-opname-item.entity";
import { OpnameService } from "./opname.service";
import { OpnameController } from "./opname.controller";
import { InboundModule } from "../inbound/inbound.module";
import { AccountingModule } from "../accounting/accounting.module";
import { MasterDataModule } from "../master-data/master-data.module";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";
import { ProductBatch } from "../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../master-data/entities/freezer-location.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockOpname,
      StockOpnameItem,
      InventoryStock,
      InventoryTransaction,
      ProductBatch,
      FreezerLocation,
    ]),
    InboundModule,
    AccountingModule,
    MasterDataModule,
  ],
  controllers: [OpnameController],
  providers: [OpnameService],
  exports: [OpnameService],
})
export class OpnameModule {}

