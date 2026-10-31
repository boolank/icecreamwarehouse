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
import { CreateProductDto, ProductUomDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataChangeLog } from '../users/entities/data-change-log.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductUom)
    private productUomRepository: Repository<ProductUom>,
    @InjectRepository(DataChangeLog)
    private dataChangeLogRepository: Repository<DataChangeLog>,
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

  async update(id: number, dto: UpdateProductDto, userId?: number) {
    const product = await this.findOne(id);
    const oldSnapshot = { ...product };
    const changedCols: string[] = [];

    if (dto.name !== undefined && dto.name !== product.name) {
      changedCols.push('name');
      product.name = dto.name;
    }
    if (dto.category_id !== undefined && dto.category_id !== product.category_id) {
      changedCols.push('category_id');
      product.category_id = dto.category_id;
    }
    if (dto.brand !== undefined && dto.brand !== product.brand) {
      changedCols.push('brand');
      product.brand = dto.brand;
    }
    if (dto.description !== undefined && dto.description !== product.description) {
      changedCols.push('description');
      product.description = dto.description;
    }
    if (dto.min_temp !== undefined && dto.min_temp !== product.min_temp) {
      changedCols.push('min_temp');
      product.min_temp = dto.min_temp;
    }
    if (dto.max_temp !== undefined && dto.max_temp !== product.max_temp) {
      changedCols.push('max_temp');
      product.max_temp = dto.max_temp;
    }
    if (dto.is_active !== undefined && dto.is_active !== product.is_active) {
      changedCols.push('is_active');
      product.is_active = dto.is_active;
    }

    product.updated_by = userId || null;
    const saved = await this.productRepository.save(product);

    // Record in data_change_logs
    if (changedCols.length > 0) {
      const log = this.dataChangeLogRepository.create({
        table_name: 'products',
        record_id: product.id,
        operation: 'UPDATE',
        old_data: oldSnapshot,
        new_data: saved,
        changed_columns: changedCols,
        changed_by: userId || null,
      });
      await this.dataChangeLogRepository.save(log);
    }

    // Jika ada update UOMs sekaligus
    if (dto.uoms && dto.uoms.length > 0) {
      await this.updateUoms(id, dto.uoms, userId);
    }

    return this.findOne(id);
  }

  async updateUoms(productId: number, uoms: ProductUomDto[], userId?: number) {
    const product = await this.findOne(productId);

    // Validasi aturan ketat Multi-UOM: Tepat 1 Base UOM
    const baseUoms = uoms.filter((u) => u.is_base_uom === true);
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

    const oldUoms = await this.productUomRepository.find({
      where: { product_id: productId },
    });

    // Hapus UOM lama dan simpan UOM baru
    await this.productUomRepository.delete({ product_id: productId });

    const newUomEntities = uoms.map((u) =>
      this.productUomRepository.create({
        product_id: productId,
        uom_name: u.uom_name.toUpperCase(),
        conversion_factor: u.conversion_factor,
        is_base_uom: u.is_base_uom || false,
        is_buying_uom: u.is_buying_uom || false,
        is_selling_uom: u.is_selling_uom || false,
        created_by: userId || null,
      }),
    );
    await this.productUomRepository.save(newUomEntities);

    // Audit log
    const log = this.dataChangeLogRepository.create({
      table_name: 'product_uoms',
      record_id: productId,
      operation: 'UPDATE',
      old_data: oldUoms,
      new_data: newUomEntities,
      changed_columns: ['uom_name', 'conversion_factor', 'is_base_uom'],
      changed_by: userId || null,
    });
    await this.dataChangeLogRepository.save(log);

    return this.findOne(productId);
  }

  async getAuditLogs(productId: number) {
    await this.findOne(productId);
    return this.dataChangeLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .where('(log.table_name = :tProd OR log.table_name = :tUom) AND log.record_id = :id', {
        tProd: 'products',
        tUom: 'product_uoms',
        id: productId,
      })
      .orderBy('log.created_at', 'DESC')
      .getMany();
  }

  async softDelete(id: number, userId?: number) {
    const product = await this.findOne(id);
    await this.productRepository.update(product.id, {
      is_deleted: true,
      deleted_at: new Date(),
      deleted_by: userId || null,
    });

    const log = this.dataChangeLogRepository.create({
      table_name: 'products',
      record_id: product.id,
      operation: 'SOFT_DELETE',
      old_data: product,
      new_data: { is_deleted: true },
      changed_columns: ['is_deleted'],
      changed_by: userId || null,
    });
    await this.dataChangeLogRepository.save(log);

    return { message: `Produk ${product.name} (${product.sku}) berhasil dinonaktifkan.` };
  }
}

