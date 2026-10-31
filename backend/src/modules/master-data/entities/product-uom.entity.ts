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
import { Product } from './product.entity';

@Entity('product_uoms')
@Unique(['product_id', 'uom_name'])
export class ProductUom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  product_id: number;

  @Column({ type: 'varchar', length: 20 })
  uom_name: string; // e.g. 'DUS', 'PACK', 'PCS'

  @Column({ type: 'int' })
  conversion_factor: number; // Jumlah Base Unit (PCS)

  @Column({ type: 'boolean', default: false })
  is_base_uom: boolean;

  @Column({ type: 'boolean', default: false })
  is_buying_uom: boolean;

  @Column({ type: 'boolean', default: false })
  is_selling_uom: boolean;

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

  @ManyToOne(() => Product, (product) => product.uoms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

