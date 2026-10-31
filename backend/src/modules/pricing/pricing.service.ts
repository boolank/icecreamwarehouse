import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCustomerPrice } from './entities/product-customer-price.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(ProductCustomerPrice)
    private priceRepository: Repository<ProductCustomerPrice>,
  ) {}

  async findAll(productId?: number, categoryId?: number) {
    const qb = this.priceRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.product', 'prod')
      .leftJoinAndSelect('p.product_uom', 'uom')
      .leftJoinAndSelect('p.category', 'cat')
      .where('p.is_active = true');

    if (productId) {
      qb.andWhere('p.product_id = :productId', { productId });
    }
    if (categoryId) {
      qb.andWhere('p.category_id = :categoryId', { categoryId });
    }

    qb.orderBy('prod.name', 'ASC');
    return qb.getMany();
  }

  async lookupPrice(productId: number, uomId: number, categoryId: number) {
    const priceEntry = await this.priceRepository.findOne({
      where: {
        product_id: productId,
        product_uom_id: uomId,
        category_id: categoryId,
        is_active: true,
      },
      relations: ['product', 'product_uom', 'category'],
    });

    if (!priceEntry) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'PRICE_NOT_FOUND',
          message: 'Harga jual untuk kombinasi produk, satuan, dan segmen pelanggan ini belum ditetapkan.',
        },
      });
    }

    return {
      product_id: priceEntry.product_id,
      product_name: priceEntry.product?.name,
      product_uom_id: priceEntry.product_uom_id,
      uom_name: priceEntry.product_uom?.uom_name,
      category_id: priceEntry.category_id,
      category_name: priceEntry.category?.category_name,
      price: Number(priceEntry.price),
      effective_date: priceEntry.effective_date,
    };
  }

  async setPrice(
    productId: number,
    uomId: number,
    categoryId: number,
    price: number,
    userId?: number,
  ) {
    if (price < 0) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INVALID_PRICE',
          message: 'Harga jual tidak boleh bernilai negatif.',
        },
      });
    }

    let existing = await this.priceRepository.findOne({
      where: {
        product_id: productId,
        product_uom_id: uomId,
        category_id: categoryId,
      },
    });

    if (existing) {
      existing.price = price;
      existing.updated_by = userId || null;
      return this.priceRepository.save(existing);
    } else {
      const newPrice = this.priceRepository.create({
        product_id: productId,
        product_uom_id: uomId,
        category_id: categoryId,
        price,
        created_by: userId || null,
      });
      return this.priceRepository.save(newPrice);
    }
  }
}

