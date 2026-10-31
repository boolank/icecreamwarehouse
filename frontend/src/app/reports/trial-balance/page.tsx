"use client";

import React, { useState } from "react";
import {
  Scale,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Filter,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";

interface TrialBalanceRow {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "COGS" | "EXPENSE";
  normalBalance: "DEBIT" | "CREDIT";
  debit: number;
  credit: number;
}

export default function TrialBalancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [asOfDate, setAsOfDate] = useState("2026-10-31");

  // Mock list of trial balance accounts matching Chart of Accounts
  const initialRows: TrialBalanceRow[] = [
    {
      id: 1,
      accountCode: "1110",
      accountName: "Kas & Bank Operasional",
      accountType: "ASSET",
      normalBalance: "DEBIT",
      debit: 145800000,
      credit: 0,
    },
    {
      id: 2,
      accountCode: "1120",
      accountName: "Piutang Usaha Toko & Supermarket",
      accountType: "ASSET",
      normalBalance: "DEBIT",
      debit: 48500000,
      credit: 0,
    },
    {
      id: 3,
      accountCode: "1130",
      accountName: "Persediaan Barang Dagang Es Krim",
      accountType: "ASSET",
      normalBalance: "DEBIT",
      debit: 82450000,
      credit: 0,
    },
    {
      id: 4,
      accountCode: "1210",
      accountName: "Peralatan Freezer & Cold Storage",
      accountType: "ASSET",
      normalBalance: "DEBIT",
      debit: 120000000,
      credit: 0,
    },
    {
      id: 5,
      accountCode: "1220",
      accountName: "Akumulasi Penyusutan Freezer",
      accountType: "ASSET",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 24000000,
    },
    {
      id: 6,
      accountCode: "2101",
      accountName: "Utang Usaha Prinsipal Pabrik Es Krim",
      accountType: "LIABILITY",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 68500000,
    },
    {
      id: 7,
      accountCode: "2102",
      accountName: "Utang Beban Listrik & Cold Storage",
      accountType: "LIABILITY",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 12450000,
    },
    {
      id: 8,
      accountCode: "3101",
      accountName: "Modal Disetor Pemilik",
      accountType: "EQUITY",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 250000000,
    },
    {
      id: 9,
      accountCode: "3201",
      accountName: "Laba Ditahan Periode Lalu",
      accountType: "EQUITY",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 28300000,
    },
    {
      id: 10,
      accountCode: "4101",
      accountName: "Pendapatan Penjualan Es Krim",
      accountType: "REVENUE",
      normalBalance: "CREDIT",
      debit: 0,
      credit: 114500000,
    },
    {
      id: 11,
      accountCode: "5101",
      accountName: "Beban Pokok Penjualan (HPP)",
      accountType: "COGS",
      normalBalance: "DEBIT",
      debit: 76800000,
      credit: 0,
    },
    {
      id: 12,
      accountCode: "5201",
      accountName: "Beban Kerugian Barang Rusak / Meleleh (Spoilage)",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 840000,
      credit: 0,
    },
    {
      id: 13,
      accountCode: "5202",
      accountName: "Beban Kerugian Kedaluwarsa (Expired Loss)",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 0,
      credit: 0,
    },
    {
      id: 14,
      accountCode: "5203",
      accountName: "Beban Selisih Stok (Susut Opname)",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 110000,
      credit: 0,
    },
    {
      id: 15,
      accountCode: "6101",
      accountName: "Beban Listrik Deep Freezer & Cold Room",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 18500000,
      credit: 0,
    },
    {
      id: 16,
      accountCode: "6102",
      accountName: "Beban Pemeliharaan & Servis Kompresor Freezer",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 4500000,
      credit: 0,
    },
    {
      id: 17,
      accountCode: "6201",
      accountName: "Beban Gaji Karyawan Gudang & Logistik",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 21000000,
      credit: 0,
    },
    {
      id: 18,
      accountCode: "6202",
      accountName: "Beban Bahan Bakar & Perawatan Truk Pendingin",
      accountType: "EXPENSE",
      normalBalance: "DEBIT",
      debit: 3850000,
      credit: 0,
    },
  ];

  const filteredRows = initialRows.filter((r) => {
    const matchesSearch =
      r.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || r.accountType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalDebit = initialRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = initialRows.reduce((sum, r) => sum + r.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) === 0;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ASSET":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">ASET</span>;
      case "LIABILITY":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">LIABILITAS</span>;
      case "EQUITY":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">EKUITAS</span>;
      case "REVENUE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">PENDAPATAN</span>;
      case "COGS":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">HPP</span>;
      case "EXPENSE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">BEBAN OPERASIONAL</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Neraca Saldo (Trial Balance)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verifikasi Keseimbangan Saldo Akhir Debit & Kredit Akun Buku Besar (COA)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan
          </button>
          <button
            onClick={() => alert("Mengunduh data Neraca Saldo (Trial Balance) format Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Balance Indicator Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
          isBalanced
            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
            : "bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isBalanced
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
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
            <h3
              className={`text-sm font-bold ${
                isBalanced
                  ? "text-emerald-900 dark:text-emerald-300"
                  : "text-rose-900 dark:text-rose-300"
              }`}
            >
              {isBalanced
                ? "NERACA SALDO SEIMBANG (BALANCED)"
                : "PERINGATAN: NERACA SALDO TIDAK SEIMBANG"}
            </h3>
            <p
              className={`text-xs ${
                isBalanced
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {isBalanced
                ? "Seluruh transaksi double-entry telah terverifikasi dengan selisih Rp 0. Buku besar siap untuk penutupan laporan keuangan."
                : `Terdapat anomali selisih sebesar Rp ${Math.abs(totalDebit - totalCredit).toLocaleString("id-ID")}. Harap periksa jurnal penyesuaian.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Debit</p>
            <p className="text-sm font-black font-mono text-slate-800 dark:text-slate-100">
              Rp {totalDebit.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Kredit</p>
            <p className="text-sm font-black font-mono text-slate-800 dark:text-slate-100">
              Rp {totalCredit.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode akun atau nama akun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Kategori Akun</option>
              <option value="ASSET">Aset</option>
              <option value="LIABILITY">Liabilitas</option>
              <option value="EQUITY">Ekuitas</option>
              <option value="REVENUE">Pendapatan</option>
              <option value="COGS">HPP</option>
              <option value="EXPENSE">Beban Operasional</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cut-Off:</span>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-28">Kode Akun</th>
                <th className="py-3 px-4">Nama Akun COA</th>
                <th className="py-3 px-4 w-36">Kategori</th>
                <th className="py-3 px-4 w-28 text-center">Saldo Normal</th>
                <th className="py-3 px-4 w-44 text-right">Debit (Rp)</th>
                <th className="py-3 px-4 w-44 text-right">Kredit (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {row.accountCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    {row.accountName}
                  </td>
                  <td className="py-3 px-4">{getTypeBadge(row.accountType)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        row.normalBalance === "DEBIT"
                          ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {row.normalBalance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {row.debit > 0 ? (
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {row.debit.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {row.credit > 0 ? (
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {row.credit.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold">
                <td colSpan={4} className="py-3.5 px-4 text-slate-900 dark:text-white uppercase tracking-wider text-right">
                  Grand Total Neraca Saldo:
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-sm text-slate-900 dark:text-white font-black">
                  Rp {totalDebit.toLocaleString("id-ID")}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-sm text-slate-900 dark:text-white font-black">
                  Rp {totalCredit.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

