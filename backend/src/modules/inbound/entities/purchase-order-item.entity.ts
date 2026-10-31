import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";
import { Product } from "../../master-data/entities/product.entity";
import { ProductUom } from "../../master-data/entities/product-uom.entity";

@Entity("purchase_order_items")
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "po_id" })
  poId: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "po_id" })
  purchaseOrder: PurchaseOrder;

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

  @Column({ name: "received_qty", default: 0 })
  receivedQty: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  unitPrice: number;

  @Column({
    name: "total_price",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  totalPrice: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;
}
