import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { BaseAuditEntity } from "../../../common/entities/base-audit.entity";
import { StockOpnameItem } from "./stock-opname-item.entity";

export type OpnameStatus = "DRAFT" | "COUNTING" | "APPROVED" | "POSTED" | "CANCELLED";

@Entity("stock_opnames")
export class StockOpname extends BaseAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "opname_code", type: "varchar", length: 30, unique: true })
  opnameCode: string;

  @Column({ name: "opname_date", type: "date" })
  opnameDate: string;

  @Column({ type: "varchar", length: 20, default: "DRAFT" })
  status: OpnameStatus;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @Column({ name: "approved_at", type: "timestamp", nullable: true })
  approvedAt: Date | null;

  @Column({ name: "approved_by", type: "int", nullable: true })
  approvedBy: number | null;

  @OneToMany(() => StockOpnameItem, (item) => item.stockOpname, {
    cascade: true,
  })
  items: StockOpnameItem[];
}

