"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Scale,
  CheckCircle2,
  Download,
  Printer,
  ChevronDown,
} from "lucide-react";

interface JournalLineItem {
  id: number;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalEntryRecord {
  id: number;
  entryNumber: string;
  entryDate: string;
  referenceType: string;
  referenceCode: string;
  description: string;
  lines: JournalLineItem[];
}

const DEMO_JOURNAL_ENTRIES: JournalEntryRecord[] = [
  {
    id: 1,
    entryNumber: "JV-202610-0001",
    entryDate: "2026-10-29",
    referenceType: "INBOUND",
    referenceCode: "PO-DIS10114",
    description: "Penerimaan Pasokan 560 Dus Es Krim Miami (PT Indo Van Houten)",
    lines: [
      {
        id: 1,
        accountCode: "1130",
        accountName: "Persediaan Barang Dagang Es Krim",
        description: "Penambahan Persediaan Masuk PO-DIS10114",
        debit: 40790214,
        credit: 0,
      },
      {
        id: 2,
        accountCode: "2101",
        accountName: "Utang Usaha",
        description: "Kewajiban Supplier PT Indo Van Houten (COD 0 Hari)",
        debit: 0,
        credit: 40790214,
      },
    ],
  },
  {
    id: 2,
    entryNumber: "JV-202610-0002",
    entryDate: "2026-10-29",
    referenceType: "PAYMENT_AP",
    referenceCode: "BKK-202610-001",
    description: "Pelunasan Hutang Pembelian PO-DIS10114 via Rekening BCA",
    lines: [
      {
        id: 3,
        accountCode: "2101",
        accountName: "Utang Usaha",
        description: "Pelunasan Tagihan PT Indo Van Houten",
        debit: 40790214,
        credit: 0,
      },
      {
        id: 4,
        accountCode: "1103",
        accountName: "Bank BCA — Rekening Operasional",
        description: "Pengeluaran Kas Transfer Pelunasan",
        debit: 0,
        credit: 40790214,
      },
    ],
  },
];

export default function GeneralJournalPage() {
  const [entries, setEntries] = useState<JournalEntryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refFilter, setRefFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRef = refFilter === "ALL" || e.referenceType === refFilter;
    return matchesSearch && matchesRef;
  });

  const grandTotalDebit = filtered.reduce(
    (sum, e) => sum + e.lines.reduce((s, l) => s + l.debit, 0),
    0
  );
  const grandTotalCredit = filtered.reduce(
    (sum, e) => sum + e.lines.reduce((s, l) => s + l.credit, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Jurnal Umum (General Journal)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              Double-Entry Balanced
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Buku catatan kronologis seluruh ayat jurnal akuntansi terotomasi dari transaksi gudang, pengadaan, penjualan, dan penyesuaian susut.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setEntries([])}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 font-medium text-xs transition cursor-pointer"
            title="Kosongkan jurnal untuk simulasi awal"
          >
            Kosongkan Jurnal
          </button>
          <button
            type="button"
            onClick={() => setEntries(DEMO_JOURNAL_ENTRIES)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs transition cursor-pointer"
            title="Muat contoh ayat jurnal penyeimbang (Inbound & Pembayaran PO-DIS10114)"
          >
            Muat Jurnal PO-DIS10114
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Jurnal</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari No. Bukti, Ref, atau Keterangan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Jenis Transaksi:</span>
          <select
            value={refFilter}
            onChange={(e) => setRefFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          >
            <option value="ALL">Semua Transaksi</option>
            <option value="INBOUND">Penerimaan Pasokan (PO)</option>
            <option value="OUTBOUND_REV">Penjualan (Sales Order)</option>
            <option value="OUTBOUND_COGS">Beban Pokok Penjualan (HPP)</option>
            <option value="SPOILAGE_WRITEOFF">Pemusnahan (Spoilage)</option>
            <option value="OPNAME_ADJUSTMENT">Penyesuaian Opname</option>
          </select>
        </div>
      </div>

      {/* Journal Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Bukti & Referensi</th>
                <th className="py-3 px-4">Kode Akun</th>
                <th className="py-3 px-4">Nama Akun & Keterangan</th>
                <th className="py-3 px-4 text-right">Debit (Rp)</th>
                <th className="py-3 px-4 text-right">Kredit (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-gray-400">
                      <FileText className="w-10 h-10 mb-2 stroke-1 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Belum Ada Ayat Jurnal Umum
                      </p>
                      <p className="text-xs text-gray-400 mt-1 mb-4">
                        Buku jurnal bersih untuk memverifikasi otomatisasi pembukuan dari transaksi alur bisnis nyata.
                      </p>
                      <button
                        type="button"
                        onClick={() => setEntries(DEMO_JOURNAL_ENTRIES)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition cursor-pointer"
                      >
                        Muat Contoh Jurnal Penyeimbang PO-DIS10114
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                <React.Fragment key={entry.id}>
                  {entry.lines.map((line, idx) => (
                    <tr
                      key={line.id}
                      className={
                        idx === 0
                          ? "bg-gray-50/40 dark:bg-gray-750/30 font-medium"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      }
                    >
                      <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {idx === 0 ? entry.entryDate : ""}
                      </td>
                      <td className="py-2.5 px-4 font-mono">
                        {idx === 0 ? (
                          <div>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {entry.entryNumber}
                            </span>
                            <p className="text-[10px] text-gray-400">
                              Ref: {entry.referenceCode}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-gray-700 dark:text-gray-300">
                        {line.accountCode}
                      </td>
                      <td
                        className={`py-2.5 px-4 ${
                          line.credit > 0 ? "pl-8 text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="font-semibold">{line.accountName}</p>
                        <p className="text-[11px] text-gray-400 font-normal">
                          {line.description}
                        </p>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                        {line.debit > 0
                          ? line.debit.toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                        {line.credit > 0
                          ? line.credit.toLocaleString("id-ID")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              )))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot className="bg-gray-100 dark:bg-gray-750 font-bold border-t-2 border-gray-300 dark:border-gray-600">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right uppercase text-xs">
                  Total Saldo Jurnal (Balance Check):
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  Rp {grandTotalDebit.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  Rp {grandTotalCredit.toLocaleString("id-ID")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

