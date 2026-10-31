import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductUom } from './entities/product-uom.entity';
import { ProductCategory } from './entities/product-category.entity';
import { FreezerLocation } from './entities/freezer-location.entity';
import { Supplier } from './entities/supplier.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { FreezersService } from './freezers.service';
import { FreezersController } from './freezers.controller';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductUom,
      ProductCategory,
      FreezerLocation,
      Supplier,
    ]),
  ],
  controllers: [
    ProductsController,
    FreezersController,
    SuppliersController,
  ],
  providers: [
    ProductsService,
    FreezersService,
    SuppliersService,
  ],
  exports: [
    ProductsService,
    FreezersService,
    SuppliersService,
  ],
})
export class MasterDataModule {}

