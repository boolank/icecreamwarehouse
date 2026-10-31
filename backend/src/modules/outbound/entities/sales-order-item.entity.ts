import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SalesOrder } from "./sales-order.entity";
import { Product } from "../../master-data/entities/product.entity";
import { ProductUom } from "../../master-data/entities/product-uom.entity";

@Entity("sales_order_items")
export class SalesOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "so_id" })
  soId: number;

  @ManyToOne(() => SalesOrder, (so) => so.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "so_id" })
  salesOrder: SalesOrder;

  @Column({ name: "product_id" })
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "product_uom_id" })
  productUomId: number;

  @ManyToOne(() => ProductUom, { eager: true })
  @JoinColumn({ name: "product_uom_id" })
  productUom: ProductUom;

  @Column({ name: "ordered_qty" })
  orderedQty: number;

  @Column({ name: "delivered_qty", default: 0 })
  deliveredQty: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  unitPrice: number;

  @Column({
    name: "discount_pct",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0.0,
  })
  discountPct: number;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  subtotal: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;
}
