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
  History,
  Clock,
  User,
  ArrowRight,
  Save,
  Check,
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

interface CustomerAuditLog {
  id: string;
  customerId: string;
  customerCode: string;
  customerName: string;
  action: "TAMBAH_PELANGGAN" | "UPDATE_DATA" | "UBAH_PLAFON_KREDIT" | "UBAH_STATUS";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
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
    paymentTermDays: 0,
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

const INITIAL_AUDIT_LOGS: CustomerAuditLog[] = [
  {
    id: "log-c-1",
    customerId: "c1",
    customerCode: "CUST-MT-001",
    customerName: "IndoGrosir Kemayoran",
    action: "TAMBAH_PELANGGAN",
    changedBy: "Nadia Rahma (Admin Sales)",
    changedAt: "2026-10-10 11:20:00",
    notes: "Pendaftaran mitra outlet Modern Trade awal dengan TOP 30 Hari",
    changes: [
      { field: "Kode Mitra", oldValue: "-", newValue: "CUST-MT-001" },
      { field: "Limit Plafon Kredit", oldValue: "-", newValue: "Rp 100.000.000" },
    ],
  },
  {
    id: "log-c-2",
    customerId: "c2",
    customerCode: "CUST-AG-002",
    customerName: "Toko Sinar Rejeki (Grosir)",
    action: "UBAH_PLAFON_KREDIT",
    changedBy: "Budi Utomo (Finance SME)",
    changedAt: "2026-10-22 15:40:12",
    notes: "Peningkatan pagu kredit dari Rp 30 Jt menjadi Rp 50 Jt atas dasar riwayat pelunasan lancar",
    changes: [
      { field: "Limit Plafon Kredit", oldValue: "Rp 30.000.000", newValue: "Rp 50.000.000" },
    ],
  },
];

export default function MasterCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [auditLogs, setAuditLogs] = useState<CustomerAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState<CustomerItem | null>(null);

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
    isActive: true,
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

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

  // Open Add Modal
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
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (customer: CustomerItem) => {
    setActiveCustomer(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      category: customer.category,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      creditLimit: customer.creditLimit,
      paymentTermDays: customer.paymentTermDays,
      isActive: customer.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Open Audit Modal
  const openAuditModal = (customer: CustomerItem) => {
    setActiveCustomer(customer);
    setIsAuditModalOpen(true);
  };

  // Toggle Active/Deactive directly
  const handleToggleStatus = (customer: CustomerItem) => {
    const nextStatus = !customer.isActive;
    const updated = customers.map((c) =>
      c.id === customer.id ? { ...c, isActive: nextStatus } : c
    );
    setCustomers(updated);

    const newAudit: CustomerAuditLog = {
      id: `log-c-${Date.now()}`,
      customerId: customer.id,
      customerCode: customer.code,
      customerName: customer.name,
      action: "UBAH_STATUS",
      changedBy: "Nadia Rahma (Admin Sales)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status operasional outlet menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        {
          field: "Status Operasional",
          oldValue: customer.isActive ? "Aktif" : "Non-Aktif",
          newValue: nextStatus ? "Aktif" : "Non-Aktif",
        },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);
    showToast(`Status outlet '${customer.name}' berhasil diubah ke ${nextStatus ? "AKTIF" : "NON-AKTIF"}.`);
  };

  // Save New Customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: CustomerItem = {
      id: `c-${Date.now()}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      category: formData.category,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      creditLimit: Number(formData.creditLimit),
      paymentTermDays: Number(formData.paymentTermDays),
      currentReceivable: 0,
      isActive: formData.isActive,
    };
    setCustomers([newCust, ...customers]);

    const newAudit: CustomerAuditLog = {
      id: `log-c-${Date.now()}`,
      customerId: newCust.id,
      customerCode: newCust.code,
      customerName: newCust.name,
      action: "TAMBAH_PELANGGAN",
      changedBy: "Nadia Rahma (Admin Sales)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: "Pendaftaran outlet mitra baru dalam master data pelanggan",
      changes: [
        { field: "Kode Pelanggan", oldValue: "-", newValue: newCust.code },
        { field: "Nama Toko", oldValue: "-", newValue: newCust.name },
        { field: "Kategori Segmen", oldValue: "-", newValue: newCust.category },
        { field: "Plafon Kredit", oldValue: "-", newValue: formatRupiah(newCust.creditLimit) },
      ],
    };
    setAuditLogs([newAudit, ...auditLogs]);

    setIsAddModalOpen(false);
    showToast(`Mitra pelanggan '${newCust.name}' berhasil didaftarkan.`);
  };

  // Save Edit Customer
  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (activeCustomer.name !== formData.name) {
      changes.push({ field: "Nama Toko", oldValue: activeCustomer.name, newValue: formData.name });
    }
    if (activeCustomer.category !== formData.category) {
      changes.push({ field: "Kategori", oldValue: activeCustomer.category, newValue: formData.category });
    }
    if (activeCustomer.contactPerson !== formData.contactPerson) {
      changes.push({ field: "PIC Kontak", oldValue: activeCustomer.contactPerson, newValue: formData.contactPerson });
    }
    if (activeCustomer.phone !== formData.phone) {
      changes.push({ field: "No. Telepon", oldValue: activeCustomer.phone, newValue: formData.phone });
    }
    if (activeCustomer.creditLimit !== Number(formData.creditLimit)) {
      changes.push({
        field: "Plafon Kredit",
        oldValue: formatRupiah(activeCustomer.creditLimit),
        newValue: formatRupiah(Number(formData.creditLimit)),
      });
    }
    if (activeCustomer.paymentTermDays !== Number(formData.paymentTermDays)) {
      changes.push({
        field: "Termin Pembayaran",
        oldValue: `${activeCustomer.paymentTermDays} Hari`,
        newValue: `${formData.paymentTermDays} Hari`,
      });
    }
    if (activeCustomer.isActive !== formData.isActive) {
      changes.push({
        field: "Status Operasional",
        oldValue: activeCustomer.isActive ? "Aktif" : "Non-Aktif",
        newValue: formData.isActive ? "Aktif" : "Non-Aktif",
      });
    }

    const updated = customers.map((c) => {
      if (c.id === activeCustomer.id) {
        return {
          ...c,
          name: formData.name,
          category: formData.category,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          creditLimit: Number(formData.creditLimit),
          paymentTermDays: Number(formData.paymentTermDays),
          isActive: formData.isActive,
        };
      }
      return c;
    });

    setCustomers(updated);

    if (changes.length > 0) {
      const newAudit: CustomerAuditLog = {
        id: `log-c-${Date.now()}`,
        customerId: activeCustomer.id,
        customerCode: activeCustomer.code,
        customerName: formData.name,
        action: "UPDATE_DATA",
        changedBy: "Nadia Rahma (Admin Sales)",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan data profil & limit kredit outlet ${activeCustomer.code}`,
        changes,
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }

    setIsEditModalOpen(false);
    showToast(`Data pelanggan '${formData.name}' berhasil diperbarui.`);
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

  const activeAuditRecords = activeCustomer
    ? auditLogs.filter((log) => log.customerId === activeCustomer.id || log.customerCode === activeCustomer.code)
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
              Pelanggan &amp; Segmentasi
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            Pelanggan &amp; Segmentasi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data mitra outlet, ketentuan plafon piutang kredit, dan segmentasi harga jual distributor es krim.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama toko, kode pelanggan, PIC, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
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

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode &amp; Nama Toko</th>
                <th className="px-5 py-3.5">Segmen Kanal</th>
                <th className="px-5 py-3.5">Kontak &amp; Alamat</th>
                <th className="px-5 py-3.5">Plafon Kredit</th>
                <th className="px-5 py-3.5">Sisa Plafon (Piutang)</th>
                <th className="px-5 py-3.5 text-center">Termin (TOP)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCustomers.map((customer) => {
                const sisaPlafon = customer.creditLimit - customer.currentReceivable;
                const usagePercent = Math.round((customer.currentReceivable / customer.creditLimit) * 100);

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
                        {customer.code}
                      </div>
                      <div className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                        {customer.name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(
                          customer.category
                        )}`}
                      >
                        {customer.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {customer.contactPerson}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {customer.phone}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {customer.city}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatRupiah(customer.creditLimit)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-slate-900 dark:text-slate-100 font-mono tabular-nums font-semibold">
                        {formatRupiah(sisaPlafon)}
                      </div>
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            usagePercent > 80
                              ? "bg-rose-500"
                              : usagePercent > 50
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, usagePercent)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Terpakai: {usagePercent}%
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                      {customer.paymentTermDays === 0 ? "Cash / COD" : `${customer.paymentTermDays} Hari`}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(customer)}
                        title="Klik untuk ubah status aktif/non-aktif"
                        className="cursor-pointer"
                      >
                        {customer.isActive ? (
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
                          onClick={() => openEditModal(customer)}
                          title="Ubah Data Pelanggan"
                          className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 font-semibold text-[11px]"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => openAuditModal(customer)}
                          title="Riwayat Jejak Audit Perubahan"
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

      {/* Modal Tambah Pelanggan */}
      {isAddModalOpen && (
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
                  <p className="text-[11px] text-slate-400">
                    Daftarkan outlet baru dan tentukan pagu kredit
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 uppercase"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Haryanto"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0812-9876-5432"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Plafon Kredit (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000000"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Termin Pembayaran (Hari)
                  </label>
                  <select
                    value={formData.paymentTermDays}
                    onChange={(e) => setFormData({ ...formData, paymentTermDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    <option value={0}>0 Hari (Cash On Delivery / Tunai)</option>
                    <option value={7}>7 Hari (1 Minggu)</option>
                    <option value={14}>14 Hari (2 Minggu)</option>
                    <option value={30}>30 Hari (1 Bulan)</option>
                    <option value={45}>45 Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap Pengiriman Outlet
                </label>
                <textarea
                  rows={2}
                  placeholder="Nama jalan, nomor ruko/kios, patokan..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
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
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pelanggan */}
      {isEditModalOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Ubah Data Pelanggan: {activeCustomer.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kode: <span className="font-mono font-bold text-indigo-500">{activeCustomer.code}</span>
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

            <form onSubmit={handleUpdateCustomer} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Toko / Mitra <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Segmen
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CustomerItem["category"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="Modern Trade">Modern Trade (Supermarket/Minimarket)</option>
                    <option value="General Trade">General Trade (Warung/Kelontong)</option>
                    <option value="Horeka">Horeka (Hotel/Resto/Kafe)</option>
                    <option value="Agen/Grosir">Agen / Grosir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Limit Plafon Kredit (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Termin Pembayaran (TOP)
                  </label>
                  <select
                    value={formData.paymentTermDays}
                    onChange={(e) => setFormData({ ...formData, paymentTermDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value={0}>0 Hari (Cash / COD)</option>
                    <option value={7}>7 Hari (1 Minggu)</option>
                    <option value={14}>14 Hari (2 Minggu)</option>
                    <option value={30}>30 Hari (1 Bulan)</option>
                    <option value={45}>45 Hari</option>
                  </select>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Status Keaktifan Outlet
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Pelanggan non-aktif tidak dapat diterbitkan Sales Order baru
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    formData.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {formData.isActive ? "AKTIF" : "NON-AKTIF"}
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
      {isAuditModalOpen && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Riwayat Perubahan Data Pelanggan
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mitra: <span className="font-bold text-slate-700 dark:text-slate-200">{activeCustomer.name}</span> ({activeCustomer.code})
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
              {activeAuditRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan untuk mitra pelanggan ini.
                </div>
              ) : (
                activeAuditRecords.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === "TAMBAH_PELANGGAN"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : log.action === "UBAH_PLAFON_KREDIT"
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
