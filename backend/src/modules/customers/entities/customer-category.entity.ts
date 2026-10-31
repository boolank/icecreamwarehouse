import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';
import { Customer } from './customer.entity';

@Entity('customer_categories')
export class CustomerCategory extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  category_code: string; // 'MT', 'GT', 'HOREKA', 'AGEN'

  @Column({ type: 'varchar', length: 100 })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  discount_pct: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Customer, (customer) => customer.category)
  customers: Customer[];
}

