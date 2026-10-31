import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from '../../master-data/entities/product.entity';
import { ProductUom } from '../../master-data/entities/product-uom.entity';
import { CustomerCategory } from '../../customers/entities/customer-category.entity';

@Entity('product_customer_prices')
@Unique(['product_id', 'product_uom_id', 'category_id'])
export class ProductCustomerPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  product_id: number;

  @Column({ type: 'int' })
  product_uom_id: number;

  @Column({ type: 'int' })
  category_id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  effective_date: string;

  @Column({ type: 'date', nullable: true })
  expired_date: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'int', nullable: true })
  created_by: number | null;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  updated_by: number | null;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductUom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_uom_id' })
  product_uom: ProductUom;

  @ManyToOne(() => CustomerCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CustomerCategory;
}

