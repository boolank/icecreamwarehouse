"use client";

import React, { useState } from "react";
import {
  Boxes,
  Search,
  Filter,
  Layers,
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Warehouse,
  DollarSign,
  TrendingUp,
  Download,
} from "lucide-react";

interface StockRecord {
  id: number;
  sku: string;
  name: string;
  category: string;
  batchNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  locationCode: string;
  zone: string;
  temperature: string;
  baseQtyPcs: number; // 1 Base UOM = Pcs
  conversionFactorDus: number; // 24 Pcs = 1 Dus
  conversionFactorPack: number; // 6 Pcs = 1 Pack
  unitCostPcs: number;
}

const INITIAL_MIAMI_STOCKS: StockRecord[] = [
  {
    id: 1,
    sku: "MIA-BLU-60",
    name: "Blueberry Ice 60/114 (Miami)",
    category: "Stick/Bar",
    batchNumber: "B-IVH-BLU-1026",
    expiryDate: "2027-10-25",
    daysToExpiry: 355,
    locationCode: "FRZ-A1 / RAK-01 / A-01",
    zone: "Zona A",
    temperature: "-21.4°C",
    baseQtyPcs: 1500, // 25 Dus
    conversionFactorDus: 60,
    conversionFactorPack: 10,
    unitCostPcs: 1081,
  },
  {
    id: 2,
    sku: "MIA-CRN-40",
    name: "Choco Corn 40/140 (Miami)",
    category: "Cone",
    batchNumber: "B-IVH-CRN-1026",
    expiryDate: "2027-10-26",
    daysToExpiry: 356,
    locationCode: "FRZ-A1 / RAK-02 / B-01",
    zone: "Zona A",
    temperature: "-21.4°C",
    baseQtyPcs: 3000, // 75 Dus
    conversionFactorDus: 40,
    conversionFactorPack: 10,
    unitCostPcs: 1441,
  },
  {
    id: 3,
    sku: "MIA-GLD-40",
    name: "Golden Corn 40/140 (Miami)",
    category: "Cone",
    batchNumber: "B-IVH-GLD-1026",
    expiryDate: "2027-10-26",
    daysToExpiry: 356,
    locationCode: "FRZ-B1 / RAK-01 / A-02",
    zone: "Zona B",
    temperature: "-20.8°C",
    baseQtyPcs: 3200, // 80 Dus
    conversionFactorDus: 40,
    conversionFactorPack: 10,
    unitCostPcs: 1441,
  },
  {
    id: 4,
    sku: "MIA-DBC-40",
    name: "Double Crumble Cho - Isi 40 (Miami)",
    category: "Stick/Bar",
    batchNumber: "B-IVH-DBC-1026",
    expiryDate: "2027-10-25",
    daysToExpiry: 355,
    locationCode: "FRZ-B1 / RAK-02 / B-02",
    zone: "Zona B",
    temperature: "-20.8°C",
    baseQtyPcs: 1000, // 25 Dus
    conversionFactorDus: 40,
    conversionFactorPack: 10,
    unitCostPcs: 2162,
  },
  {
    id: 5,
    sku: "MIA-DUR-60",
    name: "King Durian 60 (Miami)",
    category: "Stick/Bar",
    batchNumber: "B-IVH-DUR-1026",
    expiryDate: "2026-11-20", // Batch mendekati kedaluwarsa untuk tes FEFO!
    daysToExpiry: 16,
    locationCode: "FRZ-A2 / RAK-03 / A-01",
    zone: "Zona A",
    temperature: "-21.2°C",
    baseQtyPcs: 1500, // 25 Dus
    conversionFactorDus: 60,
    conversionFactorPack: 10,
    unitCostPcs: 991,
  },
  {
    id: 6,
    sku: "MIA-MIC-24",
    name: "Micro Cone 24 (Miami)",
    category: "Cone",
    batchNumber: "B-IVH-MIC-1026",
    expiryDate: "2027-10-25",
    daysToExpiry: 355,
    locationCode: "FRZ-B2 / RAK-01 / C-01",
    zone: "Zona B",
    temperature: "-21.0°C",
    baseQtyPcs: 600, // 25 Dus
    conversionFactorDus: 24,
    conversionFactorPack: 6,
    unitCostPcs: 2703,
  },
];

export default function RealTimeStocksPage() {
  const [stocks, setStocks] = useState<StockRecord[]>(INITIAL_MIAMI_STOCKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("ALL");
  const [uomMode, setUomMode] = useState<"BREAKDOWN" | "BASE" | "ESTIMATED_DUS">("BREAKDOWN");

  const filteredStocks = stocks.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === "ALL" || item.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const totalPcs = filteredStocks.reduce((s, i) => s + i.baseQtyPcs, 0);
  const totalValuation = filteredStocks.reduce(
    (s, i) => s + i.baseQtyPcs * i.unitCostPcs,
    0
  );
  const criticalBatches = filteredStocks.filter((i) => i.daysToExpiry <= 30).length;

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

  const renderQty = (item: StockRecord) => {
    if (uomMode === "BASE") {
      return (
        <div>
          <span className="font-bold text-gray-900 dark:text-white font-mono text-sm">
            {item.baseQtyPcs.toLocaleString("id-ID")}
          </span>
          <span className="text-xs text-gray-400 ml-1">PCS</span>
        </div>
      );
    } else if (uomMode === "ESTIMATED_DUS") {
      const dus = (item.baseQtyPcs / item.conversionFactorDus).toFixed(1);
      return (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">
            {dus}
          </span>
          <span className="text-xs text-gray-400 ml-1">DUS</span>
        </div>
      );
    } else {
      // BREAKDOWN: "X Dus Y Pack Z Pcs"
      const dus = Math.floor(item.baseQtyPcs / item.conversionFactorDus);
      const remainderDus = item.baseQtyPcs % item.conversionFactorDus;
      const pack = Math.floor(remainderDus / item.conversionFactorPack);
      const pcs = remainderDus % item.conversionFactorPack;

      return (
        <div className="font-mono text-xs">
          <span className="font-bold text-gray-900 dark:text-white">
            {dus} Dus
          </span>
          {pack > 0 && (
            <span className="text-gray-600 dark:text-gray-300 ml-1">
              {pack} Pack
            </span>
          )}
          {pcs > 0 && (
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              {pcs} Pcs
            </span>
          )}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Stok Real-Time Rantai Dingin
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Live FEFO Grid
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pemantauan saldo fisik persediaan es krim per nomor batch, lokasi rak pendingin, dan pengalih visual satuan multi-UOM instan.
          </p>
        </div>

        {/* Action Controls & Multi-UOM Segmented Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStocks([])}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 font-medium text-xs transition cursor-pointer"
              title="Kosongkan stok untuk simulasi kondisi awal sebelum penerimaan barang"
            >
              Kosongkan Stok (Pra-Inbound)
            </button>
            <button
              type="button"
              onClick={() => setStocks(INITIAL_MIAMI_STOCKS)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs transition cursor-pointer"
              title="Muat stok pasokan es krim Miami hasil penerimaan PO-DIS10114"
            >
              Muat Stok PO-DIS10114
            </button>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              type="button"
              onClick={() => setUomMode("BREAKDOWN")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                uomMode === "BREAKDOWN"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Tampilan Terurai (Dus/Pack/Pcs)
            </button>
            <button
              type="button"
              onClick={() => setUomMode("BASE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                uomMode === "BASE"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Standarisasi Base (Pcs)
            </button>
            <button
              type="button"
              onClick={() => setUomMode("ESTIMATED_DUS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                uomMode === "ESTIMATED_DUS"
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              Estimasi Total Dus
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Fisik Tersedia
            </span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalPcs.toLocaleString("id-ID")} Pcs
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Setara {(totalPcs / 24).toFixed(0)} Dus Besar
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Valuasi Persediaan
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {totalValuation.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Saldo Buku Besar Akun 1130
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Batch Kritis (&lt; 30 Hari)
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {criticalBatches} Batch
          </p>
          <p className="text-xs text-rose-500 mt-1">
            Prioritas pengeluaran FEFO
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Suhu Rata-Rata Gudang
            </span>
            <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
            -21.4°C
          </p>
          <p className="text-xs text-cyan-600 mt-1">
            Standar Rantai Dingin Optimal
          </p>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari SKU, nama produk, atau nomor batch..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filter Zona:</span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            >
              <option value="ALL">Semua Zona Freezer</option>
              <option value="Zona A">Zona A (Walk-in Utama)</option>
              <option value="Zona B">Zona B (Penyimpanan Dalam)</option>
              <option value="Zona C">Zona C (Buffer)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">SKU & Produk</th>
                <th className="py-3 px-4">Nomor Batch</th>
                <th className="py-3 px-4">Lokasi Rak Freezer</th>
                <th className="py-3 px-4">Suhu Ruang</th>
                <th className="py-3 px-4">Kedaluwarsa (FEFO)</th>
                <th className="py-3 px-4 text-right">Kuantitas Stok</th>
                <th className="py-3 px-4 text-right">Modal / Pcs</th>
                <th className="py-3 px-4 text-right">Total Valuasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-gray-400">
                      <Boxes className="w-10 h-10 mb-2 stroke-1 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Gudang Kosong / Belum Ada Stok Pasokan
                      </p>
                      <p className="text-xs text-gray-400 mt-1 mb-4">
                        Stok awal kosong untuk simulasi alur bisnis pra-inbound. Lakukan penerimaan barang di Inbound QC atau muat stok PO-DIS10114.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStocks(INITIAL_MIAMI_STOCKS)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer"
                      >
                        Muat Stok Masuk PO-DIS10114 (560 Dus)
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStocks.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] text-gray-400">
                        {item.sku}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-700 text-gray-500">
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      <Warehouse className="w-3 h-3 text-cyan-600" />
                      {item.locationCode}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-emerald-600 font-bold">
                      {item.temperature}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-mono text-gray-800 dark:text-gray-200">
                        {item.expiryDate}
                      </p>
                      <div className="mt-0.5">{getUrgencyBadge(item.daysToExpiry)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {renderQty(item)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-400">
                    Rp {item.unitCostPcs.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                    Rp {(item.baseQtyPcs * item.unitCostPcs).toLocaleString("id-ID")}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

