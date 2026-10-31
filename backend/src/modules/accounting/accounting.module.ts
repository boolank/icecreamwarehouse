import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { CoaService } from './coa.service';
import { CoaController } from './coa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChartOfAccount])],
  controllers: [CoaController],
  providers: [CoaService],
  exports: [CoaService],
})
export class AccountingModule {}

