"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  Shield,
  Key,
  Edit2,
  CheckCircle2,
  X,
  History,
  Lock,
  Mail,
  Phone,
  Power,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle
} from "lucide-react";

interface UserAccount {
  id: string;
  userCode: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "ADMIN_SISTEM" | "MANAJER_GUDANG" | "OPERATOR_INBOUND" | "OPERATOR_COLDCHAIN" | "DRIVER_LOGISTIK" | "STAF_FINANCE";
  roleName: string;
  lastLoginAt: string;
  isActive: boolean;
}

interface UserAuditLog {
  id: string;
  userCode: string;
  fullName: string;
  action: "TAMBAH_PENGGUNA" | "UPDATE_DATA" | "UBAH_ROLE" | "RESET_PASSWORD" | "UBAH_STATUS";
  changedBy: string;
  changedAt: string;
  notes: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: "u1",
    userCode: "USR-001",
    fullName: "Bambang Pratama",
    username: "admin_gudang",
    email: "bambang.pratama@frostflow.id",
    phone: "0812-3456-7890",
    role: "MANAJER_GUDANG",
    roleName: "Manajer Gudang (Admin)",
    lastLoginAt: "2026-10-31 08:30:12",
    isActive: true,
  },
  {
    id: "u2",
    userCode: "USR-002",
    fullName: "Nadia Rahma",
    username: "nadia_ops",
    email: "nadia.rahma@frostflow.id",
    phone: "0813-8889-1122",
    role: "OPERATOR_COLDCHAIN",
    roleName: "Operator Cold Chain & Picking",
    lastLoginAt: "2026-10-31 09:15:40",
    isActive: true,
  },
  {
    id: "u3",
    userCode: "USR-003",
    fullName: "Hendra Wijaya",
    username: "hendra_finance",
    email: "hendra.wijaya@frostflow.id",
    phone: "0818-9990-2233",
    role: "STAF_FINANCE",
    roleName: "Staf Finance & Akuntansi",
    lastLoginAt: "2026-10-30 17:45:00",
    isActive: true,
  },
  {
    id: "u4",
    userCode: "USR-004",
    fullName: "Siti Rahma",
    username: "siti_inbound",
    email: "siti.rahma@frostflow.id",
    phone: "0817-2233-4455",
    role: "OPERATOR_INBOUND",
    roleName: "Operator Inbound & QC Suhu",
    lastLoginAt: "2026-10-31 07:45:20",
    isActive: true,
  },
  {
    id: "u5",
    userCode: "USR-005",
    fullName: "Agus Santoso",
    username: "agus_driver01",
    email: "agus.santoso@frostflow.id",
    phone: "0819-5566-7788",
    role: "DRIVER_LOGISTIK",
    roleName: "Driver Armada Truk Reefer",
    lastLoginAt: "2026-10-30 14:10:05",
    isActive: true,
  },
  {
    id: "u6",
    userCode: "USR-006",
    fullName: "Rian Hidayat",
    username: "rian_superadmin",
    email: "rian.hidayat@frostflow.id",
    phone: "0811-1234-5678",
    role: "ADMIN_SISTEM",
    roleName: "Administrator Sistem (IT)",
    lastLoginAt: "2026-10-29 11:22:15",
    isActive: true,
  },
  {
    id: "u7",
    userCode: "USR-007",
    fullName: "Dimas Anggara",
    username: "dimas_magang",
    email: "dimas.anggara@frostflow.id",
    phone: "0856-7890-1234",
    role: "OPERATOR_COLDCHAIN",
    roleName: "Operator Cold Chain & Picking",
    lastLoginAt: "2026-10-25 16:00:00",
    isActive: false,
  },
];

const INITIAL_AUDIT_LOGS: UserAuditLog[] = [
  {
    id: "aud-u-1",
    userCode: "USR-001",
    fullName: "Bambang Pratama",
    action: "UPDATE_DATA",
    changedBy: "Administrator Sistem (IT)",
    changedAt: "2026-10-28 14:10:20",
    notes: "Pembaruan nomor kontak darurat manajer gudang.",
    changes: [
      { field: "phone", oldValue: "0812-0000-1111", newValue: "0812-3456-7890" },
    ],
  },
  {
    id: "aud-u-2",
    userCode: "USR-007",
    fullName: "Dimas Anggara",
    action: "UBAH_STATUS",
    changedBy: "Bambang Pratama (Manajer Gudang)",
    changedAt: "2026-10-26 09:00:00",
    notes: "Penonaktifan akun staf magang selesai kontrak.",
    changes: [
      { field: "isActive", oldValue: "Aktif", newValue: "Non-Aktif" },
    ],
  },
  {
    id: "aud-u-3",
    userCode: "USR-005",
    fullName: "Agus Santoso",
    action: "RESET_PASSWORD",
    changedBy: "Bambang Pratama (Manajer Gudang)",
    changedAt: "2026-10-24 10:15:00",
    notes: "Permintaan reset kata sandi akun driver armada pengiriman.",
    changes: [
      { field: "password", oldValue: "******", newValue: "[Diperbarui]" },
    ],
  },
];

const ROLE_OPTIONS = [
  { value: "MANAJER_GUDANG", label: "Manajer Gudang (Admin)", badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  { value: "OPERATOR_COLDCHAIN", label: "Operator Cold Chain & Picking", badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
  { value: "OPERATOR_INBOUND", label: "Operator Inbound & QC Suhu", badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { value: "STAF_FINANCE", label: "Staf Finance & Akuntansi", badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { value: "DRIVER_LOGISTIK", label: "Driver Armada Truk Reefer", badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { value: "ADMIN_SISTEM", label: "Administrator Sistem (IT)", badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("SEMUA");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Active User for Modal Actions
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);

  // Add Form State
  const [newUserData, setNewUserData] = useState({
    userCode: "",
    fullName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "OPERATOR_COLDCHAIN" as UserAccount["role"],
    isActive: true,
  });

  // Edit Form State
  const [editUserData, setEditUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "OPERATOR_COLDCHAIN" as UserAccount["role"],
    isActive: true,
  });

  // Reset Password State
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
    reason: "",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getRoleBadge = (role: UserAccount["role"]) => {
    const item = ROLE_OPTIONS.find((r) => r.value === role);
    return item ? item.badgeClass : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  const getRoleLabel = (role: UserAccount["role"]) => {
    const item = ROLE_OPTIONS.find((r) => r.value === role);
    return item ? item.label : role;
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "SEMUA" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Open Add Modal
  const openAddModal = () => {
    const nextNum = String(users.length + 1).padStart(3, "0");
    setNewUserData({
      userCode: `USR-${nextNum}`,
      fullName: "",
      username: "",
      password: "password123",
      email: "",
      phone: "",
      role: "OPERATOR_COLDCHAIN",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  // Save Add Modal
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.fullName.trim() || !newUserData.username.trim()) {
      alert("Nama lengkap dan username wajib diisi!");
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === newUserData.username.trim().toLowerCase())) {
      alert(`Username '${newUserData.username}' sudah digunakan oleh pengguna lain!`);
      return;
    }

    const createdUser: UserAccount = {
      id: `u-${Date.now()}`,
      userCode: newUserData.userCode.trim().toUpperCase(),
      fullName: newUserData.fullName.trim(),
      username: newUserData.username.trim().toLowerCase(),
      email: newUserData.email.trim() || `${newUserData.username.trim()}@frostflow.id`,
      phone: newUserData.phone.trim() || "-",
      role: newUserData.role,
      roleName: getRoleLabel(newUserData.role),
      lastLoginAt: "-",
      isActive: newUserData.isActive,
    };

    const newLog: UserAuditLog = {
      id: `aud-${Date.now()}`,
      userCode: createdUser.userCode,
      fullName: createdUser.fullName,
      action: "TAMBAH_PENGGUNA",
      changedBy: "Bambang Pratama (Manajer Gudang)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Pendaftaran pengguna baru ${createdUser.fullName} (${createdUser.roleName})`,
      changes: [
        { field: "userCode", oldValue: "-", newValue: createdUser.userCode },
        { field: "fullName", oldValue: "-", newValue: createdUser.fullName },
        { field: "role", oldValue: "-", newValue: createdUser.roleName },
      ],
    };

    setUsers([createdUser, ...users]);
    setAuditLogs([newLog, ...auditLogs]);
    setIsAddModalOpen(false);
    showToast(`Pengguna ${createdUser.fullName} berhasil ditambahkan!`);
  };

  // Open Edit Modal
  const openEditModal = (user: UserAccount) => {
    setActiveUser(user);
    setEditUserData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Modal
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    const diffs: { field: string; oldValue: string; newValue: string }[] = [];
    if (activeUser.fullName !== editUserData.fullName) {
      diffs.push({ field: "fullName", oldValue: activeUser.fullName, newValue: editUserData.fullName });
    }
    if (activeUser.email !== editUserData.email) {
      diffs.push({ field: "email", oldValue: activeUser.email, newValue: editUserData.email });
    }
    if (activeUser.phone !== editUserData.phone) {
      diffs.push({ field: "phone", oldValue: activeUser.phone, newValue: editUserData.phone });
    }
    if (activeUser.role !== editUserData.role) {
      diffs.push({ field: "role", oldValue: activeUser.roleName, newValue: getRoleLabel(editUserData.role) });
    }
    if (activeUser.isActive !== editUserData.isActive) {
      diffs.push({ field: "isActive", oldValue: activeUser.isActive ? "Aktif" : "Non-Aktif", newValue: editUserData.isActive ? "Aktif" : "Non-Aktif" });
    }

    const updatedUsers = users.map((u) => {
      if (u.id === activeUser.id) {
        return {
          ...u,
          fullName: editUserData.fullName.trim(),
          email: editUserData.email.trim(),
          phone: editUserData.phone.trim(),
          role: editUserData.role,
          roleName: getRoleLabel(editUserData.role),
          isActive: editUserData.isActive,
        };
      }
      return u;
    });

    if (diffs.length > 0) {
      const newLog: UserAuditLog = {
        id: `aud-${Date.now()}`,
        userCode: activeUser.userCode,
        fullName: editUserData.fullName,
        action: "UPDATE_DATA",
        changedBy: "Bambang Pratama (Manajer Gudang)",
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        notes: `Pembaruan data profil pengguna ${activeUser.userCode}`,
        changes: diffs,
      };
      setAuditLogs([newLog, ...auditLogs]);
    }

    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    showToast(`Data pengguna ${activeUser.fullName} berhasil diperbarui!`);
  };

  // Toggle User Active Status
  const handleToggleStatus = (user: UserAccount) => {
    if (user.role === "ADMIN_SISTEM" && user.isActive) {
      alert("Administrator Sistem utama tidak dapat dinonaktifkan demi keselamatan operasional server!");
      return;
    }

    const nextStatus = !user.isActive;
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u));

    const newLog: UserAuditLog = {
      id: `aud-${Date.now()}`,
      userCode: user.userCode,
      fullName: user.fullName,
      action: "UBAH_STATUS",
      changedBy: "Bambang Pratama (Manajer Gudang)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Perubahan status akun ${user.userCode} menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`,
      changes: [
        { field: "isActive", oldValue: user.isActive ? "Aktif" : "Non-Aktif", newValue: nextStatus ? "Aktif" : "Non-Aktif" },
      ],
    };

    setUsers(updatedUsers);
    setAuditLogs([newLog, ...auditLogs]);
    showToast(`Status pengguna ${user.fullName} diubah menjadi ${nextStatus ? "AKTIF" : "NON-AKTIF"}`);
  };

  // Open Reset Password Modal
  const openResetPasswordModal = (user: UserAccount) => {
    setActiveUser(user);
    setResetPasswordData({
      newPassword: "",
      confirmPassword: "",
      reason: "Permintaan staf operasional atau reset berkala",
    });
    setIsResetPasswordModalOpen(true);
  };

  // Save Reset Password Modal
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    if (resetPasswordData.newPassword.length < 6) {
      alert("Kata sandi baru minimal harus 6 karakter!");
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok dengan kata sandi baru!");
      return;
    }

    const newLog: UserAuditLog = {
      id: `aud-${Date.now()}`,
      userCode: activeUser.userCode,
      fullName: activeUser.fullName,
      action: "RESET_PASSWORD",
      changedBy: "Bambang Pratama (Manajer Gudang)",
      changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      notes: `Reset kata sandi pengguna: ${resetPasswordData.reason}`,
      changes: [
        { field: "password", oldValue: "******", newValue: "[Kata Sandi Baru Disimpan]" },
      ],
    };

    setAuditLogs([newLog, ...auditLogs]);
    setIsResetPasswordModalOpen(false);
    showToast(`Kata sandi pengguna ${activeUser.fullName} berhasil direset!`);
  };

  // Open Audit Modal
  const openAuditModal = (user: UserAccount) => {
    setActiveUser(user);
    setIsAuditModalOpen(true);
  };

  const getActionBadgeClass = (action: UserAuditLog["action"]) => {
    switch (action) {
      case "TAMBAH_PENGGUNA":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "UPDATE_DATA":
      case "UBAH_ROLE":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "RESET_PASSWORD":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "UBAH_STATUS":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const activeAuditRecords = activeUser
    ? auditLogs.filter((log) => log.userCode === activeUser.userCode)
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
            <span>Pengaturan &amp; Akses</span> &rsaquo;{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">
              Manajemen Pengguna
            </span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-500" />
            Manajemen Pengguna &amp; Hak Akses Gudang
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dikelola oleh Admin / Manajer Gudang untuk mengatur akun staf operasional, peran hak akses, reset sandi, dan status keaktifan login.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Pengguna
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
            {users.length} <span className="text-xs font-normal text-slate-400">Akun</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
            Pengguna Aktif
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {users.filter((u) => u.isActive).length} <span className="text-xs font-normal text-slate-400">Staf</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
            Operasional Cold Chain
          </span>
          <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1 block">
            {users.filter((u) => u.role.includes("OPERATOR") || u.role.includes("GUDANG")).length} <span className="text-xs font-normal text-slate-400">Personel</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            Finance &amp; Logistik
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
            {users.filter((u) => u.role === "STAF_FINANCE" || u.role === "DRIVER_LOGISTIK").length} <span className="text-xs font-normal text-slate-400">Personel</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama lengkap, username, kode user, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          <button
            onClick={() => setRoleFilter("SEMUA")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              roleFilter === "SEMUA"
                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
            }`}
          >
            Semua Peran
          </button>
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRoleFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === opt.value
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent"
              }`}
            >
              {opt.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode &amp; Nama Lengkap</th>
                <th className="px-5 py-3.5">Username Login</th>
                <th className="px-5 py-3.5">Peran / Hak Akses</th>
                <th className="px-5 py-3.5">Kontak Staf</th>
                <th className="px-5 py-3.5">Terakhir Masuk</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${
                    !user.isActive ? "opacity-60 bg-slate-50/30 dark:bg-slate-950/30" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-cyan-500/20">
                        {user.fullName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {user.fullName}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {user.userCode}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 font-mono text-slate-800 dark:text-slate-200">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      @{user.username}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.roleName}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{user.phone}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {user.lastLoginAt}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user)}
                      title={user.isActive ? "Klik untuk nonaktifkan" : "Klik untuk aktifkan"}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                        user.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{user.isActive ? "Aktif" : "Non-Aktif"}</span>
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(user)}
                        title="Ubah Profil Pengguna"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openResetPasswordModal(user)}
                        title="Reset Kata Sandi"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openAuditModal(user)}
                        title="Riwayat Jejak Audit Perubahan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Tambah Pengguna Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Tambah Akun Staf Pengguna Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Otorisasi kredensial login dan penugasan peran hak akses gudang
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

            <form onSubmit={handleSaveUser} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kode Pengguna <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserData.userCode}
                    onChange={(e) => setNewUserData({ ...newUserData, userCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peran / Hak Akses <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({
                        ...newUserData,
                        role: e.target.value as UserAccount["role"],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username Login <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: budi_santoso"
                    value={newUserData.username}
                    onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Staf
                  </label>
                  <input
                    type="email"
                    placeholder="budi@frostflow.id"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUserData.isActive}
                    onChange={(e) => setNewUserData({ ...newUserData, isActive: e.target.checked })}
                    className="rounded text-cyan-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Status Akun Aktif
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Pengguna langsung dapat masuk ke sistem menggunakan kredensial ini.
                    </span>
                  </div>
                </label>
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Profil Pengguna */}
      {isEditModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Ubah Data Pengguna: {activeUser.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kode: <span className="font-mono font-bold text-indigo-500">{activeUser.userCode}</span> | Username: <span className="font-mono">@{activeUser.username}</span>
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

            <form onSubmit={handleUpdateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editUserData.fullName}
                  onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peran / Hak Akses
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      role: e.target.value as UserAccount["role"],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Staf
                  </label>
                  <input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={editUserData.phone}
                    onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Status Keaktifan Akun
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Akun non-aktif diblokir dari proses login sistem
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditUserData({ ...editUserData, isActive: !editUserData.isActive })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    editUserData.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {editUserData.isActive ? "AKTIF" : "NON-AKTIF"}
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Reset Kata Sandi */}
      {isResetPasswordModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Reset Kata Sandi Pengguna
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pengguna: <span className="font-semibold text-purple-600">{activeUser.fullName}</span> (@{activeUser.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResetPassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter..."
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konfirmasi Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi kata sandi baru..."
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan / Catatan Audit Reset
                </label>
                <input
                  type="text"
                  value={resetPasswordData.reason}
                  onChange={(e) =>
                    setResetPasswordData({ ...resetPasswordData, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-sm transition"
                >
                  Simpan Kata Sandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Riwayat Perubahan (Audit Trail) */}
      {isAuditModalOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    Riwayat Jejak Audit Akun Pengguna
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pengguna: <span className="font-mono font-bold text-amber-600">{activeUser.userCode}</span> - {activeUser.fullName}
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
              {activeAuditRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan riwayat perubahan untuk akun ini.
                </div>
              ) : (
                activeAuditRecords.map((log) => (
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

