import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseAuditEntity } from '../../../common/entities/base-audit.entity';
import { ProductCategory } from './product-category.entity';
import { ProductUom } from './product-uom.entity';

@Entity('products')
export class Product extends BaseAuditEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', nullable: true })
  category_id: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: -25.0 })
  min_temp: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: -18.0 })
  max_temp: number;

  @Column({ type: 'int', nullable: true })
  shelf_life_days: number | null;

  @Column({ type: 'text', nullable: true })
  image_url: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => ProductCategory, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory | null;

  @OneToMany(() => ProductUom, (uom) => uom.product, { cascade: true })
  uoms: ProductUom[];
}

