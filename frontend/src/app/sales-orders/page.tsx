"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  DollarSign,
  ArrowRight,
  TrendingUp,
  X,
  Trash2,
  Building2,
  FileCheck2,
  AlertCircle,
  Tag,
  Percent,
  Receipt,
  Eye,
  FileText,
  Printer
} from "lucide-react";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface SoItemRow {
  sku: string;
  name: string;
  uom: string;
  orderedQty: number;
  unitPrice: number;
  discountPct: number;
  discountAmount: number;
  subtotal: number;
}

interface SalesOrderData {
  id: string;
  soNumber: string;
  customerName: string;
  category: "Modern Trade" | "General Trade" | "Horeka" | "Agen / Grosir";
  orderDate: string;
  status: "DRAFT" | "CONFIRMED" | "PICKING" | "PACKED" | "DELIVERED";
  paymentType: "CASH" | "CREDIT";
  grossAmount: number;
  itemDiscountTotal: number;
  orderDiscountAmount: number;
  totalDiscount: number;
  taxableAmount: number;
  ppnAmount: number;
  includePpn: boolean;
  totalAmount: number;
  items: SoItemRow[];
  notes?: string;
}

const INITIAL_SOS: SalesOrderData[] = [
  {
    id: "so-1",
    soNumber: "SO-202610-0001",
    customerName: "IndoGrosir Kemayoran",
    category: "Modern Trade",
    orderDate: "2026-10-31",
    status: "CONFIRMED",
    paymentType: "CREDIT",
    grossAmount: 7650000,
    itemDiscountTotal: 300000,
    orderDiscountAmount: 100000,
    totalDiscount: 400000,
    taxableAmount: 7250000,
    ppnAmount: 0,
    includePpn: false,
    totalAmount: 7250000,
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 30,
        unitPrice: 120000,
        discountPct: 5,
        discountAmount: 180000,
        subtotal: 3420000,
      },
      {
        sku: "ICR-002",
        name: "Chocolate Fudge Bar 90 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 30,
        unitPrice: 135000,
        discountPct: 3,
        discountAmount: 120000,
        subtotal: 3930000,
      },
    ],
    notes: "Pengiriman pukul 14:00 WIB ke Loading Dock B. Diskon promo modern trade diterapkan.",
  },
  {
    id: "so-2",
    soNumber: "SO-202610-0002",
    customerName: "Toko Sinar Rejeki (Grosir)",
    category: "Agen / Grosir",
    orderDate: "2026-10-31",
    status: "DRAFT",
    paymentType: "CREDIT",
    grossAmount: 5400000,
    itemDiscountTotal: 270000,
    orderDiscountAmount: 0,
    totalDiscount: 270000,
    taxableAmount: 5130000,
    ppnAmount: 0,
    includePpn: false,
    totalAmount: 5130000,
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 50,
        unitPrice: 108000,
        discountPct: 5,
        discountAmount: 270000,
        subtotal: 5130000,
      },
    ],
    notes: "Harga khusus tiering agen grosir volume 50 Dus.",
  },
  {
    id: "so-3",
    soNumber: "SO-202610-0003",
    customerName: "Kafe Kopi Kenangan Manis",
    category: "Horeka",
    orderDate: "2026-10-30",
    status: "DELIVERED",
    paymentType: "CASH",
    grossAmount: 2300000,
    itemDiscountTotal: 0,
    orderDiscountAmount: 50000,
    totalDiscount: 50000,
    taxableAmount: 2250000,
    ppnAmount: 0,
    includePpn: false,
    totalAmount: 2250000,
    items: [
      {
        sku: "ICR-003",
        name: "Strawberry Swirl Cup 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 20,
        unitPrice: 115000,
        discountPct: 0,
        discountAmount: 0,
        subtotal: 2300000,
      },
    ],
    notes: "Selesai diantar dan POD terkonfirmasi. Diskon cash delivery Rp 50.000.",
  },
];

export default function SalesOrdersPage() {
  const [soList, setSoList] = useState<SalesOrderData[]>(INITIAL_SOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSoDetail, setSelectedSoDetail] = useState<SalesOrderData | null>(null);
  const [selectedSoForInvoicePrint, setSelectedSoForInvoicePrint] = useState<SalesOrderData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "IndoGrosir Kemayoran",
    category: "Modern Trade" as SalesOrderData["category"],
    paymentType: "CREDIT" as SalesOrderData["paymentType"],
    notes: "",
    orderDiscountAmount: 0,
    includePpn: false,
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 20,
        unitPrice: 120000,
        discountPct: 5,
        discountAmount: 120000,
      },
    ],
  });

  const statuses = ["Semua", "DRAFT", "CONFIRMED", "PICKING", "PACKED", "DELIVERED"];

  const filteredSos = soList.filter((so) => {
    const matchesSearch =
      so.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      so.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua" || so.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getCategoryBadge = (cat: SalesOrderData["category"]) => {
    switch (cat) {
      case "Modern Trade":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "Agen / Grosir":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Horeka":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "General Trade":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  const getStatusBadge = (st: SalesOrderData["status"]) => {
    switch (st) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <Clock className="w-3 h-3" /> Draf
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> Dikonfirmasi
          </span>
        );
      case "PICKING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Layers className="w-3 h-3" /> Picking FEFO
          </span>
        );
      case "PACKED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <FileCheck2 className="w-3 h-3" /> Siap Muat (Packed)
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Terkirim (POD Selesai)
          </span>
        );
    }
  };

  const handleConfirmSo = (id: string) => {
    setSoList((prev) =>
      prev.map((so) => (so.id === id ? { ...so, status: "CONFIRMED" } : so))
    );
    alert("Pesanan Penjualan (SO) berhasil dikonfirmasi! Jadwal picking FEFO siap dijalankan.");
  };

  const handleAddItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          sku: "ICR-002",
          name: "Chocolate Fudge Bar 90 ml",
          uom: "DUS (24 Pcs)",
          orderedQty: 10,
          unitPrice: 135000,
          discountPct: 0,
          discountAmount: 0,
        },
      ],
    }));
  };

  const handleRemoveItemRow = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // Calculations for Add Form
  const formGross = formData.items.reduce(
    (sum, item) => sum + item.orderedQty * item.unitPrice,
    0
  );
  const formItemDiscount = formData.items.reduce(
    (sum, item) => sum + item.orderedQty * item.unitPrice * (item.discountPct / 100),
    0
  );
  const formTotalDiscount = formItemDiscount + Number(formData.orderDiscountAmount || 0);
  const formDpp = Math.max(0, formGross - formTotalDiscount);
  const formPpn = formData.includePpn ? Math.round(formDpp * 0.11) : 0;
  const formGrandTotal = formDpp + formPpn;

  const handleSaveSo = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsFormatted: SoItemRow[] = formData.items.map((it) => {
      const discAmt = it.orderedQty * it.unitPrice * (it.discountPct / 100);
      return {
        sku: it.sku,
        name: it.name,
        uom: it.uom,
        orderedQty: it.orderedQty,
        unitPrice: it.unitPrice,
        discountPct: it.discountPct,
        discountAmount: discAmt,
        subtotal: it.orderedQty * it.unitPrice - discAmt,
      };
    });

    const newSo: SalesOrderData = {
      id: `so-${Date.now()}`,
      soNumber: `SO-202611-000${soList.length + 1}`,
      customerName: formData.customerName,
      category: formData.category,
      orderDate: new Date().toISOString().split("T")[0],
      status: "DRAFT",
      paymentType: formData.paymentType,
      grossAmount: formGross,
      itemDiscountTotal: formItemDiscount,
      orderDiscountAmount: Number(formData.orderDiscountAmount || 0),
      totalDiscount: formTotalDiscount,
      taxableAmount: formDpp,
      ppnAmount: formPpn,
      includePpn: formData.includePpn,
      totalAmount: formGrandTotal,
      items: itemsFormatted,
      notes: formData.notes,
    };

    setSoList([newSo, ...soList]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Outbound &amp; Penjualan</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Sales Order (SO) &amp; Diskon
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-cyan-500" />
            Pesanan Penjualan (Sales Order) &amp; Diskon Promosi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Entri pesanan pelanggan dengan diskon bertingkat per item/faktur, penguncian harga kanal, dan jurnal diskon otomatis (Akun 4111).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pesanan Baru (SO)</span>
        </button>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Nilai Pesanan
          </span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {formatRupiah(soList.reduce((acc, so) => acc + so.totalAmount, 0))}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider block">
            Total Diskon Diberikan (4111)
          </span>
          <span className="text-xl font-bold font-mono text-rose-500 mt-1 block">
            {formatRupiah(soList.reduce((acc, so) => acc + so.totalDiscount, 0))}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider block">
            Pesanan Dikonfirmasi
          </span>
          <span className="text-xl font-bold text-blue-500 mt-1 block">
            {soList.filter((so) => so.status === "CONFIRMED").length} <span className="text-xs font-normal text-slate-400">SO</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider block">
            Terkirim &amp; POD Selesai
          </span>
          <span className="text-xl font-bold text-emerald-500 mt-1 block">
            {soList.filter((so) => so.status === "DELIVERED").length} <span className="text-xs font-normal text-slate-400">SO</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor SO atau nama outlet pelanggan..."
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

      {/* SO Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nomor SO &amp; Tanggal</th>
                <th className="px-5 py-3.5">Mitra Pelanggan</th>
                <th className="px-5 py-3.5">Segmen Kanal</th>
                <th className="px-5 py-3.5 text-right">Nilai Bruto</th>
                <th className="px-5 py-3.5 text-right">Potongan Diskon</th>
                <th className="px-5 py-3.5 text-right">Total Netto Tagihan</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredSos.map((so) => (
                <tr
                  key={so.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-cyan-600 dark:text-cyan-400">
                      {so.soNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      {so.orderDate}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-sans font-semibold text-slate-900 dark:text-white">
                    {so.customerName}
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {so.paymentType === "CREDIT" ? "Kredit (TOP)" : "Tunai (COD)"}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-sans">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadge(
                        so.category
                      )}`}
                    >
                      {so.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right text-slate-500 dark:text-slate-400">
                    {formatRupiah(so.grossAmount)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {so.totalDiscount > 0 ? (
                      <span className="text-rose-500 font-semibold flex items-center justify-end gap-1">
                        <Tag className="w-3 h-3" />
                        -{formatRupiah(so.totalDiscount)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-sans">-</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatRupiah(so.totalAmount)}
                  </td>

                  <td className="px-5 py-4 text-center font-sans">
                    {getStatusBadge(so.status)}
                  </td>

                  <td className="px-5 py-4 text-right font-sans whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedSoDetail(so)}
                        title="Lihat Detail SO & Jurnal Diskon"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedSoForInvoicePrint(so)}
                        title="Cetak Faktur Penjualan (Invoice)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {so.status === "DRAFT" && (
                        <button
                          onClick={() => handleConfirmSo(so.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition shadow-sm"
                        >
                          Konfirmasi SO
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Buat Pesanan Baru (SO) Lengkap dengan Diskon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Buat Pesanan Penjualan (Sales Order) Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Penerapan diskon per item produk dan promosi faktur otomatis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSo} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Mitra Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Segmen Kanal Penjualan
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as SalesOrderData["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="Modern Trade">Modern Trade (Supermarket/Minimarket)</option>
                    <option value="General Trade">General Trade (Warung/Kelontong)</option>
                    <option value="Horeka">Horeka (Hotel/Resto/Kafe)</option>
                    <option value="Agen / Grosir">Agen / Grosir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Pembayaran
                  </label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentType: e.target.value as SalesOrderData["paymentType"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="CREDIT">Kredit (Term of Payment)</option>
                    <option value="CASH">Tunai (Cash On Delivery)</option>
                  </select>
                </div>
              </div>

              {/* Items Section with Line Discount */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-500" />
                    Daftar Produk &amp; Diskon Item
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Baris Produk
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {formData.items.map((it, idx) => {
                    const lineSubtotalBruto = it.orderedQty * it.unitPrice;
                    const lineDiscAmt = lineSubtotalBruto * (it.discountPct / 100);
                    const lineNetto = lineSubtotalBruto - lineDiscAmt;

                    return (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                      >
                        <div className="sm:col-span-4">
                          <select
                            value={it.sku}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[idx].sku = e.target.value;
                              if (e.target.value === "ICR-001") {
                                newItems[idx].name = "Vanilla Bean Classic 100 ml";
                                newItems[idx].unitPrice = formData.category === "Agen / Grosir" ? 108000 : 120000;
                              } else if (e.target.value === "ICR-002") {
                                newItems[idx].name = "Chocolate Fudge Bar 90 ml";
                                newItems[idx].unitPrice = formData.category === "Agen / Grosir" ? 122000 : 135000;
                              } else {
                                newItems[idx].name = "Strawberry Swirl Cup 100 ml";
                                newItems[idx].unitPrice = 115000;
                              }
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                          >
                            <option value="ICR-001">ICR-001 - Vanilla Bean Classic</option>
                            <option value="ICR-002">ICR-002 - Chocolate Fudge Bar</option>
                            <option value="ICR-003">ICR-003 - Strawberry Swirl Cup</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 block text-center">
                            {it.uom}
                          </span>
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              required
                              value={it.orderedQty}
                              onChange={(e) => {
                                const newItems = [...formData.items];
                                newItems[idx].orderedQty = Math.max(1, Number(e.target.value));
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-mono"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-rose-500 font-bold">Disc %:</span>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              step="0.5"
                              value={it.discountPct}
                              onChange={(e) => {
                                const newItems = [...formData.items];
                                newItems[idx].discountPct = Math.min(50, Math.max(0, Number(e.target.value)));
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-full px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-900 text-xs text-center font-mono text-rose-600 font-bold"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 text-right font-mono text-xs tabular-nums">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {formatRupiah(lineNetto)}
                          </div>
                          {lineDiscAmt > 0 && (
                            <div className="text-[10px] text-rose-500">
                              (-{formatRupiah(lineDiscAmt)})
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-12 flex justify-end sm:hidden">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-xs text-rose-500 hover:underline"
                            >
                              Hapus Item
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Level Discount & Tax Controls */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-rose-500" />
                    Diskon Promosi Faktur Global (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="Contoh: 100000"
                    value={formData.orderDiscountAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orderDiscountAmount: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Potongan tambahan pada total pesanan (misal: promo pembukaan, cash discount).
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includePpn}
                      onChange={(e) =>
                        setFormData({ ...formData, includePpn: e.target.checked })
                      }
                      className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Faktur Pajak PPN (11%)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Tambahkan PPN 11% dari Dasar Pengenaan Pajak (DPP).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Complete Financial Breakdown Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-cyan-500/5 dark:from-slate-950 dark:to-cyan-950/20 border border-cyan-500/20 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal Bruto (Sebelum Diskon):</span>
                  <span className="font-mono font-semibold">{formatRupiah(formGross)}</span>
                </div>

                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Total Diskon Penjualan (Akun 4111):
                  </span>
                  <span className="font-mono">-{formatRupiah(formTotalDiscount)}</span>
                </div>

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Dasar Pengenaan Pajak (DPP Netto):</span>
                  <span className="font-mono font-semibold">{formatRupiah(formDpp)}</span>
                </div>

                {formData.includePpn && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>PPN Keluaran 11% (Akun 2120):</span>
                    <span className="font-mono font-semibold">+{formatRupiah(formPpn)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Total Tagihan Bersih (Grand Total):
                  </span>
                  <span className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {formatRupiah(formGrandTotal)}
                  </span>
                </div>
              </div>

              {/* Catatan Jurnal Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                  Preview Otomasi Jurnal Pembukuan Berimbang:
                </p>
                <div className="font-mono text-[10px] pl-5 space-y-0.5">
                  <p>[Debit] 1110 Piutang Usaha: {formatRupiah(formGrandTotal)}</p>
                  {formTotalDiscount > 0 && (
                    <p className="text-rose-500 font-semibold">
                      [Debit] 4111 Diskon Penjualan: {formatRupiah(formTotalDiscount)}
                    </p>
                  )}
                  {formPpn > 0 && <p>[Kredit] 2120 Utang PPN: {formatRupiah(formPpn)}</p>}
                  <p>[Kredit] 4101 Pendapatan Penjualan: {formatRupiah(formGross)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Pesanan &amp; Kunci Diskon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail SO & Rincian Diskon & Jurnal */}
      {selectedSoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Rincian Faktur SO: {selectedSoDetail.soNumber}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pelanggan: <strong className="text-slate-700 dark:text-slate-300">{selectedSoDetail.customerName}</strong> ({selectedSoDetail.category})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSoDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Items Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">Produk</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Harga Satuan</th>
                      <th className="p-2.5 text-right">Diskon Item</th>
                      <th className="p-2.5 text-right">Subtotal Netto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    {selectedSoDetail.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                          {it.name}
                          <div className="text-[10px] text-slate-400 font-mono">{it.sku} &bull; {it.uom}</div>
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.orderedQty}</td>
                        <td className="p-2.5 text-right">{formatRupiah(it.unitPrice)}</td>
                        <td className="p-2.5 text-right text-rose-500 font-semibold">
                          {it.discountAmount > 0 ? (
                            <span>-{formatRupiah(it.discountAmount)} ({it.discountPct}%)</span>
                          ) : (
                            <span className="text-slate-400 font-sans">-</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">
                          {formatRupiah(it.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rincian Finansial */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Bruto:</span>
                  <span className="font-mono">{formatRupiah(selectedSoDetail.grossAmount)}</span>
                </div>
                {selectedSoDetail.itemDiscountTotal > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Diskon Baris Produk:</span>
                    <span className="font-mono">-{formatRupiah(selectedSoDetail.itemDiscountTotal)}</span>
                  </div>
                )}
                {selectedSoDetail.orderDiscountAmount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Diskon Promosi Faktur Tambahan:</span>
                    <span className="font-mono">-{formatRupiah(selectedSoDetail.orderDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-rose-600 font-bold border-t border-slate-200 dark:border-slate-800 pt-1">
                  <span>Total Potongan Diskon (Akun 4111):</span>
                  <span className="font-mono">-{formatRupiah(selectedSoDetail.totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold text-sm pt-1">
                  <span>Total Tagihan Akhir:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">
                    {formatRupiah(selectedSoDetail.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Kartu Jurnal Akuntansi Seimbang */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-slate-950 dark:to-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-indigo-500" />
                    Jurnal Otomasi Pengakuan Penjualan &amp; Diskon (Seimbang)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    BALANCED &check;
                  </span>
                </div>
                <div className="font-mono text-[11px] space-y-1 bg-white/70 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-blue-600 dark:text-blue-400">[Debit] 1110 Piutang Usaha</span>
                    <span className="font-bold">{formatRupiah(selectedSoDetail.totalAmount)}</span>
                  </div>
                  {selectedSoDetail.totalDiscount > 0 && (
                    <div className="flex justify-between text-rose-500 font-semibold">
                      <span>[Debit] 4111 Diskon Penjualan</span>
                      <span>{formatRupiah(selectedSoDetail.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>[Kredit] 4101 Pendapatan Penjualan Es Krim</span>
                    <span className="font-bold">{formatRupiah(selectedSoDetail.grossAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                Status SO: {selectedSoDetail.status}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedSoDetail;
                    setSelectedSoDetail(null);
                    setSelectedSoForInvoicePrint(target);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Faktur Penjualan
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSoDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Pratinjau & Cetak Faktur Penjualan / Invoice Resmi */}
      {selectedSoForInvoicePrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-6">
            {/* Header Modal - Sembunyi saat cetak */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 no-print">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pratinjau Dokumen Faktur Penjualan (Commercial Invoice)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tagihan Resmi Dilengkapi Diskon, Pajak &amp; Akun Rekening Pembayaran
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Faktur (Ctrl+P)
                </button>
                <button
                  onClick={() => setSelectedSoForInvoicePrint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Area Lembar Cetak Faktur A4 */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 dark:text-slate-900 printable-document">
              {/* Kop Surat Faktur */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-black tracking-wider text-slate-900 uppercase">
                    PT FROST FLOW COLD DISTRIBUSI
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Distributor Resmi Es Krim &amp; Pengelolaan Cold Storage Modern
                  </p>
                  <p className="text-xs text-slate-500">
                    Kawasan Industri Pergudangan Cold Storage No. 18, Tangerang &bull; Telp: (021) 555-0199
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-widest uppercase mb-1">
                    FAKTUR PENJUALAN
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    NO: INV/{selectedSoForInvoicePrint.soNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ref Order: {selectedSoForInvoicePrint.soNumber}
                  </p>
                </div>
              </div>

              {/* Data Pelanggan & Transaksi */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    TAGIHAN KEPADA (PELANGGAN):
                  </p>
                  <p className="font-bold text-sm text-slate-900">
                    {selectedSoForInvoicePrint.customerName}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    Kategori Kanal: <span className="font-semibold text-slate-800">{selectedSoForInvoicePrint.category}</span>
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Status Pajak: Pengusaha Kena Pajak (PKP)
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        TANGGAL FAKTUR:
                      </p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {selectedSoForInvoicePrint.orderDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        SYARAT PEMBAYARAN:
                      </p>
                      <p className="font-bold text-indigo-700 mt-0.5">
                        {selectedSoForInvoicePrint.paymentType === "CREDIT" ? "KREDIT (TOP 14 HARI)" : "TUNAI (C.O.D)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        JATUH TEMPO:
                      </p>
                      <p className="font-semibold text-rose-700 mt-0.5">
                        {selectedSoForInvoicePrint.paymentType === "CREDIT" ? "14 Hari dari Tanggal Faktur" : "Saat Barang Diterima"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        STATUS PESANAN:
                      </p>
                      <p className="font-semibold text-slate-800 mt-0.5 uppercase">
                        {selectedSoForInvoicePrint.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Rincian Produk & Diskon */}
              <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-10">NO</th>
                    <th className="p-2 border-r border-slate-300 text-left">DESKRIPSI PRODUK ES KRIM</th>
                    <th className="p-2 border-r border-slate-300 text-center">SATUAN</th>
                    <th className="p-2 border-r border-slate-300 text-center">KUANTITAS</th>
                    <th className="p-2 border-r border-slate-300 text-right">HARGA SATUAN</th>
                    <th className="p-2 border-r border-slate-300 text-right">DISKON ITEM</th>
                    <th className="p-2 text-right">JUMLAH NETTO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedSoForInvoicePrint.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">SKU: {item.sku}</p>
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-semibold">
                        {item.uom}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                        {item.orderedQty}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono">
                        {formatRupiah(item.unitPrice)}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-mono text-rose-600">
                        {item.discountAmount > 0 ? `-${formatRupiah(item.discountAmount)} (${item.discountPct}%)` : "-"}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Rekap Finansial & Instruksi Pembayaran */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Rekening Pembayaran */}
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/70 text-xs space-y-2">
                  <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    INSTRUKSI PEMBAYARAN TRANSFER BANK:
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                    <p className="text-slate-600">Bank: <strong className="text-slate-900">BANK CENTRAL ASIA (BCA)</strong></p>
                    <p className="text-slate-600">No. Rekening: <strong className="text-slate-900">872-0918-201</strong></p>
                    <p className="text-slate-600">Atas Nama: <strong className="text-slate-900">PT FROST FLOW COLD DISTRIBUSI</strong></p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * Harap mencantumkan nomor faktur INV/{selectedSoForInvoicePrint.soNumber} pada berita acara transfer bank.
                  </p>
                </div>

                {/* Kalkulasi Total Faktur */}
                <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Nilai Bruto:</span>
                    <span className="font-mono">{formatRupiah(selectedSoForInvoicePrint.grossAmount)}</span>
                  </div>
                  {selectedSoForInvoicePrint.totalDiscount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Total Potongan Diskon Promosi:</span>
                      <span className="font-mono">-{formatRupiah(selectedSoForInvoicePrint.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1.5">
                    <span>Dasar Pengenaan Pajak (DPP):</span>
                    <span className="font-mono">{formatRupiah(selectedSoForInvoicePrint.grossAmount - selectedSoForInvoicePrint.totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PPN (Bebas / Termasuk Faktur):</span>
                    <span className="font-mono">Rp 0</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 border-t-2 border-slate-400 pt-2">
                    <span>TOTAL NETTO TAGIHAN:</span>
                    <span className="font-mono text-indigo-700">{formatRupiah(selectedSoForInvoicePrint.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="grid grid-cols-2 gap-12 text-center text-xs page-break-avoid">
                <div className="border border-slate-300 rounded p-4 flex flex-col justify-between h-32">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">Bagian Keuangan / Penjualan</p>
                  <p className="text-[10px] text-slate-400">( .................................................. )</p>
                  <p className="text-[11px] font-bold text-slate-800">PT FROST FLOW COLD DISTRIBUSI</p>
                </div>
                <div className="border border-slate-300 rounded p-4 flex flex-col justify-between h-32">
                  <p className="text-[11px] font-bold text-slate-600 uppercase">Penerima Tagihan / Pelanggan</p>
                  <p className="text-[10px] text-slate-400">( Cap Toko &amp; Tanda Tangan )</p>
                  <p className="text-[11px] font-bold text-slate-800">{selectedSoForInvoicePrint.customerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
