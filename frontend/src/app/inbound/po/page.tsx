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
  Trash2,
  Printer,
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
    id: "po-ivh-01",
    poNumber: "PO-DIS10114",
    supplierName: "PT. INDO VAN HOUTEN (Miami Ice Cream)",
    orderDate: "2026-10-29",
    expectedDate: "2026-10-29",
    status: "DRAFT",
    totalAmount: 40790214,
    items: [
      {
        sku: "MIA-BLU-60",
        productName: "Blueberry Ice 60/114",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-MEL-60",
        productName: "Little Melon 60/114",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 59460,
        totalPrice: 1486500,
      },
      {
        sku: "MIA-PNK-60",
        productName: "Helo Pinky 60/114",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 59460,
        totalPrice: 1486500,
      },
      {
        sku: "MIA-MSY-60",
        productName: "Miss You 60/140",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 59460,
        totalPrice: 1486500,
      },
      {
        sku: "MIA-CRN-40",
        productName: "Choco Corn 40/140",
        uom: "DUS (40 Pcs)",
        orderedQty: 75,
        unitPrice: 57658,
        totalPrice: 4324350,
      },
      {
        sku: "MIA-GLD-40",
        productName: "Golden Corn 40/140",
        uom: "DUS (40 Pcs)",
        orderedQty: 80,
        unitPrice: 57658,
        totalPrice: 4612640,
      },
      {
        sku: "MIA-DBC-40",
        productName: "DOUBLE CRUMBLE CHO - ISI 40",
        uom: "DUS (40 Pcs)",
        orderedQty: 25,
        unitPrice: 86487,
        totalPrice: 2162175,
      },
      {
        sku: "MIA-MIC-24",
        productName: "Micro Cone 24",
        uom: "DUS (24 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-DUR-60",
        productName: "KING DURIAN 60",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 59460,
        totalPrice: 1486500,
      },
      {
        sku: "MIA-RNF-50",
        productName: "Rainbow Frost 50/114",
        uom: "DUS (50 Pcs)",
        orderedQty: 35,
        unitPrice: 49550,
        totalPrice: 1734250,
      },
      {
        sku: "MIA-JRK-50",
        productName: "JEROOK 50",
        uom: "DUS (50 Pcs)",
        orderedQty: 25,
        unitPrice: 49550,
        totalPrice: 1238750,
      },
      {
        sku: "MIA-CHM-60",
        productName: "Chocolate Milk ISI 60 pcs",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 59460,
        totalPrice: 1486500,
      },
      {
        sku: "MIA-MNG-60",
        productName: "Mungmung 60/196",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-CVN-60",
        productName: "Choco Vanilla 60/196",
        uom: "DUS (60 Pcs)",
        orderedQty: 30,
        unitPrice: 64865,
        totalPrice: 1945950,
      },
      {
        sku: "MIA-SNF-60",
        productName: "SNOW FLOWER ISI 60",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-CHF-60",
        productName: "Chocolate Fully 60",
        uom: "DUS (60 Pcs)",
        orderedQty: 30,
        unitPrice: 64865,
        totalPrice: 1945950,
      },
      {
        sku: "MIA-SME-24",
        productName: "Soomee 24/128",
        uom: "DUS (24 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-RCK-24",
        productName: "Rockie 24/128",
        uom: "DUS (24 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
      {
        sku: "MIA-CKS-24",
        productName: "Coklat Susu 24/128",
        uom: "DUS (24 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
        totalPrice: 1621625,
      },
    ],
    notes: "Total 560 Dus es krim Miami. DPP: Rp 36.747.940 + PPN 11%: Rp 4.042.274. Syarat: Tunai / COD 0 Hari.",
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
    supplierName: "PT. INDO VAN HOUTEN (Miami Ice Cream)",
    expectedDate: "2026-10-29",
    notes: "Pengiriman dengan armada berpendingin (Cold Truck ≤ -18°C).",
    items: [
      {
        sku: "MIA-BLU-60",
        productName: "Blueberry Ice 60/114",
        uom: "DUS (60 Pcs)",
        orderedQty: 25,
        unitPrice: 64865,
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPoList([])}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Kosongkan seluruh data transaksi PO untuk simulasi dari nol"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan PO</span>
          </button>

          <button
            onClick={() => setPoList(INITIAL_POS)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5"
            title="Muat ulang draf dokumen PO-DIS10114 resmi pabrik Miami"
          >
            <History className="w-3.5 h-3.5" />
            <span>Muat Draf PO-DIS10114</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat PO Baru</span>
          </button>
        </div>
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
              {filteredPos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-slate-400">
                      <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Belum Ada Dokumen Purchase Order
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        Tabel transaksi PO kosong untuk persiapan testing alur bisnis dari awal.
                      </p>
                      <button
                        onClick={() => setPoList(INITIAL_POS)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Muat Draf Dokumen PO-DIS10114</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPos.map((po) => (
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
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail PO - Dioptimasi untuk Banyak Data (Scrollable & Responsive) */}
      {selectedPoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
            {/* Header Modal - Pinned */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-mono">
                      {selectedPoDetail.poNumber}
                    </h3>
                    {getStatusBadge(selectedPoDetail.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Pemasok: <strong className="text-slate-800 dark:text-slate-200">{selectedPoDetail.supplierName}</strong> &bull; Tgl Terbit: {selectedPoDetail.orderDate} &bull; Tiba: {selectedPoDetail.expectedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition"
                  title="Cetak Dokumen Purchase Order"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak PO</span>
                </button>
                <button
                  onClick={() => setSelectedPoDetail(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stat Ribbon */}
            <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-950 border-b border-slate-200/70 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Varian:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedPoDetail.items.length} Macam SKU
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Volume:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedPoDetail.items.reduce((sum, it) => sum + it.orderedQty, 0)} Dus
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dasar Pengenaan Pajak:</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {formatRupiah(Math.round(selectedPoDetail.totalAmount / 1.11))}
                </span>
              </div>
              <div className="text-right sm:text-left">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">PPN (11%):</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {formatRupiah(selectedPoDetail.totalAmount - Math.round(selectedPoDetail.totalAmount / 1.11))}
                </span>
              </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-h-[52vh] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 font-bold uppercase sticky top-0 shadow-sm z-10 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5 text-center w-10">No</th>
                    <th className="p-2.5">Deskripsi Produk Es Krim</th>
                    <th className="p-2.5 text-center">Kemasan / UOM</th>
                    <th className="p-2.5 text-center">Qty Dus</th>
                    <th className="p-2.5 text-right">Harga Satuan</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {selectedPoDetail.items.map((it, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-2.5 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                        {it.productName}
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          SKU: {it.sku}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-600 dark:text-slate-300">
                        {it.uom}
                      </td>
                      <td className="p-2.5 text-center font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                        {it.orderedQty}
                      </td>
                      <td className="p-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                        {formatRupiah(it.unitPrice)}
                      </td>
                      <td className="p-2.5 text-right font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatRupiah(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Modal - Pinned */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
              <div className="text-xs text-slate-500 max-w-md">
                {selectedPoDetail.notes ? (
                  <p className="italic text-slate-600 dark:text-slate-400">
                    &ldquo;{selectedPoDetail.notes}&rdquo;
                  </p>
                ) : (
                  <p>Term of Payment: Tunai / COD sesuai tanggal jatuh tempo.</p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium uppercase">
                    Grand Total Tagihan:
                  </span>
                  <span className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400">
                    {formatRupiah(selectedPoDetail.totalAmount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPoDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                >
                  Tutup Rincian
                </button>
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

