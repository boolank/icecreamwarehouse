import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductUom } from './entities/product-uom.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductUom)
    private productUomRepository: Repository<ProductUom>,
  ) {}

  async findAll(search?: string, categoryId?: number) {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.uoms', 'uoms')
      .where('product.is_deleted = false');

    if (search) {
      qb.andWhere('(product.sku ILIKE :search OR product.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId });
    }

    qb.orderBy('product.created_at', 'DESC');
    return qb.getMany();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['category', 'uoms'],
    });

    if (!product) {
      throw new NotFoundException({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Produk es krim dengan ID ${id} tidak ditemukan.`,
        },
      });
    }
    return product;
  }

  async create(dto: CreateProductDto, userId?: number) {
    // 1. Cek duplikasi SKU
    const existing = await this.productRepository.findOne({
      where: { sku: dto.sku, is_deleted: false },
    });
    if (existing) {
      throw new ConflictException({
        success: false,
        error: {
          code: 'SKU_ALREADY_EXISTS',
          message: `Produk dengan kode SKU ${dto.sku} sudah terdaftar.`,
        },
      });
    }

    // 2. Validasi aturan ketat Multi-UOM: Wajib ada tepat 1 Base UOM
    const baseUoms = dto.uoms.filter((u) => u.is_base_uom === true);
    if (baseUoms.length !== 1) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INVALID_BASE_UOM',
          message: 'Produk wajib memiliki tepat 1 Satuan Dasar (Base UOM, misal: PCS).',
        },
      });
    }

    if (baseUoms[0].conversion_factor !== 1) {
      throw new BadRequestException({
        success: false,
        error: {
          code: 'INVALID_CONVERSION_FACTOR',
          message: 'Faktor konversi untuk Base UOM harus bernilai 1.',
        },
      });
    }

    // 3. Simpan produk & uoms dalam transaksi
    const product = this.productRepository.create({
      sku: dto.sku.toUpperCase(),
      name: dto.name,
      category_id: dto.category_id || null,
      brand: dto.brand || null,
      description: dto.description || null,
      min_temp: dto.min_temp ?? -25.0,
      max_temp: dto.max_temp ?? -18.0,
      shelf_life_days: dto.shelf_life_days || null,
      image_url: dto.image_url || null,
      created_by: userId || null,
    });

    const savedProduct = await this.productRepository.save(product);

    // Simpan UOMs
    const uomEntities = dto.uoms.map((u) =>
      this.productUomRepository.create({
        product_id: savedProduct.id,
        uom_name: u.uom_name.toUpperCase(),
        conversion_factor: u.conversion_factor,
        is_base_uom: u.is_base_uom || false,
        is_buying_uom: u.is_buying_uom || false,
        is_selling_uom: u.is_selling_uom || false,
        created_by: userId || null,
      }),
    );

    await this.productUomRepository.save(uomEntities);

    return this.findOne(savedProduct.id);
  }

  async softDelete(id: number, userId?: number) {
    const product = await this.findOne(id);
    await this.productRepository.update(product.id, {
      is_deleted: true,
      deleted_at: new Date(),
      deleted_by: userId || null,
    });
    return { message: `Produk ${product.name} (${product.sku}) berhasil dinonaktifkan.` };
  }
}

