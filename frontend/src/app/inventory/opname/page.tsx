"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Warehouse,
  Save,
  Check,
} from "lucide-react";

interface OpnameItem {
  id: number;
  productCode: string;
  productName: string;
  batchNumber: string;
  locationCode: string;
  systemQtyPcs: number;
  physicalQtyPcs: number;
  differencePcs: number;
  unitCost: number;
}

export default function StockOpnamePage() {
  const [opnameCode, setOpnameCode] = useState("OPN-202610-001");
  const [opnameDate, setOpnameDate] = useState("2026-10-31");
  const [status, setStatus] = useState<"COUNTING" | "POSTED">("COUNTING");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [items, setItems] = useState<OpnameItem[]>([
    {
      id: 1,
      productCode: "ICR-001",
      productName: "Vanilla Bean Classic 100ml",
      batchNumber: "B-VAN-1026",
      locationCode: "FRZ-A1 / RAK-02 / B-01",
      systemQtyPcs: 576,
      physicalQtyPcs: 576,
      differencePcs: 0,
      unitCost: 3125,
    },
    {
      id: 2,
      productCode: "ICR-002",
      productName: "Chocolate Fudge Bar 90ml",
      batchNumber: "B-CHO-1026",
      locationCode: "FRZ-B1 / RAK-03 / B-02",
      systemQtyPcs: 432,
      physicalQtyPcs: 428, // Selisih kurang 4 pcs (Susut)
      differencePcs: -4,
      unitCost: 3333,
    },
    {
      id: 3,
      productCode: "ICR-003",
      productName: "Strawberry Swirl Cup 100ml",
      batchNumber: "B-STR-1026",
      locationCode: "FRZ-A1 / RAK-01 / A-03",
      systemQtyPcs: 744,
      physicalQtyPcs: 746, // Selisih lebih 2 pcs (Surplus)
      differencePcs: 2,
      unitCost: 3000,
    },
    {
      id: 4,
      productCode: "ICR-004",
      productName: "Mango Sorbet Cup 120ml",
      batchNumber: "B-MNG-0926",
      locationCode: "FRZ-B2 / RAK-04 / C-01",
      systemQtyPcs: 1008,
      physicalQtyPcs: 1008,
      differencePcs: 0,
      unitCost: 3541,
    },
  ]);

  const handlePhysicalQtyChange = (id: number, val: number) => {
    if (status === "POSTED") return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const phys = Math.max(0, val);
          return {
            ...item,
            physicalQtyPcs: phys,
            differencePcs: phys - item.systemQtyPcs,
          };
        }
        return item;
      })
    );
  };

  const totalVarianceValue = items.reduce(
    (sum, item) => sum + item.differencePcs * item.unitCost,
    0
  );

  const totalShortagePcs = items
    .filter((i) => i.differencePcs < 0)
    .reduce((s, i) => s + Math.abs(i.differencePcs), 0);

  const totalSurplusPcs = items
    .filter((i) => i.differencePcs > 0)
    .reduce((s, i) => s + i.differencePcs, 0);

  const handlePostOpname = () => {
    setStatus("POSTED");
    setSuccessMessage(
      `Stock Opname ${opnameCode} berhasil disetujui & diposting! Saldo fisik telah disinkronisasi ke sistem dan Jurnal Penyesuaian Selisih Stok telah diterbitkan.`
    );
    setTimeout(() => setSuccessMessage(null), 8000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Stock Opname & Rekonsiliasi Fisik
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                status === "POSTED"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse"
              }`}
            >
              {status === "POSTED" ? "DIPOSTING KE BUKU BESAR" : "PROSES PENGHITUNGAN (COUNTING)"}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pencocokan antara saldo catatan sistem dan hasil hitung fisik es krim di ruang pendingin walk-in freezer beserta penerbitan jurnal selisih otomatis.
          </p>
        </div>

        {status === "COUNTING" && (
          <button
            type="button"
            onClick={handlePostOpname}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Posting & Terbitkan Jurnal Selisih
          </button>
        )}
      </div>

      {/* Alert Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Posting Opname Berhasil
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
              Dokumen Opname
            </span>
            <ClipboardList className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">
            {opnameCode}
          </p>
          <p className="text-xs text-gray-500 mt-1">Tanggal: {opnameDate}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Selisih Kurang (Susut)
            </span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">
            -{totalShortagePcs} Pcs
          </p>
          <p className="text-xs text-rose-500 mt-1">Diakui sebagai Beban 5203</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Selisih Lebih (Surplus)
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            +{totalSurplusPcs} Pcs
          </p>
          <p className="text-xs text-blue-500 mt-1">Penambahan Persediaan 1130</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Netto Valuasi Selisih
            </span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <p
            className={`text-2xl font-bold font-mono mt-1 ${
              totalVarianceValue < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            Rp {Math.abs(totalVarianceValue).toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalVarianceValue < 0 ? "Beban Susut Netto" : "Surplus Netto"}
          </p>
        </div>
      </div>

      {/* Main Table: Reconciliation Sheet */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Lembar Rekonsiliasi Kuantitas Fisik vs Sistem
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ketikkan hasil hitung fisik di kolom input untuk menghitung selisih kuantitas dan nilai moneter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Cocok
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Susut (Kurang)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Surplus (Lebih)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">SKU & Produk</th>
                <th className="py-3 px-4">Nomor Batch</th>
                <th className="py-3 px-4">Lokasi Rak Freezer</th>
                <th className="py-3 px-4 text-right">Stok Sistem (Pcs)</th>
                <th className="py-3 px-4 text-center">Hitung Fisik (Pcs)</th>
                <th className="py-3 px-4 text-right">Selisih (Pcs)</th>
                <th className="py-3 px-4 text-right">Nilai Selisih (Rp)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item) => {
                const isMatch = item.differencePcs === 0;
                const isDeficit = item.differencePcs < 0;
                const varianceCost = item.differencePcs * item.unitCost;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isMatch
                        ? "hover:bg-gray-50 dark:hover:bg-gray-750"
                        : isDeficit
                        ? "bg-rose-50/40 dark:bg-rose-950/20"
                        : "bg-blue-50/40 dark:bg-blue-950/20"
                    }`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {item.productCode}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {item.batchNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                        {item.locationCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                      {item.systemQtyPcs.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        disabled={status === "POSTED"}
                        value={item.physicalQtyPcs}
                        onChange={(e) =>
                          handlePhysicalQtyChange(item.id, Number(e.target.value))
                        }
                        className="w-24 px-2.5 py-1 text-center font-mono font-bold text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={
                          isMatch
                            ? "text-emerald-600"
                            : isDeficit
                            ? "text-rose-600"
                            : "text-blue-600"
                        }
                      >
                        {item.differencePcs > 0 ? `+${item.differencePcs}` : item.differencePcs} Pcs
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span
                        className={
                          isMatch
                            ? "text-gray-400"
                            : isDeficit
                            ? "text-rose-600 font-bold"
                            : "text-blue-600 font-bold"
                        }
                      >
                        {isMatch
                          ? "Rp 0"
                          : `${varianceCost > 0 ? "+" : ""}Rp ${Math.abs(varianceCost).toLocaleString("id-ID")}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isMatch ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Cocok
                        </span>
                      ) : isDeficit ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          Susut
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Surplus
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balanced Adjustment Journal Preview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              Ayat Jurnal Penyesuaian Otomatis (Balanced Opname Adjustment)
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
            Seimbang / Balanced (Debit = Kredit)
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Posting stock opname ini otomatis menyesuaikan saldo buku besar akun Persediaan (1130) dan mengakui selisih susut fisik ke akun Beban Selisih Stok (5203).
        </p>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-800 dark:text-gray-200">
              (D) 5203 - Beban Selisih Stok (Susut Opname Gudang)
            </span>
            <span className="font-bold text-rose-600">
              Rp {Math.abs(totalVarianceValue).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pl-4">
            <span className="text-gray-800 dark:text-gray-200">
              (K) 1130 - Persediaan Barang Dagang Es Krim
            </span>
            <span className="font-bold text-rose-600">
              Rp {Math.abs(totalVarianceValue).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

