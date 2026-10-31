import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { DataChangeLog } from '../users/entities/data-change-log.entity';

const SYSTEM_LOCKED_CODES = ['1130', '1135', '2101', '2102', '3000', '3301', '5000', '5101', '5201', '5202'];

@Injectable()
export class CoaService {
  constructor(
    @InjectRepository(ChartOfAccount)
    private coaRepository: Repository<ChartOfAccount>,
    @InjectRepository(DataChangeLog)
    private dataChangeLogRepository: Repository<DataChangeLog>,
  ) {}

  async findAllFlat() {
    return this.coaRepository.find({
      where: { is_deleted: false },
      order: { account_code: 'ASC' },
    });
  }

  async findAllTree() {
    const all = await this.findAllFlat();
    const map = new Map<number, any>();
    const roots: any[] = [];

    all.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    all.forEach((item) => {
      const node = map.get(item.id);
      if (item.parent_id && map.has(item.parent_id)) {
        map.get(item.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async findOne(id: number) {
    const coa = await this.coaRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!coa) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'ACCOUNT_NOT_FOUND',
          message: `Akun COA dengan ID ${id} tidak ditemukan.`,
        },
      });
    }
    return coa;
  }

  async create(data: Partial<ChartOfAccount>, userId?: number) {
    const existing = await this.coaRepository.findOne({
      where: { account_code: data.account_code, is_deleted: false },
    });
    if (existing) {
      throw new ConflictException({
        success: false,
        error: {
          code: 'ACCOUNT_CODE_EXISTS',
          message: `Kode akun ${data.account_code} sudah terdaftar.`,
        },
      });
    }

    const coa = this.coaRepository.create({
      ...data,
      created_by: userId || null,
    });
    const saved = await this.coaRepository.save(coa);

    const log = this.dataChangeLogRepository.create({
      table_name: 'chart_of_accounts',
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

  async update(id: number, data: Partial<ChartOfAccount>, userId?: number) {
    const coa = await this.findOne(id);

    if (SYSTEM_LOCKED_CODES.includes(coa.account_code)) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'SYSTEM_ACCOUNT_LOCKED',
          message: `Akun ${coa.account_code} adalah akun kontrol sistem yang tidak dapat diubah namanya secara bebas demi integritas laporan keuangan.`,
        },
      });
    }

    const oldSnapshot = { ...coa };
    const changedCols: string[] = [];

    const keys: (keyof ChartOfAccount)[] = [
      'account_name',
      'account_type',
      'normal_balance',
      'level',
      'is_header',
      'is_active',
    ];

    keys.forEach((k) => {
      if (data[k] !== undefined && data[k] !== coa[k]) {
        changedCols.push(k as string);
        (coa as any)[k] = data[k];
      }
    });

    coa.updated_by = userId || null;
    const saved = await this.coaRepository.save(coa);

    if (changedCols.length > 0) {
      const log = this.dataChangeLogRepository.create({
        table_name: 'chart_of_accounts',
        record_id: coa.id,
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
    const coa = await this.findOne(id);

    if (SYSTEM_LOCKED_CODES.includes(coa.account_code)) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'CANNOT_DEACTIVATE_SYSTEM_ACCOUNT',
          message: `Akun sistem ${coa.account_code} tidak dapat dinonaktifkan demi integritas pembukuan ganda.`,
        },
      });
    }

    const oldStatus = coa.is_active;
    coa.is_active = !oldStatus;
    coa.updated_by = userId || null;
    const saved = await this.coaRepository.save(coa);

    const log = this.dataChangeLogRepository.create({
      table_name: 'chart_of_accounts',
      record_id: coa.id,
      operation: 'UPDATE',
      old_data: { is_active: oldStatus },
      new_data: { is_active: coa.is_active },
      changed_columns: ['is_active'],
      changed_by: userId || null,
    });
    await this.dataChangeLogRepository.save(log);

    return saved;
  }

  async getAuditLogs(id: number) {
    await this.findOne(id);
    return this.dataChangeLogRepository.find({
      where: {
        table_name: 'chart_of_accounts',
        record_id: id,
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }
}
