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
import { User } from "../../users/entities/user.entity";

@Entity("delivery_orders")
export class DeliveryOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "do_number", unique: true, length: 30 })
  doNumber: string;

  @Column({ name: "so_id" })
  soId: number;

  @ManyToOne(() => SalesOrder, (so) => so.deliveryOrders, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "so_id" })
  salesOrder: SalesOrder;

  @Column({ name: "driver_id", nullable: true })
  driverId: number;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "driver_id" })
  driver: User;

  @Column({ name: "vehicle_plate", length: 15, nullable: true })
  vehiclePlate: string;

  @Column({
    name: "departure_temp",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  departureTemp: number;

  @Column({ name: "departure_time", type: "timestamp", nullable: true })
  departureTime: Date;

  @Column({ length: 20, default: "PENDING" })
  status: string; // 'PENDING' | 'DELIVERING' | 'DELIVERED' | 'FAILED'

  @Column({ name: "pod_photo_url", type: "text", nullable: true })
  podPhotoUrl: string;

  @Column({ name: "received_by", length: 100, nullable: true })
  receivedBy: string;

  @Column({ name: "delivered_at", type: "timestamp", nullable: true })
  deliveredAt: Date;

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
}

