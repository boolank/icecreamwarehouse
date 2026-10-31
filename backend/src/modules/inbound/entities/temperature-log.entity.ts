import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { FreezerLocation } from "../../master-data/entities/freezer-location.entity";

@Entity("temperature_logs")
export class TemperatureLog {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ name: "freezer_location_id" })
  freezerLocationId: number;

  @ManyToOne(() => FreezerLocation, { eager: true })
  @JoinColumn({ name: "freezer_location_id" })
  freezerLocation: FreezerLocation;

  @Column({ name: "recorded_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  recordedAt: Date;

  @Column({
    name: "temperature_celsius",
    type: "decimal",
    precision: 5,
    scale: 2,
  })
  temperatureCelsius: number;

  @Column({ name: "recorded_by", nullable: true })
  recordedBy: number;

  @Column({ name: "is_anomaly", default: false })
  isAnomaly: boolean;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
