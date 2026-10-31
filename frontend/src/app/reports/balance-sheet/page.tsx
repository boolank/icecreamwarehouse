"use client";

import React, { useState } from "react";
import {
  Landmark,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState("2026-10-31");

  // Assets
  const currentAssets = [
    { code: "1110", name: "Kas & Bank Operasional", amount: 145800000 },
    { code: "1120", name: "Piutang Usaha Toko & Supermarket", amount: 48500000 },
    { code: "1130", name: "Persediaan Barang Dagang Es Krim (Cold Storage)", amount: 82450000 },
  ];
  const totalCurrentAssets = currentAssets.reduce((s, i) => s + i.amount, 0); // 276,750,000

  const fixedAssets = [
    { code: "1210", name: "Peralatan Freezer, Cold Room & Truk Reefer", amount: 120000000 },
    { code: "1220", name: "Akumulasi Penyusutan Peralatan Freezer", amount: -24000000 },
  ];
  const totalFixedAssets = fixedAssets.reduce((s, i) => s + i.amount, 0); // 96,000,000

  const totalAssets = totalCurrentAssets + totalFixedAssets; // 372,750,000

  // Liabilities
  const currentLiabilities = [
    { code: "2101", name: "Utang Usaha Prinsipal Pabrik Es Krim", amount: 68500000 },
    { code: "2102", name: "Utang Beban Listrik & Cold Storage", amount: 12450000 },
  ];
  const totalLiabilities = currentLiabilities.reduce((s, i) => s + i.amount, 0); // 80,950,000

  // Equity
  const equityItems = [
    { code: "3101", name: "Modal Disetor Pemilik", amount: 250000000 },
    { code: "3201", name: "Laba Ditahan Periode Lalu", amount: 28300000 },
    { code: "3301", name: "Laba Bersih Berjalan Periode Oktober 2026", amount: 13500000 },
  ];
  const totalEquity = equityItems.reduce((s, i) => s + i.amount, 0); // 291,800,000

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity; // 372,750,000
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) === 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 rounded-lg text-purple-600 dark:text-purple-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Laporan Neraca (Balance Sheet)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Posisi Keuangan: Total Aset, Kewajiban & Ekuitas Bersih Distributor Es Krim
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Per Tanggal:</span>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={() => alert("Mengunduh Laporan Neraca format Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Balance Formula Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
          isBalanced
            ? "bg-purple-50/70 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800"
            : "bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isBalanced
                ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                : "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300"
            }`}
          >
            {isBalanced ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              PERSAMAAN DASAR AKUNTANSI: ASET = LIABILITAS + EKUITAS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isBalanced
                ? "Keseimbangan sempurna terverifikasi. Nilai buku persediaan es krim disinkronisasi otomatis dengan sub-ledger stok cold storage."
                : "Terdapat perbedaan antara total aset dengan total liabilitas dan ekuitas."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Aset</p>
            <p className="text-sm font-black font-mono text-purple-600 dark:text-purple-400">
              Rp {totalAssets.toLocaleString("id-ID")}
            </p>
          </div>
          <span className="text-slate-400 font-bold">=</span>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Liabilitas + Ekuitas</p>
            <p className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">
              Rp {totalLiabilitiesAndEquity.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Balance Sheet Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: ASSETS */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                AKTIVA / ASET (ASSETS)
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              DEBIT BALANCE
            </span>
          </div>

          <div className="p-5 space-y-6 text-xs flex-1">
            {/* Aset Lancar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                <span className="text-[11px] uppercase">ASET LANCAR (CURRENT ASSETS)</span>
              </div>
              <div className="space-y-2 pl-3">
                {currentAssets.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                <span>Subtotal Aset Lancar</span>
                <span className="font-mono tabular-nums">
                  Rp {totalCurrentAssets.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Aset Tetap */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                <span className="text-[11px] uppercase">ASET TETAP (FIXED ASSETS)</span>
              </div>
              <div className="space-y-2 pl-3">
                {fixedAssets.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span
                      className={`font-mono font-medium tabular-nums ${
                        item.amount < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {item.amount < 0
                        ? `(Rp ${Math.abs(item.amount).toLocaleString("id-ID")})`
                        : `Rp ${item.amount.toLocaleString("id-ID")}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                <span>Subtotal Nilai Buku Aset Tetap</span>
                <span className="font-mono tabular-nums">
                  Rp {totalFixedAssets.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Total Aset Footer */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold">
            <span className="text-xs uppercase text-slate-900 dark:text-white">
              TOTAL KESELURUHAN ASET
            </span>
            <span className="font-mono text-base font-black text-indigo-600 dark:text-indigo-400">
              Rp {totalAssets.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                PASIVA / LIABILITAS & EKUITAS
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              CREDIT BALANCE
            </span>
          </div>

          <div className="p-5 space-y-6 text-xs flex-1">
            {/* Liabilitas Lancar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                <span className="text-[11px] uppercase">LIABILITAS JANGKA PENDEK</span>
              </div>
              <div className="space-y-2 pl-3">
                {currentLiabilities.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                <span>Total Liabilitas Lancar</span>
                <span className="font-mono tabular-nums">
                  Rp {totalLiabilities.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Ekuitas Pemilik */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                <span className="text-[11px] uppercase">EKUITAS PEMILIK (OWNER&apos;S EQUITY)</span>
              </div>
              <div className="space-y-2 pl-3">
                {equityItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{item.code}</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
                <span>Total Ekuitas Pemilik</span>
                <span className="font-mono tabular-nums">
                  Rp {totalEquity.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Total Pasiva Footer */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center font-bold">
            <span className="text-xs uppercase text-slate-900 dark:text-white">
              TOTAL LIABILITAS & EKUITAS
            </span>
            <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400">
              Rp {totalLiabilitiesAndEquity.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

