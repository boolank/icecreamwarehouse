import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async findAll() {
    return this.supplierRepository.find({
      where: { is_deleted: false },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!supplier) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'SUPPLIER_NOT_FOUND',
          message: `Supplier dengan ID ${id} tidak ditemukan.`,
        },
      });
    }
    return supplier;
  }

  async create(data: Partial<Supplier>, userId?: number) {
    const supplier = this.supplierRepository.create({
      ...data,
      created_by: userId || null,
    });
    return this.supplierRepository.save(supplier);
  }
}

