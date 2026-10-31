"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Warehouse,
  Boxes,
  FileText,
  DollarSign,
  Scale,
  RefreshCw,
} from "lucide-react";

interface PickingItem {
  id: number;
  productCode: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  locationCode: string;
  requestedQty: number;
  uomName: string;
  baseQtyPcs: number;
  pickedQty: number;
  isPicked: boolean;
  unitCost: number;
  sellingPrice: number;
}

interface PickingListRecord {
  id: number;
  plNumber: string;
  soNumber: string;
  customerName: string;
  customerCategory: string;
  date: string;
  status: "DRAFT" | "DIPROSES" | "SELESAI" | "DIBATALKAN";
  pickerName: string;
  totalItems: number;
  pickedItems: number;
  items: PickingItem[];
}

export default function PickingListPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPL, setSelectedPL] = useState<PickingListRecord | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedSoId, setSelectedSoId] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock initial picking lists
  const [pickingLists, setPickingLists] = useState<PickingListRecord[]>([
    {
      id: 1,
      plNumber: "PL-202610-001",
      soNumber: "SO-202610-001",
      customerName: "PT Sumber Dingin Retail",
      customerCategory: "Modern Trade / Supermarket",
      date: "2026-10-31 09:30",
      status: "DIPROSES",
      pickerName: "Budi Santoso",
      totalItems: 3,
      pickedItems: 2,
      items: [
        {
          id: 101,
          productCode: "ICR-001",
          productName: "Vanilla Bean Classic 100ml",
          batchNumber: "B-VAN-1026",
          expiryDate: "2026-11-12",
          daysToExpiry: 12,
          locationCode: "FRZ-A / RAK-02 / B-01",
          requestedQty: 10,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 240,
          pickedQty: 10,
          isPicked: true,
          unitCost: 75000,
          sellingPrice: 120000,
        },
        {
          id: 102,
          productCode: "ICR-002",
          productName: "Chocolate Fudge Bar 90ml",
          batchNumber: "B-CHO-1026",
          expiryDate: "2026-11-21",
          daysToExpiry: 21,
          locationCode: "FRZ-B / RAK-03 / B-02",
          requestedQty: 8,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 192,
          pickedQty: 8,
          isPicked: true,
          unitCost: 80000,
          sellingPrice: 130000,
        },
        {
          id: 103,
          productCode: "ICR-003",
          productName: "Strawberry Swirl Cup 100ml",
          batchNumber: "B-STR-1026",
          expiryDate: "2026-11-27",
          daysToExpiry: 27,
          locationCode: "FRZ-A / RAK-01 / A-03",
          requestedQty: 5,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 120,
          pickedQty: 0,
          isPicked: false,
          unitCost: 72000,
          sellingPrice: 115000,
        },
      ],
    },
    {
      id: 2,
      plNumber: "PL-202610-002",
      soNumber: "SO-202610-002",
      customerName: "Toko Berkah Es Krim Segar",
      customerCategory: "Agen / Grosir",
      date: "2026-10-31 10:15",
      status: "DRAFT",
      pickerName: "Belum Ditugaskan",
      totalItems: 2,
      pickedItems: 0,
      items: [
        {
          id: 201,
          productCode: "ICR-004",
          productName: "Mango Sorbet Cup 120ml",
          batchNumber: "B-MNG-0926",
          expiryDate: "2026-12-15",
          daysToExpiry: 45,
          locationCode: "FRZ-B / RAK-04 / C-01",
          requestedQty: 15,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 360,
          pickedQty: 0,
          isPicked: false,
          unitCost: 85000,
          sellingPrice: 135000,
        },
        {
          id: 202,
          productCode: "ICR-005",
          productName: "Cookies & Cream Pint 100ml",
          batchNumber: "B-COO-0926",
          expiryDate: "2027-01-20",
          daysToExpiry: 81,
          locationCode: "FRZ-A / RAK-04 / A-02",
          requestedQty: 12,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 288,
          pickedQty: 0,
          isPicked: false,
          unitCost: 90000,
          sellingPrice: 145000,
        },
      ],
    },
    {
      id: 3,
      plNumber: "PL-202610-003",
      soNumber: "SO-202610-003",
      customerName: "Kios Es Krim Malioboro",
      customerCategory: "General Trade / Warung",
      date: "2026-10-30 16:40",
      status: "SELESAI",
      pickerName: "Ahmad Riyadi",
      totalItems: 1,
      pickedItems: 1,
      items: [
        {
          id: 301,
          productCode: "ICR-001",
          productName: "Vanilla Bean Classic 100ml",
          batchNumber: "B-VAN-0926",
          expiryDate: "2026-11-10",
          daysToExpiry: 10,
          locationCode: "FRZ-A / RAK-02 / B-01",
          requestedQty: 5,
          uomName: "DUS (24 Pcs)",
          baseQtyPcs: 120,
          pickedQty: 5,
          isPicked: true,
          unitCost: 75000,
          sellingPrice: 125000,
        },
      ],
    },
  ]);

  const activePL = selectedPL || pickingLists[0];

  const getUrgencyBadge = (days: number) => {
    if (days <= 30) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          Kritis ({days} Hari)
        </span>
      );
    } else if (days <= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-600" />
          Prioritas FEFO ({days} Hari)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Aman ({days} Hari)
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            DRAFT
          </span>
        );
      case "DIPROSES":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 animate-pulse">
            SEDANG DIPILIH
          </span>
        );
      case "SELESAI":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            SELESAI
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800">
            {status}
          </span>
        );
    }
  };

  const handleToggleItemPicked = (itemId: number) => {
    if (!activePL || activePL.status === "SELESAI") return;

    const updatedItems = activePL.items.map((item) => {
      if (item.id === itemId) {
        const nextState = !item.isPicked;
        return {
          ...item,
          isPicked: nextState,
          pickedQty: nextState ? item.requestedQty : 0,
        };
      }
      return item;
    });

    const pickedCount = updatedItems.filter((i) => i.isPicked).length;
    const updatedPL: PickingListRecord = {
      ...activePL,
      items: updatedItems,
      pickedItems: pickedCount,
      status: pickedCount === updatedItems.length ? "SELESAI" : "DIPROSES",
    };

    setSelectedPL(updatedPL);
    setPickingLists((prev) =>
      prev.map((pl) => (pl.id === updatedPL.id ? updatedPL : pl))
    );
  };

  const handleCompletePicking = () => {
    if (!activePL) return;
    const updatedPL: PickingListRecord = {
      ...activePL,
      status: "SELESAI",
      items: activePL.items.map((i) => ({
        ...i,
        isPicked: true,
        pickedQty: i.requestedQty,
      })),
      pickedItems: activePL.items.length,
    };
    setSelectedPL(updatedPL);
    setPickingLists((prev) =>
      prev.map((pl) => (pl.id === updatedPL.id ? updatedPL : pl))
    );
    setSuccessMessage(
      `Picking List ${activePL.plNumber} berhasil diselesaikan! Stok reservasi dipotong dan jurnal HPP otomatis diterbitkan.`
    );
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  // Hitung total finansial picking untuk preview jurnal
  const totalCost = activePL.items.reduce(
    (sum, item) => sum + item.requestedQty * item.unitCost,
    0
  );
  const totalRevenue = activePL.items.reduce(
    (sum, item) => sum + item.requestedQty * item.sellingPrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Picking List FEFO Rantai Dingin
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
              Ambisius FEFO Engine
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pengambilan es krim berbasis First-Expired First-Out dengan panduan lokasi rak freezer dan jurnal otomatis terintegrasi.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate Picking dari SO
        </button>
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

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Picking Aktif
            </span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {pickingLists.filter((p) => p.status !== "SELESAI").length} Dokumen
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Siap dialokasikan ke staf picker
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Batch Kritis (&lt; 30 Hari)
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            3 Batch
          </p>
          <p className="text-xs text-red-500 mt-1">
            Prioritas utama keluar sebelum kedaluwarsa
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Kepatuhan FEFO
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            100%
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Algoritma otomatis mengunci batch terlama
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Valuasi HPP Dipick
            </span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            Rp {(totalCost).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-purple-500 mt-1">
            Nilai keluar dari akun 1130
          </p>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Picking Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                Daftar Dokumen Picking
              </h2>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                {pickingLists.length} item
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari No. PL atau SO..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-y-auto max-h-[600px]">
            {pickingLists
              .filter(
                (pl) =>
                  pl.plNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pl.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pl.customerName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pl) => {
                const isSelected = activePL.id === pl.id;
                return (
                  <div
                    key={pl.id}
                    onClick={() => setSelectedPL(pl)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50/60 dark:bg-blue-950/30 border-l-4 border-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-750"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {pl.plNumber}
                      </span>
                      {getStatusBadge(pl.status)}
                    </div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 truncate">
                      {pl.customerName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-mono text-[11px]">{pl.soNumber}</span>
                      <span>
                        {pl.pickedItems}/{pl.totalItems} Selesai
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(pl.pickedItems / pl.totalItems) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Column: Picking Execution & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card for Active Picking List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                    {activePL.plNumber}
                  </h3>
                  {getStatusBadge(activePL.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>
                    No. Ref SO: <b className="text-gray-800 dark:text-gray-200">{activePL.soNumber}</b>
                  </span>
                  <span>•</span>
                  <span>
                    Pelanggan: <b className="text-gray-800 dark:text-gray-200">{activePL.customerName}</b>
                  </span>
                  <span>•</span>
                  <span>
                    Petugas: <b className="text-gray-800 dark:text-gray-200">{activePL.pickerName}</b>
                  </span>
                </div>
              </div>

              {activePL.status !== "SELESAI" && (
                <button
                  onClick={handleCompletePicking}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Selesai Picking
                </button>
              )}
            </div>

            {/* Instruction Banner */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
              <span className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                Ambil es krim langsung dari rak freezer sesuai urutan FEFO di bawah untuk mencegah penyusutan kedaluwarsa.
              </span>
              <span className="font-semibold font-mono">
                {activePL.pickedItems} dari {activePL.totalItems} Item Siap
              </span>
            </div>

            {/* FEFO Items Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Produk</th>
                    <th className="py-2.5 px-3">Nomor Batch</th>
                    <th className="py-2.5 px-3">Lokasi Freezer</th>
                    <th className="py-2.5 px-3">Kedaluwarsa (FEFO)</th>
                    <th className="py-2.5 px-3 text-right">Qty Diambil</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {activePL.items.map((item) => (
                    <tr
                      key={item.id}
                      className={`${
                        item.isPicked
                          ? "bg-emerald-50/40 dark:bg-emerald-950/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                    >
                      <td className="py-3 px-3">
                        {item.isPicked ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            Dipick
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs">
                            <Clock className="w-4 h-4" />
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {item.productCode}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {item.batchNumber}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                          <Warehouse className="w-3 h-3 text-cyan-600" />
                          {item.locationCode}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-mono text-gray-800 dark:text-gray-200">
                            {item.expiryDate}
                          </p>
                          <div className="mt-0.5">{getUrgencyBadge(item.daysToExpiry)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.requestedQty} {item.uomName}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          ({item.baseQtyPcs} Pcs)
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleItemPicked(item.id)}
                          disabled={activePL.status === "SELESAI"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            item.isPicked
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } disabled:opacity-50`}
                        >
                          {item.isPicked ? "Batal Pick" : "Ambil Barang"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Automated Balanced Accounting Card (Dual Journals Outbound) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  Preview Jurnal Otomatis (Dual Balanced Double-Entry Outbound)
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Seimbang / Balanced (Debit = Kredit)
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Saat pengiriman/picking selesai, sistem langsung membukukan HPP berdasarkan metode FIFO/FEFO aktual serta pendapatan penjualan secara real-time.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Journal 1: Pengakuan Pendapatan & Piutang */}
              <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  1. Jurnal Penjualan & Piutang Usaha
                </p>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-gray-800 dark:text-gray-200">
                    <span>(D) 1120 - Piutang Usaha</span>
                    <span className="font-bold text-emerald-600">
                      Rp {totalRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-800 dark:text-gray-200 pl-4">
                    <span>(K) 4101 - Pendapatan Penjualan Es Krim</span>
                    <span className="font-bold text-emerald-600">
                      Rp {totalRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Journal 2: Pengakuan Beban Pokok Penjualan (COGS / HPP) */}
              <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  2. Jurnal Beban Pokok Penjualan (HPP FEFO)
                </p>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-gray-800 dark:text-gray-200">
                    <span>(D) 5101 - Beban Pokok Penjualan (HPP)</span>
                    <span className="font-bold text-purple-600">
                      Rp {totalCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-800 dark:text-gray-200 pl-4">
                    <span>(K) 1130 - Persediaan Barang Dagang Es Krim</span>
                    <span className="font-bold text-purple-600">
                      Rp {totalCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Estimasi Margin Bruto:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Rp {(totalRevenue - totalCost).toLocaleString("id-ID")} (
                {Math.round(((totalRevenue - totalCost) / totalRevenue) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Generate Picking dari Sales Order */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Generate Picking List FEFO
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Pilih pesanan penjualan (SO) yang telah disetujui. Mesin algoritma FEFO akan secara otomatis mengunci batch terdekat kedaluwarsa beserta lokasi rak freezer.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pilih Sales Order (Approved)
                </label>
                <select
                  value={selectedSoId}
                  onChange={(e) => setSelectedSoId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Sales Order --</option>
                  <option value="1">SO-202610-001 (PT Sumber Dingin Retail)</option>
                  <option value="2">SO-202610-002 (Toko Berkah Es Krim)</option>
                  <option value="4">SO-202610-004 (Distribusi Modern Makmur)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tugaskan Staf Picker
                </label>
                <select className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="budi">Budi Santoso (Zona Freezer A)</option>
                  <option value="ahmad">Ahmad Riyadi (Zona Freezer B)</option>
                  <option value="siti">Siti Rahmawati (Semua Zona)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowGenerateModal(false);
                  setSuccessMessage(
                    "Picking list baru berhasil dibuat dengan rekomendasi batch FEFO!"
                  );
                  setTimeout(() => setSuccessMessage(null), 5000);
                }}
                disabled={!selectedSoId}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
              >
                Proses Picking List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

