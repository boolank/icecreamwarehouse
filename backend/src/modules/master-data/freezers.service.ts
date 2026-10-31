import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreezerLocation } from './entities/freezer-location.entity';

@Injectable()
export class FreezersService {
  constructor(
    @InjectRepository(FreezerLocation)
    private freezerRepository: Repository<FreezerLocation>,
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
    return this.freezerRepository.save(loc);
  }
}

