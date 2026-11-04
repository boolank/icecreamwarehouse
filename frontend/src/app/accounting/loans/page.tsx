"use client";

import React, { useState } from "react";
import {
  Landmark,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
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
  Wallet,
  ArrowRight,
  TrendingDown,
  Percent,
  Receipt
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface LoanPaymentRecord {
  id: string;
  paymentDate: string;
  installmentNo: number;
  principalAmount: number;
  interestAmount: number;
  totalPaid: number;
  bankAccount: string;
  referenceNo: string;
  paidBy: string;
  notes: string;
}

interface LoanFacility {
  id: string;
  loanCode: string;
  facilityName: string;
  creditorName: string;
  loanType: "KREDIT_MODAL_KERJA" | "INVESTASI_COLD_STORAGE" | "LEASING_ARMADA_REEFER" | "PINJAMAN_PIHAK_KETIGA";
  principalAmount: number;
  interestRatePct: number;
  tenorMonths: number;
  disbursementDate: string;
  maturityDate: string;
  monthlyPrincipal: number;
  monthlyInterest: number;
  monthlyTotal: number;
  remainingPrincipal: number;
  liabilityAccount: string;
  status: "AKTIF" | "MENDEKATI_JATUH_TEMPO" | "LUNAS";
  payments: LoanPaymentRecord[];
}

const INITIAL_LOANS: LoanFacility[] = [
  {
    id: "loan-1",
    loanCode: "LOAN-BCA-2025-01",
    facilityName: "Kredit Modal Kerja (KMK) Operasional Gudang",
    creditorName: "PT Bank Central Asia Tbk",
    loanType: "KREDIT_MODAL_KERJA",
    principalAmount: 250000000,
    interestRatePct: 8.5,
    tenorMonths: 24,
    disbursementDate: "2025-06-15",
    maturityDate: "2027-06-15",
    monthlyPrincipal: 10416667,
    monthlyInterest: 1770833,
    monthlyTotal: 12187500,
    remainingPrincipal: 156250000,
    liabilityAccount: "2201 Utang Bank Jangka Panjang",
    status: "AKTIF",
    payments: [
      {
        id: "pay-l-1",
        paymentDate: "2026-10-15",
        installmentNo: 16,
        principalAmount: 10416667,
        interestAmount: 1770833,
        totalPaid: 12187500,
        bankAccount: "1103 Bank BCA — Rekening Operasional",
        referenceNo: "AUTODEBIT-BCA-0016",
        paidBy: "Autodebit Sistem Bank",
        notes: "Angsuran ke-16 KMK Operasional.",
      },
    ],
  },
  {
    id: "loan-2",
    loanCode: "LOAN-MDR-2026-02",
    facilityName: "Kredit Investasi Mesin Pendingin & Walk-in Freezer",
    creditorName: "PT Bank Mandiri (Persero) Tbk",
    loanType: "INVESTASI_COLD_STORAGE",
    principalAmount: 180000000,
    interestRatePct: 9.0,
    tenorMonths: 36,
    disbursementDate: "2026-01-10",
    maturityDate: "2029-01-10",
    monthlyPrincipal: 5000000,
    monthlyInterest: 1350000,
    monthlyTotal: 6350000,
    remainingPrincipal: 135000000,
    liabilityAccount: "2201 Utang Bank Jangka Panjang",
    status: "MENDEKATI_JATUH_TEMPO",
    payments: [
      {
        id: "pay-l-2",
        paymentDate: "2026-10-10",
        installmentNo: 9,
        principalAmount: 5000000,
        interestAmount: 1350000,
        totalPaid: 6350000,
        bankAccount: "1104 Bank Mandiri — Rekening Operasional",
        referenceNo: "AUTODEBIT-MDR-0009",
        paidBy: "Autodebit Sistem Bank",
        notes: "Angsuran ke-9 investasi kompresor cold storage.",
      },
    ],
  },
  {
    id: "loan-3",
    loanCode: "LEAS-ASTRA-2025-01",
    facilityName: "Leasing Pembiayaan 2 Unit Truk Reefer Isuzu Giga",
    creditorName: "PT Astra Sedaya Finance (ACC)",
    loanType: "LEASING_ARMADA_REEFER",
    principalAmount: 320000000,
    interestRatePct: 10.0,
    tenorMonths: 36,
    disbursementDate: "2025-08-20",
    maturityDate: "2028-08-20",
    monthlyPrincipal: 8888889,
    monthlyInterest: 2666667,
    monthlyTotal: 11555556,
    remainingPrincipal: 195555556,
    liabilityAccount: "2202 Utang Leasing Kendaraan",
    status: "AKTIF",
    payments: [
      {
        id: "pay-l-3",
        paymentDate: "2026-10-20",
        installmentNo: 14,
        principalAmount: 8888889,
        interestAmount: 2666667,
        totalPaid: 11555556,
        bankAccount: "1103 Bank BCA — Rekening Operasional",
        referenceNo: "TRF-ASTRA-0014",
        paidBy: "Hendra Wijaya (Finance)",
        notes: "Cicilan ke-14 leasing armada cold truck.",
      },
    ],
  },
];

export default function ExternalLoansPage() {
  const [loans, setLoans] = useState<LoanFacility[]>(INITIAL_LOANS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Semua");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isAmortizationModalOpen, setIsAmortizationModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanFacility | null>(null);

  // Add Form State
  const [newLoanData, setNewLoanData] = useState({
    loanCode: "",
    facilityName: "",
    creditorName: "",
    loanType: "KREDIT_MODAL_KERJA" as LoanFacility["loanType"],
    principalAmount: 100000000,
    interestRatePct: 8.5,
    tenorMonths: 24,
    disbursementDate: new Date().toISOString().split("T")[0],
    disbursementAccount: "1103 Bank BCA — Rekening Operasional",
    liabilityAccount: "2201 Utang Bank Jangka Panjang",
  });

  // Installment Payment Form State
  const [payInstallmentData, setPayInstallmentData] = useState({
    principalAmount: 0,
    interestAmount: 0,
    paymentDate: new Date().toISOString().split("T")[0],
    bankAccount: "1103 Bank BCA — Rekening Operasional",
    referenceNo: "",
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const types = [
    "Semua",
    "KREDIT_MODAL_KERJA",
    "INVESTASI_COLD_STORAGE",
    "LEASING_ARMADA_REEFER",
    "PINJAMAN_PIHAK_KETIGA",
  ];

  const filteredLoans = loans.filter((item) => {
    const matchesSearch =
      item.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loanCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creditorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Semua" || item.loanType === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculations
  const totalOutstanding = loans.reduce((acc, l) => acc + l.remainingPrincipal, 0);
  const totalMonthlyDue = loans.reduce((acc, l) => acc + l.monthlyTotal, 0);
  const totalMonthlyInterest = loans.reduce((acc, l) => acc + l.monthlyInterest, 0);
  const activeFacilities = loans.filter((l) => l.status === "AKTIF" || l.status === "MENDEKATI_JATUH_TEMPO").length;

  const getLoanTypeBadge = (t: LoanFacility["loanType"]) => {
    switch (t) {
      case "KREDIT_MODAL_KERJA":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "INVESTASI_COLD_STORAGE":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "LEASING_ARMADA_REEFER":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "PINJAMAN_PIHAK_KETIGA":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const getLoanTypeLabel = (t: LoanFacility["loanType"]) => {
    switch (t) {
      case "KREDIT_MODAL_KERJA":
        return "Kredit Modal Kerja";
      case "INVESTASI_COLD_STORAGE":
        return "Investasi Cold Storage";
      case "LEASING_ARMADA_REEFER":
        return "Leasing Truk Reefer";
      case "PINJAMAN_PIHAK_KETIGA":
        return "Pinjaman Pihak Ke-3";
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    const nextCode = `LOAN-BANK-${new Date().getFullYear()}-0${loans.length + 1}`;
    setNewLoanData({
      loanCode: nextCode,
      facilityName: "",
      creditorName: "PT Bank Central Asia Tbk",
      loanType: "KREDIT_MODAL_KERJA",
      principalAmount: 100000000,
      interestRatePct: 8.5,
      tenorMonths: 24,
      disbursementDate: new Date().toISOString().split("T")[0],
      disbursementAccount: "1103 Bank BCA — Rekening Operasional",
      liabilityAccount: "2201 Utang Bank Jangka Panjang",
    });
    setIsAddModalOpen(true);
  };

  // Save New Loan
  const handleSaveLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoanData.facilityName.trim() || !newLoanData.creditorName.trim()) {
      alert("Harap lengkapi nama fasilitas dan lembaga kreditur!");
      return;
    }

    const principal = Number(newLoanData.principalAmount);
    const months = Number(newLoanData.tenorMonths);
    const rate = Number(newLoanData.interestRatePct);

    const mPrincipal = Math.round(principal / months);
    const mInterest = Math.round((principal * (rate / 100)) / 12);
    const mTotal = mPrincipal + mInterest;

    const disDate = new Date(newLoanData.disbursementDate);
    const matDate = new Date(disDate);
    matDate.setMonth(matDate.getMonth() + months);

    const newLoan: LoanFacility = {
      id: `loan-${Date.now()}`,
      loanCode: newLoanData.loanCode.trim().toUpperCase(),
      facilityName: newLoanData.facilityName.trim(),
      creditorName: newLoanData.creditorName.trim(),
      loanType: newLoanData.loanType,
      principalAmount: principal,
      interestRatePct: rate,
      tenorMonths: months,
      disbursementDate: newLoanData.disbursementDate,
      maturityDate: matDate.toISOString().split("T")[0],
      monthlyPrincipal: mPrincipal,
      monthlyInterest: mInterest,
      monthlyTotal: mTotal,
      remainingPrincipal: principal,
      liabilityAccount: newLoanData.liabilityAccount,
      status: "AKTIF",
      payments: [],
    };

    setLoans([newLoan, ...loans]);
    setIsAddModalOpen(false);
    showToast(`Fasilitas pinjaman ${newLoan.facilityName} berhasil dicatat & dicairkan!`);
  };

  // Open Installment Payment Modal
  const openPayModal = (loan: LoanFacility) => {
    setSelectedLoan(loan);
    setPayInstallmentData({
      principalAmount: Math.min(loan.monthlyPrincipal, loan.remainingPrincipal),
      interestAmount: loan.monthlyInterest,
      paymentDate: new Date().toISOString().split("T")[0],
      bankAccount: "1103 Bank BCA — Rekening Operasional",
      referenceNo: `AUTODEBIT-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Pembayaran angsuran ke-${loan.payments.length + 1} pinjaman ${loan.loanCode}`,
    });
    setIsPayModalOpen(true);
  };

  // Submit Installment Payment
  const handleSubmitInstallment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const pAmt = Number(payInstallmentData.principalAmount);
    const iAmt = Number(payInstallmentData.interestAmount);
    const tAmt = pAmt + iAmt;

    if (pAmt <= 0) {
      alert("Porsi pokok angsuran harus lebih besar dari 0!");
      return;
    }

    const newPayment: LoanPaymentRecord = {
      id: `pay-l-${Date.now()}`,
      paymentDate: payInstallmentData.paymentDate,
      installmentNo: selectedLoan.payments.length + 1,
      principalAmount: pAmt,
      interestAmount: iAmt,
      totalPaid: tAmt,
      bankAccount: payInstallmentData.bankAccount,
      referenceNo: payInstallmentData.referenceNo || "-",
      paidBy: "Hendra Wijaya (Finance)",
      notes: payInstallmentData.notes,
    };

    const updatedLoans = loans.map((item) => {
      if (item.id === selectedLoan.id) {
        const nextRemaining = Math.max(0, item.remainingPrincipal - pAmt);
        const nextStatus = nextRemaining === 0 ? ("LUNAS" as const) : item.status;
        return {
          ...item,
          remainingPrincipal: nextRemaining,
          status: nextStatus,
          payments: [newPayment, ...item.payments],
        };
      }
      return item;
    });

    setLoans(updatedLoans);
    setIsPayModalOpen(false);
    showToast(
      `Angsuran ${formatRupiah(tAmt)} (Pokok: ${formatRupiah(pAmt)}, Bunga: ${formatRupiah(iAmt)}) berhasil dibukukan!`
    );
  };

  // Open Amortization Modal
  const openAmortizationModal = (loan: LoanFacility) => {
    setSelectedLoan(loan);
    setIsAmortizationModalOpen(true);
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
              Pinjaman Eksternal Perusahaan
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-cyan-500" />
            Hutang Pinjaman Eksternal (Loans &amp; Financing)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan fasilitas kredit modal kerja, pinjaman bank, leasing armada truk reefer, dan penjurnalan angsuran pokok serta beban bunga (Akun 6501).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pinjaman Baru</span>
        </button>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Sisa Pokok Pinjaman
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatRupiah(totalOutstanding)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Angsuran Bulanan Total
          </span>
          <span className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1 block">
            {formatRupiah(totalMonthlyDue)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            Beban Bunga Bulanan (6501)
          </span>
          <span className="text-xl font-bold font-mono text-amber-500 mt-1 block">
            {formatRupiah(totalMonthlyInterest)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider block flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Fasilitas Pinjaman Aktif
          </span>
          <span className="text-xl font-bold text-purple-500 mt-1 block">
            {activeFacilities} <span className="text-xs font-normal text-slate-400">Fasilitas Kredit</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama fasilitas, bank kreditur, atau nomor kontrak kredit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedType === t
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {t === "Semua" ? "Semua Tipe" : getLoanTypeLabel(t as LoanFacility["loanType"])}
            </button>
          ))}
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Fasilitas &amp; Kontrak</th>
                <th className="px-5 py-3.5">Lembaga Kreditur &amp; Tipe</th>
                <th className="px-5 py-3.5">Plafon &amp; Bunga</th>
                <th className="px-5 py-3.5">Tenor &amp; Jatuh Tempo</th>
                <th className="px-5 py-3.5 text-right">Sisa Pokok (Balance)</th>
                <th className="px-5 py-3.5 text-right">Angsuran / Bulan</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-cyan-600 dark:text-cyan-400">
                      {loan.loanCode}
                    </div>
                    <div className="text-[11px] font-sans font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {loan.facilityName}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-sans">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {loan.creditorName}
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border mt-1 ${getLoanTypeBadge(
                        loan.loanType
                      )}`}
                    >
                      {getLoanTypeLabel(loan.loanType)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {formatRupiah(loan.principalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Bunga: <span className="font-mono font-bold text-amber-500">{loan.interestRatePct}% p.a.</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-sans text-slate-500 dark:text-slate-400">
                    <div>{loan.tenorMonths} Bulan ({loan.disbursementDate.split("-")[0]} - {loan.maturityDate.split("-")[0]})</div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Jatuh Tempo: {loan.maturityDate}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                    {formatRupiah(loan.remainingPrincipal)}
                  </td>

                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                    <div>{formatRupiah(loan.monthlyTotal)}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Pokok: {formatRupiah(loan.monthlyPrincipal)}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center font-sans">
                    {loan.remainingPrincipal === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" /> Lunas
                      </span>
                    ) : loan.status === "MENDEKATI_JATUH_TEMPO" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                        <Clock className="w-3 h-3" /> Jatuh Tempo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Aktif
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right font-sans whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {loan.remainingPrincipal > 0 && (
                        <button
                          onClick={() => openPayModal(loan)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Bayar Angsuran</span>
                        </button>
                      )}

                      <button
                        onClick={() => openAmortizationModal(loan)}
                        title="Jadwal Amortisasi & Riwayat Angsuran"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Tambah Fasilitas Pinjaman Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Pencatatan Fasilitas Pinjaman Eksternal Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Otomasi penerbitan jurnal pencairan dana dan jadwal amortisasi
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

            <form onSubmit={handleSaveLoan} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Pinjaman / Kontrak <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newLoanData.loanCode}
                    onChange={(e) => setNewLoanData({ ...newLoanData, loanCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Pinjaman
                  </label>
                  <select
                    value={newLoanData.loanType}
                    onChange={(e) =>
                      setNewLoanData({
                        ...newLoanData,
                        loanType: e.target.value as LoanFacility["loanType"],
                        liabilityAccount:
                          e.target.value === "LEASING_ARMADA_REEFER"
                            ? "2202 Utang Leasing Kendaraan"
                            : "2201 Utang Bank Jangka Panjang",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="KREDIT_MODAL_KERJA">Kredit Modal Kerja (KMK)</option>
                    <option value="INVESTASI_COLD_STORAGE">Investasi Mesin Pendingin / Cold Storage</option>
                    <option value="LEASING_ARMADA_REEFER">Leasing Armada Truk Reefer</option>
                    <option value="PINJAMAN_PIHAK_KETIGA">Pinjaman Pemegang Saham / Pihak Ke-3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Fasilitas Kredit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KMK Ekspansi Gudang Jakarta Timur"
                  value={newLoanData.facilityName}
                  onChange={(e) => setNewLoanData({ ...newLoanData, facilityName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Lembaga Kreditur / Bank <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Bank Central Asia Tbk"
                  value={newLoanData.creditorName}
                  onChange={(e) => setNewLoanData({ ...newLoanData, creditorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plafon Pokok (Rp)
                  </label>
                  <input
                    type="number"
                    min="10000000"
                    step="10000000"
                    required
                    value={newLoanData.principalAmount}
                    onChange={(e) =>
                      setNewLoanData({ ...newLoanData, principalAmount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bunga (% p.a.)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    required
                    value={newLoanData.interestRatePct}
                    onChange={(e) =>
                      setNewLoanData({ ...newLoanData, interestRatePct: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tenor (Bulan)
                  </label>
                  <select
                    value={newLoanData.tenorMonths}
                    onChange={(e) =>
                      setNewLoanData({ ...newLoanData, tenorMonths: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value={12}>12 Bulan (1 Thn)</option>
                    <option value={24}>24 Bulan (2 Thn)</option>
                    <option value={36}>36 Bulan (3 Thn)</option>
                    <option value={48}>48 Bulan (4 Thn)</option>
                    <option value={60}>60 Bulan (5 Thn)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Akun Penampung Pencairan
                  </label>
                  <select
                    value={newLoanData.disbursementAccount}
                    onChange={(e) =>
                      setNewLoanData({ ...newLoanData, disbursementAccount: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="1103 Bank BCA — Rekening Operasional">
                      1103 Bank BCA — Rekening Operasional
                    </option>
                    <option value="1104 Bank Mandiri — Rekening Operasional">
                      1104 Bank Mandiri — Rekening Operasional
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pencairan Dana
                  </label>
                  <input
                    type="date"
                    required
                    value={newLoanData.disbursementDate}
                    onChange={(e) =>
                      setNewLoanData({ ...newLoanData, disbursementDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              {/* Jurnal Otomasi Pencairan */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                    Otomasi Jurnal Pencairan Dana Pinjaman:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SEIMBANG &check;
                  </span>
                </div>
                <div className="font-mono text-[11px] space-y-0.5 pl-5 pt-1">
                  <p className="text-blue-600 dark:text-blue-400">
                    [Debit] {newLoanData.disbursementAccount.split(" ")[0]} {newLoanData.disbursementAccount.split("—")[0].replace(/^\d+\s*/, "")}: {formatRupiah(newLoanData.principalAmount)}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400">
                    [Kredit] {newLoanData.liabilityAccount}: {formatRupiah(newLoanData.principalAmount)}
                  </p>
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
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  Simpan &amp; Cairkan Pinjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bayar Angsuran Pinjaman (Pokok + Bunga) */}
      {isPayModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Bayar Angsuran Pinjaman: {selectedLoan.loanCode}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kreditur: <strong className="text-slate-700 dark:text-slate-300">{selectedLoan.creditorName}</strong>
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

            <form onSubmit={handleSubmitInstallment} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Sisa Saldo Pokok:</span>
                  <span className="text-base font-bold font-mono text-rose-500">
                    {formatRupiah(selectedLoan.remainingPrincipal)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Angsuran Ke:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {selectedLoan.payments.length + 1} dari {selectedLoan.tenorMonths}
                  </span>
                </div>
              </div>

              {/* Principal & Interest Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Porsi Angsuran Pokok (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedLoan.remainingPrincipal}
                    required
                    value={payInstallmentData.principalAmount}
                    onChange={(e) =>
                      setPayInstallmentData({
                        ...payInstallmentData,
                        principalAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Mengurangi Liabilitas ({selectedLoan.liabilityAccount.split(" ")[0]})</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Porsi Bunga Pinjaman (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={payInstallmentData.interestAmount}
                    onChange={(e) =>
                      setPayInstallmentData({
                        ...payInstallmentData,
                        interestAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Dicatat ke Beban Bunga (6501)</p>
                </div>
              </div>

              {/* Total Output */}
              <div className="p-3 bg-gradient-to-r from-slate-50 to-cyan-500/10 dark:from-slate-950 dark:to-cyan-950/30 rounded-xl border border-cyan-500/20 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Total Kas Keluar (Pokok + Bunga):
                </span>
                <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  {formatRupiah(
                    Number(payInstallmentData.principalAmount) + Number(payInstallmentData.interestAmount)
                  )}
                </span>
              </div>

              {/* Source Account & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sumber Rekening Kas / Bank
                  </label>
                  <select
                    value={payInstallmentData.bankAccount}
                    onChange={(e) =>
                      setPayInstallmentData({
                        ...payInstallmentData,
                        bankAccount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="1103 Bank BCA — Rekening Operasional">
                      1103 Bank BCA — Rekening Operasional
                    </option>
                    <option value="1104 Bank Mandiri — Rekening Operasional">
                      1104 Bank Mandiri — Rekening Operasional
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Bayar Angsuran
                  </label>
                  <input
                    type="date"
                    required
                    value={payInstallmentData.paymentDate}
                    onChange={(e) =>
                      setPayInstallmentData({
                        ...payInstallmentData,
                        paymentDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              {/* Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Referensi Autodebit / Transfer
                </label>
                <input
                  type="text"
                  value={payInstallmentData.referenceNo}
                  onChange={(e) =>
                    setPayInstallmentData({
                      ...payInstallmentData,
                      referenceNo: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              {/* Jurnal Otomasi Angsuran Berimbang */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                    Jurnal Otomasi Pembayaran Angsuran:
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SEIMBANG &check;
                  </span>
                </div>
                <div className="font-mono text-[11px] space-y-0.5 pl-5 pt-1">
                  <p className="text-purple-600 dark:text-purple-400">
                    [Debit] {selectedLoan.liabilityAccount}: {formatRupiah(payInstallmentData.principalAmount)}
                  </p>
                  <p className="text-amber-500 font-semibold">
                    [Debit] 6501 Beban Bunga Pinjaman Bank: {formatRupiah(payInstallmentData.interestAmount)}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 pt-0.5 font-bold">
                    [Kredit] {payInstallmentData.bankAccount.split(" ")[0]} {payInstallmentData.bankAccount.split("—")[0].replace(/^\d+\s*/, "")}: {formatRupiah(Number(payInstallmentData.principalAmount) + Number(payInstallmentData.interestAmount))}
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
                  Konfirmasi Pembayaran Angsuran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Jadwal Amortisasi & Riwayat Angsuran */}
      {isAmortizationModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Riwayat Pembayaran Angsuran: {selectedLoan.loanCode}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Fasilitas: <strong className="text-slate-700 dark:text-slate-300">{selectedLoan.facilityName}</strong> ({selectedLoan.creditorName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAmortizationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Plafon Pokok Awal:</span>
                  <span className="font-mono font-bold">{formatRupiah(selectedLoan.principalAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sisa Pokok Pinjaman:</span>
                  <span className="font-mono font-bold text-rose-500">{formatRupiah(selectedLoan.remainingPrincipal)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Angsuran Bulanan:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{formatRupiah(selectedLoan.monthlyTotal)}</span>
                </div>
              </div>

              {selectedLoan.payments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada transaksi pembayaran angsuran untuk fasilitas pinjaman ini.
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5">Angsuran Ke</th>
                        <th className="p-2.5">Tgl Bayar</th>
                        <th className="p-2.5 text-right">Porsi Pokok</th>
                        <th className="p-2.5 text-right">Porsi Bunga (6501)</th>
                        <th className="p-2.5 text-right">Total Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {selectedLoan.payments.map((p) => (
                        <tr key={p.id}>
                          <td className="p-2.5 font-bold font-sans">
                            Ke-{p.installmentNo}
                            <div className="text-[10px] text-slate-400 font-mono">{p.referenceNo}</div>
                          </td>
                          <td className="p-2.5 text-slate-500">{p.paymentDate}</td>
                          <td className="p-2.5 text-right font-bold text-purple-600 dark:text-purple-400">
                            {formatRupiah(p.principalAmount)}
                          </td>
                          <td className="p-2.5 text-right text-amber-500 font-bold">
                            {formatRupiah(p.interestAmount)}
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">
                            {formatRupiah(p.totalPaid)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAmortizationModalOpen(false)}
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

