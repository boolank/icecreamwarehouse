"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Warehouse,
  FileCheck2,
  Scale,
  Calendar,
  Save,
  Clock,
  ArrowRight
} from "lucide-react";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface InboundQcItem {
  sku: string;
  name: string;
  orderedQtyDus: number;
  receivedQtyDus: number;
  conversionRatio: number; // 24 Pcs per Dus
  unitPriceDus: number;
  batchNumber: string;
  productionDate: string;
  expiredDate: string;
  targetFreezerRack: string;
}

export default function InboundQcPage() {
  const [selectedPo, setSelectedPo] = useState("PO-DIS10114");
  const [supplierName, setSupplierName] = useState("PT. INDO VAN HOUTEN (Miami Ice Cream)");
  const [truckTemperature, setTruckTemperature] = useState<number>(-21.4);
  const [qcNotes, setQcNotes] = useState("Segel truk pendingin PT Indo Van Houten utuh, suhu kabin reefer -21.4°C prima.");
  const [isProcessed, setIsProcessed] = useState(false);

  // Items State
  const [items, setItems] = useState<InboundQcItem[]>([
    {
      sku: "MIA-BLU-60",
      name: "Blueberry Ice 60/114",
      orderedQtyDus: 25,
      receivedQtyDus: 25,
      conversionRatio: 60,
      unitPriceDus: 64865,
      batchNumber: "B-IVH-BLU-1026",
      productionDate: "2026-10-25",
      expiredDate: "2027-10-25",
      targetFreezerRack: "FRZ-A/RAK-01",
    },
    {
      sku: "MIA-CRN-40",
      name: "Choco Corn 40/140",
      orderedQtyDus: 75,
      receivedQtyDus: 75,
      conversionRatio: 40,
      unitPriceDus: 57658,
      batchNumber: "B-IVH-CRN-1026",
      productionDate: "2026-10-26",
      expiredDate: "2027-10-26",
      targetFreezerRack: "FRZ-A/RAK-02",
    },
    {
      sku: "MIA-GLD-40",
      name: "Golden Corn 40/140",
      orderedQtyDus: 80,
      receivedQtyDus: 80,
      conversionRatio: 40,
      unitPriceDus: 57658,
      batchNumber: "B-IVH-GLD-1026",
      productionDate: "2026-10-26",
      expiredDate: "2027-10-26",
      targetFreezerRack: "FRZ-B/RAK-01",
    },
    {
      sku: "MIA-DBC-40",
      name: "DOUBLE CRUMBLE CHO - ISI 40",
      orderedQtyDus: 25,
      receivedQtyDus: 25,
      conversionRatio: 40,
      unitPriceDus: 86487,
      batchNumber: "B-IVH-DBC-1026",
      productionDate: "2026-10-25",
      expiredDate: "2027-10-25",
      targetFreezerRack: "FRZ-B/RAK-02",
    },
    {
      sku: "MIA-DUR-60",
      name: "KING DURIAN 60",
      orderedQtyDus: 25,
      receivedQtyDus: 25,
      conversionRatio: 60,
      unitPriceDus: 59460,
      batchNumber: "B-IVH-DUR-1026",
      productionDate: "2026-10-25",
      expiredDate: "2027-10-25",
      targetFreezerRack: "FRZ-A/RAK-03",
    },
  ]);

  const isTempSafe = truckTemperature <= -18.0;

  const totalMonetaryValue = items.reduce(
    (acc, it) => acc + it.receivedQtyDus * it.unitPriceDus,
    0
  );

  const totalBaseUnitsPcs = items.reduce(
    (acc, it) => acc + it.receivedQtyDus * it.conversionRatio,
    0
  );

  const handleUpdateItem = (index: number, field: keyof InboundQcItem, val: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleProcessInbound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTempSafe) {
      alert(
        "KONTROL MUTU DITOLAK: Suhu truk di atas -18°C! Barang tidak boleh dimasukkan ke stok utama gudang tanpa investigasi karantina."
      );
      return;
    }
    setIsProcessed(true);
    alert(
      `Penerimaan Inbound PO ${selectedPo} berhasil diproses!\nTotal Persediaan: ${formatRupiah(
        totalMonetaryValue
      )} (${formatNumber(totalBaseUnitsPcs)} Pcs)\nAyat Jurnal Pembelian JV-202610-0001 otomatis terbit seimbang (Balanced).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Manajemen Inbound</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Pemeriksaan QC Suhu &amp; Penerimaan Pasokan
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-500" />
            Kendali Mutu (QC) Suhu Armada &amp; Inbound Batch
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Validasi kepatuhan suhu dingin armada pembawa (&le; -18&deg;C), pencatatan tanggal kedaluwarsa batch, dan otomasi pengakuan jurnal persediaan.
          </p>
        </div>
      </div>

      <form onSubmit={handleProcessInbound} className="space-y-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PO Reference Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Package className="w-4 h-4 text-cyan-500" />
              <span>Dokumen Referensi Pengadaan</span>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Pilih Dokumen PO</label>
              <select
                value={selectedPo}
                onChange={(e) => {
                  setSelectedPo(e.target.value);
                  setSupplierName("PT. INDO VAN HOUTEN (Miami Ice Cream)");
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
              >
                <option value="PO-DIS10114">PO-DIS10114 (PT. INDO VAN HOUTEN - 560 Dus)</option>
              </select>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Pabrikan / Pemasok:</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {supplierName}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Tanggal Kedatangan: <span className="font-mono text-slate-700 dark:text-slate-300">2026-10-31</span>
            </div>
          </div>

          {/* Critical Cold Chain Truck Temperature Control Card */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Pemeriksaan Suhu Termometer Truk Pendingin (Thermo King)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Ambang Batas: &le; -18.0&deg;C
              </span>
            </div>

            {/* Input Suhu with Stepper */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={truckTemperature}
                  onChange={(e) => setTruckTemperature(Number(e.target.value))}
                  className="w-32 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-lg font-mono font-bold text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="text-lg font-bold text-slate-500">&deg;C</span>
              </div>

              {/* Dynamic Status Alert Banner */}
              <div
                className={`flex-1 p-3 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
                  isTempSafe
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400 animate-pulse font-semibold"
                }`}
              >
                {isTempSafe ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    <div>
                      <span className="font-bold block">
                        SUHU TRUK MEMENUHI STANDAR KELAYAKAN (LULUS QC)
                      </span>
                      <span>
                        Suhu es krim terjaga di bawah -18&deg;C. Tekstur beku optimal dan aman dimasukkan ke gudang utama.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                    <div>
                      <span className="font-bold block">
                        PERINGATAN BAHAYA: SUHU DI ATAS AMBANG BATAS!
                      </span>
                      <span>
                        Suhu terdeteksi {truckTemperature}&deg;C (&gt; -18&deg;C). Potensi terjadi pencairan es krim (refreezing). Muatan wajib diisolasi ke Ruang Karantina!
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Kondisi Fisik &amp; Kemasan Truk
              </label>
              <input
                type="text"
                value={qcNotes}
                onChange={(e) => setQcNotes(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Batch & Putaway Items Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Rincian Batch Produk, Masa Simpan &amp; Alokasi Rak Freezer
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Konversi otomatis ke satuan terkecil (*Base Unit PCS*)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produk &amp; SKU</th>
                  <th className="px-4 py-3">Pesan (Dus)</th>
                  <th className="px-4 py-3">Terima (Dus)</th>
                  <th className="px-4 py-3">Konversi Base Unit</th>
                  <th className="px-4 py-3">Nomor Batch</th>
                  <th className="px-4 py-3">Tgl Kedaluwarsa</th>
                  <th className="px-4 py-3">Rak Cold Storage</th>
                  <th className="px-4 py-3 text-right">Nilai Moneter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((it, idx) => {
                  const basePcs = it.receivedQtyDus * it.conversionRatio;
                  const lineTotal = it.receivedQtyDus * it.unitPriceDus;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {it.name}
                        </div>
                        <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                          {it.sku}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-slate-500">
                        {it.orderedQtyDus} Dus
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          value={it.receivedQtyDus}
                          onChange={(e) =>
                            handleUpdateItem(idx, "receivedQtyDus", Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-center font-bold text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
                          {formatNumber(basePcs)} Pcs
                        </div>
                        <span className="text-[10px] text-slate-400">
                          (1 Dus = {it.conversionRatio} Pcs)
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          required
                          value={it.batchNumber}
                          onChange={(e) =>
                            handleUpdateItem(idx, "batchNumber", e.target.value.toUpperCase())
                          }
                          placeholder="Nomor Batch"
                          className="w-28 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs uppercase text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <input
                          type="date"
                          required
                          value={it.expiredDate}
                          onChange={(e) =>
                            handleUpdateItem(idx, "expiredDate", e.target.value)
                          }
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={it.targetFreezerRack}
                          onChange={(e) =>
                            handleUpdateItem(idx, "targetFreezerRack", e.target.value)
                          }
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-900 dark:text-white"
                        >
                          <option value="FRZ-A/RAK-01">FRZ-A / RAK-01 (-21.4°C)</option>
                          <option value="FRZ-A/RAK-02">FRZ-A / RAK-02 (-21.2°C)</option>
                          <option value="FRZ-B/RAK-01">FRZ-B / RAK-01 (-20.8°C)</option>
                          <option value="FRZ-B/RAK-02">FRZ-B / RAK-02 (-20.6°C)</option>
                          <option value="KAR/RAK-01">KAR / RAK-01 (Karantina)</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatRupiah(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balanced Journal Card (Double-Entry Bookkeeping Verification) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">
                  Kartu Jurnal Akuntansi Otomatis (*Balanced Journal Card*)
                </h4>
                <p className="text-xs text-slate-400">
                  Ayat jurnal berpasangan seimbang yang otomatis dicatat ke Buku Besar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-semibold">
                JV-202610-0001
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> SEIMBANG (BALANCED)
              </span>
            </div>
          </div>

          {/* Journal Lines Table */}
          <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 font-mono text-xs space-y-2">
            {/* Debit Line */}
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                  DEBIT
                </span>
                <span className="font-bold text-slate-200">1130</span>
                <span className="text-slate-300">
                  Persediaan Barang Dagang Es Krim (Inbound {selectedPo})
                </span>
              </div>
              <div className="font-bold tabular-nums text-emerald-400">
                {formatRupiah(totalMonetaryValue)}
              </div>
            </div>

            {/* Credit Line */}
            <div className="flex items-center justify-between py-1 pl-6">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  KREDIT
                </span>
                <span className="font-bold text-slate-200">2101</span>
                <span className="text-slate-300">
                  Utang Usaha &mdash; {supplierName}
                </span>
              </div>
              <div className="font-bold tabular-nums text-emerald-400">
                {formatRupiah(totalMonetaryValue)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Total Valuasi Fisik Bertambah:{" "}
              <strong className="text-white font-mono">{formatNumber(totalBaseUnitsPcs)} Pcs</strong> Base Unit
            </span>
            <span className="text-emerald-400 font-mono font-bold">
              Total Debit = Total Kredit = {formatRupiah(totalMonetaryValue)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!isTempSafe}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Proses Penerimaan Inbound &amp; Terbitkan Jurnal</span>
          </button>
        </div>
      </form>
    </div>
  );
}

