"use client";

import React, { useState } from "react";
import {
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Activity,
  History,
  Download,
  Filter,
  Plus,
  X,
  Server
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const TELEMETRY_DATA = [
  { time: "00:00", frzA: -21.4, frzB: -20.8, frzC: -22.1, threshold: -18 },
  { time: "02:00", frzA: -21.2, frzB: -20.6, frzC: -22.0, threshold: -18 },
  { time: "04:00", frzA: -21.6, frzB: -21.0, frzC: -22.3, threshold: -18 },
  { time: "06:00", frzA: -20.9, frzB: -20.4, frzC: -21.8, threshold: -18 },
  { time: "08:00", frzA: -19.8, frzB: -19.5, frzC: -21.2, threshold: -18 }, // Opening / Loading door activity
  { time: "10:00", frzA: -20.5, frzB: -20.1, frzC: -21.5, threshold: -18 },
  { time: "12:00", frzA: -21.0, frzB: -20.5, frzC: -21.9, threshold: -18 },
  { time: "14:00", frzA: -20.8, frzB: -20.3, frzC: -21.7, threshold: -18 },
  { time: "16:00", frzA: -21.3, frzB: -20.7, frzC: -22.0, threshold: -18 },
  { time: "18:00", frzA: -21.5, frzB: -20.9, frzC: -22.2, threshold: -18 },
  { time: "20:00", frzA: -21.4, frzB: -20.8, frzC: -22.1, threshold: -18 },
  { time: "22:00", frzA: -21.6, frzB: -21.1, frzC: -22.4, threshold: -18 },
];

const RECENT_ALERTS = [
  {
    id: "ALT-01",
    timestamp: "2026-10-31 08:15",
    freezer: "FRZ-A (Cold Storage Utama)",
    recordedTemp: -17.4,
    durationMinutes: 12,
    status: "TERSELESAIKAN",
    notes: "Pintu cold storage terbuka saat pembongkaran PO #PO-2026-10-001. Suhu pulih ke -20.5°C.",
    actionBy: "Budi Santoso (Staf Gudang)",
  },
  {
    id: "ALT-02",
    timestamp: "2026-10-29 14:30",
    freezer: "KAR-01 (Karantina)",
    recordedTemp: -16.8,
    durationMinutes: 45,
    status: "INVESTIGASI",
    notes: "Fluktuasi kompresor pendingin sekunder, teknisi sedang melakukan pengecekan freon.",
    actionBy: "Agus Hermawan (Teknisi)",
  },
];

export default function ColdChainMonitoringPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    freezerCode: "FRZ-A",
    temperature: -21.0,
    humidity: 65,
    checkedAt: "2026-10-31T10:00",
    notes: "",
  });

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Log suhu ${logForm.temperature}°C untuk ${logForm.freezerCode} berhasil dicatat.`);
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Overview</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Monitoring Rantai Dingin
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ThermometerSnowflake className="w-6 h-6 text-cyan-500" />
            Telemetri &amp; Integritas Rantai Dingin (Cold Chain)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pemantauan suhu penyimpanan es krim secara real-time dengan standar kepatuhan &le; -18&deg;C.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Suhu Manual</span>
          </button>
        </div>
      </div>

      {/* 4 Freezer Live Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              FRZ-A
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> NORMAL
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            -21.4&deg;C
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cold Storage Utama (Aset Es Krim Premium)
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Ambang: &le; -18&deg;C</span>
            <span className="text-emerald-500 font-medium">Aman (Margin 3.4&deg;C)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              FRZ-B
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> NORMAL
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            -20.8&deg;C
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cold Storage B (Fast-Moving SKU)
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Ambang: &le; -18&deg;C</span>
            <span className="text-emerald-500 font-medium">Aman (Margin 2.8&deg;C)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
              FRZ-C
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> NORMAL
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            -22.1&deg;C
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cold Storage C (Buffer Stock / Bulk)
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Ambang: &le; -18&deg;C</span>
            <span className="text-emerald-500 font-medium">Aman (Margin 4.1&deg;C)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              KAR-01
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" /> PERINGATAN
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            -19.5&deg;C
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ruang Karantina &amp; Retur Rusak
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Ambang: &le; -18&deg;C</span>
            <span className="text-amber-500 font-medium">Dekat Batas (+1.5&deg;C)</span>
          </div>
        </div>
      </div>

      {/* Temperature Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Grafik Fluktuasi Suhu 24 Jam Terakhir
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Garis putus-putus merah menandakan batas kritis dingin es krim (-18&deg;C).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-slate-600 dark:text-slate-400">Freezer A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-600 dark:text-slate-400">Freezer B</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-400">Freezer C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500" />
              <span className="text-rose-500 font-semibold">Ambang -18&deg;C</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TELEMETRY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[-26, -14]} stroke="#94a3b8" fontSize={11} unit="°C" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine
                y={-18}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                label={{ value: "Batas Kritis (-18°C)", fill: "#f43f5e", fontSize: 11 }}
              />
              <Line
                type="monotone"
                dataKey="frzA"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Freezer A"
              />
              <Line
                type="monotone"
                dataKey="frzB"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Freezer B"
              />
              <Line
                type="monotone"
                dataKey="frzC"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Freezer C"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Temperature Excursions & Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Riwayat Peringatan Lonjakan Suhu (Excursion Logs)
            </h3>
          </div>
          <button
            onClick={() => alert("Mengunduh laporan kepatuhan rantai dingin...")}
            className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5 hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor PDF Audit Kepatuhan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Waktu Kejadian</th>
                <th className="px-5 py-3.5">Lokasi Freezer</th>
                <th className="px-5 py-3.5">Suhu Terdeteksi</th>
                <th className="px-5 py-3.5">Durasi</th>
                <th className="px-5 py-3.5">Status Tindakan</th>
                <th className="px-5 py-3.5">Keterangan &amp; Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {RECENT_ALERTS.map((alertItem) => (
                <tr key={alertItem.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">
                    {alertItem.timestamp}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {alertItem.freezer}
                  </td>
                  <td className="px-5 py-4 font-mono text-rose-500 font-bold">
                    {alertItem.recordedTemp}&deg;C
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                    {alertItem.durationMinutes} Menit
                  </td>
                  <td className="px-5 py-4">
                    {alertItem.status === "TERSELESAIKAN" ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Teratasi
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Dalam Investigasi
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <p className="text-slate-700 dark:text-slate-300">{alertItem.notes}</p>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Oleh: {alertItem.actionBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Suhu Manual */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ThermometerSnowflake className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Pencatatan Suhu Manual (Log Book)
                </h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Cold Storage / Freezer
                </label>
                <select
                  value={logForm.freezerCode}
                  onChange={(e) => setLogForm({ ...logForm, freezerCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                >
                  <option value="FRZ-A">FRZ-A (Cold Storage Utama)</option>
                  <option value="FRZ-B">FRZ-B (Fast-Moving SKU)</option>
                  <option value="FRZ-C">FRZ-C (Buffer Stock Bulk)</option>
                  <option value="KAR-01">KAR-01 (Karantina Cold Chain)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Termometer (&deg;C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={logForm.temperature}
                    onChange={(e) => setLogForm({ ...logForm, temperature: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kelembaban (%)
                  </label>
                  <input
                    type="number"
                    value={logForm.humidity}
                    onChange={(e) => setLogForm({ ...logForm, humidity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Observasi Visual
                </label>
                <textarea
                  rows={2}
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="Kondisi bunga es, status pintu hermetis, suara kompresor..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

