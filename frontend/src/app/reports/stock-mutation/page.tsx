"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Filter,
  Calendar,
  Download,
  Printer,
  Package,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Warehouse,
  ThermometerSnowflake,
} from "lucide-react";

interface StockMutationRecord {
  id: number;
  productCode: string;
  productName: string;
  batchNumber: string;
  expiredDate: string;
  locationCode: string;
  initialStockDus: number;
  initialStockPcs: number;
  inflowDus: number;
  inflowPcs: number;
  inflowDesc: string;
  outflowDus: number;
  outflowPcs: number;
  outflowDesc: string;
  endingStockDus: number;
  endingStockPcs: number;
  hppPerPcs: number;
  endingValuation: number;
}

export default function StockMutationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [uomMode, setUomMode] = useState<"MULTI" | "BASE">("MULTI");

  const records: StockMutationRecord[] = [
    {
      id: 1,
      productCode: "IC-MAG-001",
      productName: "Magnum Classic Chocolate 90ml",
      batchNumber: "BCH-202610-001",
      expiredDate: "2027-10-15",
      locationCode: "FREEZER-01-A1",
      initialStockDus: 0,
      initialStockPcs: 0,
      inflowDus: 25,
      inflowPcs: 600,
      inflowDesc: "Penerimaan PO-202610-001",
      outflowDus: 10,
      outflowPcs: 240,
      outflowDesc: "Pengeluaran SO-202610-001",
      endingStockDus: 15,
      endingStockPcs: 360,
      hppPerPcs: 14500,
      endingValuation: 5220000,
    },
    {
      id: 2,
      productCode: "IC-COR-002",
      productName: "Cornetto Oreo Disc 110ml",
      batchNumber: "BCH-202610-002",
      expiredDate: "2027-08-20",
      locationCode: "FREEZER-01-B1",
      initialStockDus: 10,
      initialStockPcs: 240,
      inflowDus: 20,
      inflowPcs: 480,
      inflowDesc: "Penerimaan PO-202610-002",
      outflowDus: 5,
      outflowPcs: 120,
      outflowDesc: "Pengeluaran SO-202610-002",
      endingStockDus: 25,
      endingStockPcs: 600,
      hppPerPcs: 9200,
      endingValuation: 5520000,
    },
    {
      id: 3,
      productCode: "IC-PAD-003",
      productName: "Paddle Pop Rainbow Fun 60ml",
      batchNumber: "BCH-202610-003",
      expiredDate: "2027-06-10",
      locationCode: "FREEZER-02-A1",
      initialStockDus: 30,
      initialStockPcs: 1440,
      inflowDus: 0,
      inflowPcs: 0,
      inflowDesc: "-",
      outflowDus: 8,
      outflowPcs: 384,
      outflowDesc: "Pengeluaran SO-202610-003",
      endingStockDus: 22,
      endingStockPcs: 1056,
      hppPerPcs: 4100,
      endingValuation: 4329600,
    },
    {
      id: 4,
      productCode: "IC-FEA-004",
      productName: "Feast Coklat Double Crunch 65ml",
      batchNumber: "BCH-202610-004",
      expiredDate: "2027-05-12",
      locationCode: "FREEZER-02-B1",
      initialStockDus: 15,
      initialStockPcs: 360,
      inflowDus: 0,
      inflowPcs: 0,
      inflowDesc: "-",
      outflowDus: 2,
      outflowPcs: 48,
      outflowDesc: "Penyesuaian Opname Susut (OPN-202610-001)",
      endingStockDus: 13,
      endingStockPcs: 312,
      hppPerPcs: 5000,
      endingValuation: 1560000,
    },
    {
      id: 5,
      productCode: "IC-MAG-001",
      productName: "Magnum Classic Chocolate 90ml (Karantina)",
      batchNumber: "BCH-202610-001",
      expiredDate: "2027-10-15",
      locationCode: "KRN-01",
      initialStockDus: 0,
      initialStockPcs: 0,
      inflowDus: 2,
      inflowPcs: 48,
      inflowDesc: "Retur Pelanggan RET-202610-001",
      outflowDus: 2,
      outflowPcs: 48,
      outflowDesc: "Pemusnahan Spoilage (BA-SPOIL-202610-001)",
      endingStockDus: 0,
      endingStockPcs: 0,
      hppPerPcs: 14500,
      endingValuation: 0,
    },
  ];

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = locationFilter === "ALL" || r.locationCode.includes(locationFilter);
    return matchesSearch && matchesLoc;
  });

  const totalEndingValuation = filteredRecords.reduce((s, r) => s + r.endingValuation, 0);
  const totalEndingPcs = filteredRecords.reduce((s, r) => s + r.endingStockPcs, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Laporan Mutasi Persediaan & Kartu Stok
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Riwayat Arus Masuk, Keluar, Saldo Akhir & Valuasi Stok Es Krim Per Batch FEFO
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Multi-UOM Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setUomMode("MULTI")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                uomMode === "MULTI"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Multi-UOM (Dus)
            </button>
            <button
              onClick={() => setUomMode("BASE")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                uomMode === "BASE"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Base Unit (Pcs)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak
          </button>
          <button
            onClick={() => alert("Mengunduh Laporan Mutasi Stok format Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Valuation Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Unit Tersedia
            </p>
            <p className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {totalEndingPcs.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-slate-500">PCS</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Valuasi Persediaan (COA 1130)
            </p>
            <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              Rp {totalEndingValuation.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400">
            <ThermometerSnowflake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Integritas Cold Chain
            </p>
            <p className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
              Suhu Gudang: -22.4&deg;C (Aman &le; -18&deg;C)
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari SKU, nama produk, batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Lokasi Rak / Freezer</option>
              <option value="FREEZER-01">Freezer 01 (Deep Freezer A & B)</option>
              <option value="FREEZER-02">Freezer 02 (Deep Freezer C & D)</option>
              <option value="KRN-01">KRN-01 (Karantina Retur)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Formula: <span className="font-semibold text-slate-800 dark:text-slate-200">Awal + Masuk - Keluar = Akhir</span>
        </div>
      </div>

      {/* Main Stock Mutation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Produk & Batch</th>
                <th className="py-3 px-3 w-28">Lokasi Rak</th>
                <th className="py-3 px-3 w-28 text-right">Saldo Awal</th>
                <th className="py-3 px-3 w-40 text-right">Masuk (Inflow)</th>
                <th className="py-3 px-3 w-40 text-right">Keluar (Outflow)</th>
                <th className="py-3 px-3 w-32 text-right">Saldo Akhir</th>
                <th className="py-3 px-3 w-32 text-right">Valuasi (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRecords.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {row.productName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-slate-400">{row.productCode}</span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-700">&bull;</span>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {row.batchNumber}
                      </span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-700">&bull;</span>
                      <span className="text-[10px] text-slate-500">Exp: {row.expiredDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.locationCode === "KRN-01"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {row.locationCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    {uomMode === "MULTI"
                      ? `${row.initialStockDus} Dus`
                      : `${row.initialStockPcs} Pcs`}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {uomMode === "MULTI"
                        ? `+${row.inflowDus} Dus`
                        : `+${row.inflowPcs} Pcs`}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px] ml-auto">
                      {row.inflowDesc}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      {uomMode === "MULTI"
                        ? `-${row.outflowDus} Dus`
                        : `-${row.outflowPcs} Pcs`}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px] ml-auto">
                      {row.outflowDesc}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-white tabular-nums">
                    {uomMode === "MULTI"
                      ? `${row.endingStockDus} Dus (${row.endingStockPcs} Pcs)`
                      : `${row.endingStockPcs} Pcs`}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    Rp {row.endingValuation.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold">
                <td colSpan={5} className="py-3.5 px-3 text-slate-900 dark:text-white uppercase tracking-wider text-right">
                  Total Nilai Buku Persediaan Gudang (FEFO):
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-sm text-slate-900 dark:text-white font-black">
                  {totalEndingPcs.toLocaleString("id-ID")} PCS
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-sm text-emerald-600 dark:text-emerald-400 font-black">
                  Rp {totalEndingValuation.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

