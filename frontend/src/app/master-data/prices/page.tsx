"use client";

import React, { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Edit3,
  Calendar,
  AlertCircle,
  Save,
  X,
  History,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PriceRow {
  id: string;
  sku: string;
  name: string;
  uom: string;
  baseHpp: number;
  mtPrice: number; // Modern Trade
  gtPrice: number; // General Trade
  hkPrice: number; // Horeka
  agPrice: number; // Agen/Grosir
  effectiveDate: string;
  isActive: boolean;
}

interface PriceAuditLog {
  id: string;
  priceId: string;
  sku: string;
  productName: string;
  uom: string;
  action: "TAMBAH_HARGA" | "UPDATE_HARGA" | "UBAH_STATUS";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const INITIAL_PRICES: PriceRow[] = [
  {
    id: "pr-1",
    sku: "MIA-BLU-60",
    name: "Blueberry Ice 60/114 (Miami)",
    uom: "DUS (60 Pcs)",
    baseHpp: 64865,
    mtPrice: 110000,
    gtPrice: 120000,
    hkPrice: 105000,
    agPrice: 99000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-2",
    sku: "MIA-BLU-60",
    name: "Blueberry Ice 60/114 (Miami)",
    uom: "PCS",
    baseHpp: 1081,
    mtPrice: 1850,
    gtPrice: 2000,
    hkPrice: 1750,
    agPrice: 1650,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-3",
    sku: "MIA-CRN-40",
    name: "Choco Corn 40/140 (Miami)",
    uom: "DUS (40 Pcs)",
    baseHpp: 57658,
    mtPrice: 110000,
    gtPrice: 120000,
    hkPrice: 105000,
    agPrice: 94000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-4",
    sku: "MIA-GLD-40",
    name: "Golden Corn 40/140 (Miami)",
    uom: "DUS (40 Pcs)",
    baseHpp: 57658,
    mtPrice: 110000,
    gtPrice: 120000,
    hkPrice: 105000,
    agPrice: 94000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-5",
    sku: "MIA-DBC-40",
    name: "Double Crumble Cho - Isi 40 (Miami)",
    uom: "DUS (40 Pcs)",
    baseHpp: 86487,
    mtPrice: 140000,
    gtPrice: 150000,
    hkPrice: 135000,
    agPrice: 130000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-6",
    sku: "MIA-DUR-60",
    name: "King Durian / Big Mango 60 (Miami)",
    uom: "DUS (60 Pcs)",
    baseHpp: 59460,
    mtPrice: 110000,
    gtPrice: 120000,
    hkPrice: 105000,
    agPrice: 96000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-7",
    sku: "MIA-MIC-24",
    name: "Micro Cone 24 (Miami)",
    uom: "DUS (24 Pcs)",
    baseHpp: 64865,
    mtPrice: 110000,
    gtPrice: 120000,
    hkPrice: 105000,
    agPrice: 96000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-8",
    sku: "MIA-RNF-50",
    name: "Rainbow Frost 50/114 (Miami)",
    uom: "DUS (50 Pcs)",
    baseHpp: 49550,
    mtPrice: 90000,
    gtPrice: 100000,
    hkPrice: 85000,
    agPrice: 80000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
  {
    id: "pr-9",
    sku: "MIA-PAL-5L",
    name: "Vanilla Ice Cream 5 Liter Pail (Miami/Alaska)",
    uom: "EMBER/PAIL",
    baseHpp: 70000,
    mtPrice: 105000,
    gtPrice: 118500,
    hkPrice: 95000,
    agPrice: 91000,
    effectiveDate: "2026-10-01",
    isActive: true,
  },
];

const INITIAL_AUDIT_LOGS: PriceAuditLog[] = [
  {
    id: "log-p-1",
    priceId: "pr-1",
    sku: "ICR-001",
    productName: "Vanilla Bean Classic 100 ml",
    uom: "DUS (24 Pcs)",
    action: "TAMBAH_HARGA",
    changedBy: "Budi Utomo (Finance SME)",
    changedAt: "2026-10-01 08:00:00",
    notes: "Penetapan price list matrix semester II tahun 2026",
    changes: [
      { field: "Harga MT", oldValue: "-", newValue: "Rp 120.000" },
      { field: "Harga GT", oldValue: "-", newValue: "Rp 125.000" },
      { field: "Harga Agen", oldValue: "-", newValue: "Rp 108.000" },
    ],
  },
];

export default function PriceMatrixPage() {
  const [prices, setPrices] = useState<PriceRow[]>(INITIAL_PRICES);
  const [auditLogs, setAuditLogs] = useState<PriceAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUom, setSelectedUom] = useState("Semua");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<PriceRow | null>(null);

  // Form state
  const [priceForm, setPriceForm] = useState({
    sku: "ICR-001",
    name: "Vanilla Bean Classic 100 ml",
    uom: "DUS (24 Pcs)",
    baseHpp: 84000,
    mtPrice: 120000,
    gtPrice: 125000,
    hkPrice: 115000,
    agPrice: 108000,
    effectiveDate: "2026-11-01",
    isActive: true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const calcMargin = (price: number, hpp: number) => {
    if (!price || price <= 0) return 0;
    return Number((((price - hpp) / price) * 100).toFixed(1));
  };

  const filteredPrices = prices.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUom =
      selectedUom === "Semua" || p.uom.toLowerCase().includes(selectedUom.toLowerCase());
    return matchesSearch && matchesUom;
  });

  // Open Add Modal
  const openAddModal = () => {
    setPriceForm({
      sku: "ICR-001",
      name: "Vanilla Bean Classic 100 ml",
      uom: "DUS (24 Pcs)",
      baseHpp: 84000,
      mtPrice: 120000,
      gtPrice: 125000,
      hkPrice: 115000,
      agPrice: 108000,
      effectiveDate: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: PriceRow) => {
    setActiveItem(item);
    setPriceForm({
      sku: item.sku,
      name: item.name,
      uom: item.uom,
      baseHpp: item.baseHpp,
      mtPrice: item.mtPrice,
      gtPrice: item.gtPrice,
      hkPrice: item.hkPrice,
      agPrice: item.agPrice,
      effectiveDate: item.effectiveDate,
      isActive: item.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Open Audit Modal
  const openAuditModal = (item: PriceRow) => {
    setActiveItem(item);
    setIsAuditModalOpen(true);
  };

  // Toggle Status
  const handleToggleStatus = (item: PriceRow) => {
    const nextStatus = !item.isActive;
    const updated = prices.map((p) =>
      p.id === item.id ? { ...p, isActive: nextStatus } : p
    );
    setPrices(updated);

    const newAudit: PriceAuditLog = {
      id: `log-p-${Date.now()}`,
      priceId: item.id,
      sku: item.sku,
      productName: item.name,
      uom: item.uom,
      action: "UBAH_STATUS",
      changedBy: "Budi Utomo (Finance SME)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status matriks harga menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        {
          field: "Status Matriks Harga",
          oldValue: item.isActive ? "Aktif" : "Non-Aktif",
          newValue: nextStatus ? "Aktif" : "Non-Aktif",
        },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);
    showToast(`Matriks harga ${item.sku} (${item.uom}) diubah ke ${nextStatus ? "AKTIF" : "NON-AKTIF"}.`);
  };

  // Save New Price
  const handleSaveNewPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrice: PriceRow = {
      id: `pr-${Date.now()}`,
      sku: priceForm.sku,
      name: priceForm.name,
      uom: priceForm.uom,
      baseHpp: Number(priceForm.baseHpp),
      mtPrice: Number(priceForm.mtPrice),
      gtPrice: Number(priceForm.gtPrice),
      hkPrice: Number(priceForm.hkPrice),
      agPrice: Number(priceForm.agPrice),
      effectiveDate: priceForm.effectiveDate,
      isActive: priceForm.isActive,
    };
    setPrices([newPrice, ...prices]);

    const newAudit: PriceAuditLog = {
      id: `log-p-${Date.now()}`,
      priceId: newPrice.id,
      sku: newPrice.sku,
      productName: newPrice.name,
      uom: newPrice.uom,
      action: "TAMBAH_HARGA",
      changedBy: "Budi Utomo (Finance SME)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: "Pendaftaran matriks harga baru per segmen pelanggan",
      changes: [
        { field: "Modern Trade", oldValue: "-", newValue: formatRupiah(newPrice.mtPrice) },
        { field: "General Trade", oldValue: "-", newValue: formatRupiah(newPrice.gtPrice) },
        { field: "Agen/Grosir", oldValue: "-", newValue: formatRupiah(newPrice.agPrice) },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setIsAddModalOpen(false);
    showToast(`Matriks harga baru untuk '${newPrice.name}' (${newPrice.uom}) berhasil ditambahkan.`);
  };

  // Save Edit Price
  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (activeItem.baseHpp !== Number(priceForm.baseHpp)) {
      changes.push({
        field: "HPP Acuan",
        oldValue: formatRupiah(activeItem.baseHpp),
        newValue: formatRupiah(Number(priceForm.baseHpp)),
      });
    }
    if (activeItem.mtPrice !== Number(priceForm.mtPrice)) {
      changes.push({
        field: "Modern Trade",
        oldValue: formatRupiah(activeItem.mtPrice),
        newValue: formatRupiah(Number(priceForm.mtPrice)),
      });
    }
    if (activeItem.gtPrice !== Number(priceForm.gtPrice)) {
      changes.push({
        field: "General Trade",
        oldValue: formatRupiah(activeItem.gtPrice),
        newValue: formatRupiah(Number(priceForm.gtPrice)),
      });
    }
    if (activeItem.hkPrice !== Number(priceForm.hkPrice)) {
      changes.push({
        field: "Horeka",
        oldValue: formatRupiah(activeItem.hkPrice),
        newValue: formatRupiah(Number(priceForm.hkPrice)),
      });
    }
    if (activeItem.agPrice !== Number(priceForm.agPrice)) {
      changes.push({
        field: "Agen/Grosir",
        oldValue: formatRupiah(activeItem.agPrice),
        newValue: formatRupiah(Number(priceForm.agPrice)),
      });
    }
    if (activeItem.isActive !== priceForm.isActive) {
      changes.push({
        field: "Status",
        oldValue: activeItem.isActive ? "Aktif" : "Non-Aktif",
        newValue: priceForm.isActive ? "Aktif" : "Non-Aktif",
      });
    }

    const updated = prices.map((p) => {
      if (p.id === activeItem.id) {
        return {
          ...p,
          baseHpp: Number(priceForm.baseHpp),
          mtPrice: Number(priceForm.mtPrice),
          gtPrice: Number(priceForm.gtPrice),
          hkPrice: Number(priceForm.hkPrice),
          agPrice: Number(priceForm.agPrice),
          effectiveDate: priceForm.effectiveDate,
          isActive: priceForm.isActive,
        };
      }
      return p;
    });

    setPrices(updated);

    if (changes.length > 0) {
      const newAudit: PriceAuditLog = {
        id: `log-p-${Date.now()}`,
        priceId: activeItem.id,
        sku: activeItem.sku,
        productName: activeItem.name,
        uom: activeItem.uom,
        action: "UPDATE_HARGA",
        changedBy: "Budi Utomo (Finance SME)",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Penyesuaian matriks harga jual ${activeItem.sku} (${activeItem.uom})`,
        changes,
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }

    setIsEditModalOpen(false);
    showToast(`Matriks harga ${activeItem.sku} berhasil diperbarui.`);
  };

  const activeAuditLogs = activeItem
    ? auditLogs.filter((log) => log.priceId === activeItem.id || log.sku === activeItem.sku)
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
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
              Price List Matrix (Daftar Harga Jual)
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-cyan-500" />
            Matriks Harga Jual Segmen Pelanggan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Penguncian harga otomatis (*Auto-Lock Pricing*) berdasarkan kombinasi SKU &times; Satuan (UOM) &times; Kanal Outlet.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Matriks Harga</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SKU atau nama produk es krim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedUom}
            onChange={(e) => setSelectedUom(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="Semua">Semua Satuan UOM</option>
            <option value="DUS">DUS (Karton)</option>
            <option value="PACK">PACK</option>
            <option value="PCS">PCS (Base Unit)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">SKU &amp; Produk</th>
                <th className="px-5 py-3.5">Satuan (UOM)</th>
                <th className="px-5 py-3.5">HPP Acuan</th>
                <th className="px-5 py-3.5">Modern Trade</th>
                <th className="px-5 py-3.5">General Trade</th>
                <th className="px-5 py-3.5">Horeka</th>
                <th className="px-5 py-3.5">Agen / Grosir</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPrices.map((item) => {
                const mtMargin = calcMargin(item.mtPrice, item.baseHpp);
                const gtMargin = calcMargin(item.gtPrice, item.baseHpp);
                const agMargin = calcMargin(item.agPrice, item.baseHpp);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                        {item.sku}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                        {item.name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.uom}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {formatRupiah(item.baseHpp)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                        {formatRupiah(item.mtPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{mtMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                        {formatRupiah(item.gtPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{gtMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                        {formatRupiah(item.hkPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Margin:{" "}
                        <span className="text-emerald-500 font-medium">
                          {calcMargin(item.hkPrice, item.baseHpp)}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono tabular-nums">
                        {formatRupiah(item.agPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{agMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title="Klik untuk ubah status aktif/non-aktif matriks"
                        className="cursor-pointer"
                      >
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20 hover:bg-slate-500/20 transition">
                            Non-Aktif
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Ubah Matriks Harga"
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openAuditModal(item)}
                          title="Riwayat Jejak Audit Harga"
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <History className="w-3.5 h-3.5 text-amber-500" />
                          <span>Riwayat</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Matriks Harga */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Tambah Matriks Harga Jual Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Konfigurasi harga per kanal pelanggan dan UOM
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPrice} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode SKU Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={priceForm.sku}
                    onChange={(e) => setPriceForm({ ...priceForm, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan Penjualan (UOM)
                  </label>
                  <select
                    value={priceForm.uom}
                    onChange={(e) => setPriceForm({ ...priceForm, uom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="DUS (24 Pcs)">DUS (24 Pcs)</option>
                    <option value="DUS (20 Pcs)">DUS (20 Pcs)</option>
                    <option value="PACK (6 Pcs)">PACK (6 Pcs)</option>
                    <option value="PCS">PCS (Base Unit)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Produk Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={priceForm.name}
                  onChange={(e) => setPriceForm({ ...priceForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HPP Acuan Modal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={priceForm.baseHpp}
                  onChange={(e) => setPriceForm({ ...priceForm, baseHpp: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    Modern Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.mtPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, mtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.mtPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    General Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.gtPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, gtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.gtPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Horeka (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.hkPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, hkPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.hkPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                    Agen / Grosir (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.agPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, agPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.agPrice, priceForm.baseHpp)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Matriks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Harga */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Atur Matriks Harga Produk
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeItem.sku} &bull; {activeItem.name} ({activeItem.uom})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HPP Acuan Modal (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={priceForm.baseHpp}
                  onChange={(e) => setPriceForm({ ...priceForm, baseHpp: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    Modern Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.mtPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, mtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.mtPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    General Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.gtPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, gtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.gtPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Horeka (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.hkPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, hkPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.hkPrice, priceForm.baseHpp)}%
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                    Agen / Grosir (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={priceForm.agPrice}
                    onChange={(e) => setPriceForm({ ...priceForm, agPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <span className="text-[10px] text-slate-400">
                    Margin: {calcMargin(priceForm.agPrice, priceForm.baseHpp)}%
                  </span>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Status Matriks Harga
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Matriks harga aktif digunakan untuk penguncian harga otomatis di Sales Order
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPriceForm({ ...priceForm, isActive: !priceForm.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    priceForm.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {priceForm.isActive ? "AKTIF" : "NON-AKTIF"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Riwayat Perubahan (Audit Trail) */}
      {isAuditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Riwayat Perubahan Matriks Harga
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Produk: <span className="font-bold text-slate-700 dark:text-slate-200">{activeItem.name}</span> ({activeItem.sku} &bull; {activeItem.uom})
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

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {activeAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan harga untuk produk ini.
                </div>
              ) : (
                activeAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === "TAMBAH_HARGA"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">{log.id}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
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

                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      &quot;{log.notes}&quot;
                    </p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="space-y-1 text-xs">
                        {log.changes.map((ch, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                          >
                            <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                              {ch.field}:
                            </span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              <span className="text-rose-600 dark:text-rose-400 line-through">
                                {ch.oldValue}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {ch.newValue}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
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
