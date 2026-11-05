"use client";

import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  ArrowRight,
  DollarSign,
  Calendar,
  CreditCard,
  History,
  X,
  FileText,
  Printer,
  ShieldCheck,
  Check,
  Coins,
  Wallet
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PaymentRecord {
  id: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  bankAccount: string;
  referenceNo: string;
  paidBy: string;
  notes: string;
}

interface PayableInvoice {
  id: string;
  invoiceNo: string;
  poNumber: string;
  supplierName: string;
  supplierCategory: "Prinsipal Utama" | "Pabrik Es Krim" | "Distributor Regional" | "Packaging & APD";
  invoiceDate: string;
  dueDate: string;
  termDays: number;
  daysRemaining: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: "LANCAR" | "MENDEKATI_JATUH_TEMPO" | "LEWAT_JATUH_TEMPO" | "LUNAS";
  payments: PaymentRecord[];
}

const INITIAL_PAYABLES: PayableInvoice[] = [
  {
    id: "ap-ivh",
    invoiceNo: "JR-2610/K011",
    poNumber: "PO-DIS10114",
    supplierName: "PT. INDO VAN HOUTEN (Miami Ice Cream)",
    supplierCategory: "Pabrik Es Krim",
    invoiceDate: "2026-10-29",
    dueDate: "2026-10-29",
    termDays: 0,
    daysRemaining: 0,
    totalAmount: 40790214,
    paidAmount: 0,
    balanceDue: 40790214,
    status: "MENDEKATI_JATUH_TEMPO",
    payments: [],
  },
];

export default function AccountsPayablePage() {
  const [payables, setPayables] = useState<PayableInvoice[]>(INITIAL_PAYABLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<PayableInvoice | null>(null);
  const [selectedPaymentVoucher, setSelectedPaymentVoucher] = useState<{ invoice: PayableInvoice; payment: PaymentRecord } | null>(null);

  // Payment Form State
  const [payFormData, setPayFormData] = useState({
    payType: "FULL" as "FULL" | "PARTIAL",
    amount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    bankAccount: "1103 Bank BCA — Rekening Operasional",
    paymentMethod: "Transfer Bank",
    referenceNo: "",
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const statuses = ["Semua", "LANCAR", "MENDEKATI_JATUH_TEMPO", "LEWAT_JATUH_TEMPO", "LUNAS"];

  const filteredPayables = payables.filter((item) => {
    const matchesSearch =
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalOutstanding = payables.reduce((acc, p) => acc + p.balanceDue, 0);
  const totalOverdue = payables
    .filter((p) => p.status === "LEWAT_JATUH_TEMPO")
    .reduce((acc, p) => acc + p.balanceDue, 0);
  const dueThisWeek = payables.filter(
    (p) => p.status === "MENDEKATI_JATUH_TEMPO" || (p.daysRemaining >= 0 && p.daysRemaining <= 7 && p.balanceDue > 0)
  ).length;
  const totalPaidMonth = payables.reduce((acc, p) => acc + p.paidAmount, 0);

  const getStatusBadge = (st: PayableInvoice["status"], days: number) => {
    switch (st) {
      case "LANCAR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Lancar ({days} hari lagi)
          </span>
        );
      case "MENDEKATI_JATUH_TEMPO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Jatuh Tempo Hari Ini / Segera
          </span>
        );
      case "LEWAT_JATUH_TEMPO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
            <AlertTriangle className="w-3 h-3" /> Overdue ({Math.abs(days)} hari)
          </span>
        );
      case "LUNAS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Check className="w-3 h-3" /> Lunas Terbayar
          </span>
        );
    }
  };

  // Open Pay Modal
  const openPayModal = (p: PayableInvoice) => {
    setSelectedPayable(p);
    setPayFormData({
      payType: "FULL",
      amount: p.balanceDue,
      paymentDate: new Date().toISOString().split("T")[0],
      bankAccount: "1103 Bank BCA — Rekening Operasional",
      paymentMethod: "Transfer Bank",
      referenceNo: `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `Pembayaran faktur ${p.invoiceNo} (${p.supplierName})`,
    });
    setIsPayModalOpen(true);
  };

  // Open History Modal
  const openHistoryModal = (p: PayableInvoice) => {
    setSelectedPayable(p);
    setIsHistoryModalOpen(true);
  };

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayable) return;

    const payAmount = Number(payFormData.amount);
    if (payAmount <= 0) {
      alert("Nominal pembayaran harus lebih besar dari 0!");
      return;
    }
    if (payAmount > selectedPayable.balanceDue) {
      alert("Nominal pembayaran tidak boleh melebihi sisa saldo hutang!");
      return;
    }

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      paymentDate: payFormData.paymentDate,
      amount: payAmount,
      paymentMethod: payFormData.paymentMethod,
      bankAccount: payFormData.bankAccount,
      referenceNo: payFormData.referenceNo || "-",
      paidBy: "Hendra Wijaya (Finance Gudang)",
      notes: payFormData.notes,
    };

    const updatedPayables = payables.map((item) => {
      if (item.id === selectedPayable.id) {
        const nextPaid = item.paidAmount + payAmount;
        const nextBalance = item.totalAmount - nextPaid;
        const nextStatus = nextBalance === 0 ? ("LUNAS" as const) : item.status;
        return {
          ...item,
          paidAmount: nextPaid,
          balanceDue: nextBalance,
          status: nextStatus,
          payments: [newPayment, ...item.payments],
        };
      }
      return item;
    });

    setPayables(updatedPayables);
    setIsPayModalOpen(false);
    showToast(
      `Pembayaran hutang ${formatRupiah(payAmount)} ke ${selectedPayable.supplierName} berhasil dibukukan!`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
              Hutang Usaha (Accounts Payable)
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-cyan-500" />
            Hutang Usaha Supplier (Accounts Payable)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan kewajiban tagihan pasokan es krim ke prinsipal/pabrik, jadwal jatuh tempo (AP Aging), dan otomatisasi jurnal pelunasan utang (Akun 2101).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPayables([])}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-medium text-xs transition cursor-pointer"
            title="Kosongkan daftar hutang supplier untuk simulasi dari nol"
          >
            Kosongkan AP
          </button>
          <button
            onClick={() => setPayables(INITIAL_PAYABLES)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition cursor-pointer"
            title="Muat tagihan PO-DIS10114 PT. Indo Van Houten (Rp 40.790.214)"
          >
            Muat Tagihan PO-DIS10114
          </button>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Sisa Hutang Aktif
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatRupiah(totalOutstanding)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Hutang Overdue (Lewat Tempo)
          </span>
          <span className="text-xl font-bold font-mono text-rose-500 mt-1 block">
            {formatRupiah(totalOverdue)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Jatuh Tempo &le; 7 Hari
          </span>
          <span className="text-xl font-bold text-amber-500 mt-1 block">
            {dueThisWeek} <span className="text-xs font-normal text-slate-400">Faktur Tagihan</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Total Pembayaran Terlaksana
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {formatRupiah(totalPaidMonth)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama supplier, nomor faktur, atau nomor PO pasokan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === st
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payables Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Faktur &amp; PO Supplier</th>
                <th className="px-5 py-3.5">Nama Prinsipal / Supplier</th>
                <th className="px-5 py-3.5">Tgl Faktur &amp; Jatuh Tempo</th>
                <th className="px-5 py-3.5 text-right">Nilai Tagihan Awal</th>
                <th className="px-5 py-3.5 text-right">Telah Terbayar</th>
                <th className="px-5 py-3.5 text-right">Sisa Saldo Hutang</th>
                <th className="px-5 py-3.5 text-center">Status Aging</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredPayables.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-slate-400 font-sans">
                      <Receipt className="w-10 h-10 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Tidak Ada Tagihan Hutang Usaha
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        Tabel hutang kosong untuk persiapan simulasi pembayaran kas keluar dari nol.
                      </p>
                      <button
                        onClick={() => setPayables(INITIAL_PAYABLES)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-sm transition cursor-pointer"
                      >
                        Muat Tagihan PO-DIS10114 (Rp 40.790.214)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayables.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-cyan-600 dark:text-cyan-400">
                      {item.invoiceNo}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Ref: <span className="font-mono text-indigo-500 font-semibold">{item.poNumber}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-sans font-semibold text-slate-900 dark:text-white">
                    {item.supplierName}
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.supplierCategory}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-sans">
                    <div>{item.invoiceDate} &rarr; <span className="font-bold text-slate-700 dark:text-slate-200">{item.dueDate}</span></div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      TOP: {item.termDays} Hari
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400">
                    {formatRupiah(item.totalAmount)}
                  </td>

                  <td className="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatRupiah(item.paidAmount)}
                  </td>

                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                    {item.balanceDue > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">{formatRupiah(item.balanceDue)}</span>
                    ) : (
                      <span className="text-emerald-500">Rp 0 (Lunas)</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-center font-sans">
                    {getStatusBadge(item.status, item.daysRemaining)}
                  </td>

                  <td className="px-5 py-4 text-right font-sans whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {item.balanceDue > 0 ? (
                        <button
                          onClick={() => openPayModal(item)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Bayar</span>
                        </button>
                      ) : null}

                      <button
                        onClick={() => openHistoryModal(item)}
                        title="Riwayat Pembayaran & Bukti Transfer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Form Pembayaran Hutang Supplier */}
      {isPayModalOpen && selectedPayable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Form Pembayaran Hutang Supplier
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Faktur: <span className="font-mono font-bold text-cyan-600">{selectedPayable.invoiceNo}</span> ({selectedPayable.supplierName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="mt-4 space-y-4">
              {/* Summary of Debt */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Sisa Saldo Hutang:</span>
                  <span className="text-base font-bold font-mono text-rose-500">
                    {formatRupiah(selectedPayable.balanceDue)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Jatuh Tempo:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedPayable.dueDate}
                  </span>
                </div>
              </div>

              {/* Payment Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPayFormData({
                      ...payFormData,
                      payType: "FULL",
                      amount: selectedPayable.balanceDue,
                    })
                  }
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    payFormData.payType === "FULL"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Pelunasan Penuh (100%)
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPayFormData({
                      ...payFormData,
                      payType: "PARTIAL",
                      amount: Math.round(selectedPayable.balanceDue / 2),
                    })
                  }
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    payFormData.payType === "PARTIAL"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Pembayaran Sebagian (Cicil)
                </button>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nominal Pembayaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedPayable.balanceDue}
                  required
                  value={payFormData.amount}
                  onChange={(e) =>
                    setPayFormData({ ...payFormData, amount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              {/* Source Bank Account & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sumber Rekening Kas / Bank
                  </label>
                  <select
                    value={payFormData.bankAccount}
                    onChange={(e) => setPayFormData({ ...payFormData, bankAccount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="1103 Bank BCA — Rekening Operasional">
                      1103 Bank BCA — Rekening Operasional
                    </option>
                    <option value="1104 Bank Mandiri — Rekening Operasional">
                      1104 Bank Mandiri — Rekening Operasional
                    </option>
                    <option value="1101 Kas Operasional Gudang">
                      1101 Kas Operasional Gudang
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pembayaran
                  </label>
                  <input
                    type="date"
                    required
                    value={payFormData.paymentDate}
                    onChange={(e) => setPayFormData({ ...payFormData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              {/* Reference & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Referensi Transfer / Cek
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TRF-BCA-11928"
                    value={payFormData.referenceNo}
                    onChange={(e) => setPayFormData({ ...payFormData, referenceNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Kas Keluar
                  </label>
                  <input
                    type="text"
                    placeholder="Keterangan transfer..."
                    value={payFormData.notes}
                    onChange={(e) => setPayFormData({ ...payFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              {/* Automated Journal Preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                    Otomasi Jurnal Pelunasan Hutang Usaha:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SEIMBANG &check;
                  </span>
                </div>
                <div className="font-mono text-[11px] space-y-0.5 pl-5 pt-1">
                  <p className="text-indigo-600 dark:text-indigo-400">
                    [Debit] 2101 Utang Usaha — Supplier Es Krim: {formatRupiah(payFormData.amount)}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    [Kredit] {payFormData.bankAccount.split(" ")[0]} {payFormData.bankAccount.split("—")[0].replace(/^\d+\s*/, "")}: {formatRupiah(payFormData.amount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  Konfirmasi Pembayaran Kas Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Riwayat Pembayaran & Voucher Kas Keluar */}
      {isHistoryModalOpen && selectedPayable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Riwayat Pembayaran Faktur: {selectedPayable.invoiceNo}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Supplier: <strong className="text-slate-700 dark:text-slate-300">{selectedPayable.supplierName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Tagihan:</span>
                  <span className="font-mono font-bold">{formatRupiah(selectedPayable.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Telah Terbayar:</span>
                  <span className="font-mono font-bold text-emerald-500">{formatRupiah(selectedPayable.paidAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sisa Saldo:</span>
                  <span className="font-mono font-bold text-rose-500">{formatRupiah(selectedPayable.balanceDue)}</span>
                </div>
              </div>

              {selectedPayable.payments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada transaksi pembayaran kas keluar untuk faktur ini.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedPayable.payments.map((pay) => (
                    <div
                      key={pay.id}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          {formatRupiah(pay.amount)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-400">
                            {pay.paymentDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentVoucher({ invoice: selectedPayable, payment: pay })}
                            className="p-1 rounded text-slate-400 hover:text-cyan-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                            title="Cetak Voucher Kas Keluar Resmi"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Sumber: {pay.bankAccount}</span>
                        <span className="font-mono">Ref: {pay.referenceNo}</span>
                      </div>
                      {pay.notes && (
                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                          &ldquo;{pay.notes}&rdquo; &bull; Dicatat oleh {pay.paidBy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                Tutup Riwayat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Pratinjau & Cetak Bukti Pengeluaran Kas (Payment Voucher) */}
      {selectedPaymentVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-6">
            {/* Header Modal - Sembunyi saat cetak */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 no-print">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pratinjau Bukti Pengeluaran Kas / Bank (Payment Voucher)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Voucher Resmi Pembayaran Pelunasan Tagihan Hutang Supplier
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Voucher (Ctrl+P)
                </button>
                <button
                  onClick={() => setSelectedPaymentVoucher(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Area Lembar Cetak Voucher A4 */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 dark:text-slate-900 printable-document">
              {/* Kop Surat Voucher */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase">
                    PT FROST FLOW COLD DISTRIBUSI
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Departemen Keuangan &amp; Akuntansi
                  </p>
                  <p className="text-xs text-slate-500">
                    Kawasan Industri Pergudangan Cold Storage No. 18, Tangerang &bull; Telp: (021) 555-0199
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-widest uppercase mb-1">
                    BUKTI KAS KELUAR
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    NO: BKK/{selectedPaymentVoucher.payment.referenceNo}
                  </p>
                  <p className="text-xs text-slate-500">
                    Tanggal: {selectedPaymentVoucher.payment.paymentDate}
                  </p>
                </div>
              </div>

              {/* Data Penerima & Rekening */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">DIBAYARKAN KEPADA:</span>
                  <span className="font-bold text-slate-900">{selectedPaymentVoucher.invoice.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">KATEGORI SUPPLIER:</span>
                  <span className="font-semibold text-slate-700">{selectedPaymentVoucher.invoice.supplierCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">METODE PEMBAYARAN:</span>
                  <span className="font-semibold text-slate-800">{selectedPaymentVoucher.payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SUMBER REKENING:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedPaymentVoucher.payment.bankAccount}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">NOMOR REFERENSI TRANSAKSI:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPaymentVoucher.payment.referenceNo}</span>
                </div>
              </div>

              {/* Rincian Nominal */}
              <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-12">NO</th>
                    <th className="p-2 border-r border-slate-300 text-left">DESKRIPSI PEMBAYARAN</th>
                    <th className="p-2 border-r border-slate-300 text-center">NO. FAKTUR / PO</th>
                    <th className="p-2 text-right">JUMLAH DIBAYAR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-center font-mono">1</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-bold">Pelunasan / Cicilan Pembelian Es Krim</p>
                      <p className="text-[10px] text-slate-500 italic">{selectedPaymentVoucher.payment.notes || "Sesuai kesepakatan TOP supplier"}</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-semibold">
                      {selectedPaymentVoucher.invoice.invoiceNo} (PO: {selectedPaymentVoucher.invoice.poNumber})
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatRupiah(selectedPaymentVoucher.payment.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td colSpan={3} className="p-2 text-right border-r border-slate-300">
                      TOTAL PENGELUARAN KAS:
                    </td>
                    <td className="p-2 text-right font-mono text-emerald-700 text-sm">
                      {formatRupiah(selectedPaymentVoucher.payment.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Jurnal Akuntansi Berimbang */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs mb-8">
                <p className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] mb-1">
                  POS AYAT JURNAL OTOMATIS (DOUBLE ENTRY):
                </p>
                <div className="font-mono text-[11px] text-emerald-800 space-y-0.5">
                  <p>[Debit] 2101 Utang Usaha — Supplier Es Krim: {formatRupiah(selectedPaymentVoucher.payment.amount)}</p>
                  <p>[Kredit] 1103 Bank BCA Operasional: {formatRupiah(selectedPaymentVoucher.payment.amount)}</p>
                </div>
              </div>

              {/* 3 Kolom Tanda Tangan */}
              <div className="grid grid-cols-3 gap-6 text-center text-xs page-break-avoid">
                <div className="border border-slate-300 rounded p-3 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Dibukukan Oleh</p>
                  <p className="text-[10px] text-slate-400">( {selectedPaymentVoucher.payment.paidBy} )</p>
                  <p className="text-[10px] font-bold text-slate-800">Staf Keuangan</p>
                </div>
                <div className="border border-slate-300 rounded p-3 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Diperiksa Oleh</p>
                  <p className="text-[10px] text-slate-400">( .............................. )</p>
                  <p className="text-[10px] font-bold text-slate-800">Supervisor Accounting</p>
                </div>
                <div className="border border-slate-300 rounded p-3 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Disetujui Oleh</p>
                  <p className="text-[10px] text-slate-400">( .............................. )</p>
                  <p className="text-[10px] font-bold text-slate-800">Finance Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

