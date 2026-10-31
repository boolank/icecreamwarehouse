import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { CustomersModule } from './modules/customers/customers.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { AccountingModule } from './modules/accounting/accounting.module';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Role } from './modules/users/entities/role.entity';
import { UserRole } from './modules/users/entities/user-role.entity';
import { RefreshToken } from './modules/users/entities/refresh-token.entity';
import { ActivityLog } from './modules/users/entities/activity-log.entity';
import { DataChangeLog } from './modules/users/entities/data-change-log.entity';
import { Product } from './modules/master-data/entities/product.entity';
import { ProductUom } from './modules/master-data/entities/product-uom.entity';
import { ProductCategory } from './modules/master-data/entities/product-category.entity';
import { FreezerLocation } from './modules/master-data/entities/freezer-location.entity';
import { Supplier } from './modules/master-data/entities/supplier.entity';
import { CustomerCategory } from './modules/customers/entities/customer-category.entity';
import { Customer } from './modules/customers/entities/customer.entity';
import { ProductCustomerPrice } from './modules/pricing/entities/product-customer-price.entity';
import { ChartOfAccount } from './modules/accounting/entities/chart-of-account.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'wms_user'),
        password: config.get<string>('DB_PASSWORD', 'SuperS3cr3tPass!'),
        database: config.get<string>('DB_NAME', 'icecream_wms_db'),
        entities: [
          User,
          Role,
          UserRole,
          RefreshToken,
          ActivityLog,
          DataChangeLog,
          Product,
          ProductUom,
          ProductCategory,
          FreezerLocation,
          Supplier,
          CustomerCategory,
          Customer,
          ProductCustomerPrice,
          ChartOfAccount,
        ],
        synchronize: false, // Gunakan migration / DDL script
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    MasterDataModule,
    CustomersModule,
    PricingModule,
    AccountingModule,
  ],
})
export class AppModule {}

