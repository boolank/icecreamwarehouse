"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  History
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CustomerItem {
  id: string;
  code: string;
  name: string;
  category: "Modern Trade" | "General Trade" | "Horeka" | "Agen/Grosir";
  contactPerson: string;
  phone: string;
  address: string;
  city: string;
  creditLimit: number;
  paymentTermDays: number;
  currentReceivable: number;
  isActive: boolean;
}

const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: "c1",
    code: "CUST-MT-001",
    name: "IndoGrosir Kemayoran",
    category: "Modern Trade",
    contactPerson: "Bpk. Bambang Sutanto",
    phone: "0812-3456-7890",
    address: "Jl. Benyamin Sueb No. 45",
    city: "Jakarta Pusat",
    creditLimit: 100000000,
    paymentTermDays: 30,
    currentReceivable: 42500000,
    isActive: true,
  },
  {
    id: "c2",
    code: "CUST-AG-002",
    name: "Toko Sinar Rejeki (Grosir)",
    category: "Agen/Grosir",
    contactPerson: "Ibu Megawati",
    phone: "0813-8889-1122",
    address: "Pasar Baru No. 12 Blok C",
    city: "Bekasi",
    creditLimit: 50000000,
    paymentTermDays: 14,
    currentReceivable: 18200000,
    isActive: true,
  },
  {
    id: "c3",
    code: "CUST-HK-003",
    name: "Kafe Kopi Kenangan Manis",
    category: "Horeka",
    contactPerson: "Kevin Pratama",
    phone: "0819-7771-3344",
    address: "Ruko Sentra Boulevard Blok B10",
    city: "Tangerang",
    creditLimit: 20000000,
    paymentTermDays: 7,
    currentReceivable: 5400000,
    isActive: true,
  },
  {
    id: "c4",
    code: "CUST-GT-004",
    name: "Warung Berkah Kelontong",
    category: "General Trade",
    contactPerson: "Pak Joko",
    phone: "0856-1122-3344",
    address: "Jl. Mawar No. 8 RT 02/05",
    city: "Depok",
    creditLimit: 5000000,
    paymentTermDays: 0, // Cash on Delivery
    currentReceivable: 0,
    isActive: true,
  },
  {
    id: "c5",
    code: "CUST-MT-005",
    name: "Superindo Sunter Mall",
    category: "Modern Trade",
    contactPerson: "Ibu Silvi Gunawan",
    phone: "0811-9988-7766",
    address: "Mall Sunter Lt. GF",
    city: "Jakarta Utara",
    creditLimit: 80000000,
    paymentTermDays: 30,
    currentReceivable: 31250000,
    isActive: true,
  },
];

export default function MasterCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "General Trade" as CustomerItem["category"],
    contactPerson: "",
    phone: "",
    address: "",
    city: "Jakarta",
    creditLimit: 10000000,
    paymentTermDays: 14,
  });

  const categories = ["Semua", "Modern Trade", "General Trade", "Horeka", "Agen/Grosir"];

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === "Semua" || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const openAddModal = () => {
    setFormData({
      code: `CUST-GT-00${customers.length + 1}`,
      name: "",
      category: "General Trade",
      contactPerson: "",
      phone: "",
      address: "",
      city: "Jakarta",
      creditLimit: 10000000,
      paymentTermDays: 14,
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: CustomerItem = {
      id: `c-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      category: formData.category,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      creditLimit: Number(formData.creditLimit),
      paymentTermDays: Number(formData.paymentTermDays),
      currentReceivable: 0,
      isActive: true,
    };
    setCustomers([newCust, ...customers]);
    setIsModalOpen(false);
  };

  const getCategoryBadgeClass = (category: CustomerItem["category"]) => {
    switch (category) {
      case "Modern Trade":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "Agen/Grosir":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "Horeka":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "General Trade":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Master Data</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Pelanggan &amp; Segmentasi
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            Pelanggan &amp; Segmentasi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data mitra outlet, ketentuan kredit plafon piutang, dan segmentasi harga jual.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama toko, kode pelanggan, PIC, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

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

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode &amp; Nama Pelanggan</th>
                <th className="px-5 py-3.5">Segmen Kanal</th>
                <th className="px-5 py-3.5">Kontak &amp; Alamat</th>
                <th className="px-5 py-3.5">Term of Payment</th>
                <th className="px-5 py-3.5">Plafon Kredit &amp; Piutang</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCustomers.map((customer) => {
                const usagePercent =
                  customer.creditLimit > 0
                    ? Math.round((customer.currentReceivable / customer.creditLimit) * 100)
                    : 0;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                        {customer.code}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                        {customer.name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(
                          customer.category
                        )}`}
                      >
                        {customer.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">
                        {customer.contactPerson}
                      </div>
                      <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[200px]" title={customer.address}>
                          {customer.city} &bull; {customer.address}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {customer.paymentTermDays === 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          COD (Tunai)
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                          {customer.paymentTermDays} Hari (TOP)
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {formatRupiah(customer.creditLimit)}
                      </div>
                      <div className="text-xs text-slate-400 tabular-nums mt-0.5">
                        Terpakai:{" "}
                        <span
                          className={
                            usagePercent > 80
                              ? "text-rose-500 font-semibold"
                              : "text-slate-600 dark:text-slate-300"
                          }
                        >
                          {formatRupiah(customer.currentReceivable)} ({usagePercent}%)
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      {customer.isActive ? (
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
                          onClick={() => alert(`Edit pelanggan: ${customer.name}`)}
                          title="Ubah Data Pelanggan"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Jejak Perubahan Audit: ${customer.name}`)}
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

      {/* Modal Tambah Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Tambah Mitra Pelanggan Baru
                  </h3>
                  <p className="text-xs text-slate-400">
                    Daftarkan outlet baru dan tentukan pagu kredit
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

            <form onSubmit={handleSaveCustomer} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Pelanggan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori / Segmen Kanal
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CustomerItem["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value="Modern Trade">Modern Trade (Supermarket/Minimarket)</option>
                    <option value="General Trade">General Trade (Warung/Kelontong)</option>
                    <option value="Horeka">Horeka (Hotel/Resto/Kafe)</option>
                    <option value="Agen/Grosir">Agen / Grosir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Toko / Usaha <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Toko Berkah Mandiri"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="Nama PIC toko"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Contoh: Jakarta Pusat"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Term of Payment (Hari)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.paymentTermDays}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTermDays: Number(e.target.value) })
                    }
                    placeholder="0 = COD"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Plafon Kredit Maksimal (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={formData.creditLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, creditLimit: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap Outlet
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat jalan, nomor ruko, patokan..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
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
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

