import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, QueryRunner } from "typeorm";
import { JournalEntry } from "./entities/journal-entry.entity";
import { JournalLine } from "./entities/journal-line.entity";
import { ChartOfAccount } from "./entities/chart-of-account.entity";

@Injectable()
export class JournalEngineService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly lineRepo: Repository<JournalLine>,
    @InjectRepository(ChartOfAccount)
    private readonly coaRepo: Repository<ChartOfAccount>,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Menghasilkan nomor jurnal otomatis: JV-YYYYMM-XXXX
   */
  async generateEntryNumber(queryRunner?: QueryRunner): Promise<string> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prefix = `JV-${yearMonth}-`;

    const repo = queryRunner ? queryRunner.manager.getRepository(JournalEntry) : this.journalRepo;
    const lastEntry = await repo
      .createQueryBuilder("j")
      .where("j.entry_number LIKE :prefix", { prefix: `${prefix}%` })
      .orderBy("j.id", "DESC")
      .getOne();

    let seq = 1;
    if (lastEntry) {
      const parts = lastEntry.entryNumber.split("-");
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  /**
   * Menemukan akun COA berdasarkan kode akun unik
   */
  async getAccountByNumber(accountNumber: string, queryRunner?: QueryRunner): Promise<ChartOfAccount> {
    const repo = queryRunner ? queryRunner.manager.getRepository(ChartOfAccount) : this.coaRepo;
    const acc = await repo.findOne({ where: { account_code: accountNumber, is_active: true } });
    if (!acc) {
      throw new BadRequestException(`Akun COA '${accountNumber}' tidak ditemukan atau non-aktif.`);
    }
    return acc;
  }

  /**
   * Otomasi Jurnal Pembelian Inbound:
   * Debit: 1130 Persediaan Barang Dagang Es Krim
   * Kredit: 2101 Utang Usaha (Trade Payables)
   */
  async createInboundJournal(params: {
    poNumber: string;
    supplierName: string;
    totalAmount: number;
    userId?: number;
    queryRunner?: QueryRunner;
  }): Promise<JournalEntry> {
    const { poNumber, supplierName, totalAmount, userId, queryRunner } = params;

    if (totalAmount <= 0) {
      throw new BadRequestException("Total nilai moneter jurnal pembelian harus lebih dari nol.");
    }

    const runner = queryRunner || this.dataSource.createQueryRunner();
    const isLocalRunner = !queryRunner;

    if (isLocalRunner) {
      await runner.connect();
      await runner.startTransaction();
    }

    try {
      const entryNumber = await this.generateEntryNumber(runner);
      const accInventory = await this.getAccountByNumber("1130", runner); // Persediaan Es Krim
      const accPayable = await this.getAccountByNumber("2101", runner);   // Utang Usaha

      const journal = runner.manager.create(JournalEntry, {
        entryNumber,
        transactionDate: new Date().toISOString().split("T")[0],
        referenceType: "INBOUND",
        referenceCode: poNumber,
        description: `Penerimaan Pasokan PO ${poNumber} dari ${supplierName} (Suhu Valid ≤ -18°C)`,
        totalDebit: totalAmount,
        totalCredit: totalAmount,
        isBalanced: true,
        isPosted: true,
        createdBy: userId,
        postedBy: userId,
        postedAt: new Date(),
      });

      const savedJournal = await runner.manager.save(journal);

      // Line 1: Debit Persediaan
      const lineDebit = runner.manager.create(JournalLine, {
        journalId: savedJournal.id,
        accountId: accInventory.id,
        description: `Persediaan Es Krim - Inbound PO ${poNumber}`,
        debitAmount: totalAmount,
        creditAmount: 0,
      });

      // Line 2: Kredit Utang Usaha
      const lineCredit = runner.manager.create(JournalLine, {
        journalId: savedJournal.id,
        accountId: accPayable.id,
        description: `Utang Pembelian Pasokan kepada ${supplierName}`,
        debitAmount: 0,
        creditAmount: totalAmount,
      });

      await runner.manager.save([lineDebit, lineCredit]);

      if (isLocalRunner) {
        await runner.commitTransaction();
      }

      savedJournal.lines = [lineDebit, lineCredit];
      return savedJournal;
    } catch (err) {
      if (isLocalRunner) {
        await runner.rollbackTransaction();
      }
      throw err;
    } finally {
      if (isLocalRunner) {
        await runner.release();
      }
    }
  }

  /**
   * Mengambil daftar seluruh jurnal beserta baris akunnya
   */
  async findAllJournals(): Promise<JournalEntry[]> {
    return this.journalRepo.find({
      relations: ["lines", "lines.account"],
      order: { id: "DESC" },
      take: 50,
    });
  }
}
