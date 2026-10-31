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
import { SalesOrder } from "./sales-order.entity";
import { User } from "../../users/entities/user.entity";
import { PickingListItem } from "./picking-list-item.entity";

@Entity("picking_lists")
export class PickingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "pl_number", unique: true, length: 30 })
  plNumber: string;

  @Column({ name: "so_id" })
  soId: number;

  @ManyToOne(() => SalesOrder, (so) => so.pickingLists, { onDelete: "CASCADE" })
  @JoinColumn({ name: "so_id" })
  salesOrder: SalesOrder;

  @Column({ length: 20, default: "PENDING" })
  status: string; // 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

  @Column({ name: "assigned_to", nullable: true })
  assignedTo: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assigned_to" })
  assignee: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;

  @Column({ name: "completed_at", nullable: true })
  completedAt: Date;

  @Column({ name: "completed_by", nullable: true })
  completedBy: number;

  @OneToMany(() => PickingListItem, (item) => item.pickingList, { cascade: true })
  items: PickingListItem[];
}
