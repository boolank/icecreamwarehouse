"use client";

import React, { useState } from "react";
import {
  Inbox,
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  DollarSign,
  ChevronRight,
  X,
  History,
  Trash2
} from "lucide-react";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface PoItem {
  sku: string;
  productName: string;
  uom: string;
  orderedQty: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrderData {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: "DRAFT" | "CONFIRMED" | "PARTIAL" | "RECEIVED" | "CANCELLED";
  totalAmount: number;
  items: PoItem[];
  notes?: string;
}

const INITIAL_POS: PurchaseOrderData[] = [
  {
    id: "po-1",
    poNumber: "PO-202610-0001",
    supplierName: "PT Es Krim Nusantara Sejahtera",
    orderDate: "2026-10-28",
    expectedDate: "2026-10-31",
    status: "CONFIRMED",
    totalAmount: 18000000,
    items: [
      {
        sku: "ICR-001",
        productName: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 100,
        unitPrice: 84000,
        totalPrice: 8400000,
      },
      {
        sku: "ICR-002",
        productName: "Chocolate Fudge Bar 90 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 100,
        unitPrice: 96000,
        totalPrice: 9600000,
      },
    ],
    notes: "Pengiriman via truk pendingin Thermo King dengan suhu wajib ≤ -20°C.",
  },
  {
    id: "po-2",
    poNumber: "PO-202610-0002",
    supplierName: "PT Indo Cold Logistics",
    orderDate: "2026-10-29",
    expectedDate: "2026-11-02",
    status: "DRAFT",
    totalAmount: 12600000,
    items: [
      {
        sku: "ICR-003",
        productName: "Strawberry Swirl Cup 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 150,
        unitPrice: 84000,
        totalPrice: 12600000,
      },
    ],
    notes: "Pesanan restock persediaan akhir bulan.",
  },
  {
    id: "po-3",
    poNumber: "PO-202610-0003",
    supplierName: "PT Gelato Prima Dairy",
    orderDate: "2026-10-25",
    expectedDate: "2026-10-27",
    status: "RECEIVED",
    totalAmount: 24500000,
    items: [
      {
        sku: "ICR-004",
        productName: "Mango Sorbet 120 ml",
        uom: "DUS (20 Pcs)",
        orderedQty: 100,
        unitPrice: 90000,
        totalPrice: 9000000,
      },
      {
        sku: "ICR-005",
        productName: "Cookies & Cream 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 150,
        unitPrice: 102000,
        totalPrice: 15300000,
      },
    ],
    notes: "Telah diterima penuh dengan suhu armada truk -21.4°C.",
  },
];

export default function PurchaseOrdersPage() {
  const [poList, setPoList] = useState<PurchaseOrderData[]>(INITIAL_POS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPoDetail, setSelectedPoDetail] = useState<PurchaseOrderData | null>(null);

  // Form State
  const [newPoData, setNewPoData] = useState({
    supplierName: "PT Es Krim Nusantara Sejahtera",
    expectedDate: "2026-11-05",
    notes: "Pengiriman dengan armada berpendingin (Cold Truck ≤ -18°C).",
    items: [
      {
        sku: "ICR-001",
        productName: "Vanilla Bean Classic 100 ml",
        uom: "DUS (24 Pcs)",
        orderedQty: 50,
        unitPrice: 84000,
      },
    ],
  });

  const statuses = ["Semua", "DRAFT", "CONFIRMED", "RECEIVED"];

  const filteredPos = poList.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "Semua" || po.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PurchaseOrderData["status"]) => {
    switch (status) {
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
      case "RECEIVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Selesai Diterima
          </span>
        );
      default:
        return null;
    }
  };

  const handleConfirmPo = (id: string) => {
    setPoList((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: "CONFIRMED" } : po))
    );
    alert("Purchase Order berhasil dikonfirmasi dan siap untuk proses Inbound Receiving!");
  };

  const handleAddItemRow = () => {
    setNewPoData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          sku: "ICR-002",
          productName: "Chocolate Fudge Bar 90 ml",
          uom: "DUS (24 Pcs)",
          orderedQty: 50,
          unitPrice: 96000,
        },
      ],
    }));
  };

  const handleRemoveItemRow = (idx: number) => {
    setNewPoData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveNewPo = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newPoData.items.reduce(
      (sum, item) => sum + item.orderedQty * item.unitPrice,
      0
    );

    const createdPo: PurchaseOrderData = {
      id: `po-${Date.now()}`,
      poNumber: `PO-202610-000${poList.length + 1}`,
      supplierName: newPoData.supplierName,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: newPoData.expectedDate,
      status: "DRAFT",
      totalAmount: total,
      notes: newPoData.notes,
      items: newPoData.items.map((it) => ({
        ...it,
        totalPrice: it.orderedQty * it.unitPrice,
      })),
    };

    setPoList([createdPo, ...poList]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Manajemen Inbound</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Purchase Order (PO)
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-cyan-500" />
            Pesanan Pembelian Pasokan (Purchase Order)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola pengadaan stok es krim grosir dari pabrikan dan jadwalkan kedatangan armada berpendingin.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat PO Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor PO atau nama pabrikan supplier..."
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

      {/* Table of POs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nomor PO</th>
                <th className="px-5 py-3.5">Pabrikan Supplier</th>
                <th className="px-5 py-3.5">Tanggal Order</th>
                <th className="px-5 py-3.5">Estimasi Kedatangan</th>
                <th className="px-5 py-3.5">Total Nilai Tagihan</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPos.map((po) => (
                <tr
                  key={po.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {po.poNumber}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                    {po.supplierName}
                  </td>

                  <td className="px-5 py-4 text-xs font-mono text-slate-500">
                    {po.orderDate}
                  </td>

                  <td className="px-5 py-4 text-xs font-mono text-slate-700 dark:text-slate-300">
                    {po.expectedDate}
                  </td>

                  <td className="px-5 py-4 font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {formatRupiah(po.totalAmount)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {getStatusBadge(po.status)}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {po.status === "DRAFT" && (
                        <button
                          onClick={() => handleConfirmPo(po.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                        >
                          Konfirmasi PO
                        </button>
                      )}

                      {po.status === "CONFIRMED" && (
                        <a
                          href={`/inbound/qc?po=${po.poNumber}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-all"
                        >
                          Proses QC Inbound &rsaquo;
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedPoDetail(po)}
                        title="Lihat Rincian Item PO"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail PO */}
      {selectedPoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Rincian Pesanan: {selectedPoDetail.poNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Supplier: {selectedPoDetail.supplierName} &bull; Tgl: {selectedPoDetail.orderDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPoDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="p-2.5">SKU &amp; Produk</th>
                    <th className="p-2.5">Satuan</th>
                    <th className="p-2.5 text-center">Jumlah Pesan</th>
                    <th className="p-2.5 text-right">Harga Satuan</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedPoDetail.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">
                        {it.productName}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {it.sku}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-600 dark:text-slate-400">
                        {it.uom}
                      </td>
                      <td className="p-2.5 text-center font-mono font-semibold">
                        {it.orderedQty}
                      </td>
                      <td className="p-2.5 text-right font-mono tabular-nums">
                        {formatRupiah(it.unitPrice)}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatRupiah(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  Status: {getStatusBadge(selectedPoDetail.status)}
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Tagihan:</span>
                  <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {formatRupiah(selectedPoDetail.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat PO Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Buat Purchase Order Baru
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPo} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pabrikan / Pemasok Es Krim <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newPoData.supplierName}
                    onChange={(e) =>
                      setNewPoData({ ...newPoData, supplierName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="PT Es Krim Nusantara Sejahtera">
                      PT Es Krim Nusantara Sejahtera
                    </option>
                    <option value="PT Indo Cold Logistics">PT Indo Cold Logistics</option>
                    <option value="PT Gelato Prima Dairy">PT Gelato Prima Dairy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Tanggal Kedatangan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newPoData.expectedDate}
                    onChange={(e) =>
                      setNewPoData({ ...newPoData, expectedDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Daftar Item Es Krim yang Dipesan
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Baris Produk
                  </button>
                </div>

                <div className="space-y-2">
                  {newPoData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <select
                          value={item.sku}
                          onChange={(e) => {
                            const newItems = [...newPoData.items];
                            newItems[idx].sku = e.target.value;
                            if (e.target.value === "ICR-001") {
                              newItems[idx].productName = "Vanilla Bean Classic 100 ml";
                              newItems[idx].unitPrice = 84000;
                            } else if (e.target.value === "ICR-002") {
                              newItems[idx].productName = "Chocolate Fudge Bar 90 ml";
                              newItems[idx].unitPrice = 96000;
                            } else {
                              newItems[idx].productName = "Strawberry Swirl Cup 100 ml";
                              newItems[idx].unitPrice = 84000;
                            }
                            setNewPoData({ ...newPoData, items: newItems });
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
                          {item.uom}
                        </span>
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.orderedQty}
                          onChange={(e) => {
                            const newItems = [...newPoData.items];
                            newItems[idx].orderedQty = Math.max(1, Number(e.target.value));
                            setNewPoData({ ...newPoData, items: newItems });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-center font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 text-right font-mono text-xs tabular-nums font-semibold">
                        {formatRupiah(item.orderedQty * item.unitPrice)}
                      </div>

                      <div className="sm:col-span-1 text-center">
                        {newPoData.items.length > 1 && (
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Instruksi Khusus
                </label>
                <textarea
                  rows={2}
                  value={newPoData.notes}
                  onChange={(e) =>
                    setNewPoData({ ...newPoData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-sm"
                >
                  Simpan Draft PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

