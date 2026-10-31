import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';

@Entity('freezer_locations')
export class FreezerLocation extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  location_code: string;

  @Column({ type: 'varchar', length: 100 })
  location_name: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zone: string | null;

  @Column({ type: 'int', nullable: true })
  capacity_pcs: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: -25.0 })
  min_temp: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: -18.0 })
  max_temp: number;

  @Column({ type: 'boolean', default: false })
  is_quarantine: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}

