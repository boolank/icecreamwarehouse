import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { JournalLine } from "./journal-line.entity";

@Entity("journal_entries")
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "entry_number", unique: true, length: 30 })
  entryNumber: string;

  @Column({ name: "transaction_date", type: "date" })
  transactionDate: string;

  @Column({ name: "reference_type", length: 30 })
  referenceType: string; // 'INBOUND' | 'OUTBOUND' | 'SPOILAGE' | 'ADJUSTMENT' | 'MANUAL'

  @Column({ name: "reference_id", nullable: true })
  referenceId: number;

  @Column({ name: "reference_code", length: 30, nullable: true })
  referenceCode: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    name: "total_debit",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  totalDebit: number;

  @Column({
    name: "total_credit",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  totalCredit: number;

  @Column({ name: "is_balanced", type: "boolean", default: true })
  isBalanced: boolean;

  @Column({ name: "is_posted", type: "boolean", default: true })
  isPosted: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;

  @Column({ name: "posted_at", nullable: true })
  postedAt: Date;

  @Column({ name: "posted_by", nullable: true })
  postedBy: number;

  @OneToMany(() => JournalLine, (line) => line.journal, { cascade: true })
  lines: JournalLine[];
}

