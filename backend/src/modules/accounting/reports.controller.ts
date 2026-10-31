import { Controller, Get, Query } from "@nestjs/common";
import { AccountingReportsService } from "./reports.service";

@Controller("api/v1/accounting/reports")
export class AccountingReportsController {
  constructor(private readonly reportsService: AccountingReportsService) {}

  @Get("general-journal")
  async getGeneralJournal(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("referenceType") referenceType?: string
  ) {
    return this.reportsService.getGeneralJournal({
      startDate,
      endDate,
      referenceType,
    });
  }

  @Get("general-ledger")
  async getGeneralLedger(@Query("accountCode") accountCode: string) {
    return this.reportsService.getGeneralLedger(accountCode || "1130");
  }

  @Get("trial-balance")
  async getTrialBalance() {
    return this.reportsService.getTrialBalance();
  }

  @Get("income-statement")
  async getIncomeStatement() {
    return this.reportsService.getIncomeStatement();
  }

  @Get("balance-sheet")
  async getBalanceSheet() {
    return this.reportsService.getBalanceSheet();
  }

  @Get("stock-movement")
  async getStockMovement() {
    return this.reportsService.getStockMovement();
  }
}

