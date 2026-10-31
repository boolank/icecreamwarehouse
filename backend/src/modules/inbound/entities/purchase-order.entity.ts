import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Supplier } from "../../master-data/entities/supplier.entity";
import { PurchaseOrderItem } from "./purchase-order-item.entity";

@Entity("purchase_orders")
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "po_number", unique: true, length: 30 })
  poNumber: string;

  @Column({ name: "supplier_id" })
  supplierId: number;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @Column({ name: "order_date", type: "date" })
  orderDate: string;

  @Column({ name: "expected_date", type: "date", nullable: true })
  expectedDate: string;

  @Column({ length: 20, default: "DRAFT" })
  status: string; // 'DRAFT' | 'CONFIRMED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED'

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  totalAmount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;

  @Column({ name: "approved_at", nullable: true })
  approvedAt: Date;

  @Column({ name: "approved_by", nullable: true })
  approvedBy: number;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, {
    cascade: true,
  })
  items: PurchaseOrderItem[];
}
