import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';
import { CustomerCategory } from './customer-category.entity';

@Entity('customers')
export class Customer extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  customer_code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'int', nullable: true })
  category_id: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pic_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  npwp: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.0 })
  credit_limit: number;

  @Column({ type: 'int', default: 0 })
  payment_term_days: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => CustomerCategory, (cat) => cat.customers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CustomerCategory | null;
}

