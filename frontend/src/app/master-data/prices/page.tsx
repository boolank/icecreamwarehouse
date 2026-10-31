"use client";

import React, { useState } from "react";
import {
  Tag,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Edit3,
  Calendar,
  AlertCircle,
  Save,
  X,
  History
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface PriceRow {
  sku: string;
  name: string;
  uom: string;
  baseHpp: number;
  mtPrice: number; // Modern Trade
  gtPrice: number; // General Trade
  hkPrice: number; // Horeka
  agPrice: number; // Agen/Grosir
  effectiveDate: string;
}

const INITIAL_PRICES: PriceRow[] = [
  {
    sku: "ICR-001",
    name: "Vanilla Bean Classic 100 ml",
    uom: "DUS (24 Pcs)",
    baseHpp: 84000,
    mtPrice: 120000,
    gtPrice: 125000,
    hkPrice: 115000,
    agPrice: 108000,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-001",
    name: "Vanilla Bean Classic 100 ml",
    uom: "PCS",
    baseHpp: 3500,
    mtPrice: 5500,
    gtPrice: 6000,
    hkPrice: 5200,
    agPrice: 4800,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-002",
    name: "Chocolate Fudge Bar 90 ml",
    uom: "DUS (24 Pcs)",
    baseHpp: 96000,
    mtPrice: 135000,
    gtPrice: 140000,
    hkPrice: 130000,
    agPrice: 122000,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-002",
    name: "Chocolate Fudge Bar 90 ml",
    uom: "PACK (6 Pcs)",
    baseHpp: 24000,
    mtPrice: 35000,
    gtPrice: 36500,
    hkPrice: 33500,
    agPrice: 31500,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-003",
    name: "Strawberry Swirl Cup 100 ml",
    uom: "DUS (24 Pcs)",
    baseHpp: 84000,
    mtPrice: 120000,
    gtPrice: 125000,
    hkPrice: 115000,
    agPrice: 108000,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-004",
    name: "Mango Sorbet 120 ml",
    uom: "DUS (20 Pcs)",
    baseHpp: 90000,
    mtPrice: 130000,
    gtPrice: 135000,
    hkPrice: 125000,
    agPrice: 118000,
    effectiveDate: "2026-10-01",
  },
  {
    sku: "ICR-005",
    name: "Cookies & Cream 100 ml",
    uom: "DUS (24 Pcs)",
    baseHpp: 102000,
    mtPrice: 145000,
    gtPrice: 150000,
    hkPrice: 140000,
    agPrice: 132000,
    effectiveDate: "2026-10-01",
  },
];

export default function MasterPricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>(INITIAL_PRICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUom, setSelectedUom] = useState("Semua");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<PriceRow | null>(null);

  const uomFilters = ["Semua", "DUS", "PCS", "PACK"];

  const filteredPrices = prices.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUom =
      selectedUom === "Semua" || item.uom.startsWith(selectedUom);
    return matchesSearch && matchesUom;
  });

  const handleOpenEdit = (item: PriceRow) => {
    setCurrentEdit({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    setPrices((prev) =>
      prev.map((p) =>
        p.sku === currentEdit.sku && p.uom === currentEdit.uom ? currentEdit : p
      )
    );
    setIsEditModalOpen(false);
  };

  const calcMargin = (price: number, hpp: number) => {
    if (price <= 0) return 0;
    return Math.round(((price - hpp) / price) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Master Data</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Matriks Harga &amp; Kanal Penjualan
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-cyan-500" />
            Matriks Harga &amp; Kanal Penjualan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Konfigurasi tiering harga jual per segmen pelanggan (Modern Trade, GT, Horeka, Agen) dan satuan UOM.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SKU atau nama produk es krim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {uomFilters.map((uom) => (
            <button
              key={uom}
              onClick={() => setSelectedUom(uom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedUom === uom
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {uom}
            </button>
          ))}
        </div>
      </div>

      {/* Price Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">SKU &amp; Produk</th>
                <th className="px-5 py-3.5">Satuan (UOM)</th>
                <th className="px-5 py-3.5">HPP Standar</th>
                <th className="px-5 py-3.5">Modern Trade</th>
                <th className="px-5 py-3.5">General Trade</th>
                <th className="px-5 py-3.5">Horeka</th>
                <th className="px-5 py-3.5">Agen / Grosir</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPrices.map((item, idx) => {
                const mtMargin = calcMargin(item.mtPrice, item.baseHpp);
                const gtMargin = calcMargin(item.gtPrice, item.baseHpp);
                const agMargin = calcMargin(item.agPrice, item.baseHpp);

                return (
                  <tr
                    key={`${item.sku}-${item.uom}-${idx}`}
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
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{mtMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                        {formatRupiah(item.gtPrice)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{gtMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                        {formatRupiah(item.hkPrice)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
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
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Margin: <span className="text-emerald-500 font-medium">{agMargin}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Ubah Matriks Harga"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Riwayat Perubahan Harga SKU ${item.sku}`)}
                          title="Riwayat Jejak Audit Harga"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <History className="w-4 h-4" />
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

      {/* Modal Edit Harga */}
      {isEditModalOpen && currentEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Atur Matriks Harga Produk
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentEdit.sku} &bull; {currentEdit.name} ({currentEdit.uom})
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

            <form onSubmit={handleSavePrice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HPP Acuan (Harga Pokok Pembelian)
                </label>
                <input
                  type="number"
                  required
                  value={currentEdit.baseHpp}
                  onChange={(e) =>
                    setCurrentEdit({ ...currentEdit, baseHpp: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    Modern Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentEdit.mtPrice}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, mtPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    General Trade (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentEdit.gtPrice}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, gtPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Horeka (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentEdit.hkPrice}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, hkPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                    Agen / Grosir (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    value={currentEdit.agPrice}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, agPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Mulai Berlaku
                </label>
                <input
                  type="date"
                  value={currentEdit.effectiveDate}
                  onChange={(e) =>
                    setCurrentEdit({ ...currentEdit, effectiveDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-sm transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

