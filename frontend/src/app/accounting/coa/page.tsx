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
  History,
  Power,
  User,
  Clock,
  ArrowRight,
  ShieldAlert,
  Save,
  Check
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

interface CoaAuditLog {
  id: string;
  accountNumber: string;
  accountName: string;
  action: "TAMBAH_AKUN" | "UPDATE_AKUN" | "UBAH_STATUS";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const INITIAL_COA_DATA: CoaAccount[] = [
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

const INITIAL_AUDIT_LOGS: CoaAuditLog[] = [
  {
    id: "aud-coa-1",
    accountNumber: "5201",
    accountName: "Beban Kerusakan Persediaan (Stock Damage / Melt)",
    action: "UPDATE_AKUN",
    changedBy: "Hendra Wijaya (Finance Manager)",
    changedAt: "2026-10-28 10:20:15",
    notes: "Penguncian akun sistem otomatis untuk pencatatan HPP disposisi es krim rusak.",
    changes: [
      { field: "isSystemLocked", oldValue: "false", newValue: "true" },
    ],
  },
  {
    id: "aud-coa-2",
    accountNumber: "1103",
    accountName: "Bank Mandiri Operasional",
    action: "TAMBAH_AKUN",
    changedBy: "Dewi Lestari (Staf Accounting)",
    changedAt: "2026-10-20 09:15:00",
    notes: "Penambahan rekening bank baru untuk operasional armada pengiriman.",
    changes: [
      { field: "accountNumber", oldValue: "-", newValue: "1103" },
      { field: "accountName", oldValue: "-", newValue: "Bank Mandiri Operasional" },
      { field: "category", oldValue: "-", newValue: "ASET" },
    ],
  },
];

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<CoaAccount[]>(INITIAL_COA_DATA);
  const [auditLogs, setAuditLogs] = useState<CoaAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Active items
  const [activeAccount, setActiveAccount] = useState<CoaAccount | null>(null);

  // Add Form State
  const [newAccount, setNewAccount] = useState({
    accountNumber: "",
    accountName: "",
    accountType: "DETAIL" as CoaAccount["accountType"],
    category: "ASET" as CoaAccount["category"],
    normalBalance: "DEBIT" as CoaAccount["normalBalance"],
    level: 3,
    isActive: true,
  });

  // Edit Form State
  const [editAccount, setEditAccount] = useState({
    accountName: "",
    accountType: "DETAIL" as CoaAccount["accountType"],
    category: "ASET" as CoaAccount["category"],
    normalBalance: "DEBIT" as CoaAccount["normalBalance"],
    level: 3,
    isActive: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const categoryFilters = [
    "Semua",
    "ASET",
    "KEWAJIBAN",
    "EKUITAS",
    "PENDAPATAN",
    "HPP",
    "BEBAN",
  ];

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.includes(searchTerm);
    const matchesCat =
      selectedCategory === "Semua" || acc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Open Add Modal
  const openAddModal = () => {
    setNewAccount({
      accountNumber: "",
      accountName: "",
      accountType: "DETAIL",
      category: "ASET",
      normalBalance: "DEBIT",
      level: 3,
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Save New Account
  const handleSaveNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = newAccount.accountNumber.trim();

    if (!cleanNum || !newAccount.accountName.trim()) {
      alert("Harap lengkapi kode dan nama akun!");
      return;
    }

    if (accounts.some((a) => a.accountNumber === cleanNum)) {
      alert(`Kode akun ${cleanNum} sudah terdaftar dalam bagan akun!`);
      return;
    }

    const createdAccount: CoaAccount = {
      accountNumber: cleanNum,
      accountName: newAccount.accountName.trim(),
      accountType: newAccount.accountType,
      category: newAccount.category,
      normalBalance: newAccount.normalBalance,
      level: Number(newAccount.level),
      isActive: newAccount.isActive,
      isSystemLocked: false,
    };

    const newLog: CoaAuditLog = {
      id: `aud-${Date.now()}`,
      accountNumber: createdAccount.accountNumber,
      accountName: createdAccount.accountName,
      action: "TAMBAH_AKUN",
      changedBy: "Staf Accounting Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Penambahan akun baru ${createdAccount.accountNumber} - ${createdAccount.accountName}`,
      changes: [
        { field: "accountNumber", oldValue: "-", newValue: createdAccount.accountNumber },
        { field: "accountName", oldValue: "-", newValue: createdAccount.accountName },
        { field: "category", oldValue: "-", newValue: createdAccount.category },
        { field: "normalBalance", oldValue: "-", newValue: createdAccount.normalBalance },
      ],
    };

    setAccounts([...accounts, createdAccount].sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)));
    setAuditLogs([newLog, ...auditLogs]);
    setIsAddModalOpen(false);
    showToast(`Akun ${createdAccount.accountNumber} berhasil ditambahkan!`);
  };

  // Open Edit Modal
  const openEditModal = (account: CoaAccount) => {
    if (account.isSystemLocked) {
      alert(`Akun ${account.accountNumber} dikunci oleh sistem otomasi jurnal umum dan tidak dapat dimodifikasi.`);
      return;
    }
    setActiveAccount(account);
    setEditAccount({
      accountName: account.accountName,
      accountType: account.accountType,
      category: account.category,
      normalBalance: account.normalBalance,
      level: account.level,
      isActive: account.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Modal
  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAccount) return;

    const diffs: { field: string; oldValue: string; newValue: string }[] = [];
    if (activeAccount.accountName !== editAccount.accountName) {
      diffs.push({ field: "accountName", oldValue: activeAccount.accountName, newValue: editAccount.accountName });
    }
    if (activeAccount.category !== editAccount.category) {
      diffs.push({ field: "category", oldValue: activeAccount.category, newValue: editAccount.category });
    }
    if (activeAccount.normalBalance !== editAccount.normalBalance) {
      diffs.push({ field: "normalBalance", oldValue: activeAccount.normalBalance, newValue: editAccount.normalBalance });
    }
    if (activeAccount.isActive !== editAccount.isActive) {
      diffs.push({ field: "isActive", oldValue: activeAccount.isActive ? "Aktif" : "Non-Aktif", newValue: editAccount.isActive ? "Aktif" : "Non-Aktif" });
    }

    const updated = accounts.map((acc) => {
      if (acc.accountNumber === activeAccount.accountNumber) {
        return {
          ...acc,
          accountName: editAccount.accountName.trim(),
          category: editAccount.category,
          normalBalance: editAccount.normalBalance,
          level: Number(editAccount.level),
          isActive: editAccount.isActive,
        };
      }
      return acc;
    });

    if (diffs.length > 0) {
      const newLog: CoaAuditLog = {
        id: `aud-${Date.now()}`,
        accountNumber: activeAccount.accountNumber,
        accountName: editAccount.accountName,
        action: "UPDATE_AKUN",
        changedBy: "Staf Accounting Gudang",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan akun ${activeAccount.accountNumber}`,
        changes: diffs,
      };
      setAuditLogs([newLog, ...auditLogs]);
    }

    setAccounts(updated);
    setIsEditModalOpen(false);
    showToast(`Akun ${activeAccount.accountNumber} berhasil diperbarui!`);
  };

  // Toggle Active Status
  const handleToggleStatus = (account: CoaAccount) => {
    if (account.isSystemLocked) {
      alert(`Akun sistem ${account.accountNumber} tidak boleh dinonaktifkan demi integritas pembukuan ganda!`);
      return;
    }

    const nextStatus = !account.isActive;
    const updated = accounts.map((acc) =>
      acc.accountNumber === account.accountNumber ? { ...acc, isActive: nextStatus } : acc
    );

    const newLog: CoaAuditLog = {
      id: `aud-${Date.now()}`,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      action: "UBAH_STATUS",
      changedBy: "Staf Accounting Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status akun ${account.accountNumber} menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        { field: "isActive", oldValue: account.isActive ? "Aktif" : "Non-Aktif", newValue: nextStatus ? "Aktif" : "Non-Aktif" },
      ],
    };

    setAccounts(updated);
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Status akun ${account.accountNumber} diubah menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`);
  };

  // Open Audit Log Modal
  const openAuditModal = (account: CoaAccount) => {
    setActiveAccount(account);
    setIsAuditModalOpen(true);
  };

  const getActionBadgeClass = (action: CoaAuditLog["action"]) => {
    switch (action) {
      case "TAMBAH_AKUN":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "UPDATE_AKUN":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "UBAH_STATUS":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const activeAuditRecords = activeAccount
    ? auditLogs.filter((log) => log.accountNumber === activeAccount.accountNumber)
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar kode akun akuntansi terstruktur untuk penjurnalan otomatis transaksi gudang, persediaan, dan laporan keuangan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode akun atau nama akun..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode Akun</th>
                <th className="px-5 py-3.5">Nama Akun</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Tipe Akun</th>
                <th className="px-5 py-3.5">Saldo Normal</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Kelola</th>
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
                    } ${!account.isActive ? "opacity-60 bg-slate-50/30 dark:bg-slate-950/30" : ""}`}
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
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {account.category}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-sans">
                      {isHeader ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          HEADER
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
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
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(account)}
                        disabled={account.isSystemLocked}
                        title={
                          account.isSystemLocked
                            ? "Akun sistem tidak dapat dinonaktifkan"
                            : account.isActive
                            ? "Klik untuk nonaktifkan"
                            : "Klik untuk aktifkan"
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                          account.isSystemLocked ? "cursor-not-allowed opacity-90" : ""
                        } ${
                          account.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{account.isActive ? "Aktif" : "Non-Aktif"}</span>
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-right font-sans whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(account)}
                          disabled={account.isSystemLocked}
                          title={
                            account.isSystemLocked
                              ? "Akun sistem terkunci otomasi"
                              : "Ubah Akun"
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openAuditModal(account)}
                          title="Riwayat Jejak Audit Perubahan"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <History className="w-3.5 h-3.5" />
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

      {/* MODAL 1: Tambah Akun Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Tambah Akun Standar (COA) Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Definisi kode akun untuk posting jurnal buku besar
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAccount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Kode Akun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1150"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Akun Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Piutang Karyawan Operasional"
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Akun
                  </label>
                  <select
                    value={newAccount.category}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        category: e.target.value as CoaAccount["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="ASET">ASET</option>
                    <option value="KEWAJIBAN">KEWAJIBAN</option>
                    <option value="EKUITAS">EKUITAS</option>
                    <option value="PENDAPATAN">PENDAPATAN</option>
                    <option value="HPP">HPP</option>
                    <option value="BEBAN">BEBAN</option>
                    <option value="LAIN_LAIN">LAIN-LAIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Akun
                  </label>
                  <select
                    value={newAccount.accountType}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        accountType: e.target.value as CoaAccount["accountType"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="DETAIL">POSTING DETAIL</option>
                    <option value="HEADER">HEADER (INDUK)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Normal
                  </label>
                  <select
                    value={newAccount.normalBalance}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        normalBalance: e.target.value as CoaAccount["normalBalance"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="DEBIT">DEBIT</option>
                    <option value="KREDIT">KREDIT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Level Hirarki
                  </label>
                  <select
                    value={newAccount.level}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, level: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value={1}>Level 1 (Utama)</option>
                    <option value={2}>Level 2 (Sub-Grup)</option>
                    <option value={3}>Level 3 (Detail Transaksi)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Akun */}
      {isEditModalOpen && activeAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Ubah Akun: {activeAccount.accountNumber}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kategori asal: <span className="font-semibold text-indigo-500">{activeAccount.category}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAccount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Akun <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editAccount.accountName}
                  onChange={(e) => setEditAccount({ ...editAccount, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Akun
                  </label>
                  <select
                    value={editAccount.category}
                    onChange={(e) =>
                      setEditAccount({
                        ...editAccount,
                        category: e.target.value as CoaAccount["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="ASET">ASET</option>
                    <option value="KEWAJIBAN">KEWAJIBAN</option>
                    <option value="EKUITAS">EKUITAS</option>
                    <option value="PENDAPATAN">PENDAPATAN</option>
                    <option value="HPP">HPP</option>
                    <option value="BEBAN">BEBAN</option>
                    <option value="LAIN_LAIN">LAIN-LAIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Saldo Normal
                  </label>
                  <select
                    value={editAccount.normalBalance}
                    onChange={(e) =>
                      setEditAccount({
                        ...editAccount,
                        normalBalance: e.target.value as CoaAccount["normalBalance"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="DEBIT">DEBIT</option>
                    <option value="KREDIT">KREDIT</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Status Keaktifan Akun
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Akun non-aktif disembunyikan saat posting jurnal umum
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditAccount({ ...editAccount, isActive: !editAccount.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    editAccount.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {editAccount.isActive ? "AKTIF" : "NON-AKTIF"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Riwayat Perubahan (Audit Trail) */}
      {isAuditModalOpen && activeAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Riwayat Jejak Audit Perubahan Akun
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Akun: <span className="font-mono font-bold text-amber-600">{activeAccount.accountNumber}</span> - {activeAccount.accountName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {activeAuditRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan untuk akun ini.
                </div>
              ) : (
                activeAuditRecords.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeClass(
                            log.action
                          )}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log.notes}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.changedBy}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {log.changedAt}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {log.changes.map((ch, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
                        >
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {ch.field}:
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="line-through text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                              {ch.oldValue}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                              {ch.newValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                Tutup Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
