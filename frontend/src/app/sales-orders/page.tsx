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
  AlertCircle
} from "lucide-react";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface SoItemRow {
  sku: string;
  name: string;
  uom: string;
  orderedQty: number;
  unitPrice: number;
  discountPct: number;
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
    totalAmount: 7650000,
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 30,
        unitPrice: 120000,
        discountPct: 0,
        subtotal: 3600000,
      },
      {
        sku: "ICR-002",
        name: "Chocolate Fudge Bar 90 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 30,
        unitPrice: 135000,
        discountPct: 0,
        subtotal: 4050000,
      },
    ],
    notes: "Pengiriman pukul 14:00 WIB ke Loading Dock B.",
  },
  {
    id: "so-2",
    soNumber: "SO-202610-0002",
    customerName: "Toko Sinar Rejeki (Grosir)",
    category: "Agen / Grosir",
    orderDate: "2026-10-31",
    status: "DRAFT",
    paymentType: "CREDIT",
    totalAmount: 5400000,
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 50,
        unitPrice: 108000,
        discountPct: 0,
        subtotal: 5400000,
      },
    ],
    notes: "Harga khusus tiering agen grosir.",
  },
  {
    id: "so-3",
    soNumber: "SO-202610-0003",
    customerName: "Kafe Kopi Kenangan Manis",
    category: "Horeka",
    orderDate: "2026-10-30",
    status: "DELIVERED",
    paymentType: "CASH",
    totalAmount: 2300000,
    items: [
      {
        sku: "ICR-003",
        name: "Strawberry Swirl Cup 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 20,
        unitPrice: 115000,
        discountPct: 0,
        subtotal: 2300000,
      },
    ],
    notes: "Selesai diantar dan POD terkonfirmasi.",
  },
];

export default function SalesOrdersPage() {
  const [soList, setSoList] = useState<SalesOrderData[]>(INITIAL_SOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSoDetail, setSelectedSoDetail] = useState<SalesOrderData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "IndoGrosir Kemayoran",
    category: "Modern Trade" as SalesOrderData["category"],
    paymentType: "CREDIT" as SalesOrderData["paymentType"],
    notes: "",
    items: [
      {
        sku: "ICR-001",
        name: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 20,
        unitPrice: 120000,
        discountPct: 0,
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <Layers className="w-3 h-3" /> Proses Picking FEFO
          </span>
        );
      case "PACKED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="w-3 h-3" /> Siap Kirim (Packed)
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
    alert("Pesanan Penjualan (SO) berhasil dikonfirmasi!");
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

  const handleSaveSo = (e: React.FormEvent) => {
    e.preventDefault();
    const total = formData.items.reduce(
      (sum, item) => sum + item.orderedQty * item.unitPrice * (1 - item.discountPct / 100),
      0
    );

    const newSo: SalesOrderData = {
      id: `so-${Date.now()}`,
      soNumber: `SO-202610-000${soList.length + 1}`,
      customerName: formData.customerName,
      category: formData.category,
      orderDate: new Date().toISOString().split("T")[0],
      status: "DRAFT",
      paymentType: formData.paymentType,
      totalAmount: total,
      items: formData.items.map((it) => ({
        ...it,
        subtotal: it.orderedQty * it.unitPrice * (1 - it.discountPct / 100),
      })),
      notes: formData.notes,
    };

    setSoList([newSo, ...soList]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Outbound &amp; Penjualan</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Sales Order (SO)
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-cyan-500" />
            Pesanan Penjualan (Sales Order)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Entri pesanan pelanggan dengan penguncian harga otomatis dari Matriks Harga Kanal dan penerbitan alokasi FEFO.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pesanan Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor SO atau nama outlet pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nomor SO</th>
                <th className="px-5 py-3.5">Mitra Pelanggan</th>
                <th className="px-5 py-3.5">Segmen Kanal</th>
                <th className="px-5 py-3.5">Tipe Pembayaran</th>
                <th className="px-5 py-3.5">Total Tagihan</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSos.map((so) => (
                <tr
                  key={so.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {so.soNumber}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                    {so.customerName}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadge(
                        so.category
                      )}`}
                    >
                      {so.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs font-mono">
                    {so.paymentType === "CREDIT" ? (
                      <span className="text-slate-700 dark:text-slate-300">Kredit (TOP)</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">Tunai / COD</span>
                    )}
                  </td>

                  <td className="px-5 py-4 font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {formatRupiah(so.totalAmount)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {getStatusBadge(so.status)}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {so.status === "DRAFT" && (
                        <button
                          onClick={() => handleConfirmSo(so.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                        >
                          Konfirmasi SO
                        </button>
                      )}

                      {so.status === "CONFIRMED" && (
                        <a
                          href={`/picking?so=${so.soNumber}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-all"
                        >
                          Alokasikan FEFO &rsaquo;
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedSoDetail(so)}
                        title="Lihat Detail Pesanan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FileCheck2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat SO Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Buat Pesanan Penjualan (SO) Baru
                  </h3>
                  <p className="text-xs text-slate-400">
                    Harga dikunci otomatis dari matriks harga kanal pelanggan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSo} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pilih Mitra Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.customerName}
                    onChange={(e) => {
                      const name = e.target.value;
                      let cat: SalesOrderData["category"] = "General Trade";
                      if (name.includes("IndoGrosir")) cat = "Modern Trade";
                      else if (name.includes("Sinar Rejeki")) cat = "Agen / Grosir";
                      else if (name.includes("Kafe")) cat = "Horeka";

                      setFormData({ ...formData, customerName: name, category: cat });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="IndoGrosir Kemayoran">IndoGrosir Kemayoran (MT)</option>
                    <option value="Toko Sinar Rejeki (Grosir)">Toko Sinar Rejeki (Agen)</option>
                    <option value="Kafe Kopi Kenangan Manis">Kafe Kopi Kenangan Manis (Horeka)</option>
                    <option value="Warung Berkah Kelontong">Warung Berkah Kelontong (GT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Segmen Kanal Terdeteksi
                  </label>
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formData.category}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentType: e.target.value as SalesOrderData["paymentType"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="CREDIT">Kredit (Term of Payment)</option>
                    <option value="CASH">Tunai (Cash On Delivery)</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Daftar Produk yang Dipesan
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Produk
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
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
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 text-right font-mono text-xs tabular-nums font-semibold">
                        {formatRupiah(it.orderedQty * it.unitPrice)}
                      </div>

                      <div className="sm:col-span-1 text-center">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Tagihan Bersih:</span>
                <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  {formatRupiah(
                    formData.items.reduce(
                      (sum, item) => sum + item.orderedQty * item.unitPrice,
                      0
                    )
                  )}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-sm"
                >
                  Simpan Draft SO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

