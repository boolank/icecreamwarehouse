"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Warehouse,
  Boxes,
  FileText,
  DollarSign,
  ArrowRight,
  Truck,
  HelpCircle,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface ReturnOrderItem {
  id: number;
  productCode: string;
  productName: string;
  batchNumber: string;
  condition: "MELTED" | "DAMAGED" | "NEAR_EXPIRED" | "WRONG_ITEM";
  returnQtyPcs: number;
  unitCost: number;
  totalCost: number;
  quarantineLocation: string;
}

interface ReturnOrderRecord {
  id: number;
  returnNumber: string;
  soNumber: string;
  customerName: string;
  customerCategory: string;
  returnDate: string;
  status: "QUARANTINE" | "APPROVED_CLAIM" | "DISPOSED";
  disposition?: "WRITE_OFF" | "RESTOCK" | "RETURN_TO_SUPPLIER" | null;
  totalValue: number;
  reason: string;
  operatorName: string;
  items: ReturnOrderItem[];
}

const DEMO_RETURN_ORDERS: ReturnOrderRecord[] = [
  {
    id: 1,
    returnNumber: "RTN-202610-001",
    soNumber: "SO-202610-001",
    customerName: "Minimarket Sumber Makmur BSD",
    customerCategory: "General Trade / Minimarket",
    returnDate: "2026-10-31",
    status: "QUARANTINE",
    disposition: null,
    totalValue: 64865,
    reason: "Kemasan basah dan bentuk es krim berubah (meleleh) akibat suhu showcase toko bermasalah.",
    operatorName: "Nadia Rahma",
    items: [
      {
        id: 101,
        productCode: "MIA-BLU-60",
        productName: "Blueberry Ice 60/114 (Miami)",
        batchNumber: "B-IVH-BLU-1026",
        condition: "MELTED",
        returnQtyPcs: 60,
        unitCost: 1081,
        totalCost: 64865,
        quarantineLocation: "KRN-01 / RAK-KARANTINA-A",
      },
    ],
  },
];

export default function ReturnsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [selectedSo, setSelectedSo] = useState("SO-202610-001");
  const [customerName, setCustomerName] = useState("Minimarket Sumber Makmur BSD");
  const [productId, setProductId] = useState("1");
  const [batchNumber, setBatchNumber] = useState("B-IVH-BLU-1026");
  const [returnQtyPcs, setReturnQtyPcs] = useState(60); // 1 Dus = 60 Pcs
  const [condition, setCondition] = useState<"MELTED" | "DAMAGED" | "NEAR_EXPIRED" | "WRONG_ITEM">("MELTED");
  const [reason, setReason] = useState("Es krim mengalami kenaikan suhu di showcase toko mitra sehingga mencair.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock list of returns (empty by default for clean testing)
  const [returnOrders, setReturnOrders] = useState<ReturnOrderRecord[]>([]);

  const getConditionBadge = (c: string) => {
    switch (c) {
      case "MELTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800">
            <Flame className="w-3 h-3 text-red-600" />
            Meleleh / Thermal Shock
          </span>
        );
      case "DAMAGED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Kemasan Rusak / Cacat
          </span>
        );
      case "NEAR_EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="w-3 h-3 text-yellow-600" />
            Mendekati Kedaluwarsa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <RotateCcw className="w-3 h-3 text-purple-600" />
            Salah Kirim Barang
          </span>
        );
    }
  };

  const getStatusBadge = (status: string, disposition?: string | null) => {
    if (status === "QUARANTINE") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
          <ShieldAlert className="w-3 h-3 text-amber-600" />
          DI ZONA KARANTINA
        </span>
      );
    } else if (status === "DISPOSED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          DISPOSISI SELESAI ({disposition})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
        {status}
      </span>
    );
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newRecord: ReturnOrderRecord = {
        id: returnOrders.length + 1,
        returnNumber: `RTN-202610-00${returnOrders.length + 1}`,
        soNumber: selectedSo,
        customerName: customerName,
        customerCategory: "Modern Trade / Supermarket",
        returnDate: "2026-10-31",
        status: "QUARANTINE",
        disposition: null,
        totalValue: returnQtyPcs * 3125,
        reason: reason,
        operatorName: "Nadia Rahma",
        items: [
          {
            id: 201,
            productCode: "ICR-001",
            productName: "Vanilla Bean Classic 100ml",
            batchNumber: batchNumber,
            condition: condition,
            returnQtyPcs: Number(returnQtyPcs),
            unitCost: 3125,
            totalCost: returnQtyPcs * 3125,
            quarantineLocation: "KRN-01 / RAK-KARANTINA-A",
          },
        ],
      };

      setReturnOrders([newRecord, ...returnOrders]);
      setIsSubmitting(false);
      setShowCreateModal(false);
      setSuccessMessage(
        `Retur ${newRecord.returnNumber} berhasil dicatat! Barang ditempatkan di zona KRN-01 (terisolasi dari stok aktif).`
      );
      setTimeout(() => setSuccessMessage(null), 6000);
    }, 600);
  };

  const filteredOrders = returnOrders.filter((order) => {
    const matchesSearch =
      order.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === "ALL" ||
      order.items.some((i) => i.condition === filterCondition);
    return matchesSearch && matchesCondition;
  });

  const totalQuarantineValue = returnOrders
    .filter((r) => r.status === "QUARANTINE")
    .reduce((sum, r) => sum + r.totalValue, 0);

  const totalQuarantinePcs = returnOrders
    .filter((r) => r.status === "QUARANTINE")
    .reduce(
      (sum, r) => sum + r.items.reduce((s, i) => s + i.returnQtyPcs, 0),
      0
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Penerimaan Retur Pelanggan & Karantina
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              Isolasi Mutu
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pencatatan pengembalian es krim leleh, rusak, atau salah kirim langsung ke ruang karantina bersuhu dingin guna mencegah kontaminasi stok aktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReturnOrders([])}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 font-medium text-xs transition cursor-pointer"
            title="Kosongkan daftar retur untuk simulasi dari nol"
          >
            Kosongkan Retur
          </button>
          <button
            onClick={() => setReturnOrders(DEMO_RETURN_ORDERS)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs transition cursor-pointer"
            title="Muat contoh es krim retur meleleh (Miami)"
          >
            Muat Contoh Retur
          </button>
          <Link
            href="/returns/disposition"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Disposisi &amp; Pemusnahan</span>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Retur Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Operasi Berhasil
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Item Menunggu di Karantina
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {totalQuarantinePcs} Pcs
          </p>
          <p className="text-xs text-amber-500 mt-1">
            Terisolasi di Rak KRN-01
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Valuasi Kerugian Karantina
            </span>
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            Rp {totalQuarantineValue.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-red-500 mt-1">
            Menunggu persetujuan write-off
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Lokasi Ruang Karantina
            </span>
            <Warehouse className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            KRN-01
          </p>
          <p className="text-xs text-cyan-600 mt-1 font-mono">
            Suhu Aman: -18.0°C s/d -10.0°C
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Alasan Terbanyak
            </span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            Meleleh (67%)
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Kendala suhu armada pengiriman
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari No. Retur, SO, atau Pelanggan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filter Kondisi:</span>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="ALL">Semua Kondisi</option>
              <option value="MELTED">Meleleh (Melted)</option>
              <option value="DAMAGED">Kemasan Rusak</option>
              <option value="WRONG_ITEM">Salah Kirim</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">No. Retur</th>
                <th className="py-3 px-4">Ref. Sales Order</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Item & Batch</th>
                <th className="py-3 px-4">Kondisi Barang</th>
                <th className="py-3 px-4">Lokasi Karantina</th>
                <th className="py-3 px-4 text-right">Qty (Pcs)</th>
                <th className="py-3 px-4 text-right">Nilai Modal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-gray-400">
                      <RotateCcw className="w-10 h-10 mb-2 stroke-1 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Tidak Ada Barang Retur Karantina
                      </p>
                      <p className="text-xs text-gray-400 mt-1 mb-4">
                        Daftar retur bersih untuk pengetesan alur karantina dan berita acara dari awal.
                      </p>
                      <button
                        onClick={() => setReturnOrders(DEMO_RETURN_ORDERS)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition cursor-pointer"
                      >
                        Muat Contoh Retur Es Krim Meleleh (Miami)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                const item = order.items[0];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {order.returnNumber}
                      <p className="text-[10px] text-gray-400 font-normal">
                        {order.returnDate}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">
                      {order.soNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {order.customerCategory}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {item.productName}
                      </p>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        Batch: {item.batchNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getConditionBadge(item.condition)}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                        {item.quarantineLocation}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      {item.returnQtyPcs} Pcs
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                      Rp {order.totalValue.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(order.status, order.disposition)}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Penerimaan Retur Pelanggan */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              Catat Penerimaan Retur ke Karantina
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Barang yang diretur akan otomatis dialokasikan ke rak freezer karantina (KRN-01) dan terisolasi dari inventaris siap jual.
            </p>

            <form onSubmit={handleCreateReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Sales Order Asal
                </label>
                <select
                  value={selectedSo}
                  onChange={(e) => {
                    setSelectedSo(e.target.value);
                    if (e.target.value === "SO-202610-001")
                      setCustomerName("PT Sumber Dingin Retail");
                    else if (e.target.value === "SO-202610-002")
                      setCustomerName("Toko Berkah Es Krim Segar");
                    else setCustomerName("Kios Es Krim Malioboro");
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SO-202610-001">SO-202610-001 (PT Sumber Dingin Retail)</option>
                  <option value="SO-202610-002">SO-202610-002 (Toko Berkah Es Krim)</option>
                  <option value="SO-202610-003">SO-202610-003 (Kios Es Krim Malioboro)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pelanggan
                </label>
                <input
                  type="text"
                  disabled
                  value={customerName}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Produk Es Krim
                  </label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="1">ICR-001 Vanilla Bean Classic</option>
                    <option value="2">ICR-002 Chocolate Fudge Bar</option>
                    <option value="3">ICR-003 Strawberry Swirl Cup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Batch
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kondisi Fisik Barang
                  </label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="MELTED">Meleleh (Melted / Thermal Shock)</option>
                    <option value="DAMAGED">Kemasan Rusak / Pecah</option>
                    <option value="WRONG_ITEM">Salah Kirim Varian</option>
                    <option value="NEAR_EXPIRED">Mendekati Kedaluwarsa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jumlah Retur (Satuan Pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={returnQtyPcs}
                    onChange={(e) => setReturnQtyPcs(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lokasi Rak Karantina (Terkunci Otomatis)
                </label>
                <input
                  type="text"
                  disabled
                  value="KRN-01 / RAK-KARANTINA-A (is_quarantine = TRUE)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alasan / Keterangan Masalah
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan ke Karantina"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

