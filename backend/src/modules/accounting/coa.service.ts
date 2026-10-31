import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';

@Injectable()
export class CoaService {
  constructor(
    @InjectRepository(ChartOfAccount)
    private coaRepository: Repository<ChartOfAccount>,
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
    return this.coaRepository.save(coa);
  }
}

