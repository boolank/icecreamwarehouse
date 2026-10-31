"use client";

import React, { useState } from "react";
import {
  Split,
  Boxes,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Warehouse,
  History,
  Scale,
  DollarSign,
  HelpCircle,
  ThermometerSnowflake,
} from "lucide-react";

interface BreakdownHistory {
  id: number;
  transactionNumber: string;
  date: string;
  productName: string;
  productCode: string;
  sourceBatchNumber: string;
  sourceQty: number;
  sourceUom: string;
  sourceLocation: string;
  targetQty: number;
  targetUom: string;
  targetLocation: string;
  conversionRatio: number;
  totalValuationRp: number;
  operatorName: string;
  notes: string;
}

export default function BreakdownUomPage() {
  const [selectedProductId, setSelectedProductId] = useState("1");
  const [sourceBatch, setSourceBatch] = useState("B-VAN-1026");
  const [sourceQty, setSourceQty] = useState(2);
  const [targetLocation, setTargetLocation] = useState("FRZ-A / RAK-01 / A-01");
  const [notes, setNotes] = useState("Kebutuhan pemenuhan pesanan eceran General Trade / Kios");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock list of breakdown history
  const [historyList, setHistoryList] = useState<BreakdownHistory[]>([
    {
      id: 1,
      transactionNumber: "BD-202610-001",
      date: "2026-10-31 08:45",
      productName: "Vanilla Bean Classic 100ml",
      productCode: "ICR-001",
      sourceBatchNumber: "B-VAN-1026",
      sourceQty: 3,
      sourceUom: "DUS",
      sourceLocation: "FRZ-A / RAK-02 / B-01",
      targetQty: 72,
      targetUom: "PCS",
      targetLocation: "FRZ-A / RAK-01 / A-01",
      conversionRatio: 24,
      totalValuationRp: 225000,
      operatorName: "Nadia Rahma",
      notes: "Persiapan pesanan eceran Kios Malioboro",
    },
    {
      id: 2,
      transactionNumber: "BD-202610-002",
      date: "2026-10-30 14:15",
      productName: "Chocolate Fudge Bar 90ml",
      productCode: "ICR-002",
      sourceBatchNumber: "B-CHO-1026",
      sourceQty: 2,
      sourceUom: "DUS",
      sourceLocation: "FRZ-B / RAK-03 / B-02",
      targetQty: 48,
      targetUom: "PCS",
      targetLocation: "FRZ-B / RAK-01 / C-01",
      conversionRatio: 24,
      totalValuationRp: 160000,
      operatorName: "Budi Santoso",
      notes: "Pemecahan karton untuk display outlet",
    },
  ]);

  // Kalkulasi form aktif
  const conversionFactor = 24; // 1 Dus = 24 Pcs
  const calculatedPcs = (sourceQty || 0) * conversionFactor;
  const unitCostPerDus = 75000;
  const unitCostPerPcs = unitCostPerDus / conversionFactor; // Rp 3.125
  const totalValuation = (sourceQty || 0) * unitCostPerDus;

  const handleSubmitBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceQty <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRecord: BreakdownHistory = {
        id: historyList.length + 1,
        transactionNumber: `BD-202610-00${historyList.length + 1}`,
        date: "2026-10-31 11:50",
        productName: "Vanilla Bean Classic 100ml",
        productCode: "ICR-001",
        sourceBatchNumber: sourceBatch,
        sourceQty: sourceQty,
        sourceUom: "DUS",
        sourceLocation: "FRZ-A / RAK-02 / B-01",
        targetQty: calculatedPcs,
        targetUom: "PCS",
        targetLocation: targetLocation,
        conversionRatio: conversionFactor,
        totalValuationRp: totalValuation,
        operatorName: "Nadia Rahma",
        notes: notes,
      };

      setHistoryList([newRecord, ...historyList]);
      setIsSubmitting(false);
      setSuccessMessage(
        `Sukses melakukan breakdown ${sourceQty} Dus menjadi ${calculatedPcs} Pcs! Integritas batch (${sourceBatch}) dan valuasi persediaan Rp ${totalValuation.toLocaleString("id-ID")} terjaga utuh.`
      );
      setSourceQty(1);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Breakdown & Repacking Satuan (UOM)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              Multi-UOM Engine
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pecah satuan kemasan besar (Dus/Karton) menjadi satuan terkecil (Pcs) secara instan tanpa mengubah total valuasi nominal persediaan.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-medium">
          <ThermometerSnowflake className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span>Proses di Ante-Room (Suhu Dingin Terjaga)</span>
        </div>
      </div>

      {/* Alert Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Konversi Satuan Berhasil
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Dus Dipecah Bulan Ini
            </span>
            <Split className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {historyList.reduce((sum, h) => sum + h.sourceQty, 0)} Dus
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Dari kemasan 1 Dus @ 24 Pcs
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Pcs Dihasilkan
            </span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {historyList.reduce((sum, h) => sum + h.targetQty, 0)} Pcs
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Siap untuk pesanan toko eceran
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Nilai Persediaan Dipecah
            </span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            Rp{" "}
            {historyList
              .reduce((sum, h) => sum + h.totalValuationRp, 0)
              .toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-purple-500 mt-1">
            Perubahan Netto Buku = Rp 0
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Ketertelusuran Batch (FEFO)
            </span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            100%
          </p>
          <p className="text-xs text-cyan-600 mt-1">
            Batch & ED diwariskan ke pecahan
          </p>
        </div>
      </div>

      {/* Main Grid: Form Breakdown (Left) + Accounting Preview & History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Split className="w-4 h-4 text-blue-600" />
            Formulir Pemecahan Satuan
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Pilih kemasan induk dus yang ingin dibuka untuk dialokasikan menjadi satuan pieces (Pcs).
          </p>

          <form onSubmit={handleSubmitBreakdown} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pilih Produk
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">ICR-001 - Vanilla Bean Classic 100ml</option>
                <option value="2">ICR-002 - Chocolate Fudge Bar 90ml</option>
                <option value="3">ICR-003 - Strawberry Swirl Cup 100ml</option>
                <option value="4">ICR-004 - Mango Sorbet Cup 120ml</option>
                <option value="5">ICR-005 - Cookies & Cream Pint 100ml</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pilih Batch Induk (FEFO Terdekat)
              </label>
              <select
                value={sourceBatch}
                onChange={(e) => setSourceBatch(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              >
                <option value="B-VAN-1026">
                  B-VAN-1026 (ED: 2026-11-12 • Stok: 24 Dus)
                </option>
                <option value="B-VAN-1126">
                  B-VAN-1126 (ED: 2026-12-20 • Stok: 50 Dus)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Jumlah Dus yang Ingin Dipecah
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={sourceQty}
                  onChange={(e) => setSourceQty(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  DUS
                </span>
              </div>
            </div>

            {/* Visual Conversion Box */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 font-medium">
                <span>Hasil Konversi Otomatis:</span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-0.5 rounded font-mono">
                  1 DUS = 24 PCS
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {sourceQty} Dus
                  </p>
                  <p className="text-[11px] text-gray-500">Satuan Besar</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600 animate-pulse" />
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    +{calculatedPcs} Pcs
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Satuan Terkecil (Base)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lokasi Rak Freezer untuk Pcs Eceran
              </label>
              <select
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              >
                <option value="FRZ-A / RAK-01 / A-01">FRZ-A / RAK-01 / A-01 (Area Eceran)</option>
                <option value="FRZ-A / RAK-01 / A-02">FRZ-A / RAK-01 / A-02 (Area Eceran)</option>
                <option value="FRZ-B / RAK-01 / C-01">FRZ-B / RAK-01 / C-01 (Area Eceran)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catatan / Alasan Pemecahan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || sourceQty <= 0}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Memproses Konversi...</span>
              ) : (
                <>
                  <Split className="w-4 h-4" />
                  Konfirmasi & Eksekusi Breakdown
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Columns: Accounting Balance & History Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Jurnal Mutasi Internal Double-Entry (Netto Rp 0) */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Keseimbangan Finansial: Mutasi Internal Persediaan
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                Netto Finansial = Rp 0 (Zero Discrepancy)
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Prinsip WMS & Akuntansi: Pemecahan kemasan hanya memindahkan saldo antar sub-kartu stok satuan (Dus ke Pcs). Akun Buku Besar Persediaan (1130) tetap memiliki saldo yang sama.
            </p>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-700 dark:text-gray-300">
                  (D) 1130.01 - Persediaan Es Krim (Sub-Satuan PCS)
                </span>
                <span className="font-bold text-emerald-600">
                  + Rp {totalValuation.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono pl-4">
                <span className="text-gray-700 dark:text-gray-300">
                  (K) 1130.02 - Persediaan Es Krim (Sub-Satuan DUS)
                </span>
                <span className="font-bold text-red-500">
                  - Rp {totalValuation.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-xs font-bold">
                <span className="text-gray-900 dark:text-white">
                  Dampak pada Laba / Rugi (P&L):
                </span>
                <span className="text-emerald-600 font-mono">Rp 0 (Tidak Ada Beban)</span>
              </div>
            </div>
          </div>

          {/* Tabel Riwayat Pemecahan Satuan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-500" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Riwayat Transaksi Breakdown UOM
                </h3>
              </div>
              <span className="text-xs text-gray-500">
                Menampilkan {historyList.length} transaksi terakhir
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                  <tr>
                    <th className="py-2.5 px-3">No. Transaksi</th>
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Produk & Batch</th>
                    <th className="py-2.5 px-3">Asal (Dus)</th>
                    <th className="py-2.5 px-3">Hasil (Pcs)</th>
                    <th className="py-2.5 px-3 text-right">Nilai Mutasi</th>
                    <th className="py-2.5 px-3">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {historyList.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {row.transactionNumber}
                      </td>
                      <td className="py-3 px-3 text-gray-500 dark:text-gray-400">
                        {row.date}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {row.productName}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          Batch: {row.sourceBatchNumber}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {row.sourceQty} {row.sourceUom}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {row.sourceLocation}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{row.targetQty} {row.targetUom}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {row.targetLocation}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-gray-900 dark:text-white">
                        Rp {row.totalValuationRp.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                        {row.operatorName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
