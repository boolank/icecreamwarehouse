import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { JournalEntry } from "./journal-entry.entity";
import { ChartOfAccount } from "./chart-of-account.entity";

@Entity("journal_lines")
export class JournalLine {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ name: "journal_id" })
  journalId: number;

  @ManyToOne(() => JournalEntry, (journal) => journal.lines, { onDelete: "CASCADE" })
  @JoinColumn({ name: "journal_id" })
  journal: JournalEntry;

  @Column({ name: "account_id" })
  accountId: number;

  @ManyToOne(() => ChartOfAccount, { eager: true })
  @JoinColumn({ name: "account_id" })
  account: ChartOfAccount;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    name: "debit_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  debitAmount: number;

  @Column({
    name: "credit_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  creditAmount: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

