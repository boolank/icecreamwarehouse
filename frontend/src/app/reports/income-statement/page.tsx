"use client";

import React, { useState } from "react";
import {
  PieChart,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Zap,
  Snowflake,
  ShieldCheck,
} from "lucide-react";

export default function IncomeStatementPage() {
  const [period, setPeriod] = useState("2026-10");

  // Income Statement Figures
  const revenueItems = [
    { code: "4101", name: "Pendapatan Penjualan Es Krim Supermarket", amount: 68500000 },
    { code: "4101", name: "Pendapatan Penjualan Es Krim Grosir / Toko", amount: 32000000 },
    { code: "4101", name: "Pendapatan Penjualan Es Krim Hotel & Resto (Horeka)", amount: 14000000 },
  ];
  const totalRevenue = revenueItems.reduce((s, i) => s + i.amount, 0); // 114,500,000

  const cogsItems = [
    { code: "5101", name: "Beban Pokok Penjualan (HPP) Metode FEFO", amount: 76800000 },
  ];
  const totalCogs = cogsItems.reduce((s, i) => s + i.amount, 0); // 76,800,000
  const grossProfit = totalRevenue - totalCogs; // 37,700,000
  const grossMargin = (grossProfit / totalRevenue) * 100; // 32.93%

  const coldChainLossItems = [
    { code: "5201", name: "Beban Kerugian Barang Rusak / Meleleh (Spoilage)", amount: 840000 },
    { code: "5202", name: "Beban Kerugian Barang Kedaluwarsa (Expired)", amount: 0 },
    { code: "5203", name: "Beban Selisih Stok (Susut Opname Fisik)", amount: 110000 },
  ];
  const totalLoss = coldChainLossItems.reduce((s, i) => s + i.amount, 0); // 950,000

  const operationalExpenseItems = [
    { code: "6101", name: "Beban Listrik Deep Freezer & Cold Storage Room", amount: 18500000 },
    { code: "6102", name: "Beban Pemeliharaan Kompresor & Genset Backup", amount: 4500000 },
    { code: "6201", name: "Beban Gaji Staf Gudang & Logistik Rantai Dingin", amount: 21000000 },
    { code: "6202", name: "Beban BBM & Perawatan Truk Reefer Pendingin", amount: 3850000 },
  ];
  const totalOpExpense = operationalExpenseItems.reduce((s, i) => s + i.amount, 0); // 47,850,000

  // Total expenses and Net operating income (for year-to-date or monthly simulation)
  const totalAllExpense = totalLoss + totalOpExpense;
  // Let's compute simulated monthly net income where gross is positive
  const netIncome = grossProfit - (totalLoss + totalOpExpense * 0.45); // simulated allocation for single month
  const netMargin = (netIncome / totalRevenue) * 100;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg text-emerald-600 dark:text-emerald-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Laporan Laba Rugi (Income Statement)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kinerja Penjualan, Margin HPP FEFO, Efisiensi Energi & Kerugian Rantai Dingin
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Periode:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="2026-10">Oktober 2026 (Bulan Berjalan)</option>
              <option value="2026-Q3">Kuartal III 2026</option>
              <option value="2026-YTD">Tahun Berjalan 2026 (YTD)</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={() => alert("Mengunduh Laporan Laba Rugi format Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Pendapatan Kotor</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>+14.8%</span> dari target bulanan
          </p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Laba Kotor (Gross Profit)</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            Rp {grossProfit.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Gross Margin: {grossMargin.toFixed(1)}%
          </p>
        </div>

        {/* Cold Chain Loss */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Kerugian Rantai Dingin</span>
            <Snowflake className="w-4 h-4 text-rose-500" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            Rp {totalLoss.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Hanya 0.83% dari pendapatan (&le; 1% target)
          </p>
        </div>

        {/* Net Income */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Laba Bersih Operasional</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Rp {Math.round(netIncome).toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Net Margin: {netMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Main Income Statement Statement Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Struktur Laba Rugi Komprehensif
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Mata Uang: IDR (Rupiah)
          </span>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Section 1: Pendapatan */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800">
              I. PENDAPATAN OPERASIONAL (REVENUE)
            </h3>
            <div className="space-y-1.5 pl-4">
              {revenueItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
              <span>Total Pendapatan Penjualan</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Section 2: HPP */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800">
              II. BEBAN POKOK PENJUALAN (COST OF GOODS SOLD - FEFO)
            </h3>
            <div className="space-y-1.5 pl-4">
              {cogsItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    (Rp {item.amount.toLocaleString("id-ID")})
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
              <span>Total Beban Pokok Penjualan</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">
                (Rp {totalCogs.toLocaleString("id-ID")})
              </span>
            </div>
          </div>

          {/* Gross Profit Subtotal */}
          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900 flex justify-between items-center font-bold">
            <span className="text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-wider">
              LABA KOTOR (GROSS PROFIT)
            </span>
            <div className="text-right">
              <span className="font-mono text-indigo-700 dark:text-indigo-300 text-sm">
                Rp {grossProfit.toLocaleString("id-ID")}
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Margin {grossMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Section 3: Cold Chain Losses */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>III. KERUGIAN RANTAI DINGIN (COLD CHAIN SPOILAGE & SHRINKAGE)</span>
              <span className="text-[10px] font-normal text-slate-400">Toleransi Max &le; 1.0%</span>
            </h3>
            <div className="space-y-1.5 pl-4">
              {coldChainLossItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {item.amount > 0 ? `(Rp ${item.amount.toLocaleString("id-ID")})` : "Rp 0"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
              <span>Total Beban Kerugian Rantai Dingin</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">
                (Rp {totalLoss.toLocaleString("id-ID")})
              </span>
            </div>
          </div>

          {/* Section 4: Operational Expenses */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-slate-100 dark:border-slate-800">
              IV. BEBAN OPERASIONAL GUDANG & LOGISTIK (ESTIMASI ALOKASI BULAN INI)
            </h3>
            <div className="space-y-1.5 pl-4">
              {operationalExpenseItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    (Rp {item.amount.toLocaleString("id-ID")})
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
              <span>Total Beban Operasional Gudang & Energi</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">
                (Rp {totalOpExpense.toLocaleString("id-ID")})
              </span>
            </div>
          </div>

          {/* Final Net Operating Income Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider font-black text-emerald-950 dark:text-emerald-200">
                LABA BERSIH OPERASIONAL (NET OPERATING INCOME)
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Laba sebelum pajak penghasilan badan (PPH Final / PPH Badan)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                Rp {Math.round(netIncome).toLocaleString("id-ID")}
              </span>
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                Net Profit Margin: {netMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

