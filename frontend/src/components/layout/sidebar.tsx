"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ThermometerSnowflake,
  TrendingUp,
  Package,
  Users,
  BadgeDollarSign,
  Warehouse,
  BookOpen,
  Inbox,
  ShieldCheck,
  Boxes,
  Split,
  ClipboardList,
  ShoppingCart,
  CheckSquare,
  Truck,
  RotateCcw,
  FileCheck2,
  FileText,
  BookMarked,
  Scale,
  PieChart,
  Landmark,
  Receipt,
  Layers,
  Snowflake,
  UserCheck,
  LogOut,
  Shield
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface MenuGroup {
  groupName: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    groupName: "OVERVIEW",
    items: [
      { title: "Ringkasan Operasional", href: "/", icon: LayoutDashboard },
      { title: "Monitoring Rantai Dingin", href: "/monitoring-suhu", icon: ThermometerSnowflake },
      { title: "Dasbor Eksekutif Finansial", href: "/dasbor-finansial", icon: TrendingUp },
    ],
  },
  {
    groupName: "MASTER DATA",
    items: [
      { title: "Produk & Multi-UOM", href: "/master-data/products", icon: Package },
      { title: "Kategori & Pelanggan", href: "/master-data/customers", icon: Users },
      { title: "Price List Matrix", href: "/master-data/prices", icon: BadgeDollarSign },
      { title: "Freezer & Rak Gudang", href: "/master-data/freezers", icon: Warehouse },
      { title: "Chart of Accounts/COA", href: "/accounting/coa", icon: BookOpen },
    ],
  },
  {
    groupName: "MANAJEMEN INBOUND",
    items: [
      { title: "Purchase Order Receiving", href: "/inbound/po", icon: Inbox },
      { title: "Pemeriksaan QC Suhu & Batch", href: "/inbound/qc", icon: ShieldCheck },
    ],
  },
  {
    groupName: "INVENTORY CONTROL",
    items: [
      { title: "Stok Real-Time", href: "/inventory/stocks", icon: Boxes },
      { title: "Breakdown/Repacking UOM", href: "/inventory/breakdown", icon: Split },
      { title: "Log Suhu Freezer", href: "/inventory/temperature-logs", icon: ThermometerSnowflake },
      { title: "Stock Opname", href: "/inventory/opname", icon: ClipboardList },
    ],
  },
  {
    groupName: "OUTBOUND & PENJUALAN",
    items: [
      { title: "Sales Order", href: "/sales-orders", icon: ShoppingCart },
      { title: "Picking List FEFO", href: "/picking", icon: CheckSquare },
      { title: "Pengiriman & Surat Jalan", href: "/delivery", icon: Truck },
    ],
  },
  {
    groupName: "KARANTINA & RETUR",
    items: [
      { title: "Penerimaan Retur Pelanggan", href: "/returns", icon: RotateCcw },
      { title: "Disposisi & Berita Acara", href: "/returns/disposition", icon: FileCheck2 },
    ],
  },
  {
    groupName: "HUTANG & PEMBIAYAAN",
    items: [
      { title: "Hutang Usaha Supplier", href: "/accounting/payable", icon: Receipt },
      { title: "Pinjaman Eksternal (Loans)", href: "/accounting/loans", icon: Landmark },
    ],
  },
  {
    groupName: "AKUNTANSI & LAPORAN",
    items: [
      { title: "General Journal", href: "/reports/general-journal", icon: FileText },
      { title: "General Ledger", href: "/reports/general-ledger", icon: BookMarked },
      { title: "Trial Balance", href: "/reports/trial-balance", icon: Scale },
      { title: "Income Statement", href: "/reports/income-statement", icon: PieChart },
      { title: "Balance Sheet", href: "/reports/balance-sheet", icon: Landmark },
      { title: "Laporan Mutasi Persediaan", href: "/reports/stock-mutation", icon: Layers },
    ],
  },
  {
    groupName: "PENGATURAN & AKSES",
    items: [
      { title: "Manajemen Pengguna", href: "/users", icon: UserCheck },
    ],
  },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState({
    name: "Bambang Pratama",
    role: "Manajer Gudang (Admin)",
    initials: "BP",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("icecream_user_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setCurrentUser(parsed);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      localStorage.removeItem("icecream_user_session");
      router.push("/login");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-sm">
          <Snowflake className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-slate-900 dark:text-white uppercase">
            FROST<span className="text-cyan-500">/FLOW</span>
          </h1>
          <p className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase">
            COLD CHAIN WMS &amp; ERP
          </p>
        </div>
      </div>

      {/* Nav Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {menuGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {group.groupName}
            </h2>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Session & Logout Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Link
            href="/users"
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition"
            title="Buka Manajemen Pengguna"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400 truncate font-semibold">
                {currentUser.role.split(" ")[0]}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Keluar dari Sistem (Logout)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
