import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "../../master-data/entities/product.entity";
import { ProductBatch } from "./product-batch.entity";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";
import { ProductUom } from "../../master-data/entities/product-uom.entity";
import { Supplier } from "../../master-data/entities/supplier.entity";
import { Customer } from "../../customers/entities/customer.entity";

@Entity("inventory_transactions")
export class InventoryTransaction {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ name: "transaction_code", unique: true, length: 30 })
  transactionCode: string;

  @Column({ name: "transaction_type", length: 20 })
  transactionType: string; // 'INBOUND' | 'OUTBOUND' | 'BREAKDOWN' | 'ADJUSTMENT' | 'SPOILAGE'

  @Column({ name: "reference_doc", length: 30, nullable: true })
  referenceDoc: string;

  @Column({ name: "product_id" })
  productId: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ name: "batch_id", nullable: true })
  batchId: number;

  @ManyToOne(() => ProductBatch, { eager: true, nullable: true })
  @JoinColumn({ name: "batch_id" })
  batch: ProductBatch;

  @Column({ name: "freezer_location_id" })
  freezerLocationId: number;

  @ManyToOne(() => FreezerLocation, { eager: true })
  @JoinColumn({ name: "freezer_location_id" })
  freezerLocation: FreezerLocation;

  @Column({ name: "customer_id", nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @Column({ name: "supplier_id", nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: "supplier_id" })
  supplier: Supplier;

  @Column({ name: "input_quantity" })
  inputQuantity: number;

  @Column({ name: "input_uom_id" })
  inputUomId: number;

  @ManyToOne(() => ProductUom, { eager: true })
  @JoinColumn({ name: "input_uom_id" })
  inputUom: ProductUom;

  @Column({ name: "qty_in_base_uom" })
  qtyInBaseUom: number;

  @Column({
    name: "unit_cost",
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: true,
  })
  unitCost: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: true,
  })
  unitPrice: number;

  @Column({
    name: "total_cost",
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalCost: number;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalAmount: number;

  @Column({
    name: "temp_check",
    type: "decimal",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  tempCheck: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "created_by", nullable: true })
  createdBy: number;
}
