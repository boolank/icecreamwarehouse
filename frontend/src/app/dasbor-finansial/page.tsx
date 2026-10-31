"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Snowflake,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  Layers,
  Scale,
  Building,
} from "lucide-react";

export default function DasborFinansialPage() {
  const [timeRange, setTimeRange] = useState("OCT_2026");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Dasbor Eksekutif Finansial & Profitabilitas
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemantauan Arus Kas, Margin Penjualan, Rasio Biaya Cold Chain & Kesehatan Likuiditas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Periode:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none"
            >
              <option value="OCT_2026">Oktober 2026 (Bulan Berjalan)</option>
              <option value="Q3_2026">Kuartal III 2026</option>
              <option value="YTD_2026">Tahun Berjalan 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 1: High Level Executive KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Pendapatan (Omzet)</span>
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            Rp 114.500.000
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8%</span>
            <span className="text-slate-400 font-normal">vs bulan lalu</span>
          </div>
        </div>

        {/* Gross Margin */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Gross Profit Margin</span>
            <span className="p-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            32.9%
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Laba Kotor:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              Rp 37.700.000
            </span>
          </div>
        </div>

        {/* Spoilage Loss Ratio */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Rasio Kerugian Suhu (Spoilage)</span>
            <span className="p-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
              <Snowflake className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            0.83%
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sesuai Batas Aman</span>
            <span className="text-slate-400 font-normal">(&le; 1.0%)</span>
          </div>
        </div>

        {/* Net Profit Margin */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Estimasi Laba Bersih</span>
            <span className="p-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-600">
              <PieChart className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Rp 15.280.000
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Net Profit Margin:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              13.3%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Two Column Deep Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Breakdown by Customer Segment */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Komposisi Penjualan per Segmen
            </h2>
            <span className="text-[10px] text-slate-400">Bulan Ini</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Supermarket */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-medium">Modern Trade / Supermarket</span>
                <span className="font-mono font-semibold">Rp 68.500.000 (59.8%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: "59.8%" }} />
              </div>
            </div>

            {/* Grosir / Toko */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-medium">General Trade / Grosir & Toko</span>
                <span className="font-mono font-semibold">Rp 32.000.000 (27.9%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: "27.9%" }} />
              </div>
            </div>

            {/* Horeka */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="font-medium">Hotel, Restoran & Kafe (Horeka)</span>
                <span className="font-mono font-semibold">Rp 14.000.000 (12.3%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12.3%" }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Insight Harga Segmen:
            </p>
            <p>
              Segmen Supermarket berkontribusi volume tertinggi dengan TOP 30 Hari. Segmen Grosir berkontribusi perputaran tunai tercepat (TOP 7 Hari).
            </p>
          </div>
        </div>

        {/* Center: Cold Chain Cost & Energy Analysis */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Struktur Beban Operasional Rantai Dingin
            </h2>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Listrik Deep Freezer (Cold Storage)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Rp 18.500.000
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Gaji Staf Gudang & Logistik Pendingin</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Rp 21.000.000
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Pemeliharaan Kompresor & Genset</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Rp 4.500.000
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">BBM & Armada Truk Reefer Pendingin</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Rp 3.850.000
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                Kerugian Spoilage & Selisih Opname
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                Rp 950.000
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300">
            <span className="font-bold">Efisiensi Biaya Energi:</span> Rata-rata biaya listrik per liter es krim tersimpan adalah Rp 412/L (turun 4.2% berkat isolasi ante-room yang ketat).
          </div>
        </div>

        {/* Right: Piutang (AR Aging) & Likuiditas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Piutang Usaha (AR Aging Status)
            </h2>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <span>Lancar (Belum Jatuh Tempo)</span>
              <span className="font-mono font-bold">Rp 38.200.000 (78.8%)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <span>Menunggak 1 - 15 Hari</span>
              <span className="font-mono font-bold">Rp 8.100.000 (16.7%)</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
              <span>Menunggak &gt; 15 Hari</span>
              <span className="font-mono font-bold">Rp 2.200.000 (4.5%)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Total Piutang Usaha (COA 1120):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Rp 48.500.000
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kolektibilitas piutang berjalan sangat sehat dengan 95.5% piutang dalam kategori tertagih lancar.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Actionable Accounting & Operational Controls */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Keseimbangan Double-Entry Terjaga Sepenuhnya
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Seluruh transaksi penjualan, HPP FEFO, penerimaan inbound, retur, dan susut opname telah menghasilkan jurnal berimbang (Debit = Kredit).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/reports/trial-balance"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            Lihat Neraca Saldo
          </a>
          <a
            href="/reports/income-statement"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Buka Laporan Laba Rugi
          </a>
        </div>
      </div>
    </div>
  );
}

