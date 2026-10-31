"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Layers,
  Snowflake,
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
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <Snowflake className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-sm font-black tracking-wider text-slate-900 dark:text-white uppercase">
            FROST/FLOW
          </h1>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            WAREHOUSE + FINANCE
          </p>
        </div>
      </div>

      {/* Nav Scroll Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {menuGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            <h2 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
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

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-600 dark:text-slate-300">PROTOTIPE</p>
        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
          Data simulasi, bukan telemetri sensor langsung.
        </p>
      </div>
    </aside>
  );
}

