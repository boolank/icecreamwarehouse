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
  X,
  Edit2,
  Save,
  Clock,
  User,
  ArrowRight,
  Check,
  Power,
  AlertCircle
} from "lucide-react";

interface RackItem {
  id: string;
  code: string;
  capacityDus: number;
  occupiedDus: number;
  temperature: number;
  isQuarantine: boolean;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  isActive: boolean;
}

interface FreezerZone {
  id: string;
  code: string;
  name: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  isQuarantine: boolean;
  isActive: boolean;
  racks: RackItem[];
}

interface FreezerAuditLog {
  id: string;
  zoneId?: string;
  zoneCode: string;
  rackId?: string;
  rackCode?: string;
  action: "TAMBAH_ZONA" | "UPDATE_ZONA" | "TAMBAH_RAK" | "UPDATE_RAK" | "UBAH_STATUS_ZONA" | "UBAH_STATUS_RAK";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
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
    isActive: true,
    racks: [
      { id: "r1", code: "FRZ-A/RAK-01", capacityDus: 100, occupiedDus: 78, temperature: -21.4, isQuarantine: false, status: "NORMAL", isActive: true },
      { id: "r2", code: "FRZ-A/RAK-02", capacityDus: 100, occupiedDus: 92, temperature: -21.2, isQuarantine: false, status: "NORMAL", isActive: true },
      { id: "r3", code: "FRZ-A/RAK-03", capacityDus: 120, occupiedDus: 45, temperature: -21.5, isQuarantine: false, status: "NORMAL", isActive: true },
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
    isActive: true,
    racks: [
      { id: "r4", code: "FRZ-B/RAK-01", capacityDus: 120, occupiedDus: 85, temperature: -20.8, isQuarantine: false, status: "NORMAL", isActive: true },
      { id: "r5", code: "FRZ-B/RAK-02", capacityDus: 120, occupiedDus: 110, temperature: -20.6, isQuarantine: false, status: "NORMAL", isActive: true },
      { id: "r6", code: "FRZ-B/RAK-03", capacityDus: 100, occupiedDus: 60, temperature: -20.9, isQuarantine: false, status: "NORMAL", isActive: true },
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
    isActive: true,
    racks: [
      { id: "r7", code: "FRZ-C/RAK-01", capacityDus: 150, occupiedDus: 40, temperature: -22.1, isQuarantine: false, status: "NORMAL", isActive: true },
      { id: "r8", code: "FRZ-C/RAK-02", capacityDus: 150, occupiedDus: 95, temperature: -22.0, isQuarantine: false, status: "NORMAL", isActive: true },
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
    isActive: true,
    racks: [
      { id: "r9", code: "KAR/RAK-01", capacityDus: 50, occupiedDus: 18, temperature: -19.5, isQuarantine: true, status: "WARNING", isActive: true },
    ],
  },
];

const INITIAL_AUDIT_LOGS: FreezerAuditLog[] = [
  {
    id: "aud-frz-1",
    zoneId: "z1",
    zoneCode: "FRZ-A",
    action: "UPDATE_ZONA",
    changedBy: "Budi Santoso (Supervisor Cold Chain)",
    changedAt: "2026-10-30 14:15:22",
    notes: "Kalibrasi kompresor dan sensor IoT zona FRZ-A.",
    changes: [
      { field: "minTemp", oldValue: "-24°C", newValue: "-25°C" },
      { field: "maxTemp", oldValue: "-18°C", newValue: "-18°C" },
    ],
  },
  {
    id: "aud-frz-2",
    zoneId: "z2",
    zoneCode: "FRZ-B",
    rackId: "r5",
    rackCode: "FRZ-B/RAK-02",
    action: "UPDATE_RAK",
    changedBy: "Hendra Wijaya (Staf Gudang)",
    changedAt: "2026-10-29 09:30:10",
    notes: "Penyesuaian kapasitas rak palet bertingkat.",
    changes: [
      { field: "capacityDus", oldValue: "100 Dus", newValue: "120 Dus" },
    ],
  },
  {
    id: "aud-frz-3",
    zoneId: "z4",
    zoneCode: "KAR-01",
    action: "TAMBAH_ZONA",
    changedBy: "Siti Rahma (Manajer Gudang)",
    changedAt: "2026-10-25 11:00:00",
    notes: "Penyediaan ruang isolasi karantina produk retur/meleleh.",
    changes: [
      { field: "code", oldValue: "-", newValue: "KAR-01" },
      { field: "isQuarantine", oldValue: "false", newValue: "true" },
    ],
  },
];

export default function MasterFreezersPage() {
  const [zones, setZones] = useState<FreezerZone[]>(INITIAL_ZONES);
  const [auditLogs, setAuditLogs] = useState<FreezerAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal States
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [isEditZoneModalOpen, setIsEditZoneModalOpen] = useState(false);
  const [isAddRackModalOpen, setIsAddRackModalOpen] = useState(false);
  const [isEditRackModalOpen, setIsEditRackModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Active items for modals
  const [activeZone, setActiveZone] = useState<FreezerZone | null>(null);
  const [activeRack, setActiveRack] = useState<RackItem | null>(null);

  // Form States - Add Zone
  const [newZoneData, setNewZoneData] = useState({
    code: "",
    name: "",
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
    isActive: true,
  });

  // Form States - Edit Zone
  const [editZoneData, setEditZoneData] = useState({
    name: "",
    minTemp: -25,
    maxTemp: -18,
    isQuarantine: false,
    isActive: true,
  });

  // Form States - Add Rack
  const [newRackData, setNewRackData] = useState({
    code: "",
    capacityDus: 100,
    temperature: -21.0,
    isQuarantine: false,
  });

  // Form States - Edit Rack
  const [editRackData, setEditRackData] = useState({
    code: "",
    capacityDus: 100,
    temperature: -21.0,
    isQuarantine: false,
    status: "NORMAL" as RackItem["status"],
    isActive: true,
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Open Add Zone
  const openAddZoneModal = () => {
    const nextCode = `FRZ-${String.fromCharCode(65 + zones.length)}`;
    setNewZoneData({
      code: nextCode,
      name: "",
      minTemp: -25,
      maxTemp: -18,
      isQuarantine: false,
      isActive: true,
    });
    setIsAddZoneModalOpen(true);
  };

  // Save New Zone
  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneData.isQuarantine && newZoneData.maxTemp > -18) {
      alert("Peringatan Cold Chain: Batas suhu maksimal es krim komersial tidak boleh lebih hangat dari -18°C!");
      return;
    }

    const newZone: FreezerZone = {
      id: `z-${Date.now()}`,
      code: newZoneData.code.trim().toUpperCase(),
      name: newZoneData.name.trim(),
      currentTemp: newZoneData.minTemp + 3.0,
      minTemp: newZoneData.minTemp,
      maxTemp: newZoneData.maxTemp,
      isQuarantine: newZoneData.isQuarantine,
      isActive: newZoneData.isActive,
      racks: [],
    };

    const newLog: FreezerAuditLog = {
      id: `aud-${Date.now()}`,
      zoneId: newZone.id,
      zoneCode: newZone.code,
      action: "TAMBAH_ZONA",
      changedBy: "Staf Operasional Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Penambahan zona cold storage ${newZone.code} (${newZone.name})`,
      changes: [
        { field: "code", oldValue: "-", newValue: newZone.code },
        { field: "name", oldValue: "-", newValue: newZone.name },
        { field: "batasSuhu", oldValue: "-", newValue: `${newZone.minTemp}°C s/d ${newZone.maxTemp}°C` },
      ],
    };

    setZones([...zones, newZone]);
    setAuditLogs([newLog, ...auditLogs]);
    setIsAddZoneModalOpen(false);
    showToast(`Zona cold storage ${newZone.code} berhasil ditambahkan!`);
  };

  // Open Edit Zone
  const openEditZoneModal = (zone: FreezerZone) => {
    setActiveZone(zone);
    setEditZoneData({
      name: zone.name,
      minTemp: zone.minTemp,
      maxTemp: zone.maxTemp,
      isQuarantine: zone.isQuarantine,
      isActive: zone.isActive,
    });
    setIsEditZoneModalOpen(true);
  };

  // Save Edit Zone
  const handleUpdateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeZone) return;

    if (!editZoneData.isQuarantine && editZoneData.maxTemp > -18) {
      alert("Peringatan Cold Chain: Batas suhu maksimal es krim komersial tidak boleh lebih hangat dari -18°C!");
      return;
    }

    const diffs: { field: string; oldValue: string; newValue: string }[] = [];
    if (activeZone.name !== editZoneData.name) {
      diffs.push({ field: "name", oldValue: activeZone.name, newValue: editZoneData.name });
    }
    if (activeZone.minTemp !== editZoneData.minTemp) {
      diffs.push({ field: "minTemp", oldValue: `${activeZone.minTemp}°C`, newValue: `${editZoneData.minTemp}°C` });
    }
    if (activeZone.maxTemp !== editZoneData.maxTemp) {
      diffs.push({ field: "maxTemp", oldValue: `${activeZone.maxTemp}°C`, newValue: `${editZoneData.maxTemp}°C` });
    }
    if (activeZone.isQuarantine !== editZoneData.isQuarantine) {
      diffs.push({ field: "isQuarantine", oldValue: activeZone.isQuarantine ? "Ya" : "Tidak", newValue: editZoneData.isQuarantine ? "Ya" : "Tidak" });
    }
    if (activeZone.isActive !== editZoneData.isActive) {
      diffs.push({ field: "isActive", oldValue: activeZone.isActive ? "Aktif" : "Non-Aktif", newValue: editZoneData.isActive ? "Aktif" : "Non-Aktif" });
    }

    const updatedZones = zones.map((z) => {
      if (z.id === activeZone.id) {
        return {
          ...z,
          name: editZoneData.name,
          minTemp: editZoneData.minTemp,
          maxTemp: editZoneData.maxTemp,
          isQuarantine: editZoneData.isQuarantine,
          isActive: editZoneData.isActive,
        };
      }
      return z;
    });

    if (diffs.length > 0) {
      const newLog: FreezerAuditLog = {
        id: `aud-${Date.now()}`,
        zoneId: activeZone.id,
        zoneCode: activeZone.code,
        action: "UPDATE_ZONA",
        changedBy: "Staf Operasional Gudang",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan data parameter zona cold storage ${activeZone.code}`,
        changes: diffs,
      };
      setAuditLogs([newLog, ...auditLogs]);
    }

    setZones(updatedZones);
    setIsEditZoneModalOpen(false);
    showToast(`Zona cold storage ${activeZone.code} berhasil diperbarui!`);
  };

  // Toggle Zone Status
  const handleToggleZoneStatus = (zone: FreezerZone) => {
    const nextStatus = !zone.isActive;
    const updatedZones = zones.map((z) => (z.id === zone.id ? { ...z, isActive: nextStatus } : z));
    const newLog: FreezerAuditLog = {
      id: `aud-${Date.now()}`,
      zoneId: zone.id,
      zoneCode: zone.code,
      action: "UBAH_STATUS_ZONA",
      changedBy: "Staf Operasional Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status aktif zona ${zone.code} menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        { field: "isActive", oldValue: zone.isActive ? "Aktif" : "Non-Aktif", newValue: nextStatus ? "Aktif" : "Non-Aktif" },
      ],
    };
    setZones(updatedZones);
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Status zona ${zone.code} diubah menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`);
  };

  // Open Add Rack Modal
  const openAddRackModal = (zone: FreezerZone) => {
    setActiveZone(zone);
    const rackNumber = String(zone.racks.length + 1).padStart(2, "0");
    setNewRackData({
      code: `${zone.code}/RAK-${rackNumber}`,
      capacityDus: 100,
      temperature: zone.currentTemp,
      isQuarantine: zone.isQuarantine,
    });
    setIsAddRackModalOpen(true);
  };

  // Save New Rack
  const handleSaveRack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeZone) return;

    const newRack: RackItem = {
      id: `r-${Date.now()}`,
      code: newRackData.code.trim().toUpperCase(),
      capacityDus: Number(newRackData.capacityDus),
      occupiedDus: 0,
      temperature: Number(newRackData.temperature),
      isQuarantine: newRackData.isQuarantine,
      status: "NORMAL",
      isActive: true,
    };

    const updatedZones = zones.map((z) => {
      if (z.id === activeZone.id) {
        return {
          ...z,
          racks: [...z.racks, newRack],
        };
      }
      return z;
    });

    const newLog: FreezerAuditLog = {
      id: `aud-${Date.now()}`,
      zoneId: activeZone.id,
      zoneCode: activeZone.code,
      rackId: newRack.id,
      rackCode: newRack.code,
      action: "TAMBAH_RAK",
      changedBy: "Staf Operasional Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Penambahan rak penyimpanan palet ${newRack.code} di ${activeZone.code}`,
      changes: [
        { field: "code", oldValue: "-", newValue: newRack.code },
        { field: "capacityDus", oldValue: "-", newValue: `${newRack.capacityDus} Dus` },
        { field: "temperature", oldValue: "-", newValue: `${newRack.temperature}°C` },
      ],
    };

    setZones(updatedZones);
    setAuditLogs([newLog, ...auditLogs]);
    setIsAddRackModalOpen(false);
    showToast(`Rak ${newRack.code} berhasil ditambahkan ke zona ${activeZone.code}!`);
  };

  // Open Edit Rack Modal
  const openEditRackModal = (zone: FreezerZone, rack: RackItem) => {
    setActiveZone(zone);
    setActiveRack(rack);
    setEditRackData({
      code: rack.code,
      capacityDus: rack.capacityDus,
      temperature: rack.temperature,
      isQuarantine: rack.isQuarantine,
      status: rack.status,
      isActive: rack.isActive,
    });
    setIsEditRackModalOpen(true);
  };

  // Save Edit Rack
  const handleUpdateRack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeZone || !activeRack) return;

    const diffs: { field: string; oldValue: string; newValue: string }[] = [];
    if (activeRack.code !== editRackData.code) {
      diffs.push({ field: "code", oldValue: activeRack.code, newValue: editRackData.code });
    }
    if (activeRack.capacityDus !== editRackData.capacityDus) {
      diffs.push({ field: "capacityDus", oldValue: `${activeRack.capacityDus} Dus`, newValue: `${editRackData.capacityDus} Dus` });
    }
    if (activeRack.temperature !== editRackData.temperature) {
      diffs.push({ field: "temperature", oldValue: `${activeRack.temperature}°C`, newValue: `${editRackData.temperature}°C` });
    }
    if (activeRack.isQuarantine !== editRackData.isQuarantine) {
      diffs.push({ field: "isQuarantine", oldValue: activeRack.isQuarantine ? "Ya" : "Tidak", newValue: editRackData.isQuarantine ? "Ya" : "Tidak" });
    }
    if (activeRack.status !== editRackData.status) {
      diffs.push({ field: "status", oldValue: activeRack.status, newValue: editRackData.status });
    }
    if (activeRack.isActive !== editRackData.isActive) {
      diffs.push({ field: "isActive", oldValue: activeRack.isActive ? "Aktif" : "Non-Aktif", newValue: editRackData.isActive ? "Aktif" : "Non-Aktif" });
    }

    const updatedZones = zones.map((z) => {
      if (z.id === activeZone.id) {
        return {
          ...z,
          racks: z.racks.map((r) => {
            if (r.id === activeRack.id) {
              return {
                ...r,
                code: editRackData.code,
                capacityDus: Number(editRackData.capacityDus),
                temperature: Number(editRackData.temperature),
                isQuarantine: editRackData.isQuarantine,
                status: editRackData.status,
                isActive: editRackData.isActive,
              };
            }
            return r;
          }),
        };
      }
      return z;
    });

    if (diffs.length > 0) {
      const newLog: FreezerAuditLog = {
        id: `aud-${Date.now()}`,
        zoneId: activeZone.id,
        zoneCode: activeZone.code,
        rackId: activeRack.id,
        rackCode: activeRack.code,
        action: "UPDATE_RAK",
        changedBy: "Staf Operasional Gudang",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan data rak penyimpanan ${activeRack.code}`,
        changes: diffs,
      };
      setAuditLogs([newLog, ...auditLogs]);
    }

    setZones(updatedZones);
    setIsEditRackModalOpen(false);
    showToast(`Data rak ${activeRack.code} berhasil diperbarui!`);
  };

  // Toggle Rack Status
  const handleToggleRackStatus = (zone: FreezerZone, rack: RackItem) => {
    const nextStatus = !rack.isActive;
    const updatedZones = zones.map((z) => {
      if (z.id === zone.id) {
        return {
          ...z,
          racks: z.racks.map((r) => (r.id === rack.id ? { ...r, isActive: nextStatus } : r)),
        };
      }
      return z;
    });

    const newLog: FreezerAuditLog = {
      id: `aud-${Date.now()}`,
      zoneId: zone.id,
      zoneCode: zone.code,
      rackId: rack.id,
      rackCode: rack.code,
      action: "UBAH_STATUS_RAK",
      changedBy: "Staf Operasional Gudang",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status rak ${rack.code} menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        { field: "isActive", oldValue: rack.isActive ? "Aktif" : "Non-Aktif", newValue: nextStatus ? "Aktif" : "Non-Aktif" },
      ],
    };

    setZones(updatedZones);
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Status rak ${rack.code} diubah menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`);
  };

  // Open Audit Modal
  const openAuditModal = (zone: FreezerZone, rack?: RackItem) => {
    setActiveZone(zone);
    setActiveRack(rack || null);
    setIsAuditModalOpen(true);
  };

  const getActionBadgeClass = (action: FreezerAuditLog["action"]) => {
    switch (action) {
      case "TAMBAH_ZONA":
      case "TAMBAH_RAK":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "UPDATE_ZONA":
      case "UPDATE_RAK":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "UBAH_STATUS_ZONA":
      case "UBAH_STATUS_RAK":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Filter audit logs for active modal
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!activeZone) return true;
    if (activeRack) {
      return log.rackId === activeRack.id || log.rackCode === activeRack.code;
    }
    return log.zoneId === activeZone.id || log.zoneCode === activeZone.code;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen lokasi penyimpanan es krim, kapasitas rak palet, audit suhu cold chain, dan status aktif fasilitas gudang.
          </p>
        </div>

        <button
          onClick={openAddZoneModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
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
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Sistem Otomasi Ambang Batas Suhu Dingin (Cold Chain Integrity)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Suhu es krim wajib dijaga di bawah <strong>-18&deg;C</strong>. Jika suhu &gt; -18&deg;C selama 30 menit, sistem otomatis memblokir alokasi picking batch ke zona tersebut.
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono whitespace-nowrap">
          {zones.filter((z) => z.isActive).length}/{zones.length} ZONA AKTIF
        </div>
      </div>

      {/* Grid of Freezer Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const totalCapacity = zone.racks.reduce((acc, r) => acc + (r.isActive ? r.capacityDus : 0), 0);
          const totalOccupied = zone.racks.reduce((acc, r) => acc + (r.isActive ? r.occupiedDus : 0), 0);
          const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
          const isTempSafe = zone.currentTemp <= -18;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm transition-all ${
                !zone.isActive
                  ? "opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
                  : zone.isQuarantine
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
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          zone.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {zone.isActive ? "AKTIF" : "NON-AKTIF"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                      {zone.name}
                    </h3>
                  </div>
                </div>

                {/* Telemetry pill & Actions */}
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border ${
                      isTempSafe
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse"
                    }`}
                  >
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    <span>{zone.currentTemp}&deg;C</span>
                  </div>

                  <button
                    onClick={() => openEditZoneModal(zone)}
                    title="Ubah Zona Cold Storage"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openAuditModal(zone)}
                    title="Riwayat Perubahan & Sensor Suhu"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleZoneStatus(zone)}
                    title={zone.isActive ? "Nonaktifkan Zona" : "Aktifkan Zona"}
                    className={`p-1.5 rounded-lg transition ${
                      zone.isActive
                        ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Occupancy Progress */}
              <div className="py-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">
                    Kapasitas Terisi ({zone.racks.filter((r) => r.isActive).length} Rak Aktif)
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
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Daftar Rak Penyimpanan:</span>
                  <span className="text-[10px] lowercase text-slate-400">
                    ({zone.racks.length} rak terdaftar)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {zone.racks.map((rack) => {
                    const rackRate = Math.round((rack.occupiedDus / rack.capacityDus) * 100);
                    return (
                      <div
                        key={rack.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                          !rack.isActive
                            ? "opacity-50 bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800"
                            : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                              {rack.code}
                            </span>
                            {!rack.isActive && (
                              <span className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                                OFF
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                            {rack.occupiedDus} / {rack.capacityDus} Dus ({rackRate}%)
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold mr-1">
                            {rack.temperature}&deg;C
                          </span>
                          <button
                            onClick={() => openEditRackModal(zone, rack)}
                            title="Edit Rak"
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleToggleRackStatus(zone, rack)}
                            title={rack.isActive ? "Nonaktifkan Rak" : "Aktifkan Rak"}
                            className={`p-1 rounded transition ${
                              rack.isActive
                                ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            }`}
                          >
                            <Power className="w-3 h-3" />
                          </button>
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
                  onClick={() => openAddRackModal(zone)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Rak
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Tambah Zona Cold Storage */}
      {isAddZoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Tambah Zona Cold Storage Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Konfigurasi parameter suhu dingin dan status karantina
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddZoneModalOpen(false)}
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
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

                <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={newZoneData.isActive}
                    onChange={(e) =>
                      setNewZoneData({ ...newZoneData, isActive: e.target.checked })
                    }
                    className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Status Zona Aktif (Siap Menerima Alokasi Rak)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddZoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Zona Cold Storage */}
      {isEditZoneModalOpen && activeZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Ubah Zona Cold Storage: {activeZone.code}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pembaruan nama ruang dan ambang batas suhu operasional
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditZoneModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateZone} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Ruang Cold Storage <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editZoneData.name}
                  onChange={(e) => setEditZoneData({ ...editZoneData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Minimal (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={editZoneData.minTemp}
                    onChange={(e) =>
                      setEditZoneData({ ...editZoneData, minTemp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Maksimal (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={editZoneData.maxTemp}
                    onChange={(e) =>
                      setEditZoneData({ ...editZoneData, maxTemp: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editZoneData.isQuarantine}
                    onChange={(e) =>
                      setEditZoneData({ ...editZoneData, isQuarantine: e.target.checked })
                    }
                    className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Zona Karantina Khusus
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tandai jika ruang ini khusus isolasi es krim meleleh/rusak.
                    </span>
                  </div>
                </label>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Status Keaktifan Zona
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Zona non-aktif tidak menerima alokasi batch
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditZoneData({ ...editZoneData, isActive: !editZoneData.isActive })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      editZoneData.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {editZoneData.isActive ? "AKTIF" : "NON-AKTIF"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditZoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Tambah Rak Penyimpanan Baru */}
      {isAddRackModalOpen && activeZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Tambah Rak ke Zona: {activeZone.code}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Alokasi nomor rak dan kapasitas tampung dus es krim
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRack} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Rak Palet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newRackData.code}
                  onChange={(e) => setNewRackData({ ...newRackData, code: e.target.value })}
                  placeholder="Contoh: FRZ-A/RAK-04"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kapasitas Maksimal (Dus) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRackData.capacityDus}
                    onChange={(e) =>
                      setNewRackData({ ...newRackData, capacityDus: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sensor Suhu Rak (&deg;C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRackData.temperature}
                    onChange={(e) =>
                      setNewRackData({ ...newRackData, temperature: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRackData.isQuarantine}
                    onChange={(e) =>
                      setNewRackData({ ...newRackData, isQuarantine: e.target.checked })
                    }
                    className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Rak Khusus Karantina
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tandai jika rak ini hanya untuk barang non-conforming / melting batch.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Rak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Edit Rak Penyimpanan */}
      {isEditRackModalOpen && activeZone && activeRack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Ubah Rak Penyimpanan: {activeRack.code}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Zona: <span className="font-mono font-bold text-indigo-500">{activeZone.code}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditRackModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRack} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Rak Palet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editRackData.code}
                  onChange={(e) => setEditRackData({ ...editRackData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kapasitas Maksimal (Dus)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editRackData.capacityDus}
                    onChange={(e) =>
                      setEditRackData({ ...editRackData, capacityDus: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sensor Suhu Rak (&deg;C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editRackData.temperature}
                    onChange={(e) =>
                      setEditRackData({ ...editRackData, temperature: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Sensor Rak
                  </label>
                  <select
                    value={editRackData.status}
                    onChange={(e) =>
                      setEditRackData({
                        ...editRackData,
                        status: e.target.value as RackItem["status"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="NORMAL">NORMAL (&le; -18&deg;C)</option>
                    <option value="WARNING">WARNING (-17&deg;C s/d -15&deg;C)</option>
                    <option value="CRITICAL">CRITICAL (&gt; -15&deg;C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Keaktifan Rak
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditRackData({ ...editRackData, isActive: !editRackData.isActive })}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      editRackData.isActive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{editRackData.isActive ? "RAK AKTIF" : "NON-AKTIF"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editRackData.isQuarantine}
                    onChange={(e) =>
                      setEditRackData({ ...editRackData, isQuarantine: e.target.checked })
                    }
                    className="mt-0.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Rak Khusus Karantina
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tandai jika rak ini dialokasikan untuk isolasi barang melting.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditRackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Rak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Riwayat Perubahan (Audit Trail & Telemetry Log) */}
      {isAuditModalOpen && activeZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Riwayat Perubahan Data &amp; Sensor Suhu
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Zona: <span className="font-mono font-bold text-amber-600">{activeZone.code}</span>
                    {activeRack && (
                      <span> &rsaquo; Rak: <span className="font-mono font-bold text-cyan-600">{activeRack.code}</span></span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {filteredAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan untuk zona/rak ini.
                </div>
              ) : (
                filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeClass(
                            log.action
                          )}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                        {log.rackCode && (
                          <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            [{log.rackCode}]
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {log.notes}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.changedBy}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {log.changedAt}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {log.changes.map((ch, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800"
                        >
                          <span className="font-semibold text-slate-600 dark:text-slate-400">
                            {ch.field}:
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="line-through text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                              {ch.oldValue}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                              {ch.newValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                Tutup Riwayat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
