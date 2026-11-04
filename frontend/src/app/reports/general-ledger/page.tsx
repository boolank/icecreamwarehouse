"use client";

import React, { useState } from "react";
import {
  BookMarked,
  Search,
  Filter,
  Calendar,
  Scale,
  Printer,
  ChevronDown,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface LedgerRow {
  id: number;
  entryDate: string;
  entryNumber: string;
  referenceType: string;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

export default function GeneralLedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState("1130");

  const accounts = [
    { code: "1130", name: "Persediaan Barang Dagang Es Krim", type: "ASSET", normal: "DEBIT" },
    { code: "1120", name: "Piutang Usaha", type: "ASSET", normal: "DEBIT" },
    { code: "2101", name: "Utang Usaha — Supplier", type: "LIABILITY", normal: "CREDIT" },
    { code: "4101", name: "Pendapatan Penjualan Es Krim", type: "REVENUE", normal: "CREDIT" },
    { code: "5101", name: "Beban Pokok Penjualan (HPP)", type: "COGS", normal: "DEBIT" },
    { code: "5201", name: "Beban Kerugian Barang Rusak / Meleleh", type: "COGS", normal: "DEBIT" },
    { code: "5203", name: "Beban Selisih Stok (Susut Opname)", type: "COGS", normal: "DEBIT" },
  ];

  const currentAcc = accounts.find((a) => a.code === selectedAccount) || accounts[0];

  // Mock ledger data for 1130
  const ledgerData: LedgerRow[] = [
    {
      id: 1,
      entryDate: "2026-10-01",
      entryNumber: "JV-202610-0000",
      referenceType: "SALDO_AWAL",
      description: "Saldo Awal Bulan Oktober 2026",
      debit: 280000000,
      credit: 0,
      runningBalance: 280000000,
    },
    {
      id: 2,
      entryDate: "2026-10-31",
      entryNumber: "JV-202610-0003",
      referenceType: "INBOUND",
      description: "Penerimaan Pasokan Masuk PO-202610-001",
      debit: 5400000,
      credit: 0,
      runningBalance: 285400000,
    },
    {
      id: 3,
      entryDate: "2026-10-31",
      entryNumber: "JV-202610-0002",
      referenceType: "OUTBOUND_COGS",
      description: "Pengeluaran HPP Pesanan SO-202610-001",
      debit: 0,
      credit: 1750000,
      runningBalance: 283650000,
    },
    {
      id: 4,
      entryDate: "2026-10-31",
      entryNumber: "JV-202610-0004",
      referenceType: "SPOILAGE_WRITEOFF",
      description: "Pemusnahan Es Krim Rusak BA-SPOIL-001",
      debit: 0,
      credit: 75000,
      runningBalance: 283575000,
    },
    {
      id: 5,
      entryDate: "2026-10-31",
      entryNumber: "JV-202610-0005",
      referenceType: "OPNAME_ADJUSTMENT",
      description: "Penyesuaian Selisih Susut Opname OPN-001",
      debit: 0,
      credit: 7333,
      runningBalance: 283567667,
    },
  ];

  const totalDebit = ledgerData.reduce((s, r) => s + r.debit, 0);
  const totalCredit = ledgerData.reduce((s, r) => s + r.credit, 0);
  const endingBalance = ledgerData[ledgerData.length - 1].runningBalance;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Buku Besar (General Ledger)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              Rincian Mutasi Akun
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Riwayat kronologis mutasi debit dan kredit per akun buku besar beserta perhitungan saldo berjalan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          Cetak Buku Besar
        </button>
      </div>

      {/* Account Selector Card */}
      <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pilih Akun Buku Besar:
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accounts.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} - {a.name} ({a.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-gray-500">Tipe Akun:</span>
            <p className="font-bold text-gray-900 dark:text-white mt-0.5">
              {currentAcc.type}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Saldo Normal:</span>
            <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {currentAcc.normal}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Saldo Akhir Berjalan:</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono mt-0.5">
              Rp {endingBalance.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Bukti Jurnal</th>
                <th className="py-3 px-4">Keterangan Transaksi</th>
                <th className="py-3 px-4 text-right">Debit (Rp)</th>
                <th className="py-3 px-4 text-right">Kredit (Rp)</th>
                <th className="py-3 px-4 text-right">Saldo Berjalan (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {ledgerData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {row.entryDate}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {row.entryNumber}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                    {row.description}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                    {row.debit > 0 ? row.debit.toLocaleString("id-ID") : "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                    {row.credit > 0 ? row.credit.toLocaleString("id-ID") : "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                    Rp {row.runningBalance.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totals */}
            <tfoot className="bg-gray-100 dark:bg-gray-750 font-bold border-t-2 border-gray-300 dark:border-gray-600">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right uppercase text-xs">
                  Total Mutasi & Saldo Akhir:
                </td>
                <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                  Rp {totalDebit.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-white">
                  Rp {totalCredit.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  Rp {endingBalance.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

