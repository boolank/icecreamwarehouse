import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';

@Entity('suppliers')
export class Supplier extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 30, unique: true })
  supplier_code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contact_person: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  npwp: string | null;

  @Column({ type: 'int', default: 30 })
  payment_term_days: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}

