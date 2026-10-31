import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Product } from "../../master-data/entities/product.entity";
import { Supplier } from "../../master-data/entities/supplier.entity";

@Entity("product_batches")
@Unique(["productId", "batchNumber"])
export class ProductBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "product_id" })
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "supplier_id", nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @Column({ name: "batch_number", length: 50 })
  batchNumber: string;

  @Column({ name: "production_date", type: "date", nullable: true })
  productionDate: string;

  @Column({ name: "expired_date", type: "date" })
  expiredDate: string;

  @Column({
    name: "cost_price_per_base_uom",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  costPricePerBaseUom: number;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy: number;
}
