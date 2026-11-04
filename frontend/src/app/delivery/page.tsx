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
  X,
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
  const [selectedDeliveryForPrint, setSelectedDeliveryForPrint] = useState<DeliveryRecord | null>(null);

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
          onClick={() => setSelectedDeliveryForPrint(deliveries[0])}
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
                      onClick={() => setSelectedDeliveryForPrint(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Cetak Surat Jalan Resmi"
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

      {/* Modal Pratinjau & Cetak Surat Jalan Resmi (Printable Delivery Order) */}
      {selectedDeliveryForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-6">
            {/* Header Modal - Sembunyi saat cetak */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 no-print">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pratinjau Dokumen Cetak Surat Jalan (Delivery Order)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Format Dokumen Resmi Pengiriman Rantai Dingin Cold Chain (&le; -18&deg;C)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Dokumen (Ctrl+P)
                </button>
                <button
                  onClick={() => setSelectedDeliveryForPrint(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Area Lembar Kerja Surat Jalan Cetak (A4 Layout) */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 dark:text-slate-900 printable-document">
              {/* Kop Surat Resmi */}
              <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-wider text-slate-900 uppercase">
                      PT FROST FLOW COLD DISTRIBUSI
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Gudang Pusat Distribusi Es Krim & Rantai Dingin Terpadu
                  </p>
                  <p className="text-xs text-slate-500">
                    Kawasan Industri Pergudangan Cold Storage No. 18, Tangerang &bull; Telp: (021) 555-0199
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm tracking-widest uppercase mb-1">
                    SURAT JALAN
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    NO: {selectedDeliveryForPrint.deliveryNumber}
                  </p>
                  <p className="text-xs text-slate-500">
                    Ref SO: {selectedDeliveryForPrint.soNumber}
                  </p>
                </div>
              </div>

              {/* Data Tujuan & Armada */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    TUJUAN PENGIRIMAN (OUTLET / CUSTOMER):
                  </p>
                  <p className="font-bold text-sm text-slate-900">
                    {selectedDeliveryForPrint.customerName}
                  </p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {selectedDeliveryForPrint.destination}
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        TANGGAL PENGIRIMAN:
                      </p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {selectedDeliveryForPrint.dispatchTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        STATUS PRE-COOLING:
                      </p>
                      <p className="font-bold text-emerald-700 mt-0.5">
                        SUHU {selectedDeliveryForPrint.truckTemp.toFixed(1)}&deg;C (&le; -18&deg;C VALID)
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        ARMADA REEFER:
                      </p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {selectedDeliveryForPrint.vehiclePlate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        NAMA PENGEMUDI:
                      </p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {selectedDeliveryForPrint.driverName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Muatan Barang */}
              <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-10">NO</th>
                    <th className="p-2 border-r border-slate-300 text-left">KODE &amp; NAMA PRODUK ES KRIM</th>
                    <th className="p-2 border-r border-slate-300 text-center">NO. BATCH</th>
                    <th className="p-2 border-r border-slate-300 text-center">TGL KEDALUWARSA (FEFO)</th>
                    <th className="p-2 border-r border-slate-300 text-center">QTY KEMASAN</th>
                    <th className="p-2 text-center">TOTAL SATUAN DASAR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-center font-mono">1</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-bold">Aice Mochi Vanilla 30g</p>
                      <p className="text-[10px] font-mono text-slate-500">SKU: AIC-MOC-VAN</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                      B202610-01
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-600">
                      2027-10-15
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold">
                      {Math.ceil(selectedDeliveryForPrint.totalBoxes * 0.6)} Dus
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-slate-800">
                      {Math.ceil(selectedDeliveryForPrint.totalBoxes * 0.6) * 24} Pcs
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-center font-mono">2</td>
                    <td className="p-2 border-r border-slate-200">
                      <p className="font-bold">Wall&apos;s Feast Cokelat 65ml</p>
                      <p className="text-[10px] font-mono text-slate-500">SKU: WLS-FST-CHK</p>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono font-bold">
                      B202609-08
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-600">
                      2027-09-20
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold">
                      {Math.floor(selectedDeliveryForPrint.totalBoxes * 0.4)} Dus
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-slate-800">
                      {Math.floor(selectedDeliveryForPrint.totalBoxes * 0.4) * 24} Pcs
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <td colSpan={4} className="p-2 text-right border-r border-slate-300">
                      TOTAL VOLUME ANGKUT:
                    </td>
                    <td className="p-2 text-center border-r border-slate-300 font-mono">
                      {selectedDeliveryForPrint.totalBoxes} Dus
                    </td>
                    <td className="p-2 text-center font-mono">
                      {selectedDeliveryForPrint.totalBoxes * 24} Pcs
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Syarat & Klausul Rantai Dingin */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 mb-8 space-y-1">
                <p className="font-bold uppercase tracking-wider text-amber-800">
                  PERHATIAN RANTAI DINGIN (COLD CHAIN INTEGRITY):
                </p>
                <p>
                  1. Es krim wajib segera dipindahkan ke freezer toko penyimpanan bersuhu minimal &le; -18&deg;C selambat-lambatnya 15 menit setelah serah terima barang.
                </p>
                <p>
                  2. Barang yang telah diterima dan ditandatangani dalam keadaan beku sempurna tidak dapat diretur akibat kelalaian pemadaman listrik toko penerima.
                </p>
              </div>

              {/* Lembar 4 Kolom Tanda Tangan Resmi */}
              <div className="grid grid-cols-4 gap-4 text-center text-xs page-break-avoid">
                <div className="border border-slate-300 rounded p-2 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Gudang Pengirim</p>
                  <p className="text-[10px] text-slate-400">( .............................. )</p>
                  <p className="text-[10px] font-bold text-slate-800">Staf Logistik</p>
                </div>
                <div className="border border-slate-300 rounded p-2 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">QC Suhu Rantai Dingin</p>
                  <p className="text-[10px] text-emerald-700 font-bold">LULUS &le; -18&deg;C</p>
                  <p className="text-[10px] font-bold text-slate-800">Checker Suhu</p>
                </div>
                <div className="border border-slate-300 rounded p-2 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Pengemudi Truk</p>
                  <p className="text-[10px] text-slate-400">( {selectedDeliveryForPrint.driverName} )</p>
                  <p className="text-[10px] font-bold text-slate-800">Driver Ekspedisi</p>
                </div>
                <div className="border border-slate-300 rounded p-2 flex flex-col justify-between h-28">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Toko / Penerima</p>
                  <p className="text-[10px] text-slate-400">( Cap &amp; Tanda Tangan )</p>
                  <p className="text-[10px] font-bold text-slate-800">Nama Penerima</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

