import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';

@Entity('chart_of_accounts')
export class ChartOfAccount extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 10, unique: true })
  account_code: string;

  @Column({ type: 'varchar', length: 150 })
  account_name: string;

  @Column({ type: 'varchar', length: 20 })
  account_type: string; // 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'COGS' | 'EXPENSE'

  @Column({ type: 'varchar', length: 6 })
  normal_balance: 'DEBIT' | 'CREDIT';

  @Column({ type: 'int', nullable: true })
  parent_id: number | null;

  @Column({ type: 'smallint', default: 1 })
  level: number;

  @Column({ type: 'boolean', default: false })
  is_header: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => ChartOfAccount, (coa) => coa.children, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: ChartOfAccount | null;

  @OneToMany(() => ChartOfAccount, (coa) => coa.parent)
  children: ChartOfAccount[];
}

