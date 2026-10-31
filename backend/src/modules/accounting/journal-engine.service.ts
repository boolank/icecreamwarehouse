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
   * Otomasi Jurnal Penjualan Ganda Outbound:
   * Jurnal 1: Pendapatan & Piutang Usaha
   *   Debit: 1120 Piutang Usaha
   *   Kredit: 4101-4104 Pendapatan Penjualan Es Krim
   * Jurnal 2: Pengakuan HPP Berbasis FEFO
   *   Debit: 5101 Beban Pokok Penjualan (HPP)
   *   Kredit: 1130 Persediaan Barang Dagang Es Krim
   */
  async createOutboundJournals(params: {
    soNumber: string;
    customerName: string;
    categoryCode: string; // 'MT' | 'GT' | 'HOREKA' | 'AGEN'
    revenueAmount: number;
    cogsAmount: number;
    userId?: number;
    queryRunner?: QueryRunner;
  }): Promise<{ revenueJournal: JournalEntry; cogsJournal: JournalEntry }> {
    const { soNumber, customerName, categoryCode, revenueAmount, cogsAmount, userId, queryRunner } = params;

    const runner = queryRunner || this.dataSource.createQueryRunner();
    const isLocalRunner = !queryRunner;

    if (isLocalRunner) {
      await runner.connect();
      await runner.startTransaction();
    }

    try {
      // Tentukan kode akun pendapatan berdasarkan segmen
      let revenueAccountCode = "4102"; // default General Trade
      if (categoryCode === "MT") revenueAccountCode = "4101";
      else if (categoryCode === "HOREKA") revenueAccountCode = "4103";
      else if (categoryCode === "AGEN") revenueAccountCode = "4104";

      const accReceivable = await this.getAccountByNumber("1120", runner);
      const accRevenue = await this.getAccountByNumber(revenueAccountCode, runner);
      const accCogs = await this.getAccountByNumber("5101", runner);
      const accInventory = await this.getAccountByNumber("1130", runner);

      // --- 1. JURNAL PENDAPATAN & PIUTANG ---
      const entryNumRev = await this.generateEntryNumber(runner);
      const revJournal = runner.manager.create(JournalEntry, {
        entryNumber: entryNumRev,
        transactionDate: new Date().toISOString().split("T")[0],
        referenceType: "OUTBOUND",
        referenceCode: soNumber,
        description: `Penjualan Es Krim SO ${soNumber} kepada ${customerName}`,
        totalDebit: revenueAmount,
        totalCredit: revenueAmount,
        isBalanced: true,
        isPosted: true,
        createdBy: userId,
        postedBy: userId,
        postedAt: new Date(),
      });
      const savedRevJournal = await runner.manager.save(revJournal);

      const lineRec = runner.manager.create(JournalLine, {
        journalId: savedRevJournal.id,
        accountId: accReceivable.id,
        description: `Piutang Usaha Penjualan - ${customerName}`,
        debitAmount: revenueAmount,
        creditAmount: 0,
      });

      const lineRev = runner.manager.create(JournalLine, {
        journalId: savedRevJournal.id,
        accountId: accRevenue.id,
        description: `Pendapatan Penjualan Segmen ${categoryCode}`,
        debitAmount: 0,
        creditAmount: revenueAmount,
      });
      await runner.manager.save([lineRec, lineRev]);
      savedRevJournal.lines = [lineRec, lineRev];

      // --- 2. JURNAL BEBAN POKOK PENJUALAN (HPP FEFO) ---
      const entryNumCogs = await this.generateEntryNumber(runner);
      const cogsJournal = runner.manager.create(JournalEntry, {
        entryNumber: entryNumCogs,
        transactionDate: new Date().toISOString().split("T")[0],
        referenceType: "OUTBOUND",
        referenceCode: soNumber,
        description: `Pengakuan HPP FEFO Pengeluaran Stok SO ${soNumber}`,
        totalDebit: cogsAmount,
        totalCredit: cogsAmount,
        isBalanced: true,
        isPosted: true,
        createdBy: userId,
        postedBy: userId,
        postedAt: new Date(),
      });
      const savedCogsJournal = await runner.manager.save(cogsJournal);

      const lineCogs = runner.manager.create(JournalLine, {
        journalId: savedCogsJournal.id,
        accountId: accCogs.id,
        description: `Beban Pokok Penjualan (HPP) FEFO SO ${soNumber}`,
        debitAmount: cogsAmount,
        creditAmount: 0,
      });

      const lineInv = runner.manager.create(JournalLine, {
        journalId: savedCogsJournal.id,
        accountId: accInventory.id,
        description: `Pengurangan Persediaan Es Krim Gudang SO ${soNumber}`,
        debitAmount: 0,
        creditAmount: cogsAmount,
      });
      await runner.manager.save([lineCogs, lineInv]);
      savedCogsJournal.lines = [lineCogs, lineInv];

      if (isLocalRunner) {
        await runner.commitTransaction();
      }

      return {
        revenueJournal: savedRevJournal,
        cogsJournal: savedCogsJournal,
      };
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
