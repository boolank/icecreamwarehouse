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
  History,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  Save,
  Info,
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

interface AuditLogEntry {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  action: "TAMBAH_PRODUK" | "UPDATE_PRODUK" | "KELOLA_UOM" | "UBAH_STATUS";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
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

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    productId: "p1",
    productSku: "ICR-001",
    productName: "Vanilla Bean Classic 100 ml",
    action: "TAMBAH_PRODUK",
    changedBy: "Nadia Rahma (Staf Operasional)",
    changedAt: "2026-10-15 09:30:12",
    notes: "Pendaftaran produk awal sistem dengan konfigurasi satuan PCS & DUS (24)",
    changes: [
      { field: "SKU", oldValue: "-", newValue: "ICR-001" },
      { field: "Nama Produk", oldValue: "-", newValue: "Vanilla Bean Classic 100 ml" },
      { field: "Kategori", oldValue: "-", newValue: "Cup" },
      { field: "Suhu Standar", oldValue: "-", newValue: "-25°C s/d -18°C" },
    ],
  },
  {
    id: "log-2",
    productId: "p2",
    productSku: "ICR-002",
    productName: "Chocolate Fudge Bar 90 ml",
    action: "KELOLA_UOM",
    changedBy: "Budi Utomo (Manajer Gudang)",
    changedAt: "2026-10-20 14:15:45",
    notes: "Penambahan satuan PACK (6 Pcs) untuk segmen toko eceran",
    changes: [
      { field: "Hirarki UOM", oldValue: "PCS (1), DUS (24)", newValue: "PCS (1), PACK (6), DUS (24)" },
    ],
  },
];

export default function MasterProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUomModalOpen, setIsUomModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Selected item references
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);

  // Form State for Add / Edit Product
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    category: "Cup",
    barcode: "",
    minTemp: -25,
    maxTemp: -18,
    isActive: true,
  });

  // State for UOM management modal
  const [uomList, setUomList] = useState<ProductUomItem[]>([]);

  // Toast / Feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

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

  // 1. OPEN ADD MODAL
  const openAddModal = () => {
    setProductForm({
      sku: `ICR-00${products.length + 1}`,
      name: "",
      category: "Cup",
      barcode: "",
      minTemp: -25,
      maxTemp: -18,
      isActive: true,
    });
    setUomList([
      { uomName: "PCS", conversionRatio: 1, isBaseUnit: true, barcode: "" },
      { uomName: "DUS", conversionRatio: 24, isBaseUnit: false, barcode: "" },
    ]);
    setIsAddModalOpen(true);
  };

  // 2. OPEN EDIT MODAL
  const openEditModal = (product: ProductItem) => {
    setActiveProduct(product);
    setProductForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      barcode: product.barcode,
      minTemp: product.minTemp,
      maxTemp: product.maxTemp,
      isActive: product.isActive,
    });
    setIsEditModalOpen(true);
  };

  // 3. OPEN UOM MODAL
  const openUomModal = (product: ProductItem) => {
    setActiveProduct(product);
    setUomList(JSON.parse(JSON.stringify(product.uoms)));
    setIsUomModalOpen(true);
  };

  // 4. OPEN AUDIT MODAL
  const openAuditModal = (product: ProductItem) => {
    setActiveProduct(product);
    setIsAuditModalOpen(true);
  };

  // Handle Add Product Submit
  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const baseUnits = uomList.filter((u) => u.isBaseUnit);
    if (baseUnits.length !== 1) {
      alert("Produk wajib memiliki tepat 1 Satuan Dasar (Base Unit) dengan rasio 1!");
      return;
    }

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      sku: productForm.sku.toUpperCase(),
      name: productForm.name,
      category: productForm.category,
      barcode: productForm.barcode || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      minTemp: productForm.minTemp,
      maxTemp: productForm.maxTemp,
      stockInPcs: 0,
      isActive: productForm.isActive,
      uoms: uomList,
    };

    setProducts([newProd, ...products]);

    // Create audit entry
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      productId: newProd.id,
      productSku: newProd.sku,
      productName: newProd.name,
      action: "TAMBAH_PRODUK",
      changedBy: "Nadia Rahma (Staf Operasional)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: "Pendaftaran produk baru melalui form input katalog",
      changes: [
        { field: "SKU", oldValue: "-", newValue: newProd.sku },
        { field: "Nama Produk", oldValue: "-", newValue: newProd.name },
        { field: "Kategori", oldValue: "-", newValue: newProd.category },
        { field: "Satuan UOM", oldValue: "-", newValue: newProd.uoms.map(u => `${u.uomName}(${u.conversionRatio})`).join(", ") },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setIsAddModalOpen(false);
    showToast(`Produk '${newProd.name}' berhasil ditambahkan ke katalog.`);
  };

  // Handle Edit Product Submit
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (activeProduct.name !== productForm.name) {
      changes.push({ field: "Nama Produk", oldValue: activeProduct.name, newValue: productForm.name });
    }
    if (activeProduct.category !== productForm.category) {
      changes.push({ field: "Kategori", oldValue: activeProduct.category, newValue: productForm.category });
    }
    if (activeProduct.barcode !== productForm.barcode) {
      changes.push({ field: "Barcode", oldValue: activeProduct.barcode, newValue: productForm.barcode });
    }
    if (activeProduct.minTemp !== productForm.minTemp || activeProduct.maxTemp !== productForm.maxTemp) {
      changes.push({
        field: "Suhu Standar",
        oldValue: `${activeProduct.minTemp}°C s/d ${activeProduct.maxTemp}°C`,
        newValue: `${productForm.minTemp}°C s/d ${productForm.maxTemp}°C`,
      });
    }
    if (activeProduct.isActive !== productForm.isActive) {
      changes.push({
        field: "Status",
        oldValue: activeProduct.isActive ? "Aktif" : "Non-Aktif",
        newValue: productForm.isActive ? "Aktif" : "Non-Aktif",
      });
    }

    const updated = products.map((p) => {
      if (p.id === activeProduct.id) {
        return {
          ...p,
          name: productForm.name,
          category: productForm.category,
          barcode: productForm.barcode,
          minTemp: productForm.minTemp,
          maxTemp: productForm.maxTemp,
          isActive: productForm.isActive,
        };
      }
      return p;
    });

    setProducts(updated);

    if (changes.length > 0) {
      const newAudit: AuditLogEntry = {
        id: `log-${Date.now()}`,
        productId: activeProduct.id,
        productSku: activeProduct.sku,
        productName: productForm.name,
        action: "UPDATE_PRODUK",
        changedBy: "Nadia Rahma (Staf Operasional)",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan data produk SKU ${activeProduct.sku}`,
        changes,
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }

    setIsEditModalOpen(false);
    showToast(`Produk '${productForm.name}' berhasil diperbarui.`);
  };

  // Handle UOM Modal Actions
  const handleAddUomRow = () => {
    setUomList([
      ...uomList,
      { uomName: "PACK", conversionRatio: 6, isBaseUnit: false, barcode: "" },
    ]);
  };

  const handleRemoveUomRow = (index: number) => {
    if (uomList[index].isBaseUnit) {
      alert("Satuan Dasar (Base Unit) tidak boleh dihapus!");
      return;
    }
    setUomList(uomList.filter((_, i) => i !== index));
  };

  const handleSetBaseUnit = (targetIndex: number) => {
    setUomList(
      uomList.map((u, i) => ({
        ...u,
        isBaseUnit: i === targetIndex,
        conversionRatio: i === targetIndex ? 1 : u.conversionRatio,
      }))
    );
  };

  const handleSaveUoms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    const baseUnits = uomList.filter((u) => u.isBaseUnit);
    if (baseUnits.length !== 1) {
      alert("Produk wajib memiliki tepat 1 Satuan Dasar (Base Unit) dengan faktor konversi 1!");
      return;
    }

    const oldUomStr = activeProduct.uoms.map(u => `${u.uomName} (${u.conversionRatio}${u.isBaseUnit ? ' Base' : ''})`).join(", ");
    const newUomStr = uomList.map(u => `${u.uomName} (${u.conversionRatio}${u.isBaseUnit ? ' Base' : ''})`).join(", ");

    const updated = products.map((p) => {
      if (p.id === activeProduct.id) {
        return {
          ...p,
          uoms: uomList,
        };
      }
      return p;
    });

    setProducts(updated);

    // Audit log
    const newAudit: AuditLogEntry = {
      id: `log-${Date.now()}`,
      productId: activeProduct.id,
      productSku: activeProduct.sku,
      productName: activeProduct.name,
      action: "KELOLA_UOM",
      changedBy: "Budi Utomo (Manajer Gudang)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: "Rekonfigurasi hirarki konversi satuan Multi-UOM",
      changes: [
        { field: "Hirarki Konversi UOM", oldValue: oldUomStr, newValue: newUomStr },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setIsUomModalOpen(false);
    showToast(`Konfigurasi Multi-UOM untuk '${activeProduct.name}' berhasil disimpan.`);
  };

  const activeAuditLogs = activeProduct
    ? auditLogs.filter((log) => log.productId === activeProduct.id || log.productSku === activeProduct.sku)
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola SKU es krim, spesifikasi suhu simpan cold chain (&le; -18&deg;C), dan rasio konversi satuan bertingkat (PCS, PACK, DUS).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SKU, nama produk, atau nomor barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">SKU &amp; Barcode</th>
                <th className="px-5 py-3.5">Nama Produk</th>
                <th className="px-5 py-3.5">Kategori</th>
                <th className="px-5 py-3.5">Satuan Konversi (Multi-UOM)</th>
                <th className="px-5 py-3.5">Suhu Standar</th>
                <th className="px-5 py-3.5">Stok Fisik</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Kelola</th>
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
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Barcode className="w-3 h-3 text-slate-400" />
                        {product.barcode}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        ID: {product.id}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.uoms.map((uom, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                              uom.isBaseUnit
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold"
                                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium"
                            }`}
                            title={
                              uom.isBaseUnit
                                ? "Satuan Dasar (Base Unit)"
                                : `1 ${uom.uomName} = ${uom.conversionRatio} ${baseUom}`
                            }
                          >
                            <span>{uom.uomName}</span>
                            {!uom.isBaseUnit && (
                              <span className="text-[9px] text-slate-400">
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
                      <div className="text-[10px] text-slate-400 tabular-nums font-mono">
                        Total {formatNumber(product.stockInPcs)} Pcs
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-500 border border-slate-500/20">
                          Non-Aktif
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => openUomModal(product)}
                          title="Form Kelola Multi-UOM"
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Layers className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Multi-UOM</span>
                        </button>

                        <button
                          onClick={() => openEditModal(product)}
                          title="Form Edit / Update Produk"
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openAuditModal(product)}
                          title="Riwayat Perubahan Data (Audit Trail)"
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

      {/* ============================================================== */}
      {/* 1. MODAL TAMBAH PRODUK BARU                                   */}
      {/* ============================================================== */}
      {isAddModalOpen && (
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
                  <p className="text-[11px] text-slate-400">
                    Konfigurasi spesifikasi produk dan hirarki Multi-UOM
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

            <form onSubmit={handleSaveNewProduct} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode SKU <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode Utama (EAN-13)
                  </label>
                  <input
                    type="text"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                    placeholder="Contoh: 8992761001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
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
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                    value={productForm.minTemp}
                    onChange={(e) => setProductForm({ ...productForm, minTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Max (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={productForm.maxTemp}
                    onChange={(e) => setProductForm({ ...productForm, maxTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>
              </div>

              {/* Multi-UOM Section */}
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
                  {uomList.map((uom, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="w-full sm:w-28">
                        <input
                          type="text"
                          required
                          placeholder="Satuan"
                          value={uom.uomName}
                          onChange={(e) => {
                            const updated = [...uomList];
                            updated[idx].uomName = e.target.value.toUpperCase();
                            setUomList(updated);
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
                            const updated = [...uomList];
                            updated[idx].conversionRatio = Math.max(1, Number(e.target.value));
                            setUomList(updated);
                          }}
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-center font-mono disabled:opacity-50"
                        />
                        <span className="text-[11px] text-slate-400">Base Unit</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:flex-1 justify-between sm:justify-start">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="newProductBaseUnitRadio"
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition-all"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FORM UPDATE / EDIT PRODUK                                  */}
      {/* ============================================================== */}
      {isEditModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Ubah Data Produk: {activeProduct.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    SKU: <span className="font-mono font-bold text-indigo-500">{activeProduct.sku}</span> &bull; ID: {activeProduct.id}
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

            <form onSubmit={handleUpdateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Produk Es Krim <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Produk
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="Cup">Cup</option>
                    <option value="Stick/Bar">Stick / Bar</option>
                    <option value="Cone">Cone</option>
                    <option value="Bulk/Family Pack">Bulk / Family Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Barcode EAN-13
                  </label>
                  <input
                    type="text"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Minimum Penyimpanan (&deg;C)
                  </label>
                  <input
                    type="number"
                    value={productForm.minTemp}
                    onChange={(e) => setProductForm({ ...productForm, minTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Suhu Maksimum Standar (&deg;C)
                  </label>
                  <input
                    type="number"
                    max="-18"
                    value={productForm.maxTemp}
                    onChange={(e) => setProductForm({ ...productForm, maxTemp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1">
                    <ThermometerSnowflake className="w-3 h-3" />
                    Wajib &le; -18&deg;C untuk kepatuhan rantai dingin es krim
                  </p>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Status Operasional Produk
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Produk non-aktif tidak akan muncul di daftar pemesanan Sales Order
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, isActive: !productForm.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    productForm.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {productForm.isActive ? "AKTIF" : "NON-AKTIF"}
                </button>
              </div>

              {/* Action Buttons */}
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

      {/* ============================================================== */}
      {/* 3. FORM KELOLA MULTI-UOM PRODUK                               */}
      {/* ============================================================== */}
      {isUomModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Kelola Konfigurasi Multi-UOM
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Produk: <span className="font-bold text-slate-700 dark:text-slate-200">{activeProduct.name}</span> ({activeProduct.sku})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUomModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cold Chain Multi-UOM Compliance Banner */}
            <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl flex items-start gap-2.5 text-xs text-cyan-800 dark:text-cyan-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">Aturan Baku Multi-UOM Distributor Es Krim:</p>
                <p className="text-[11px] mt-0.5">
                  Wajib menetapkan tepat <strong>1 Satuan Dasar (Base Unit = PCS)</strong> dengan rasio konversi bernilai 1. Seluruh saldo inventaris fisik dan perhitungan jurnal akuntansi secara internal disimpan dalam satuan dasar ini.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUoms} className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Daftar Satuan & Rasio Konversi
                </span>
                <button
                  type="button"
                  onClick={handleAddUomRow}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Satuan Baru
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                {uomList.map((uom, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div className="w-full sm:w-32">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Nama Satuan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: DUS"
                        value={uom.uomName}
                        onChange={(e) => {
                          const updated = [...uomList];
                          updated[idx].uomName = e.target.value.toUpperCase();
                          setUomList(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-bold text-slate-900 dark:text-white uppercase font-mono"
                      />
                    </div>

                    <div className="w-full sm:w-44">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Faktor Konversi</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">=</span>
                        <input
                          type="number"
                          required
                          min="1"
                          disabled={uom.isBaseUnit}
                          value={uom.conversionRatio}
                          onChange={(e) => {
                            const updated = [...uomList];
                            updated[idx].conversionRatio = Math.max(1, Number(e.target.value));
                            setUomList(updated);
                          }}
                          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-center font-mono font-bold disabled:opacity-50"
                        />
                        <span className="text-[11px] text-slate-400">Base Unit</span>
                      </div>
                    </div>

                    <div className="w-full sm:flex-1">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Barcode Khusus Kemasan</label>
                      <input
                        type="text"
                        placeholder="Barcode opsional"
                        value={uom.barcode || ""}
                        onChange={(e) => {
                          const updated = [...uomList];
                          updated[idx].barcode = e.target.value;
                          setUomList(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-3 sm:pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="uomBaseUnitSelection"
                          checked={uom.isBaseUnit}
                          onChange={() => handleSetBaseUnit(idx)}
                          className="text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded ${
                            uom.isBaseUnit
                              ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 font-bold"
                              : "text-slate-400 font-normal"
                          }`}
                        >
                          {uom.isBaseUnit ? "Base Unit" : "Set Base"}
                        </span>
                      </label>

                      {!uom.isBaseUnit && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUomRow(idx)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-500/10"
                          title="Hapus Satuan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUomModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-sm transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Konfigurasi UOM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL RIWAYAT PERUBAHAN (DATA CHANGE LOGS / AUDIT TRAIL)   */}
      {/* ============================================================== */}
      {isAuditModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Riwayat Perubahan Data (Audit Trail)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Produk: <span className="font-bold text-slate-700 dark:text-slate-200">{activeProduct.name}</span> ({activeProduct.sku})
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

            {/* Audit Logs Content */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {activeAuditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan untuk produk ini.
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
                            log.action === "TAMBAH_PRODUK"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : log.action === "KELOLA_UOM"
                              ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300"
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

                    {/* Changes Diff Table */}
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
