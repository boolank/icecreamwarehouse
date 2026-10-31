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
import { BaseAuditEntity } from "../../../common/entities/base-audit.entity";
import { Customer } from "../../customers/entities/customer.entity";
import { Supplier } from "../../master-data/entities/supplier.entity";
import { SalesOrder } from "../../outbound/entities/sales-order.entity";
import { ReturnOrderItem } from "./return-order-item.entity";

export type ReturnType = "CUSTOMER_RETURN" | "SUPPLIER_CLAIM";
export type ReturnStatus = "QUARANTINE" | "APPROVED_CLAIM" | "DISPOSED" | "CANCELLED";
export type ReturnDisposition = "RETURN_TO_SUPPLIER" | "WRITE_OFF" | "RESTOCK";

@Entity("return_orders")
export class ReturnOrder extends BaseAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "return_number", type: "varchar", length: 30, unique: true })
  returnNumber: string;

  @Column({ name: "return_type", type: "varchar", length: 20, default: "CUSTOMER_RETURN" })
  returnType: ReturnType;

  @Column({ name: "so_id", type: "int", nullable: true })
  soId: number | null;

  @ManyToOne(() => SalesOrder, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "so_id" })
  salesOrder?: SalesOrder;

  @Column({ name: "customer_id", type: "int", nullable: true })
  customerId: number | null;

  @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @Column({ name: "supplier_id", type: "int", nullable: true })
  supplierId: number | null;

  @ManyToOne(() => Supplier, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "supplier_id" })
  supplier?: Supplier;

  @Column({ name: "return_date", type: "date", default: () => "CURRENT_DATE" })
  returnDate: string;

  @Column({ type: "text", nullable: true })
  reason: string | null;

  @Column({ type: "varchar", length: 20, default: "QUARANTINE" })
  status: ReturnStatus;

  @Column({ type: "varchar", length: 20, nullable: true })
  disposition: ReturnDisposition | null;

  @Column({ name: "total_value", type: "decimal", precision: 15, scale: 2, default: 0.0 })
  totalValue: number;

  @Column({ name: "approved_at", type: "timestamp", nullable: true })
  approvedAt: Date | null;

  @Column({ name: "approved_by", type: "int", nullable: true })
  approvedBy: number | null;

  @OneToMany(() => ReturnOrderItem, (item) => item.returnOrder, {
    cascade: true,
  })
  items: ReturnOrderItem[];
}

