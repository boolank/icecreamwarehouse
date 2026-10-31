import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { CoaService } from './coa.service';
import { CoaController } from './coa.controller';
import { JournalEngineService } from './journal-engine.service';
import { AccountingReportsService } from './reports.service';
import { AccountingReportsController } from './reports.controller';
import { InventoryStock } from '../inbound/entities/inventory-stock.entity';
import { InventoryTransaction } from '../inbound/entities/inventory-transaction.entity';
import { DataChangeLog } from '../users/entities/data-change-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChartOfAccount,
      JournalEntry,
      JournalLine,
      InventoryStock,
      InventoryTransaction,
      DataChangeLog,
    ]),
  ],
  controllers: [CoaController, AccountingReportsController],
  providers: [CoaService, JournalEngineService, AccountingReportsService],
  exports: [CoaService, JournalEngineService, AccountingReportsService],
})
export class AccountingModule {}
