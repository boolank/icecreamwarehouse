import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerCategory } from './entities/customer-category.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerCategory)
    private categoryRepository: Repository<CustomerCategory>,
  ) {}

  async findAllCategories() {
    return this.categoryRepository.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });
  }

  async findAllCustomers(search?: string, categoryId?: number) {
    const qb = this.customerRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.category', 'cat')
      .where('c.is_deleted = false');

    if (search) {
      qb.andWhere('(c.name ILIKE :search OR c.customer_code ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      qb.andWhere('c.category_id = :categoryId', { categoryId });
    }

    qb.orderBy('c.name', 'ASC');
    return qb.getMany();
  }

  async findOneCustomer(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['category'],
    });

    if (!customer) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'CUSTOMER_NOT_FOUND',
          message: `Pelanggan dengan ID ${id} tidak ditemukan.`,
        },
      });
    }
    return customer;
  }

  async createCustomer(data: Partial<Customer>, userId?: number) {
    const customer = this.customerRepository.create({
      ...data,
      created_by: userId || null,
    });
    return this.customerRepository.save(customer);
  }
}

