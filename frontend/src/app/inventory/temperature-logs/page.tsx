"use client";

import React, { useState } from "react";
import {
  ThermometerSnowflake,
  Search,
  Filter,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  Truck,
  ArrowUpRight,
} from "lucide-react";

interface TempLog {
  id: number;
  locationCode: string;
  locationName: string;
  type: "COLD_ROOM" | "FREEZER_RACK" | "REEFER_TRUCK";
  recordedAt: string;
  temperature: number;
  sensorId: string;
  status: "NORMAL" | "WARNING" | "CRITICAL";
}

export default function TemperatureLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const logs: TempLog[] = [
    {
      id: 1,
      locationCode: "FREEZER-01",
      locationName: "Deep Freezer Room A",
      type: "COLD_ROOM",
      recordedAt: "2026-10-31 12:45:00",
      temperature: -22.4,
      sensorId: "SNS-FRZ-001",
      status: "NORMAL",
    },
    {
      id: 2,
      locationCode: "FREEZER-02",
      locationName: "Deep Freezer Room B",
      type: "COLD_ROOM",
      recordedAt: "2026-10-31 12:45:00",
      temperature: -21.8,
      sensorId: "SNS-FRZ-002",
      status: "NORMAL",
    },
    {
      id: 3,
      locationCode: "TRK-01",
      locationName: "Truk Reefer Box B 9124 KLD",
      type: "REEFER_TRUCK",
      recordedAt: "2026-10-31 12:40:00",
      temperature: -20.1,
      sensorId: "SNS-TRK-001",
      status: "NORMAL",
    },
    {
      id: 4,
      locationCode: "ANTE-ROOM",
      locationName: "Ruang Ante-Room Repacking",
      type: "COLD_ROOM",
      recordedAt: "2026-10-31 12:35:00",
      temperature: 4.2,
      sensorId: "SNS-ANTE-001",
      status: "NORMAL",
    },
    {
      id: 5,
      locationCode: "KRN-01",
      locationName: "Rak Karantina Retur",
      type: "FREEZER_RACK",
      recordedAt: "2026-10-31 12:30:00",
      temperature: -19.5,
      sensorId: "SNS-KRN-001",
      status: "NORMAL",
    },
  ];

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.sensorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || l.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950/60 rounded-lg text-cyan-600 dark:text-cyan-400">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Log Riwayat Suhu Cold Storage & IoT Sensor
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan Suhu Otomatis Real-Time Setiap 15 Menit untuk Menjamin Standar &le; -18&deg;C
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/monitoring-suhu"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Live Visual Monitoring
          </a>
          <button
            onClick={() => alert("Mengunduh data log audit suhu format CSV/Excel...")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
          >
            <Download className="w-4 h-4" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari lokasi, sensor ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">Semua Jenis Lokasi</option>
              <option value="COLD_ROOM">Ruang Cold Room / Deep Freezer</option>
              <option value="FREEZER_RACK">Rak Penyimpanan</option>
              <option value="REEFER_TRUCK">Armada Truk Reefer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Waktu Perekaman</th>
                <th className="py-3 px-4">Lokasi / Titik Sensor</th>
                <th className="py-3 px-4">ID Sensor IoT</th>
                <th className="py-3 px-4 text-center">Temperatur</th>
                <th className="py-3 px-4 text-center">Status Integritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {log.recordedAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {log.locationName}
                    </span>
                    <span className="ml-2 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {log.locationCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                    {log.sensorId}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-sm px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300">
                      {log.temperature.toFixed(1)}&deg;C
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      AMAN & VALID
                    </span>
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

