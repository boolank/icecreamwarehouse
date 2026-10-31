import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Product } from "../../master-data/entities/product.entity";
import { ProductBatch } from "./product-batch.entity";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";

@Entity("inventory_stocks")
@Unique(["productId", "batchId", "freezerLocationId"])
export class InventoryStock {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ name: "quantity_in_base_uom", default: 0 })
  quantityInBaseUom: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;
}
