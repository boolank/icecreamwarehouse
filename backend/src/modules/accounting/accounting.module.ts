import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { CoaService } from './coa.service';
import { CoaController } from './coa.controller';
import { JournalEngineService } from './journal-engine.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChartOfAccount, JournalEntry, JournalLine]),
  ],
  controllers: [CoaController],
  providers: [CoaService, JournalEngineService],
  exports: [CoaService, JournalEngineService],
})
export class AccountingModule {}

