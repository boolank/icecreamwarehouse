# FROST/FLOW — Cold Chain WMS & Automated Accounting System
### Sistem Informasi Manajemen Gudang & Akuntansi Distributor Es Krim

[![Build Backend](https://img.shields.io/badge/Backend-NestJS%2010%20%7C%20Passing-brightgreen.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/backend)
[![Build Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20Passing-brightgreen.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/frontend)
[![Design System](https://img.shields.io/badge/UI%2FUX-TailAdmin%20Tailwind%20CSS-blue.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/rancangan_desain_ui_tailadmin_gudang_es_krim.md)
[![Cold Chain Standard](https://img.shields.io/badge/Cold%20Chain-%E2%89%A4%20--18%C2%B0C-cyan.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/01_dokumentasi_teknis_master.md)
[![Language](https://img.shields.io/badge/Language-100%25%20Bahasa%20Indonesia-emerald.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/frontend)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016-blue.svg)](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/00_skema_database_lengkap.sql)

---

## 📌 Ringkasan Proyek

**FROST/FLOW** adalah sistem informasi manajemen pergudangan (*Warehouse Management System - WMS*) dan akuntansi terotomasi (*ERP Lite*) yang dirancang khusus untuk operasi bisnis **distributor es krim**. Sistem ini memadukan pengawasan ketat integritas rantai dingin (*cold chain* $\le -18^\circ\text{C}$), pengelolaan satuan bertingkat (*Multi-UOM*), alokasi pengeluaran berbasis kedaluwarsa terdekat (*FEFO*), serta **mesin penjurnalan otomatis berpasangan seimbang (*balanced double-entry journal*)** untuk setiap transaksi fisik gudang.

Semua antarmuka web dibangun menggunakan standar **TailAdmin** (Next.js 14, Tailwind CSS, Dark/Light Mode Parity) dengan seluruh teks operasional menggunakan **100% Bahasa Indonesia**.

---

## 🚀 Status Realisasi & Capaian Proyek (Progress Tracking)

> **Capaian Keseluruhan:** **168 / 168 Story Points (100.0%) — SPRINT 1, 2, 3, & 4 LULUS 100%**  
> **Status Build:** Backend NestJS (`Exit Code 0`) | Frontend Next.js (`Exit Code 0`, 30 Rute Statis Aktif Prerendered)  
> **Git Repository:** `https://github.com/boolank/icecreamwarehouse.git` (Branch `main`)

| Siklus | Sasaran Utama | Target SP | Status | Catatan Teknis |
| :--- | :--- | :---: | :---: | :--- |
| **Sprint 1 (Minggu 1-2)** | Fondasi Sistem, Auth RBAC, Master Produk & Multi-UOM, Pelanggan, Matriks Harga, Setup COA, Shell TailAdmin | **38 SP** | **100% SELESAI** | Build Lulus, 8 Halaman UI Aktif, DDL Database Ready |
| **Sprint 2 (Minggu 3-4)** | Purchase Order, Inbound Receiving, Batch & QC Suhu Armada ($\le -18^\circ\text{C}$), Jurnal Pembelian Otomatis, Log Suhu | **42 SP** | **100% SELESAI** | Modul Inbound, PO Management, QC Suhu & Journal Ready |
| **Sprint 3 (Minggu 5-6)** | Sales Order, Picking List FEFO, Pengiriman & Surat Jalan, Breakdown/Repacking UOM, Retur & Spoilage, Jurnal Jual | **48 SP** | **100% SELESAI** | SO Auto-Pricing, FEFO Picking, Breakdown UOM, Retur, & Spoilage Journal Ready |
| **Sprint 4 (Minggu 7-8)** | Stock Opname, Pelaporan Finansial (Jurnal Umum, Buku Besar, Neraca Saldo, Laba Rugi, Neraca, Mutasi Stok), Dasbor Eksekutif Bento Grid | **40 SP** | **100% SELESAI** | Full Financial Statements, Stock Opname, & Executive Dashboard Ready |

*Catatan: Sesuai instruksi mutakhir, pengembangan aplikasi mobile (React Native) ditiadakan guna memfokuskan 100% kapabilitas pada platform Web Admin TailAdmin dan Backend REST API.*

---

## ❄️ 5 Pilar Logika Bisnis Utama

1. **Integritas Rantai Dingin (Cold Chain Integrity &le; -18&deg;C):**
   - Suhu es krim wajib dijaga $\le -18^\circ\text{C}$ di setiap titik: penerimaan truk ekspedisi, ruang penyimpanan *walk-in freezer*, rak gudang, hingga armada pengiriman ke outlet.
   - Peringatan lonjakan suhu (*excursion alert*) otomatis memblokir alokasi batch jika berada di atas batas aman.
2. **Aturan Multi-UOM & Tepat 1 Satuan Dasar (1 Base Unit):**
   - Setiap produk memiliki tepat 1 *Base UOM* bernilai konversi 1 (misal: `PCS`).
   - Satuan kemasan besar seperti `DUS` (24 Pcs) atau `PACK` (6 Pcs) dikonversikan otomatis ke saldo satuan dasar fisik di database.
3. **Alokasi Pengeluaran FEFO (First Expired, First Out):**
   - Sistem merekomendasikan pengambilan batch es krim dengan tanggal kedaluwarsa paling awal (`expired_date ASC`) untuk mencegah kerugian barang kedaluwarsa di gudang.
4. **Mesin Penjurnalan Otomatis Seimbang (Balanced Automated Journal Engine):**
   - Setiap transaksi logistik langsung membentuk ayat jurnal Debit-Kredit secara otomatis tanpa entri manual akuntansi berulang:
     - *Inbound PO*: Debit Persediaan Es Krim (1130), Kredit Utang Usaha (2101).
     - *Penjualan*: Debit Piutang Usaha (1120), Kredit Pendapatan Penjualan (4101–4104).
     - *HPP FEFO*: Debit Beban Pokok Penjualan (5101), Kredit Persediaan (1130).
     - *Es Krim Rusak/Karantina*: Debit Beban Kerusakan Persediaan (5201), Kredit Persediaan (1130).
5. **Penelusuran Jejak Data & Audit Metadata Lengkap:**
   - Semua tabel master dan transaksi dilengkapi kolom metadata: `created_by`, `created_at`, `updated_by`, `updated_at`, `is_deleted`, `deleted_at`, `deleted_by`.
   - Perubahan data tercatat otomatis ke tabel `data_change_logs` (menyimpan snapshot JSONB `old_data` dan `new_data`) serta `activity_logs`.

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

```
┌────────────────────────────────────────────────────────────┐
│         FRONTEND: Next.js 14 (App Router) + Tailwind       │
│    Antarmuka TailAdmin, Lucide React, Recharts, Zustand    │
└─────────────────────────────┬──────────────────────────────┘
                              │ REST API (/api/v1) & JWT Bearer
┌─────────────────────────────▼──────────────────────────────┐
│           BACKEND: NestJS 10 + TypeORM (TypeScript)        │
│    Auth RBAC, Master Data, Inbound, Outbound, Accounting   │
└─────────────────────────────┬──────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌───────────────────────────┐           ┌───────────────────┐
│       PostgreSQL 16       │           │      Redis 7      │
│  35 Tabel, 5 Views, Triggers│         │ Caching & Session │
└───────────────────────────┘           └───────────────────┘
```

---

## 📂 Struktur Repositori (Monorepo)

```
icecream/
├── backend/                               # Layanan Backend NestJS 10
│   ├── src/
│   │   ├── common/                        # Decorators, Filters, Guards, Entities (BaseAuditEntity)
│   │   ├── modules/
│   │   │   ├── accounting/                # Bagan Akun Standar (COA) & Journal Engine
│   │   │   ├── auth/                      # Otentikasi JWT, Passport, Bcrypt
│   │   │   ├── customers/                 # Master Pelanggan & Kategori Kanal
│   │   │   ├── master-data/               # Produk, Multi-UOM, Freezer Locations, Suppliers
│   │   │   ├── pricing/                   # Matriks Harga Jual Segmen
│   │   │   └── users/                     # Manajemen Pengguna, Peran, & Audit Logs
│   │   ├── app.module.ts
│   │   └── main.ts                        # Prefix API /api/v1, CORS, Validasi
│   ├── package.json
│   └── tsconfig.json
├── frontend/                              # Antarmuka Web TailAdmin (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── accounting/coa/            # Layar Bagan Akun Standar (COA Tree-View)
│   │   │   ├── master-data/customers/     # Layar Pelanggan & Segmentasi
│   │   │   ├── master-data/freezers/      # Layar Freezer & Rak Cold Storage
│   │   │   ├── master-data/prices/        # Layar Matriks Daftar Harga
│   │   │   ├── master-data/products/      # Layar Katalog Produk & Multi-UOM
│   │   │   ├── monitoring-suhu/           # Layar Telemetri Suhu Rantai Dingin 24 Jam
│   │   │   ├── login/                     # Layar Masuk (Login TailAdmin)
│   │   │   ├── layout.tsx                 # App Shell & Dynamic Route Wrapper
│   │   │   └── page.tsx                   # Dasbor Utama Bento Grid
│   │   ├── components/layout/             # Header, Sidebar (Bahasa Indonesia), AppShell
│   │   └── lib/utils.ts                   # Format Rupiah & Angka Tabular
│   ├── package.json
│   └── tailwind.config.ts                 # Token Warna TailAdmin & Dark Mode
├── docs/                                  # Dokumentasi Teknis Lengkap
│   ├── 00_skema_database_lengkap.sql      # DDL Skema PostgreSQL v2.1 (35 Tabel + Seeds)
│   ├── 01_dokumentasi_teknis_master.md    # Dokumen Arsitektur & Spesifikasi Bisnis
│   ├── 02_spesifikasi_api_endpoint.md     # Spesifikasi 60+ Endpoint REST API
│   ├── 03_chart_of_accounts_coa.md        # 60+ Akun COA & Pemetaan Jurnal Otomatis
│   └── 04_user_stories_sprint_todolist.md # 20 User Stories & To-Do List Realisasi
├── docker-compose.yml                     # PostgreSQL 16 & Redis 7
├── package.json                           # Root Workspace
└── README.md
```

---

## ⚡ Panduan Instalasi & Menjalankan Sistem

### 1. Prasyarat Sistem
- **Node.js**: `v20.x` atau `v22.x`
- **npm**: `v10.x` atau lebih baru
- **Docker & Docker Compose** (Opsional untuk menjalankan PostgreSQL dan Redis lokal)

### 2. Menjalankan Database & Cache
Jalankan kontainer database via Docker:
```bash
docker compose up -d
```
Eksekusi DDL database dan data awal:
```bash
# Menjalankan skema DDL v2.1 ke PostgreSQL
psql -h localhost -p 5432 -U postgres -d icecream_wms -f docs/00_skema_database_lengkap.sql
```

### 3. Menjalankan Backend (NestJS)
```bash
cd backend
npm install
npm run build        # Memverifikasi kompilasi TypeScript
npm run start:dev    # Menjalankan mode pengembangan di http://localhost:5000/api/v1
```

### 4. Menjalankan Frontend (Next.js 14 TailAdmin)
```bash
cd frontend
npm install
npm run build        # Memverifikasi bundling Next.js
npm run dev          # Menjalankan dev server di http://localhost:3000
```

---

## 🔑 Kredensial Akun Percobaan (Demo)

Buka `http://localhost:3000/login` pada peramban web:

| Peran | Nama Pengguna (*Username*) | Kata Sandi (*Password*) | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin Sistem** | `admin_gudang` | `password123` | Akses penuh seluruh master data, pengguna, dan konfigurasi |
| **Staf Akuntansi** | `staf_akuntansi` | `password123` | Akses Bagan Akun (COA), Jurnal Umum, dan Laporan Keuangan |
| **Operator Gudang** | `operator_gudang` | `password123` | Inbound receiving, log suhu freezer, dan picking list |

---

## 📚 Indeks Dokumentasi Proyek

Untuk rincian implementasi mendalam, silakan merujuk ke dokumen pada folder `docs/`:
- [Skema Database Lengkap DDL SQL](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/00_skema_database_lengkap.sql)
- [Dokumentasi Teknis Master](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/01_dokumentasi_teknis_master.md)
- [Spesifikasi API Endpoint](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/02_spesifikasi_api_endpoint.md)
- [Chart of Accounts (COA) & Logika Jurnal](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/03_chart_of_accounts_coa.md)
- [User Stories, Sprint Plan & To-Do List](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/docs/04_user_stories_sprint_todolist.md)
- [Rancangan Desain Antarmuka TailAdmin UI/UX](file:///c:/Users/Muhammad%20Ramdan/Documents/DATA/PROJECT2026/icecream/rancangan_desain_ui_tailadmin_gudang_es_krim.md)

---
*Dikembangkan dengan standar keandalan tinggi untuk operasional distributor es krim modern.*

