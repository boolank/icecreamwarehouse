"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Layers,
  ThermometerSnowflake,
  Barcode,
  CheckCircle2,
  AlertCircle,
  X,
  History
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface ProductUomItem {
  id?: string;
  uomName: string;
  conversionRatio: number;
  isBaseUnit: boolean;
  barcode?: string;
}

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  barcode: string;
  minTemp: number;
  maxTemp: number;
  stockInPcs: number;
  isActive: boolean;
  uoms: ProductUomItem[];
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    sku: "ICR-001",
    name: "Vanilla Bean Classic 100 ml",
    category: "Cup",
    barcode: "8992761001",
    minTemp: -25,
    maxTemp: -18,
    stockInPcs: 1440,
    isActive: true,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "899276100101" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "899276100124" },
    ],
  },
  {
    id: "p2",
    sku: "ICR-002",
    name: "Chocolate Fudge Bar 90 ml",
    category: "Stick/Bar",
    barcode: "8992761002",
    minTemp: -25,
    maxTemp: -18,
    stockInPcs: 864,
    isActive: true,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "899276100201" },
      { uomName: "PACK", conversionRatio: 6, isBaseUnit: false, barcode: "899276100206" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "899276100224" },
    ],
  },
  {
    id: "p3",
    sku: "ICR-003",
    name: "Strawberry Swirl Cup 100 ml",
    category: "Cup",
    barcode: "8992761003",
    minTemp: -25,
    maxTemp: -18,
    stockInPcs: 1200,
    isActive: true,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "899276100301" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "899276100324" },
    ],
  },
  {
    id: "p4",
    sku: "ICR-004",
    name: "Mango Sorbet 120 ml",
    category: "Cup",
    barcode: "8992761004",
    minTemp: -25,
    maxTemp: -18,
    stockInPcs: 960,
    isActive: true,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "899276100401" },
      { uomName: "DUS", conversionRatio: 20, isBaseUnit: false, barcode: "899276100420" },
    ],
  },
  {
    id: "p5",
    sku: "ICR-005",
    name: "Cookies & Cream 100 ml",
    category: "Stick/Bar",
    barcode: "8992761005",
    minTemp: -25,
    maxTemp: -18,
    stockInPcs: 1920,
    isActive: true,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "899276100501" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "899276100524" },
    ],
  },
];

export default function MasterProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Cup",
    barcode: "",
    minTemp: -25,
    maxTemp: -18,
    uoms: [
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "" },
    ],
  });

  const categories = ["Semua", "Cup", "Stick/Bar", "Cone", "Bulk/Family Pack"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchesCat =
      selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `ICR-00${products.length + 1}`,
      name: "",
      category: "Cup",
      barcode: "",
      minTemp: -25,
      maxTemp: -18,
      uoms: [
        { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "" },
        { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "" },
      ],
    });
    setIsModalOpen(true);
  };

  const handleAddUomRow = () => {
    setFormData((prev) => ({
      ...prev,
      uoms: [
        ...prev.uoms,
        { uomName: "PACK", conversionRatio: 6, isBaseUnit: false, barcode: "" },
      ],
    }));
  };

  const handleRemoveUomRow = (index: number) => {
    if (formData.uoms[index].isBaseUnit) {
      alert("Satuan Dasar (Base Unit) tidak boleh dihapus!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      uoms: prev.uoms.filter((_, i) => i !== index),
    }));
  };

  const handleSetBaseUnit = (targetIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      uoms: prev.uoms.map((u, i) => ({
        ...u,
        isBaseUnit: i === targetIndex,
        conversionRatio: i === targetIndex ? 1 : u.conversionRatio,
      })),
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify exactly 1 base unit
    const baseUnits = formData.uoms.filter((u) => u.isBaseUnit);
    if (baseUnits.length !== 1) {
      alert("Produk wajib memiliki tepat 1 Satuan Dasar (Base Unit)!");
      return;
    }

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      barcode: formData.barcode || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      minTemp: formData.minTemp,
      maxTemp: formData.maxTemp,
      stockInPcs: 0,
      isActive: true,
      uoms: formData.uoms,
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Master Data</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Katalog Produk &amp; Multi-UOM
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-500" />
            Katalog Produk &amp; Multi-UOM
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola SKU es krim, spesifikasi suhu simpan, dan rasio konversi satuan bertingkat (PCS, PACK, DUS).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SKU, nama produk, atau nomor barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">SKU &amp; Barcode</th>
                <th className="px-5 py-3.5">Nama Produk</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Satuan Konversi (Multi-UOM)</th>
                <th className="px-5 py-3.5">Suhu Standar</th>
                <th className="px-5 py-3.5">Stok Fisik</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredProducts.map((product) => {
                const baseUom = product.uoms.find((u) => u.isBaseUnit)?.uomName || "PCS";
                const dusUom = product.uoms.find((u) => u.uomName === "DUS");
                const dusRatio = dusUom ? dusUom.conversionRatio : 24;
                const dusCount = Math.floor(product.stockInPcs / dusRatio);
                const sisaPcs = product.stockInPcs % dusRatio;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono">
                      <div className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {product.sku}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        {product.barcode}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {product.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        ID: {product.id}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.uoms.map((uom, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                              uom.isBaseUnit
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold"
                                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                            }`}
                            title={
                              uom.isBaseUnit
                                ? "Satuan Dasar (Base Unit)"
                                : `1 ${uom.uomName} = ${uom.conversionRatio} ${baseUom}`
                            }
                          >
                            <span>{uom.uomName}</span>
                            {!uom.isBaseUnit && (
                              <span className="text-[10px] text-slate-400">
                                ({uom.conversionRatio})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-mono font-medium">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        <span>{product.minTemp}&deg;C s/d {product.maxTemp}&deg;C</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {dusCount} Dus / {sisaPcs} Pcs
                      </div>
                      <div className="text-xs text-slate-400 tabular-nums">
                        Total {formatNumber(product.stockInPcs)} Pcs
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          Non-Aktif
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => alert(`Kelola Multi-UOM untuk ${product.name}`)}
                          title="Kelola Satuan Bertingkat"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Edit produk ${product.name}`)}
                          title="Ubah Produk"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Riwayat Perubahan (Audit Log) SKU ${product.sku}`)}
                          title="Riwayat Jejak Audit"
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

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Tambah Produk Es Krim Baru
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi spesifikasi produk dan hirarki Multi-UOM
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

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode SKU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode Utama (EAN-13)
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Contoh: 8992761001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Produk Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Vanilla Bean Ice Cream Cup 100 ml"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="Cup">Cup</option>
                    <option value="Stick/Bar">Stick / Bar</option>
                    <option value="Cone">Cone</option>
                    <option value="Bulk/Family Pack">Bulk / Family Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Min (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={formData.minTemp}
                    onChange={(e) => setFormData({ ...formData, minTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Max (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={formData.maxTemp}
                    onChange={(e) => setFormData({ ...formData, maxTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>
              </div>

              {/* Multi-UOM Configuration Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Konfigurasi Multi-UOM (Satuan Bertingkat)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddUomRow}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Tingkat Satuan
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  {formData.uoms.map((uom, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="w-full sm:w-28">
                        <input
                          type="text"
                          required
                          placeholder="Satuan (DUS/PCS)"
                          value={uom.uomName}
                          onChange={(e) => {
                            const newUoms = [...formData.uoms];
                            newUoms[idx].uomName = e.target.value.toUpperCase();
                            setFormData({ ...formData, uoms: newUoms });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-semibold text-slate-900 dark:text-white uppercase"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-44">
                        <span className="text-[11px] text-slate-400">Rasio =</span>
                        <input
                          type="number"
                          required
                          min="1"
                          disabled={uom.isBaseUnit}
                          value={uom.conversionRatio}
                          onChange={(e) => {
                            const newUoms = [...formData.uoms];
                            newUoms[idx].conversionRatio = Math.max(1, Number(e.target.value));
                            setFormData({ ...formData, uoms: newUoms });
                          }}
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-center font-mono disabled:opacity-50"
                        />
                        <span className="text-[11px] text-slate-400">Base Unit</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:flex-1 justify-between sm:justify-start">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="baseUnitRadio"
                            checked={uom.isBaseUnit}
                            onChange={() => handleSetBaseUnit(idx)}
                            className="text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                          <span
                            className={
                              uom.isBaseUnit
                                ? "font-bold text-cyan-600 dark:text-cyan-400"
                                : "text-slate-500"
                            }
                          >
                            Base Unit
                          </span>
                        </label>

                        {!uom.isBaseUnit && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUomRow(idx)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-500/10 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  &bull; Tepat 1 satuan harus bertindak sebagai <strong>Satuan Dasar (Base Unit)</strong> dengan rasio 1.
                </p>
              </div>

              {/* Action Buttons */}
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
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

