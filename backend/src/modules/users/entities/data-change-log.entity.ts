import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('data_change_logs')
@Index(['table_name', 'record_id'])
@Index(['created_at'])
export class DataChangeLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 60 })
  table_name: string;

  @Column({ type: 'bigint' })
  record_id: number;

  @Column({ type: 'varchar', length: 10 })
  operation: string; // 'INSERT' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE'

  @Column({ type: 'jsonb', nullable: true })
  old_data: any;

  @Column({ type: 'jsonb', nullable: true })
  new_data: any;

  @Column({ type: 'text', array: true, nullable: true })
  changed_columns: string[] | null;

  @Column({ type: 'int', nullable: true })
  changed_by: number | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'changed_by' })
  user: User | null;
}

