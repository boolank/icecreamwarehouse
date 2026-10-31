"use client";

import React, { useState } from "react";
import {
  ThermometerSnowflake,
  Plus,
  Box,
  Layers,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  History,
  X
} from "lucide-react";

interface RackItem {
  id: string;
  code: string;
  capacityDus: number;
  occupiedDus: number;
  temperature: number;
  isQuarantine: boolean;
  status: "NORMAL" | "WARNING" | "CRITICAL";
}

interface FreezerZone {
  id: string;
  code: string;
  name: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  isQuarantine: boolean;
  racks: RackItem[];
}

const INITIAL_ZONES: FreezerZone[] = [
  {
    id: "z1",
    code: "FRZ-A",
    name: "Cold Storage Utama A",
    currentTemp: -21.4,
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
    racks: [
      { id: "r1", code: "FRZ-A/RAK-01", capacityDus: 100, occupiedDus: 78, temperature: -21.4, isQuarantine: false, status: "NORMAL" },
      { id: "r2", code: "FRZ-A/RAK-02", capacityDus: 100, occupiedDus: 92, temperature: -21.2, isQuarantine: false, status: "NORMAL" },
      { id: "r3", code: "FRZ-A/RAK-03", capacityDus: 120, occupiedDus: 45, temperature: -21.5, isQuarantine: false, status: "NORMAL" },
    ],
  },
  {
    id: "z2",
    code: "FRZ-B",
    name: "Cold Storage B (Fast-Moving)",
    currentTemp: -20.8,
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
    racks: [
      { id: "r4", code: "FRZ-B/RAK-01", capacityDus: 120, occupiedDus: 85, temperature: -20.8, isQuarantine: false, status: "NORMAL" },
      { id: "r5", code: "FRZ-B/RAK-02", capacityDus: 120, occupiedDus: 110, temperature: -20.6, isQuarantine: false, status: "NORMAL" },
      { id: "r6", code: "FRZ-B/RAK-03", capacityDus: 100, occupiedDus: 60, temperature: -20.9, isQuarantine: false, status: "NORMAL" },
    ],
  },
  {
    id: "z3",
    code: "FRZ-C",
    name: "Cold Storage C (Buffer Stock)",
    currentTemp: -22.1,
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
    racks: [
      { id: "r7", code: "FRZ-C/RAK-01", capacityDus: 150, occupiedDus: 40, temperature: -22.1, isQuarantine: false, status: "NORMAL" },
      { id: "r8", code: "FRZ-C/RAK-02", capacityDus: 150, occupiedDus: 95, temperature: -22.0, isQuarantine: false, status: "NORMAL" },
    ],
  },
  {
    id: "z4",
    code: "KAR-01",
    name: "Ruang Karantina Cold Chain",
    currentTemp: -19.5,
    minTemp: -22,
    maxTemp: -15,
    isQuarantine: true,
    racks: [
      { id: "r9", code: "KAR/RAK-01", capacityDus: 50, occupiedDus: 18, temperature: -19.5, isQuarantine: true, status: "WARNING" },
    ],
  },
];

export default function MasterFreezersPage() {
  const [zones, setZones] = useState<FreezerZone[]>(INITIAL_ZONES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZoneData, setNewZoneData] = useState({
    code: "",
    name: "",
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
  });

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    const newZone: FreezerZone = {
      id: `z-${Date.now()}`,
      code: newZoneData.code,
      name: newZoneData.name,
      currentTemp: -21.0,
      minTemp: newZoneData.minTemp,
      maxTemp: newZoneData.maxTemp,
      isQuarantine: newZoneData.isQuarantine,
      racks: [],
    };
    setZones([...zones, newZone]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Master Data</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Freezer &amp; Rak Gudang
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ThermometerSnowflake className="w-6 h-6 text-cyan-500" />
            Zona Cold Storage &amp; Rak Gudang
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen lokasi penyimpanan es krim, kapasitas rak palet, dan sensor pemantauan suhu cold chain.
          </p>
        </div>

        <button
          onClick={() => {
            setNewZoneData({
              code: `FRZ-${String.fromCharCode(65 + zones.length)}`,
              name: "",
              minTemp: -25,
              maxTemp: -18,
              isQuarantine: false,
            });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Zona Cold Storage</span>
        </button>
      </div>

      {/* Cold Chain Compliance Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Sistem Otomasi Ambang Batas Suhu Dingin
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suhu es krim wajib dijaga di bawah <strong>-18&deg;C</strong>. Jika suhu &gt; -18&deg;C selama 30 menit, sistem otomatis memblokir alokasi picking batch ke zona tersebut.
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono whitespace-nowrap">
          4/4 ZONA TERVERIFIKASI
        </div>
      </div>

      {/* Grid of Freezer Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const totalCapacity = zone.racks.reduce((acc, r) => acc + r.capacityDus, 0);
          const totalOccupied = zone.racks.reduce((acc, r) => acc + r.occupiedDus, 0);
          const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
          const isTempSafe = zone.currentTemp <= -18;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm transition-all ${
                zone.isQuarantine
                  ? "border-amber-500/30 dark:border-amber-500/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      zone.isQuarantine
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-cyan-500/10 text-cyan-500"
                    }`}
                  >
                    {zone.isQuarantine ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <Server className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {zone.code}
                      </span>
                      {zone.isQuarantine && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          ZONA KARANTINA
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {zone.name}
                    </h3>
                  </div>
                </div>

                {/* Telemetry pill */}
                <div
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                    isTempSafe
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse"
                  }`}
                >
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{zone.currentTemp}&deg;C</span>
                </div>
              </div>

              {/* Occupancy Progress */}
              <div className="py-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">
                    Kapasitas Terisi ({zone.racks.length} Rak Aktif)
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {totalOccupied} / {totalCapacity} Dus ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancyRate > 90
                        ? "bg-rose-500"
                        : occupancyRate > 70
                        ? "bg-cyan-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Racks List */}
              <div className="space-y-2 mt-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Daftar Rak Penyimpanan:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {zone.racks.map((rack) => {
                    const rackRate = Math.round((rack.occupiedDus / rack.capacityDus) * 100);
                    return (
                      <div
                        key={rack.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {rack.code}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                            {rack.occupiedDus} / {rack.capacityDus} Dus ({rackRate}%)
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                            {rack.temperature}&deg;C
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Batas Suhu: {zone.minTemp}&deg;C s/d {zone.maxTemp}&deg;C
                </span>
                <button
                  onClick={() => alert(`Tambah Rak baru di zona ${zone.code}`)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Rak
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Zona */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Tambah Zona Cold Storage Baru
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi parameter suhu dan status karantina
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Zona <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newZoneData.code}
                  onChange={(e) => setNewZoneData({ ...newZoneData, code: e.target.value })}
                  placeholder="Contoh: FRZ-D"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Ruang Cold Storage <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newZoneData.name}
                  onChange={(e) => setNewZoneData({ ...newZoneData, name: e.target.value })}
                  placeholder="Contoh: Cold Storage D (Deep Freeze)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Minimal (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={newZoneData.minTemp}
                    onChange={(e) =>
                      setNewZoneData({ ...newZoneData, minTemp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Maksimal (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={newZoneData.maxTemp}
                    onChange={(e) =>
                      setNewZoneData({ ...newZoneData, maxTemp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newZoneData.isQuarantine}
                    onChange={(e) =>
                      setNewZoneData({ ...newZoneData, isQuarantine: e.target.checked })
                    }
                    className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Zona Karantina Khusus
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tandai jika ruang ini khusus isolasi es krim meleleh/rusak sebelum pemusnahan (disposisi).
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-sm transition-all"
                >
                  Simpan Zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

