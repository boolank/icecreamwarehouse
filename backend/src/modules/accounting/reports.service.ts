import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, DataSource } from "typeorm";
import { JournalEntry } from "./entities/journal-entry.entity";
import { JournalLine } from "./entities/journal-line.entity";
import { ChartOfAccount } from "./entities/chart-of-account.entity";
import { InventoryStock } from "../inbound/entities/inventory-stock.entity";
import { InventoryTransaction } from "../inbound/entities/inventory-transaction.entity";

@Injectable()
export class AccountingReportsService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepo: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly lineRepo: Repository<JournalLine>,
    @InjectRepository(ChartOfAccount)
    private readonly coaRepo: Repository<ChartOfAccount>,
    @InjectRepository(InventoryStock)
    private readonly stockRepo: Repository<InventoryStock>,
    @InjectRepository(InventoryTransaction)
    private readonly txRepo: Repository<InventoryTransaction>,
    private readonly dataSource: DataSource
  ) {}

  /**
   * Laporan Jurnal Umum (General Journal)
   */
  async getGeneralJournal(params: {
    startDate?: string;
    endDate?: string;
    referenceType?: string;
  }) {
    let qb = this.journalRepo
      .createQueryBuilder("j")
      .leftJoinAndSelect("j.lines", "l")
      .leftJoinAndSelect("l.account", "acc")
      .orderBy("j.transaction_date", "DESC")
      .addOrderBy("j.id", "DESC");

    if (params.referenceType) {
      qb = qb.andWhere("j.reference_type = :refType", {
        refType: params.referenceType,
      });
    }

    if (params.startDate && params.endDate) {
      qb = qb.andWhere("j.transaction_date BETWEEN :start AND :end", {
        start: params.startDate,
        end: params.endDate,
      });
    }

    const entries = await qb.getMany();

    const totalDebit = entries.reduce((sum, e) => {
      return (
        sum +
        (e.lines || []).reduce((s, l) => s + Number(l.debitAmount || 0), 0)
      );
    }, 0);

    const totalCredit = entries.reduce((sum, e) => {
      return (
        sum +
        (e.lines || []).reduce((s, l) => s + Number(l.creditAmount || 0), 0)
      );
    }, 0);

    return {
      period: {
        startDate: params.startDate || "Semua",
        endDate: params.endDate || "Semua",
      },
      summary: {
        totalEntries: entries.length,
        totalDebit,
        totalCredit,
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      },
      entries,
    };
  }

  /**
   * Laporan Buku Besar (General Ledger) per Akun
   */
  async getGeneralLedger(accountCode: string) {
    const account = await this.coaRepo.findOne({
      where: { account_code: accountCode, is_deleted: false },
    });
    if (!account) {
      throw new NotFoundException(`Akun COA '${accountCode}' tidak ditemukan.`);
    }

    const lines = await this.lineRepo
      .createQueryBuilder("l")
      .innerJoinAndSelect("l.journal", "j")
      .where("l.account_id = :accId", { accId: account.id })
      .andWhere("j.is_posted = TRUE")
      .orderBy("j.transaction_date", "ASC")
      .addOrderBy("l.id", "ASC")
      .getMany();

    let runningBalance = 0;
    const isNormalDebit = account.normal_balance === "DEBIT";

    const ledgerEntries = lines.map((line) => {
      const debit = Number(line.debitAmount || 0);
      const credit = Number(line.creditAmount || 0);

      if (isNormalDebit) {
        runningBalance += debit - credit;
      } else {
        runningBalance += credit - debit;
      }

      return {
        id: line.id,
        entryDate: line.journal.transactionDate,
        entryNumber: line.journal.entryNumber,
        referenceType: line.journal.referenceType,
        description: line.description || line.journal.description,
        debit,
        credit,
        runningBalance,
      };
    });

    return {
      account: {
        code: account.account_code,
        name: account.account_name,
        type: account.account_type,
        normalBalance: account.normal_balance,
      },
      totalTransactions: ledgerEntries.length,
      endingBalance: runningBalance,
      entries: ledgerEntries,
    };
  }

  /**
   * Laporan Neraca Saldo (Trial Balance)
   */
  async getTrialBalance() {
    const leafAccounts = await this.coaRepo.find({
      where: { is_header: false, is_active: true, is_deleted: false },
      order: { account_code: "ASC" },
    });

    const lines = await this.lineRepo
      .createQueryBuilder("l")
      .innerJoin("l.journal", "j")
      .select("l.account_id", "accountId")
      .addSelect("SUM(l.debit_amount)", "totalDebit")
      .addSelect("SUM(l.credit_amount)", "totalCredit")
      .where("j.is_posted = TRUE")
      .groupBy("l.account_id")
      .getRawMany();

    const lineMap = new Map<number, { debit: number; credit: number }>();
    lines.forEach((r) => {
      lineMap.set(Number(r.accountId), {
        debit: Number(r.totalDebit || 0),
        credit: Number(r.totalCredit || 0),
      });
    });

    let grandTotalDebit = 0;
    let grandTotalCredit = 0;

    const rows = leafAccounts.map((acc) => {
      const tx = lineMap.get(acc.id) || { debit: 0, credit: 0 };
      const isDebit = acc.normal_balance === "DEBIT";

      let debitBalance = 0;
      let creditBalance = 0;

      if (isDebit) {
        const net = tx.debit - tx.credit;
        if (net >= 0) {
          debitBalance = net;
        } else {
          creditBalance = Math.abs(net);
        }
      } else {
        const net = tx.credit - tx.debit;
        if (net >= 0) {
          creditBalance = net;
        } else {
          debitBalance = Math.abs(net);
        }
      }

      grandTotalDebit += debitBalance;
      grandTotalCredit += creditBalance;

      return {
        id: acc.id,
        accountCode: acc.account_code,
        accountName: acc.account_name,
        accountType: acc.account_type,
        normalBalance: acc.normal_balance,
        debit: debitBalance,
        credit: creditBalance,
      };
    });

    return {
      asOfDate: new Date().toISOString().split("T")[0],
      isBalanced: Math.abs(grandTotalDebit - grandTotalCredit) < 0.01,
      grandTotalDebit,
      grandTotalCredit,
      rows,
    };
  }

  /**
   * Laporan Laba Rugi (Income Statement)
   */
  async getIncomeStatement() {
    const trial = await this.getTrialBalance();

    const revenues = trial.rows.filter((r) => r.accountType === "REVENUE");
    const cogs = trial.rows.filter((r) => r.accountType === "COGS");
    const expenses = trial.rows.filter((r) => r.accountType === "EXPENSE");

    const totalRevenue = revenues.reduce((s, r) => s + (r.credit - r.debit), 0);
    const totalCogs = cogs.reduce((s, r) => s + (r.debit - r.credit), 0);
    const grossProfit = totalRevenue - totalCogs;
    const grossMarginPct =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const totalExpense = expenses.reduce((s, r) => s + (r.debit - r.credit), 0);
    const netOperatingIncome = grossProfit - totalExpense;
    const netMarginPct =
      totalRevenue > 0 ? (netOperatingIncome / totalRevenue) * 100 : 0;

    return {
      period: "Tahun Berjalan 2026",
      revenue: {
        items: revenues,
        total: totalRevenue,
      },
      cogs: {
        items: cogs,
        total: totalCogs,
      },
      grossProfit,
      grossMarginPct: Number(grossMarginPct.toFixed(2)),
      expense: {
        items: expenses,
        total: totalExpense,
      },
      netOperatingIncome,
      netMarginPct: Number(netMarginPct.toFixed(2)),
    };
  }

  /**
   * Laporan Neraca (Balance Sheet)
   */
  async getBalanceSheet() {
    const trial = await this.getTrialBalance();
    const incomeStmt = await this.getIncomeStatement();

    const assets = trial.rows.filter((r) => r.accountType === "ASSET");
    const liabilities = trial.rows.filter((r) => r.accountType === "LIABILITY");
    const equities = trial.rows.filter((r) => r.accountType === "EQUITY");

    const totalAssets = assets.reduce((s, r) => s + (r.debit - r.credit), 0);
    const totalLiabilities = liabilities.reduce(
      (s, r) => s + (r.credit - r.debit),
      0
    );
    const baseEquities = equities.reduce((s, r) => s + (r.credit - r.debit), 0);

    // Laba Berjalan ditambahkan ke Ekuitas
    const retainedEarnings = incomeStmt.netOperatingIncome;
    const totalEquities = baseEquities + retainedEarnings;
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquities;

    return {
      asOfDate: new Date().toISOString().split("T")[0],
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1.0,
      assets: {
        items: assets,
        total: totalAssets,
      },
      liabilities: {
        items: liabilities,
        total: totalLiabilities,
      },
      equity: {
        items: equities,
        retainedEarnings,
        total: totalEquities,
      },
      totalLiabilitiesAndEquity,
    };
  }

  /**
   * Laporan Mutasi Persediaan (Stock Movement Card)
   */
  async getStockMovement() {
    return this.stockRepo
      .createQueryBuilder("s")
      .innerJoinAndSelect("s.product", "p")
      .innerJoinAndSelect("s.batch", "b")
      .innerJoinAndSelect("s.freezerLocation", "fl")
      .orderBy("p.name", "ASC")
      .addOrderBy("b.expired_date", "ASC")
      .getMany();
  }
}
