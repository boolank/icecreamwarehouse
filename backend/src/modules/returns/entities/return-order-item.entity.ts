import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ReturnOrder } from "./return-order.entity";
import { Product } from "../../master-data/entities/product.entity";
import { ProductBatch } from "../../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";

export type ReturnCondition =
  | "DAMAGED"
  | "MELTED"
  | "NEAR_EXPIRED"
  | "WRONG_ITEM"
  | "GOOD";

@Entity("return_order_items")
export class ReturnOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "return_id" })
  returnId: number;

  @ManyToOne(() => ReturnOrder, (ro) => ro.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "return_id" })
  returnOrder: ReturnOrder;

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

  @Column({ name: "return_qty_base_uom", type: "int" })
  returnQtyBaseUom: number;

  @Column({ name: "unit_cost", type: "decimal", precision: 12, scale: 2, nullable: true })
  unitCost: number;

  @Column({ name: "total_cost", type: "decimal", precision: 15, scale: 2, nullable: true })
  totalCost: number;

  @Column({ type: "varchar", length: 30, default: "DAMAGED" })
  condition: ReturnCondition;

  @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ name: "created_by", type: "int", nullable: true })
  createdBy: number | null;
}

