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
import { Customer } from "../../customers/entities/customer.entity";
import { SalesOrderItem } from "./sales-order-item.entity";
import { PickingList } from "./picking-list.entity";
import { DeliveryOrder } from "./delivery-order.entity";

@Entity("sales_orders")
export class SalesOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "so_number", unique: true, length: 30 })
  soNumber: string;

  @Column({ name: "customer_id" })
  customerId: number;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ name: "order_date", type: "date" })
  orderDate: string;

  @Column({ name: "requested_date", type: "date", nullable: true })
  requestedDate: string;

  @Column({ length: 20, default: "DRAFT" })
  status: string; // 'DRAFT' | 'CONFIRMED' | 'PICKING' | 'PACKED' | 'DELIVERED' | 'PARTIAL' | 'CANCELLED'

  @Column({ name: "payment_type", length: 20, default: "CREDIT" })
  paymentType: string; // 'CASH' | 'CREDIT'

  @Column({ name: "due_date", type: "date", nullable: true })
  dueDate: string;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  subtotal: number;

  @Column({
    name: "discount_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  discountAmount: number;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  totalAmount: number;

  @Column({ type: "text", nullable: true })
  notes: string;

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

  @OneToMany(() => SalesOrderItem, (item) => item.salesOrder, { cascade: true })
  items: SalesOrderItem[];

  @OneToMany(() => PickingList, (pl) => pl.salesOrder)
  pickingLists: PickingList[];

  @OneToMany(() => DeliveryOrder, (doItem) => doItem.salesOrder)
  deliveryOrders: DeliveryOrder[];
}

