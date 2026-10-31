import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreezerLocation } from './entities/freezer-location.entity';
import { DataChangeLog } from '../users/entities/data-change-log.entity';

@Injectable()
export class FreezersService {
  constructor(
    @InjectRepository(FreezerLocation)
    private freezerRepository: Repository<FreezerLocation>,
    @InjectRepository(DataChangeLog)
    private dataChangeLogRepository: Repository<DataChangeLog>,
  ) {}

  async findAll() {
    return this.freezerRepository.find({
      where: { is_deleted: false },
      order: { location_code: 'ASC' },
    });
  }

  async findOne(id: number) {
    const loc = await this.freezerRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!loc) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'LOCATION_NOT_FOUND',
          message: `Lokasi rak freezer dengan ID ${id} tidak ditemukan.`,
        },
      });
    }
    return loc;
  }

  async create(data: Partial<FreezerLocation>, userId?: number) {
    const loc = this.freezerRepository.create({
      ...data,
      created_by: userId || null,
    });
    const saved = await this.freezerRepository.save(loc);

    // Record audit trail
    const log = this.dataChangeLogRepository.create({
      table_name: 'freezer_locations',
      record_id: saved.id,
      operation: 'INSERT',
      old_data: null,
      new_data: saved,
      changed_columns: Object.keys(data),
      changed_by: userId || null,
    });
    await this.dataChangeLogRepository.save(log);

    return saved;
  }

  async update(id: number, data: Partial<FreezerLocation>, userId?: number) {
    const loc = await this.findOne(id);
    const oldSnapshot = { ...loc };
    const changedCols: string[] = [];

    const keys: (keyof FreezerLocation)[] = [
      'location_name',
      'zone',
      'capacity_pcs',
      'min_temp',
      'max_temp',
      'is_quarantine',
      'is_active',
    ];

    keys.forEach((k) => {
      if (data[k] !== undefined && data[k] !== loc[k]) {
        changedCols.push(k as string);
        (loc as any)[k] = data[k];
      }
    });

    loc.updated_by = userId || null;
    const saved = await this.freezerRepository.save(loc);

    if (changedCols.length > 0) {
      const log = this.dataChangeLogRepository.create({
        table_name: 'freezer_locations',
        record_id: loc.id,
        operation: 'UPDATE',
        old_data: oldSnapshot,
        new_data: saved,
        changed_columns: changedCols,
        changed_by: userId || null,
      });
      await this.dataChangeLogRepository.save(log);
    }

    return saved;
  }

  async toggleStatus(id: number, userId?: number) {
    const loc = await this.findOne(id);
    const oldStatus = loc.is_active;
    loc.is_active = !oldStatus;
    loc.updated_by = userId || null;
    const saved = await this.freezerRepository.save(loc);

    const log = this.dataChangeLogRepository.create({
      table_name: 'freezer_locations',
      record_id: loc.id,
      operation: 'UPDATE',
      old_data: { is_active: oldStatus },
      new_data: { is_active: loc.is_active },
      changed_columns: ['is_active'],
      changed_by: userId || null,
    });
    await this.dataChangeLogRepository.save(log);

    return saved;
  }

  async getAuditLogs(id: number) {
    await this.findOne(id); // pastikan ada
    return this.dataChangeLogRepository.find({
      where: {
        table_name: 'freezer_locations',
        record_id: id,
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }
}
