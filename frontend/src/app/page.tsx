"use client";

import React from "react";
import {
  Boxes,
  Thermometer,
  ClockAlert,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Data simulasi telemetri suhu 24 jam
const temperatureData = [
  { time: "00:00", temp: -22.4 },
  { time: "02:00", temp: -22.1 },
  { time: "04:00", temp: -22.8 },
  { time: "06:00", temp: -21.9 },
  { time: "08:00", temp: -21.2 },
  { time: "10:00", temp: -20.8 },
  { time: "12:00", temp: -19.4 },
  { time: "14:00", temp: -20.1 },
  { time: "16:00", temp: -21.3 },
  { time: "18:00", temp: -21.8 },
  { time: "20:00", temp: -22.0 },
  { time: "22:00", temp: -22.3 },
];

// Data penjualan per kategori pelanggan
const categorySalesData = [
  { name: "Agen/Grosir", value: 45, color: "#3B82F6" },   // Blue
  { name: "Modern Trade", value: 30, color: "#10B981" },  // Green
  { name: "General Trade", value: 25, color: "#06B6D4" }, // Cyan
];

// Data FEFO Watchlist
const fefoWatchlist = [
  {
    sku: "ICR-001",
    name: "Vanilla Bean Classic 100 ml",
    batch: "B-VAN-1026",
    expiry: "2026-11-12",
    daysLeft: 13,
    statusLevel: "danger", // < 30 hari
    stock: "24 Dus / 8 Pcs",
    location: "FRZ-A / RAK-02 / B-01",
  },
  {
    sku: "ICR-002",
    name: "Chocolate Fudge Bar 90 ml",
    batch: "B-CHO-1026",
    expiry: "2026-11-21",
    daysLeft: 22,
    statusLevel: "danger",
    stock: "18 Dus / 5 Pcs",
    location: "FRZ-B / RAK-03 / B-02",
  },
  {
    sku: "ICR-003",
    name: "Strawberry Swirl Cup 100 ml",
    batch: "B-STR-1026",
    expiry: "2026-11-27",
    daysLeft: 28,
    statusLevel: "danger",
    stock: "31 Dus / 12 Pcs",
    location: "FRZ-A / RAK-03",
  },
  {
    sku: "ICR-004",
    name: "Mango Sorbet 120 ml",
    batch: "B-MNG-0926",
    expiry: "2026-12-15",
    daysLeft: 46,
    statusLevel: "warning", // 30-60 hari
    stock: "42 Dus / 0 Pcs",
    location: "FRZ-B / RAK-04 / C-01",
  },
  {
    sku: "ICR-005",
    name: "Cookies & Cream 100 ml",
    batch: "B-COO-0926",
    expiry: "2027-01-20",
    daysLeft: 82,
    statusLevel: "safe", // > 60 hari
    stock: "55 Dus / 7 Pcs",
    location: "KAR / RAK-01 / A-02",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            COLD CHAIN COMMAND CENTER / 2026
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ringkasan Operasional & Keuangan
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5" />
          <span>DATA WAKTU NYATA • 30 OKT 2026</span>
        </div>
      </div>

      {/* 4 Bento KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Valuasi Stok */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Valuasi Stok
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            Rp 284.500.000
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            1.420 Dus / 54.200 Pcs
          </p>
        </div>

        {/* Card 2: Integritas Rantai Dingin */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Integritas Rantai Dingin
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            AMAN
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            -21.4°C • 4 Freezer Normal
          </p>
        </div>

        {/* Card 3: Batch Kritis FEFO */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Batch Kritis FEFO
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            3 Batch
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Perlu Perhatian (&lt; 30 Hari)
          </p>
        </div>

        {/* Card 4: Penjualan Hari Ini */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Penjualan & Margin Hari Ini
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            Rp 18.250.000
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Margin 27,4%
          </p>
        </div>
      </div>

      {/* 2 Analytical Charts (60% : 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Telemetri Suhu 24 Jam (8 cols / ~66%) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Telemetri Suhu • 24 Jam
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulasi Freezer 01 • Batas aman maksimal -18°C
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              -21.4°C TERKINI
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  domain={[-26, -14]}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${v}°C`}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}°C`, "Suhu"]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#tempColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Suhu Ruang Freezer (°C)
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-medium">
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
              Ambang Kritis (-18°C)
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Distribusi Penjualan per Kategori (4 cols / ~33%) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Penjualan per Kategori
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribusi kanal pelanggan
            </p>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Pangsa"]}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            {categorySalesData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <p className="font-bold text-slate-800 dark:text-white mt-0.5">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEFO Watchlist Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              FEFO Watchlist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prioritaskan batch mendekati kedaluwarsa untuk dikeluarkan lebih awal
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            3 KRITIS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">SKU / Produk</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Kedaluwarsa</th>
                <th className="px-4 py-3">Sisa Hari</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3">Lokasi Freezer</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {fefoWatchlist.map((row) => (
                <tr key={row.batch} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3">
                    <span className="font-bold text-slate-900 dark:text-white block font-mono">
                      {row.sku}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{row.name}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                    {row.batch}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {row.expiry}
                  </td>
                  <td className="px-4 py-3">
                    {row.statusLevel === "danger" ? (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {row.daysLeft} hari
                      </span>
                    ) : row.statusLevel === "warning" ? (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {row.daysLeft} hari
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {row.daysLeft} hari
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {row.stock}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-[11px]">
                    {row.location}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold hover:underline transition"
                    >
                      Promo / Disposisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

