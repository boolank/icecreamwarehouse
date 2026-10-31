"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Trash2,
  RotateCcw,
  Scale,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  Flame,
  Printer,
  ShieldCheck,
  Search,
  ArrowRight,
  Boxes,
} from "lucide-react";
import Link from "next/link";

interface QuarantineStockItem {
  id: number;
  returnNumber: string;
  soNumber: string;
  productName: string;
  productCode: string;
  batchNumber: string;
  expiryDate: string;
  condition: "MELTED" | "DAMAGED" | "WRONG_ITEM";
  quarantineQtyPcs: number;
  unitCost: number;
  totalCost: number;
  quarantineLocation: string;
  reason: string;
}

export default function DispositionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<QuarantineStockItem | null>(null);
  const [showDisposeModal, setShowDisposeModal] = useState(false);
  const [dispositionType, setDispositionType] = useState<"WRITE_OFF" | "RESTOCK" | "RETURN_TO_SUPPLIER">("WRITE_OFF");
  const [baNumber, setBaNumber] = useState("BA-SPOIL-202610-001");
  const [targetLocation, setTargetLocation] = useState("FRZ-A1 / RAK-01 / A-01");
  const [notes, setNotes] = useState("Es krim meleleh total akibat kenaikan suhu kabin selama distribusi, tidak layak konsumsi.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock quarantine items awaiting disposition
  const [quarantineItems, setQuarantineItems] = useState<QuarantineStockItem[]>([
    {
      id: 1,
      returnNumber: "RTN-202610-001",
      soNumber: "SO-202610-001",
      productName: "Vanilla Bean Classic 100ml",
      productCode: "ICR-001",
      batchNumber: "B-VAN-1026",
      expiryDate: "2026-11-12",
      condition: "MELTED",
      quarantineQtyPcs: 24,
      unitCost: 3125,
      totalCost: 75000,
      quarantineLocation: "KRN-01 / RAK-KARANTINA-A",
      reason: "Bentuk es krim cair dan kemasan berembun hangat.",
    },
    {
      id: 2,
      returnNumber: "RTN-202610-002",
      soNumber: "SO-202610-002",
      productName: "Chocolate Fudge Bar 90ml",
      productCode: "ICR-002",
      batchNumber: "B-CHO-1026",
      expiryDate: "2026-11-21",
      condition: "DAMAGED",
      quarantineQtyPcs: 48,
      unitCost: 3333,
      totalCost: 160000,
      quarantineLocation: "KRN-01 / RAK-KARANTINA-B",
      reason: "Karton penyok dan stick es krim patah.",
    },
  ]);

  const activeItem = selectedItem || quarantineItems[0];

  const handleOpenDispose = (item: QuarantineStockItem) => {
    setSelectedItem(item);
    if (item.condition === "MELTED") {
      setDispositionType("WRITE_OFF");
      setNotes("Es krim meleleh permanen akibat suhu tinggi, wajib dimusnahkan.");
    } else if (item.condition === "WRONG_ITEM") {
      setDispositionType("RESTOCK");
      setNotes("Salah kirim varian, kondisi fisik dan suhu beku masih prima (-19°C), layak jual kembali.");
    } else {
      setDispositionType("WRITE_OFF");
      setNotes("Kemasan rusak pecah, berpotensi terkontaminasi.");
    }
    setShowDisposeModal(true);
  };

  const handleExecuteDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setQuarantineItems((prev) => prev.filter((i) => i.id !== activeItem.id));
      setIsSubmitting(false);
      setShowDisposeModal(false);

      if (dispositionType === "WRITE_OFF") {
        setSuccessMessage(
          `Pemusnahan barang rusak (${activeItem.returnNumber}) berhasil disahkan via Berita Acara ${baNumber}! Jurnal beban kerugian Rp ${activeItem.totalCost.toLocaleString("id-ID")} otomatis dibukukan seimbang.`
        );
      } else if (dispositionType === "RESTOCK") {
        setSuccessMessage(
          `Barang retur (${activeItem.returnNumber}) berhasil direstock kembali ke ${targetLocation} dan saldo aktif bertambah.`
        );
      } else {
        setSuccessMessage(
          `Klaim penggantian retur pabrik untuk ${activeItem.returnNumber} berhasil dibuat.`
        );
      }
      setTimeout(() => setSuccessMessage(null), 7000);
    }, 600);
  };

  const totalLoss = quarantineItems.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Disposisi & Berita Acara Pemusnahan (Spoilage)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
              Pengakuan Beban Akuntansi
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Penetapan status akhir barang karantina: Pemusnahan (Write-Off) dengan jurnal kerugian otomatis, restock es krim layak, atau klaim ke supplier.
          </p>
        </div>

        <Link
          href="/returns"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-blue-600" />
          Kembali ke Daftar Retur Karantina
        </Link>
      </div>

      {/* Alert Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Disposisi Berhasil Diproses
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Antrean Disposisi Karantina
            </span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {quarantineItems.length} Batch
          </p>
          <p className="text-xs text-amber-500 mt-1">
            Menunggu persetujuan manajer
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Estimasi Beban Kerugian
            </span>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            Rp {totalLoss.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-rose-500 mt-1">
            Dialokasikan ke Akun 5201
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Integritas Jurnal Otomatis
            </span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            100% Seimbang
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Debit 5201 = Kredit 1130
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Prosedur Pemusnahan
            </span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            SOP Cold Chain
          </p>
          <p className="text-xs text-blue-500 mt-1">
            Wajib tanda tangan Berita Acara
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Daftar Barang Karantina Menunggu Penetapan Status
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Barang di bawah ini tidak dapat dipick oleh tim sales sampai dilakukan disposisi resmi.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
            {quarantineItems.length} Butuh Tindakan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">No. Retur & Ref SO</th>
                <th className="py-3 px-4">Produk Es Krim</th>
                <th className="py-3 px-4">Nomor Batch</th>
                <th className="py-3 px-4">Kondisi & Masalah</th>
                <th className="py-3 px-4">Lokasi Karantina</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4 text-right">Total Kerugian Modal</th>
                <th className="py-3 px-4 text-center">Aksi Disposisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {quarantineItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Tidak ada barang di zona karantina saat ini. Semua stok dalam kondisi aman.
                  </td>
                </tr>
              ) : (
                quarantineItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.returnNumber}
                      </span>
                      <p className="text-[11px] text-gray-400 font-mono">
                        SO: {item.soNumber}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {item.productCode}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {item.batchNumber}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        ED: {item.expiryDate}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {item.condition === "MELTED" && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                          <Flame className="w-3 h-3" />
                          Meleleh
                        </span>
                      )}
                      {item.condition === "DAMAGED" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          Kemasan Rusak
                        </span>
                      )}
                      <p className="text-[11px] text-gray-500 mt-0.5 max-w-xs">
                        {item.reason}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">
                      {item.quarantineLocation}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      {item.quarantineQtyPcs} Pcs
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      Rp {item.totalCost.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenDispose(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors flex items-center gap-1.5 mx-auto"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Disposisi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Eksekusi Disposisi */}
      {showDisposeModal && activeItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-purple-600" />
              Persetujuan Disposisi: {activeItem.returnNumber}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {activeItem.productName} ({activeItem.quarantineQtyPcs} Pcs) • Valuasi Modal: Rp {activeItem.totalCost.toLocaleString("id-ID")}
            </p>

            <form onSubmit={handleExecuteDisposition} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pilih Keputusan Disposisi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDispositionType("WRITE_OFF")}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                      dispositionType === "WRITE_OFF"
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500 font-bold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 mb-1" />
                    Pemusnahan Total (Write-Off)
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispositionType("RESTOCK")}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                      dispositionType === "RESTOCK"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500 font-bold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                    Restock ke Rak Aktif
                  </button>

                  <button
                    type="button"
                    onClick={() => setDispositionType("RETURN_TO_SUPPLIER")}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                      dispositionType === "RETURN_TO_SUPPLIER"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500 font-bold"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Boxes className="w-4 h-4 text-blue-600 mb-1" />
                    Klaim Retur ke Supplier
                  </button>
                </div>
              </div>

              {dispositionType === "WRITE_OFF" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nomor Berita Acara Pemusnahan
                      </label>
                      <input
                        type="text"
                        value={baNumber}
                        onChange={(e) => setBaNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Saksi / Pejabat Penyetuju
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Hendra Setiawan (Manajer Gudang)"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-750 text-gray-600 dark:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Balanced Accounting Card for Write-Off Spoilage */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-2 mb-2">
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-purple-600" />
                        Jurnal Kerugian Otomatis (Balanced Spoilage Journal)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Debit = Kredit (Seimbang)
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-gray-800 dark:text-gray-200">
                        <span>(D) 5201 - Beban Kerugian Barang Rusak / Meleleh</span>
                        <span className="font-bold text-rose-600">
                          Rp {activeItem.totalCost.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-800 dark:text-gray-200 pl-4">
                        <span>(K) 1130 - Persediaan Barang Dagang Es Krim</span>
                        <span className="font-bold text-rose-600">
                          Rp {activeItem.totalCost.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {dispositionType === "RESTOCK" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pilih Rak Freezer Tujuan Restock (Aktif)
                  </label>
                  <select
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none font-mono"
                  >
                    <option value="FRZ-A1 / RAK-01 / A-01">FRZ-A1 / RAK-01 / A-01 (Area Utama)</option>
                    <option value="FRZ-A2 / RAK-02 / B-01">FRZ-A2 / RAK-02 / B-01 (Area Utama)</option>
                    <option value="FRZ-B1 / RAK-01 / C-01">FRZ-B1 / RAK-01 / C-01 (Area Utama)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catatan Berita Acara / Keterangan Tambahan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowDisposeModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Mengeksekusi..." : "Sahkan Disposisi & Terbitkan Berita Acara"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
