import { Entity, Column } from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';

@Entity('product_categories')
export class ProductCategory extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  category_code: string;

  @Column({ type: 'varchar', length: 100 })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}

