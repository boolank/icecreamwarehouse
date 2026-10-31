import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { StockOpname } from "./stock-opname.entity";
import { Product } from "../../master-data/entities/product.entity";
import { ProductBatch } from "../../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";

@Entity("stock_opname_items")
export class StockOpnameItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "opname_id" })
  opnameId: number;

  @ManyToOne(() => StockOpname, (op) => op.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "opname_id" })
  stockOpname: StockOpname;

  @Column({ name: "product_id" })
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "batch_id" })
  batchId: number;

  @ManyToOne(() => ProductBatch, { eager: true })
  @JoinColumn({ name: "batch_id" })
  batch: ProductBatch;

  @Column({ name: "freezer_location_id" })
  freezerLocationId: number;

  @ManyToOne(() => FreezerLocation, { eager: true })
  @JoinColumn({ name: "freezer_location_id" })
  freezerLocation: FreezerLocation;

  @Column({ name: "system_qty_base_uom", type: "int", default: 0 })
  systemQtyBaseUom: number;

  @Column({ name: "physical_qty_base_uom", type: "int", default: 0 })
  physicalQtyBaseUom: number;

  @Column({ name: "difference_base_uom", type: "int", default: 0 })
  differenceBaseUom: number;

  @Column({ name: "unit_cost", type: "decimal", precision: 12, scale: 2, default: 0 })
  unitCost: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ name: "created_by", type: "int", nullable: true })
  createdBy: number | null;
}

