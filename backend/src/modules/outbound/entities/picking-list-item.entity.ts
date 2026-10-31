import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PickingList } from "./picking-list.entity";
import { SalesOrderItem } from "./sales-order-item.entity";
import { Product } from "../../master-data/entities/product.entity";
import { ProductBatch } from "../../inbound/entities/product-batch.entity";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";

@Entity("picking_list_items")
export class PickingListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "pl_id" })
  plId: number;

  @ManyToOne(() => PickingList, (pl) => pl.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "pl_id" })
  pickingList: PickingList;

  @Column({ name: "so_item_id" })
  soItemId: number;

  @ManyToOne(() => SalesOrderItem, { onDelete: "CASCADE" })
  @JoinColumn({ name: "so_item_id" })
  salesOrderItem: SalesOrderItem;

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

  @Column({ name: "qty_to_pick_base" })
  qtyToPickBase: number; // Dalam PCS

  @Column({ name: "qty_picked_base", default: 0 })
  qtyPickedBase: number;

  @Column({ name: "is_done", default: false })
  isDone: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
