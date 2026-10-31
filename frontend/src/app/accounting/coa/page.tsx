"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Lock,
  Edit2,
  X,
  History
} from "lucide-react";

interface CoaAccount {
  accountNumber: string;
  accountName: string;
  accountType: "HEADER" | "DETAIL";
  category: "ASET" | "KEWAJIBAN" | "EKUITAS" | "PENDAPATAN" | "HPP" | "BEBAN" | "LAIN_LAIN";
  normalBalance: "DEBIT" | "KREDIT";
  level: number;
  isActive: boolean;
  isSystemLocked?: boolean;
}

const COA_DATA: CoaAccount[] = [
  // 1 - ASET
  { accountNumber: "1000", accountName: "ASET", accountType: "HEADER", category: "ASET", normalBalance: "DEBIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "1100", accountName: "ASET LANCAR", accountType: "HEADER", category: "ASET", normalBalance: "DEBIT", level: 2, isActive: true, isSystemLocked: true },
  { accountNumber: "1101", accountName: "Kas Operasional Gudang", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true },
  { accountNumber: "1102", accountName: "Bank BCA Rekening Utama", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true },
  { accountNumber: "1103", accountName: "Bank Mandiri Operasional", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true },
  { accountNumber: "1120", accountName: "Piutang Usaha (Trade Receivables)", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true },
  { accountNumber: "1129", accountName: "Cadangan Kerugian Piutang", accountType: "DETAIL", category: "ASET", normalBalance: "KREDIT", level: 3, isActive: true },
  { accountNumber: "1130", accountName: "Persediaan Barang Dagang Es Krim", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true, isSystemLocked: true },
  { accountNumber: "1135", accountName: "Persediaan Dalam Karantina", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true, isSystemLocked: true },
  { accountNumber: "1140", accountName: "Uang Muka Pembelian (DP Supplier)", accountType: "DETAIL", category: "ASET", normalBalance: "DEBIT", level: 3, isActive: true },

  // 2 - KEWAJIBAN
  { accountNumber: "2000", accountName: "KEWAJIBAN", accountType: "HEADER", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "2100", accountName: "KEWAJIBAN JANGKA PENDEK", accountType: "HEADER", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 2, isActive: true, isSystemLocked: true },
  { accountNumber: "2101", accountName: "Utang Usaha (Trade Payables)", accountType: "DETAIL", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 3, isActive: true },
  { accountNumber: "2102", accountName: "Hutang Penerimaan Barang Belum Ditagih (GR/IR Clearing)", accountType: "DETAIL", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 3, isActive: true, isSystemLocked: true },
  { accountNumber: "2110", accountName: "Utang Gaji Karyawan Gudang", accountType: "DETAIL", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 3, isActive: true },
  { accountNumber: "2120", accountName: "Utang PPN Keluaran", accountType: "DETAIL", category: "KEWAJIBAN", normalBalance: "KREDIT", level: 3, isActive: true },

  // 3 - EKUITAS
  { accountNumber: "3000", accountName: "EKUITAS", accountType: "HEADER", category: "EKUITAS", normalBalance: "KREDIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "3101", accountName: "Modal Disetor", accountType: "DETAIL", category: "EKUITAS", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "3201", accountName: "Laba Ditahan (Retained Earnings)", accountType: "DETAIL", category: "EKUITAS", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "3301", accountName: "Laba / Rugi Periode Berjalan", accountType: "DETAIL", category: "EKUITAS", normalBalance: "KREDIT", level: 2, isActive: true, isSystemLocked: true },

  // 4 - PENDAPATAN
  { accountNumber: "4000", accountName: "PENDAPATAN USAHA", accountType: "HEADER", category: "PENDAPATAN", normalBalance: "KREDIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "4101", accountName: "Penjualan Es Krim - Modern Trade", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "4102", accountName: "Penjualan Es Krim - General Trade", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "4103", accountName: "Penjualan Es Krim - Horeka", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "4104", accountName: "Penjualan Es Krim - Agen & Grosir", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "KREDIT", level: 2, isActive: true },
  { accountNumber: "4201", accountName: "Retur Penjualan (Sales Return)", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "DEBIT", level: 2, isActive: true },
  { accountNumber: "4301", accountName: "Potongan & Diskon Penjualan", accountType: "DETAIL", category: "PENDAPATAN", normalBalance: "DEBIT", level: 2, isActive: true },

  // 5 - BEBAN POKOK PENJUALAN
  { accountNumber: "5000", accountName: "BEBAN POKOK PENJUALAN (HPP)", accountType: "HEADER", category: "HPP", normalBalance: "DEBIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "5101", accountName: "Beban Pokok Penjualan Es Krim", accountType: "DETAIL", category: "HPP", normalBalance: "DEBIT", level: 2, isActive: true, isSystemLocked: true },
  { accountNumber: "5201", accountName: "Beban Kerusakan Persediaan (Stock Damage / Melt)", accountType: "DETAIL", category: "HPP", normalBalance: "DEBIT", level: 2, isActive: true, isSystemLocked: true },
  { accountNumber: "5202", accountName: "Selisih Hasil Stock Opname (Inventory Variance)", accountType: "DETAIL", category: "HPP", normalBalance: "DEBIT", level: 2, isActive: true, isSystemLocked: true },

  // 6 - BEBAN OPERASIONAL
  { accountNumber: "6000", accountName: "BEBAN OPERASIONAL", accountType: "HEADER", category: "BEBAN", normalBalance: "DEBIT", level: 1, isActive: true, isSystemLocked: true },
  { accountNumber: "6101", accountName: "Beban Listrik Cold Storage & Freezer", accountType: "DETAIL", category: "BEBAN", normalBalance: "DEBIT", level: 2, isActive: true },
  { accountNumber: "6102", accountName: "Beban Bahan Bakar & Transport Armada Berpendingin", accountType: "DETAIL", category: "BEBAN", normalBalance: "DEBIT", level: 2, isActive: true },
  { accountNumber: "6103", accountName: "Beban Pemeliharaan Mesin Pendingin (Maintenance)", accountType: "DETAIL", category: "BEBAN", normalBalance: "DEBIT", level: 2, isActive: true },
  { accountNumber: "6201", accountName: "Beban Gaji Staf Operasional Gudang", accountType: "DETAIL", category: "BEBAN", normalBalance: "DEBIT", level: 2, isActive: true },
];

export default function ChartOfAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    accountNumber: "",
    accountName: "",
    accountType: "DETAIL" as CoaAccount["accountType"],
    category: "ASET" as CoaAccount["category"],
    normalBalance: "DEBIT" as CoaAccount["normalBalance"],
    level: 3,
  });

  const categoryFilters = [
    "Semua",
    "ASET",
    "KEWAJIBAN",
    "EKUITAS",
    "PENDAPATAN",
    "HPP",
    "BEBAN",
  ];

  const filteredAccounts = COA_DATA.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.includes(searchTerm);
    const matchesCat =
      selectedCategory === "Semua" || acc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Akuntansi &amp; Keuangan</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Bagan Akun Standar (COA)
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-500" />
            Bagan Akun Standar (Chart of Accounts)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar kode akun akuntansi terstruktur untuk penjurnalan otomatis transaksi gudang dan laporan keuangan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode akun atau nama akun..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* COA Tree Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode Akun</th>
                <th className="px-5 py-3.5">Nama Akun</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Tipe Akun</th>
                <th className="px-5 py-3.5">Saldo Normal</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredAccounts.map((account) => {
                const isHeader = account.accountType === "HEADER";
                const indentClass =
                  account.level === 1
                    ? "pl-2 font-bold"
                    : account.level === 2
                    ? "pl-6 font-semibold"
                    : "pl-10 font-normal";

                return (
                  <tr
                    key={account.accountNumber}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                      isHeader ? "bg-slate-50/40 dark:bg-slate-800/20" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {account.accountNumber}
                    </td>

                    <td className="px-5 py-3.5 font-sans">
                      <div className={`flex items-center gap-2 ${indentClass}`}>
                        {isHeader && (
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                        )}
                        <span
                          className={
                            isHeader
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-700 dark:text-slate-300"
                          }
                        >
                          {account.accountName}
                        </span>
                        {account.isSystemLocked && (
                          <span
                            title="Akun Sistem Terkunci Otomasi"
                            className="text-slate-400"
                          >
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-sans">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {account.category}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-sans">
                      {isHeader ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          HEADER
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          POSTING DETAIL
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-sans">
                      {account.normalBalance === "DEBIT" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          DEBIT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          KREDIT
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-center font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right font-sans whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => alert(`Edit Akun ${account.accountNumber}`)}
                          disabled={account.isSystemLocked}
                          title={
                            account.isSystemLocked
                              ? "Akun sistem tidak dapat diubah"
                              : "Ubah Akun"
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Jejak Audit Akun ${account.accountNumber}`)}
                          title="Riwayat Jejak Audit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

