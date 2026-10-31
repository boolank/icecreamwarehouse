"use client";

import React, { useState } from "react";
import {
  Truck,
  Search,
  Filter,
  Calendar,
  ThermometerSnowflake,
  ShieldCheck,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  FileText,
} from "lucide-react";

interface DeliveryRecord {
  id: number;
  deliveryNumber: string;
  soNumber: string;
  customerName: string;
  destination: string;
  driverName: string;
  vehiclePlate: string;
  dispatchTime: string;
  truckTemp: number; // in Celsius
  isTempCompliant: boolean;
  status: "DIPROSES" | "DALAM_PENGIRIMAN" | "TERKIRIM";
  totalBoxes: number;
}

export default function DeliveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const deliveries: DeliveryRecord[] = [
    {
      id: 1,
      deliveryNumber: "SJ-202610-001",
      soNumber: "SO-202610-001",
      customerName: "Supermarket Fresh Mart BSD",
      destination: "Jl. BSD Raya Utama No. 8, Tangerang Selatan",
      driverName: "Budi Santoso",
      vehiclePlate: "B 9124 KLD (Truk Reefer 4 Roda)",
      dispatchTime: "2026-10-31 08:30",
      truckTemp: -20.4,
      isTempCompliant: true,
      status: "TERKIRIM",
      totalBoxes: 15,
    },
    {
      id: 2,
      deliveryNumber: "SJ-202610-002",
      soNumber: "SO-202610-002",
      customerName: "Toko Grosir Berkah Mandiri",
      destination: "Kav. Pergudangan Daan Mogot Blok C-2, Jakarta Barat",
      driverName: "Ahmad Riyadi",
      vehiclePlate: "B 9481 JKL (Truk Reefer 6 Roda)",
      dispatchTime: "2026-10-31 10:15",
      truckTemp: -19.2,
      isTempCompliant: true,
      status: "DALAM_PENGIRIMAN",
      totalBoxes: 28,
    },
    {
      id: 3,
      deliveryNumber: "SJ-202610-003",
      soNumber: "SO-202610-003",
      customerName: "Hotel Grand Serpong Lagoon",
      destination: "Jl. MH Thamrin KM 2.7, Tangerang",
      driverName: "Dedi Kurniawan",
      vehiclePlate: "B 9302 TYU (Blind Van Cold Box)",
      dispatchTime: "2026-10-31 13:00",
      truckTemp: -21.0,
      isTempCompliant: true,
      status: "DIPROSES",
      totalBoxes: 8,
    },
  ];

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.soNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: DeliveryRecord["status"]) => {
    switch (status) {
      case "TERKIRIM":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            TERKIRIM
          </span>
        );
      case "DALAM_PENGIRIMAN":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center gap-1 w-fit">
            <Truck className="w-3 h-3" />
            DALAM PERJALANAN
          </span>
        );
      case "DIPROSES":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            SEDANG DISIAPKAN
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Pengiriman & Surat Jalan (Delivery Order)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pelepasan Armada Reefer Cold Box dengan Verifikasi Suhu Ketat (&le; -18&deg;C)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert("Fitur cetak Surat Jalan (DO) siap dicetak...")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <Printer className="w-4 h-4" />
          Cetak Surat Jalan Terpilih
        </button>
      </div>

      {/* Cold Chain Quality Compliance Banner */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase">
              SOP PELEPASAN ARMADA RANTAI DINGIN TERPENUHI
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              100% armada truk reefer yang diberangkatkan telah lolos pra-pendinginan (Pre-cooling) dengan temperatur box pendingin &le; -18&deg;C.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <ThermometerSnowflake className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-slate-500">Standar Dispatch:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">&le; -18.0&deg;C</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No SJ, No SO, Pelanggan, Supir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Status Pengiriman</option>
              <option value="DIPROSES">Sedang Disiapkan</option>
              <option value="DALAM_PENGIRIMAN">Dalam Perjalanan</option>
              <option value="TERKIRIM">Terkirim</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Total Pengiriman: <span className="font-bold text-slate-900 dark:text-white">{filteredDeliveries.length} Armada</span>
        </div>
      </div>

      {/* Delivery Cards / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">No. Surat Jalan & SO</th>
                <th className="py-3 px-4">Tujuan / Pelanggan</th>
                <th className="py-3 px-4">Armada & Supir</th>
                <th className="py-3 px-4 text-center">Suhu Truk</th>
                <th className="py-3 px-4 text-center">Jumlah Muatan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredDeliveries.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.deliveryNumber}
                    </span>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                      Ref: {item.soNumber}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {item.destination}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {item.driverName}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {item.vehiclePlate}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      {item.truckTemp.toFixed(1)}&deg;C
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                    {item.totalBoxes} Dus
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center">
                      {getStatusBadge(item.status)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Mencetak Surat Jalan ${item.deliveryNumber}...`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Cetak Surat Jalan"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

