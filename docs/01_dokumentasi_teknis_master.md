# Dokumentasi Teknis Master — Cold Chain WMS & ERP Lite
## Sistem Informasi Gudang Distributor Es Krim (Versi Lengkap)

> **Versi Dokumen:** 2.0 (Berdasarkan Dokumen A/v1 + Pelengkap Komprehensif)
> **Tanggal:** 2026-10-30
> **Status:** Aktif — Acuan Utama Development

---

## Daftar Isi

1. [Alur Proses Bisnis](#1-alur-proses-bisnis)
2. [Ruang Lingkup Sistem](#2-ruang-lingkup-sistem)
3. [Arsitektur & Tech Stack](#3-arsitektur--tech-stack)
4. [Struktur Database](#4-struktur-database)
5. [Spesifikasi RBAC](#5-spesifikasi-rbac)
6. [Mekanisme FEFO & Multi-UOM](#6-mekanisme-fefo--multi-uom)
7. [Mekanisme Jurnal Otomatis](#7-mekanisme-jurnal-otomatis)
8. [Mekanisme Notifikasi & Alert](#8-mekanisme-notifikasi--alert)
9. [Konfigurasi Environment](#9-konfigurasi-environment)
10. [Struktur Proyek (Monorepo)](#10-struktur-proyek-monorepo)
11. [User Stories & Acceptance Criteria](#11-user-stories--acceptance-criteria-lengkap)
12. [Sprint Roadmap](#12-sprint-roadmap-agile)
13. [Panduan Deployment](#13-panduan-deployment)
14. [Status Realisasi & Capaian Proyek](#14-status-realisasi--capaian-proyek)

---

## 1. Alur Proses Bisnis

### 1.1 Inbound — Penerimaan Barang & Pengakuan Aset/Utang

```
Supplier → [Surat Jalan + Faktur] → Petugas Inbound
     ↓
[QC Suhu Truk ≤ -18°C] → Tolak jika suhu tidak sesuai
     ↓
[Pemeriksaan Fisik Es Krim] → Refreezing? Kemasan rusak?
     ↓
[Input Sistem: Batch, Expired Date, UOM, Lokasi Freezer]
     ↓
[Putaway → Cold Storage/Walk-in Freezer]
     ↓
[Approval Manager] → Otomatis terbentuk Jurnal Pembelian
     Debit  : 1120 Persediaan Es Krim
     Kredit : 2101 Utang Usaha (atau 1103 Bank jika tunai)
```

### 1.2 Storage & Inventory Management

```
[Monitoring Suhu Harian] → Alert jika > -18°C atau < -25°C
     ↓
[Stok dikelola dalam Base UOM = PCS] → Semua konversi otomatis
     ↓
[Breakdown UOM] → 1 DUS → 24 PCS (tanpa ubah nilai persediaan)
     ↓
[Stock Opname Berkala] → Selisih otomatis buat Jurnal Adjustment
```

### 1.3 Outbound — Penjualan & FEFO Picking

```
[Sales Order Input] → Auto-lookup Harga dari Matriks (Produk × UOM × Kategori)
     ↓
[Approval SO] → Generate Picking List FEFO
     ↓
[Picking] → Batch paling dekat expired_date diambil lebih dulu
     ↓
[Packing → Loading ke Armada Berpendingin]
     ↓
[Cetak Surat Jalan + Faktur Penjualan]
     ↓
[Delivery → POD (Proof of Delivery)]
     ↓
[Otomatis terbentuk 2 Jurnal:]
   Jurnal 1 — Pendapatan:
     Debit  : 1110 Piutang Usaha / 1103 Bank
     Kredit : 4101-4104 Penjualan Es Krim (sesuai kategori)
   Jurnal 2 — HPP:
     Debit  : 5101 Beban Pokok Penjualan
     Kredit : 1120 Persediaan Es Krim (× cost FEFO batch)
```

### 1.4 Retur & Karantina

```
[Pelanggan Kembalikan Barang] → Alasan: Meleleh / Salah Kirim / Near-Expired
     ↓
[Input Retur] → Stok masuk ke Zona KARANTINA
     ↓
[Inspeksi & Disposisi oleh Manager]
     ├── BAIK → Restock ke cold storage aktif (jurnal balik HPP)
     ├── KLAIM SUPPLIER → Jurnal pengurang Utang Usaha / Piutang Klaim
     └── RUSAK TOTAL → Write-Off:
           Debit  : 5201 Beban Kerugian Barang Rusak
           Kredit : 1120 Persediaan Es Krim
```

---

## 2. Ruang Lingkup Sistem

| No | Modul | Deskripsi |
|---|---|---|
| 1 | **User & RBAC** | 8 peran dengan hak akses berbeda |
| 2 | **Master Data** | Produk, UOM, Freezer, Supplier, Kategori Produk |
| 3 | **Customer & Pricing** | Kategori pelanggan, matriks harga bertingkat |
| 4 | **Purchase Order** | Pembuatan & tracking PO ke supplier |
| 5 | **Inbound & QC** | Penerimaan, batch, suhu truk, putaway |
| 6 | **Inventory & FEFO** | Stok realtime, breakdown UOM, stock opname |
| 7 | **Temperature Monitoring** | Log suhu harian, alert anomali |
| 8 | **Sales Order** | Pemesanan dengan auto-pricing |
| 9 | **Outbound & Delivery** | Picking FEFO, surat jalan, POD |
| 10 | **Retur & Karantina** | Pencatatan & disposisi retur |
| 11 | **Akuntansi** | COA, jurnal otomatis, laporan keuangan |
| 12 | **Notifikasi** | Alert real-time dan terjadwal |
| 13 | **Dasbor & Laporan** | Dasbor eksekutif & laporan operasional |

---

## 3. Arsitektur & Tech Stack

### 3.1 Diagram Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌───────────────────────┐    ┌──────────────────────────────┐  │
│  │  Web Admin (Next.js)  │    │  Mobile App (React Native)   │  │
│  │  Tailwind CSS         │    │  Android (Handheld Scanner)  │  │
│  └──────────┬────────────┘    └─────────────┬────────────────┘  │
└─────────────│─────────────────────────────────│─────────────────┘
              │ HTTPS / REST API                │ HTTPS / REST API
              │ WebSocket (Notifikasi)          │
┌─────────────▼─────────────────────────────────▼─────────────────┐
│                      API GATEWAY / BACKEND                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │          Node.js + NestJS (Modular Architecture)           │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │   │  Auth    │ │Inventory │ │  Sales   │ │Accounting│    │  │
│  │   │  Module  │ │  Module  │ │  Module  │ │  Module  │    │  │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │   │ Inbound  │ │Outbound  │ │  Return  │ │ Report   │    │  │
│  │   │  Module  │ │  Module  │ │  Module  │ │  Module  │    │  │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────┬────────────────────────┬────────────────┬─────────────┘
           │ SQL (TypeORM)          │ Redis Client   │ S3 SDK
┌──────────▼──────────┐  ┌─────────▼──────────┐  ┌──▼────────────┐
│   PostgreSQL DB     │  │    Redis Cache      │  │ AWS S3 / GCS  │
│   (Primary)         │  │    & Bull Queue     │  │ (File Storage)│
└─────────────────────┘  └────────────────────┘  └───────────────┘
```

### 3.2 Tech Stack Detail

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Frontend Web** | Next.js + React | 14.x | SSR + SPA hybrid |
| **UI Framework** | Tailwind CSS | 3.x | Utility-first CSS |
| **UI Components** | shadcn/ui | latest | Component library |
| **Chart/Viz** | Recharts | 2.x | Grafik dasbor |
| **Mobile App** | React Native | 0.74.x | Android base |
| **Backend** | NestJS | 10.x | Modular, DDD-ready |
| **ORM** | TypeORM | 0.3.x | PostgreSQL adapter |
| **Validasi** | class-validator | latest | DTO validation |
| **Autentikasi** | Passport.js + JWT | latest | Strategy pattern |
| **Database** | PostgreSQL | 16.x | ACID, relasional |
| **Cache/Queue** | Redis + BullMQ | latest | Job queue & cache |
| **PDF Export** | pdfmake / puppeteer | latest | Laporan PDF |
| **Excel Export** | exceljs | latest | Export Excel |
| **File Upload** | AWS SDK v3 | latest | S3 upload |
| **WebSocket** | Socket.io + NestJS | latest | Real-time notif |
| **Testing** | Jest + Supertest | latest | Unit & E2E test |
| **Container** | Docker + Compose | latest | Deployment |
| **CI/CD** | GitHub Actions | latest | Pipeline otomatis |

---

## 4. Struktur Database

> Dokumen lengkap DDL ada di: `docs/00_skema_database_lengkap.sql`

### Ringkasan Tabel (18 Tabel Utama + 6 View)

| No | Tabel | Modul | Deskripsi |
|---|---|---|---|
| 1 | `roles` | RBAC | Master peran sistem |
| 2 | `users` | RBAC | Master pengguna |
| 3 | `user_roles` | RBAC | Relasi user-role |
| 4 | `refresh_tokens` | Auth | Token JWT refresh |
| 5 | `activity_logs` | Audit | Log aktivitas user (event-level) |
| 6 | `data_change_logs` | Audit | Log jejak riwayat perubahan data baris tabel (Change Data Capture: old_data vs new_data JSONB) |
| 7 | `freezer_locations` | Master | Zona penyimpanan |
| 8 | `suppliers` | Master | Data supplier/prinsipal |
| 9 | `product_categories` | Master | Kategori produk |
| 10 | `products` | Master | Produk es krim |
| 11 | `product_uoms` | Master | Satuan & konversi |
| 12 | `customer_categories` | Pelanggan | Segmen pelanggan |
| 13 | `customers` | Pelanggan | Data pelanggan |
| 14 | `product_customer_prices` | Harga | Matriks harga |
| 15 | `purchase_orders` | Pembelian | Header PO |
| 16 | `purchase_order_items` | Pembelian | Item PO |
| 17 | `product_batches` | Inventaris | Batch + expired + cost |
| 18 | `inventory_stocks` | Inventaris | Saldo stok per batch/lokasi |
| 19 | `inventory_transactions` | Inventaris | Ledger mutasi fisik |
| 20 | `temperature_logs` | Cold Chain | Log suhu harian |
| 21 | `stock_opnames` | Inventaris | Header stock opname |
| 22 | `stock_opname_items` | Inventaris | Item opname |
| 23 | `sales_orders` | Penjualan | Header SO |
| 24 | `sales_order_items` | Penjualan | Item SO |
| 25 | `picking_lists` | Outbound | Header picking FEFO |
| 26 | `picking_list_items` | Outbound | Item picking per batch |
| 27 | `delivery_orders` | Pengiriman | Surat jalan |
| 28 | `return_orders` | Retur | Header retur |
| 29 | `return_order_items` | Retur | Item retur |
| 30 | `chart_of_accounts` | Akuntansi | Bagan akun COA |
| 31 | `journal_entries` | Akuntansi | Header jurnal |
| 32 | `journal_lines` | Akuntansi | Baris debit/kredit |
| 33 | `notification_types` | Notifikasi | Template jenis alert |
| 34 | `notifications` | Notifikasi | Notifikasi per user |
| 35 | `notification_role_settings` | Notifikasi | Konfigurasi penerima |

---

### 4.1 Standar Metadata Audit & Penelusuran Perubahan Data (*Audit Trail & Traceability*)

Setiap tabel dalam sistem mengimplementasikan metadata penelusuran data bertingkat:

1. **Kolom Jejak Pembuatan & Pembaruan (*Audit Stamp Columns*):**
   * `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`: Waktu baris data pertama kali dibuat.
   * `created_by INT REFERENCES users(id)`: Identitas user yang membuat data.
   * `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`: Waktu terakhir baris data diperbarui (otomatis via database trigger `fn_set_updated_at()`).
   * `updated_by INT REFERENCES users(id)`: Identitas user terakhir yang memodifikasi data.

2. **Dukungan Hapus Lunak (*Soft-Delete Protection*):**
   * Data master krusial (Produk, Satuan, Pelanggan, Pemasok, Kategori, COA, Lokasi Freezer) tidak dihapus permanen (`HARD DELETE`), melainkan menggunakan mekanisme *soft-delete*:
     * `is_deleted BOOLEAN DEFAULT FALSE`
     * `deleted_at TIMESTAMP`
     * `deleted_by INT REFERENCES users(id)`
   * Menjamin integritas referensial dan laporan riwayat historis masa lalu tidak rusak atau menghasilkan *broken foreign keys*.

3. **Log Perubahan Nilai Baris Tabel (*Change Data Capture / CDC*):**
   * Tabel `data_change_logs` menangkap seluruh perubahan nilai lama (`old_data` JSONB) dan nilai baru (`new_data` JSONB) secara otomatis melalui PostgreSQL trigger `fn_audit_log_changes()`.
   * Menjamin penelusuran 100% transparan untuk audit finansial dan logistik (misal: pelacakan perubahan tarif harga jual, perubahan konversi UOM, atau koreksi kuantitas stok).

---

## 5. Spesifikasi RBAC

### Matriks Hak Akses per Peran

| Modul / Fitur | ADMIN | OP.IN | OP.OUT | P.GDG | DRIVER | FINANCE | MGR.GDG | OWNER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Master Data (CRUD)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 👁 | 👁 |
| **Master Pelanggan & Harga** | ✅ | ❌ | 👁 | ❌ | ❌ | 👁 | 👁 | 👁 |
| **Purchase Order** | ✅ | ✅ | ❌ | ❌ | ❌ | 👁 | ✅ | 👁 |
| **Inbound / Penerimaan** | ✅ | ✅ | ❌ | 👁 | ❌ | 👁 | ✅ | 👁 |
| **Stok & Inventaris** | ✅ | 👁 | 👁 | ✅ | ❌ | 👁 | ✅ | 👁 |
| **Breakdown UOM** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Log Suhu** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | 👁 |
| **Stock Opname** | ✅ | ❌ | ❌ | ✅ | ❌ | 👁 | ✅ | 👁 |
| **Sales Order** | ✅ | ❌ | ✅ | ❌ | ❌ | 👁 | ✅ | 👁 |
| **Picking List** | ✅ | ❌ | 👁 | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Delivery / POD** | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | 👁 | 👁 |
| **Retur & Karantina** | ✅ | ✅ | ✅ | 👁 | ❌ | 👁 | ✅ | 👁 |
| **Jurnal & COA** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | 👁 |
| **Laporan Keuangan** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Dasbor Eksekutif** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **User Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

> ✅ = Full Access (CRUD) &nbsp;|&nbsp; 👁 = Read Only &nbsp;|&nbsp; ❌ = Tidak Ada Akses

---

## 6. Mekanisme FEFO & Multi-UOM

### 6.1 Algoritma FEFO (First Expired, First Out)

```sql
-- Query FEFO Picking: Ambil batch dengan expired_date paling awal
-- untuk memenuhi permintaan qty_needed (dalam PCS)

WITH fefo_batches AS (
    SELECT
        ist.batch_id,
        pb.batch_number,
        pb.expired_date,
        pb.cost_price_per_base_uom,
        fl.location_code,
        ist.freezer_location_id,
        ist.quantity_in_base_uom AS available_pcs,
        SUM(ist.quantity_in_base_uom) OVER (
            PARTITION BY ist.product_id
            ORDER BY pb.expired_date ASC, ist.id ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS cumulative_pcs
    FROM inventory_stocks ist
    JOIN product_batches pb  ON pb.id = ist.batch_id
    JOIN freezer_locations fl ON fl.id = ist.freezer_location_id
    WHERE ist.product_id = :product_id
      AND fl.is_quarantine = FALSE
      AND ist.quantity_in_base_uom > 0
    ORDER BY pb.expired_date ASC
)
SELECT * FROM fefo_batches
WHERE cumulative_pcs - available_pcs < :qty_needed_pcs;
```

### 6.2 Kalkulasi Multi-UOM

```
Aturan:
  - Semua stok SELALU disimpan dalam Base UOM (PCS)
  - conversion_factor = jumlah PCS dalam 1 unit UOM tersebut
  
Contoh: Produk "Es Krim Cup Coklat"
  DUS   → conversion_factor = 24  (1 DUS = 24 PCS)
  PACK  → conversion_factor = 6   (1 PACK = 6 PCS)
  PCS   → conversion_factor = 1   (Base UOM)

Input: 5 DUS
Konversi ke Base UOM: 5 × 24 = 120 PCS → disimpan di inventory_stocks

Display Toggle:
  Total PCS: 150
  ÷ 24 = 6 DUS sisa 6 PCS
  sisa 6 PCS ÷ 6 = 1 PACK sisa 0 PCS
  → Tampilan: "6 Dus 1 Pack 0 Pcs"
```

### 6.3 Breakdown UOM (Repacking)

```
Sebelum: inventory_stocks → product_id=1, batch_id=3, qty=24 (1 DUS)
Proses : Breakdown 1 DUS → 24 PCS
Setelah: inventory_stocks → product_id=1, batch_id=3, qty=24 (tetap)
         (Tidak ada perubahan qty fisik, hanya representasi)
         
Transaksi yang dicatat: BREAKDOWN
  - Tidak ada perubahan jurnal akuntansi (nilai persediaan tetap sama)
  - qty_in_base_uom tidak berubah
  - Hanya dicatat untuk audit trail
```

---

## 7. Mekanisme Jurnal Otomatis

Setiap transaksi gudang yang di-**approve** akan **otomatis** memicu pembentukan jurnal keuangan melalui `JournalEngine` di backend.

### 7.1 Flow Jurnal Engine

```
Transaksi Approved
      ↓
JournalEngine.createFromTransaction(transaction)
      ↓
Tentukan reference_type (INBOUND/OUTBOUND/SPOILAGE/...)
      ↓
Pilih Template Jurnal sesuai tipe + metode bayar
      ↓
Hitung nilai: qty × harga pokok / harga jual
      ↓
INSERT journal_entries (header)
      ↓
INSERT journal_lines (debit & kredit)
      ↓
Validasi: total_debit = total_credit (jika tidak → rollback)
      ↓
UPDATE journal_entries SET is_posted = TRUE
      ↓
Return entry_number ke response API
```

### 7.2 Contoh Kalkulasi HPP FEFO Multi-Batch

```
Sales Order: 50 PCS Es Krim Cup Coklat

FEFO Pick:
  Batch BCH-001 (expired: 2027-03-01): 30 PCS × Rp 10.000 = Rp 300.000
  Batch BCH-002 (expired: 2027-06-01): 20 PCS × Rp 10.500 = Rp 210.000

Total HPP: Rp 510.000

Jurnal HPP yang terbentuk:
  Debit  5101 Beban HPP          Rp 510.000
  Kredit 1120 Persediaan Es Krim Rp 510.000
```

---

## 8. Mekanisme Notifikasi & Alert

### 8.1 Jenis Alert & Trigger

| Jenis Alert | Trigger | Penerima | Waktu |
|---|---|---|---|
| **Suhu Anomali** | `temperature_logs.is_anomaly = TRUE` | PETUGAS_GUDANG, MANAJER_GUDANG | Real-time |
| **Near-Expired 7 Hari** | Cron harian, cek expired_date ≤ today+7 | PETUGAS_GUDANG, MANAJER_GUDANG | 06:00 WIB |
| **Near-Expired 3 Hari** | Cron harian, cek expired_date ≤ today+3 | MANAJER_GUDANG, OWNER | 06:00 WIB |
| **Expired Hari Ini** | Cron harian, cek expired_date = today | MANAJER_GUDANG, STAF_FINANCE | 06:00 WIB |
| **Stok Rendah** | qty_pcs < threshold produk | MANAJER_GUDANG | Real-time |
| **SO Dikonfirmasi** | SO status → CONFIRMED | PETUGAS_GUDANG | Real-time |
| **PO Diterima** | PO status → RECEIVED | STAF_FINANCE | Real-time |
| **Jurnal Tidak Balance** | total_debit ≠ total_credit | STAF_FINANCE | Real-time |
| **Retur Masuk Karantina** | Return status → QUARANTINE | MANAJER_GUDANG | Real-time |

### 8.2 Arsitektur Notifikasi

```
[Event Trigger]
    ↓
NotificationService.emit(type, payload)
    ↓
    ├─→ [WebSocket Gateway] → Socket.io broadcast ke user terkait (real-time)
    │
    └─→ [BullMQ Queue: 'notifications'] → Redis
              ↓
         [Worker: NotificationWorker]
              ↓
         INSERT notifications (in-app)
```

---

## 9. Konfigurasi Environment

### File `.env` Backend (NestJS)

```env
# =============================================
# APLIKASI
# =============================================
NODE_ENV=development
PORT=3001
API_VERSION=v1
APP_NAME="Cold Chain WMS API"

# =============================================
# DATABASE — PostgreSQL
# =============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=icecream_wms_db
DB_USER=wms_user
DB_PASSWORD=SuperS3cr3tPass!
DB_SSL=false
DB_MAX_CONNECTIONS=20
DB_SYNCHRONIZE=false        # FALSE di production — pakai migration
DB_LOGGING=false            # TRUE untuk debug query

# =============================================
# AUTENTIKASI — JWT
# =============================================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# =============================================
# REDIS — Cache & Queue
# =============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL_SECONDS=300       # Cache TTL: 5 menit

# =============================================
# CLOUD STORAGE — AWS S3 / GCS
# =============================================
STORAGE_PROVIDER=s3         # 's3' atau 'gcs'
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=icecream-wms-storage
GCS_PROJECT_ID=
GCS_KEY_FILE=

# =============================================
# NOTIFIKASI
# =============================================
WEBSOCKET_CORS_ORIGIN=http://localhost:3000,https://wms.yourdomain.com

# =============================================
# BATAS SUHU (COLD CHAIN)
# =============================================
TEMP_MIN_CELSIUS=-25.0
TEMP_MAX_CELSIUS=-18.0
NEAR_EXPIRY_WARNING_DAYS=7
NEAR_EXPIRY_CRITICAL_DAYS=3

# =============================================
# CORS
# =============================================
ALLOWED_ORIGINS=http://localhost:3000,https://wms.yourdomain.com
```

### File `.env` Frontend (Next.js)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME="Cold Chain WMS"
NEXT_PUBLIC_COMPANY_NAME="PT. Sejuk Distribusi Indonesia"
NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB=5
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### File `docker-compose.yml`

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: icecream_wms_db
    restart: always
    environment:
      POSTGRES_DB: icecream_wms_db
      POSTGRES_USER: wms_user
      POSTGRES_PASSWORD: SuperS3cr3tPass!
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docs/00_skema_database_lengkap.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    container_name: icecream_wms_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: icecream_wms_api
    restart: always
    env_file: ./backend/.env
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: icecream_wms_web
    restart: always
    env_file: ./frontend/.env
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
  redisdata:
```

---

## 10. Struktur Proyek (Monorepo)

```
icecream/                              ← Root proyek (monorepo)
├── docs/
│   ├── 00_skema_database_lengkap.sql
│   ├── 01_dokumentasi_teknis_master.md
│   ├── 02_spesifikasi_api_endpoint.md
│   └── 03_chart_of_accounts_coa.md
│
├── backend/                           ← NestJS API
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── decorators/            ← @Roles(), @CurrentUser()
│   │   │   ├── guards/                ← JwtAuthGuard, RolesGuard
│   │   │   ├── filters/               ← GlobalExceptionFilter
│   │   │   ├── interceptors/          ← TransformInterceptor, LoggingInterceptor
│   │   │   └── pipes/                 ← ValidationPipe
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/                  ← JWT, Passport, refresh token
│   │   │   ├── users/                 ← User CRUD, RBAC
│   │   │   ├── master-data/
│   │   │   │   ├── products/
│   │   │   │   ├── product-uoms/
│   │   │   │   ├── freezer-locations/
│   │   │   │   └── suppliers/
│   │   │   ├── customers/             ← Pelanggan & kategori
│   │   │   ├── pricing/               ← Matriks harga
│   │   │   ├── purchase-orders/       ← PO management
│   │   │   ├── inbound/               ← Penerimaan + QC + batch
│   │   │   ├── inventory/             ← Stok, FEFO, breakdown
│   │   │   ├── temperature/           ← Log suhu, alert
│   │   │   ├── stock-opname/          ← Opname & adjustment
│   │   │   ├── sales-orders/          ← SO + auto-pricing
│   │   │   ├── picking/               ← Picking list FEFO
│   │   │   ├── delivery/              ← Surat jalan, POD
│   │   │   ├── returns/               ← Retur & karantina
│   │   │   ├── accounting/
│   │   │   │   ├── chart-of-accounts/
│   │   │   │   ├── journal-entries/
│   │   │   │   └── journal-engine/    ← Auto-journal service
│   │   │   ├── reports/               ← Laporan keuangan & stok
│   │   │   ├── dashboard/             ← Dasbor & analitik
│   │   │   └── notifications/         ← Notif & WebSocket gateway
│   │   │
│   │   ├── database/
│   │   │   ├── entities/              ← TypeORM entities
│   │   │   ├── migrations/            ← DB migrations
│   │   │   └── seeds/                 ← Seed data (roles, COA, dll)
│   │   │
│   │   └── config/
│   │       ├── database.config.ts
│   │       ├── redis.config.ts
│   │       └── jwt.config.ts
│   │
│   ├── test/
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
├── frontend/                          ← Next.js Web Admin
│   ├── src/
│   │   ├── app/                       ← Next.js App Router
│   │   │   ├── (auth)/login/
│   │   │   ├── dashboard/
│   │   │   ├── master-data/
│   │   │   ├── customers/
│   │   │   ├── purchase-orders/
│   │   │   ├── inbound/
│   │   │   ├── inventory/
│   │   │   ├── sales-orders/
│   │   │   ├── delivery/
│   │   │   ├── returns/
│   │   │   ├── accounting/
│   │   │   └── reports/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    ← shadcn/ui base components
│   │   │   ├── forms/                 ← Form components per modul
│   │   │   ├── tables/                ← Data table components
│   │   │   └── dashboard/             ← Widget dasbor
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                 ← Axios instance + interceptors
│   │   │   ├── auth.ts                ← NextAuth config
│   │   │   └── utils.ts
│   │   │
│   │   └── store/                     ← Zustand state management
│   │
│   ├── .env
│   ├── package.json
│   └── Dockerfile
│
├── mobile/                            ← React Native (Android)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── InboundScreen.tsx
│   │   │   ├── PickingScreen.tsx
│   │   │   ├── TemperatureLogScreen.tsx
│   │   │   ├── DeliveryScreen.tsx
│   │   │   └── StockCheckScreen.tsx
│   │   │
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/                  ← API calls
│   │   └── store/                     ← Redux Toolkit
│   │
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 11. User Stories & Acceptance Criteria (Lengkap)

| ID | Peran | Tindakan | Manfaat | Kriteria Penerimaan |
|---|---|---|---|---|
| **US-01** | Admin Sistem | Kelola hierarki Multi-UOM dan rasio konversi per SKU | Konversi stok otomatis saat transaksi | Multi-UOM per SKU; tepat 1 Base UOM; formula konversi tervalidasi; tidak boleh hapus Base UOM jika ada stok |
| **US-02** | Admin Komersial | Kelola kategori pelanggan & matriks harga bertingkat per UOM | Harga jual berbeda per segmen pelanggan akurat | CRUD kategori pelanggan; harga unik per (Produk + UOM + Kategori); harga ≥ 0; histori perubahan harga tersimpan |
| **US-03** | Admin Sistem | Kelola master lokasi freezer dan kapasitas | Putaway dan monitoring per zona terkelola | CRUD lokasi; tandai zona karantina; kapasitas dalam PCS terdefinisi |
| **US-04** | Operator Inbound | Terima pasokan dalam satuan Dus + Batch + Expiry + Suhu Truk | Barang tercatat akurat tanpa konversi manual | Form Inbound pilih UOM; validasi suhu ≤ -18°C; stok bertambah dalam Base UOM; jurnal pembelian otomatis terbentuk |
| **US-05** | Operator Inbound | Buat & track Purchase Order ke supplier | Pemesanan terstruktur dan termonitor | CRUD PO; status workflow DRAFT→CONFIRMED→RECEIVED; linking ke penerimaan inbound |
| **US-06** | Operator Outbound | Input Sales Order dengan harga auto-fill sesuai kategori pelanggan | Entri cepat & tidak ada salah harga | Pilih pelanggan → harga auto-lock dari product_customer_prices; preview total tagihan sebelum submit |
| **US-07** | Petugas Gudang | Ambil barang berdasarkan Picking List FEFO | Batch paling dekat expired keluar lebih dulu | Picking List urut expired_date ASC; pemotongan stok presisi per batch; konfirmasi qty picked |
| **US-08** | Petugas Gudang | Breakdown UOM: buka 1 Dus → 24 Pcs | Stok eceran siap untuk order kecil | Tidak mengubah total Base UOM; dicatat sebagai transaksi BREAKDOWN; tidak memicu jurnal |
| **US-09** | Manajer Gudang | Lihat laporan stok Toggle View UOM | Visibilitas stok grosir & eceran sekaligus | Toggle: All Dus / All Pcs / Mixed (X Dus Y Pack Z Pcs); data realtime dari Redis cache |
| **US-10** | Petugas Gudang | Rekam log suhu harian + terima alert anomali | Kualitas cold chain terjaga | Input suhu per freezer; alert real-time via WebSocket jika suhu > -18°C; anomali tersimpan di log |
| **US-11** | Manajer Gudang | Lakukan stock opname dan approve adjustment | Stok sistem sesuai stok fisik | Input qty fisik per batch; sistem hitung selisih; approval → jurnal adjustment otomatis |
| **US-12** | Driver | Konfirmasi pengiriman dengan foto POD | Bukti serah terima barang tersimpan digital | Input nama penerima, timestamp, foto POD; upload ke S3; SO status → DELIVERED |
| **US-13** | Staf Finance | Setiap transaksi gudang otomatis memicu jurnal berpasangan | Data akuntansi selalu sinkron tanpa re-entry | Inbound → D:Persediaan K:Utang; Outbound → D:Piutang K:Penjualan & D:HPP K:Persediaan; Σ Debit = Σ Kredit |
| **US-14** | Staf Finance | Buat jurnal manual untuk transaksi non-gudang | Pencatatan beban operasional & transaksi keuangan | Form jurnal manual; validasi balance real-time; posting mengunci jurnal |
| **US-15** | Manajer Keuangan/Owner | Akses laporan keuangan lengkap | Profitabilitas & posisi keuangan realtime | Jurnal Umum, Buku Besar, Neraca Saldo, Laba Rugi, Neraca tersedia; export PDF & Excel |
| **US-16** | Owner | Akses dasbor eksekutif | Monitoring bisnis sekilas pandang | Widget: total stok, nilai persediaan, alert near-expiry, suhu freezer, penjualan hari ini, laba kotor |
| **US-17** | Admin Sistem | Kelola user, assign role, reset password | Keamanan akses sistem terjaga | CRUD user; assign multi-role; password bcrypt; audit log semua aktivitas |
| **US-18** | Manajer Gudang | Proses disposisi retur (restock/write-off/klaim supplier) | Penanganan retur terstruktur dan tercatat | Retur masuk karantina; approval disposisi; write-off terbentuk jurnal; klaim terbentuk kredit utang |

---

## 12. Sprint Roadmap Agile

**Durasi Total:** 8 Minggu (4 Sprint × 2 Minggu)
**Metode:** Scrum — Daily standup, Sprint planning, Sprint review, Sprint retrospective

---

### 🚀 Sprint 1 (Minggu 1–2): Fondasi & Master Data

**Goal:** Sistem bisa berjalan, login berhasil, semua master data dapat dikelola.  
**Status Realisasi:** <span style="color:#10b981;font-weight:bold;">[100% SELESAI — VERIFIED BUILD PASSED]</span>

#### Backend Tasks — [SELESAI]
- [x] Setup proyek NestJS modular + TypeORM + PostgreSQL
- [x] Jalankan semua migration (`00_skema_database_lengkap.sql`)
- [x] Seed data: Roles, COA, Freezer Locations, Customer Categories
- [x] Modul Auth: JWT login/logout, refresh token, `@Roles()` guard
- [x] API CRUD: Products + Multi-UOM (dengan validasi 1 Base UOM)
- [x] API CRUD: Freezer Locations, Suppliers, Product Categories
- [x] API CRUD: Customer Categories, Customers
- [x] API Matriks Harga (`product_customer_prices`) + lookup endpoint
- [x] API CRUD: Chart of Accounts (COA) + validasi tipe akun
- [x] API User Management + Role assignment
- [x] Audit log middleware & entity `DataChangeLog` (kolom metadata audit lengkap)

#### Frontend Tasks (TailAdmin UI/UX — 100% Bahasa Indonesia) — [SELESAI]
- [x] Setup Next.js 14 (App Router) + Tailwind CSS TailAdmin
- [x] Layout dasbor: sidebar navigasi 100% Bahasa Indonesia, header sticky, telemetri status dingin `● -21.2°C`, universal search (`⌘ K`)
- [x] Halaman Login TailAdmin bergaya Cold Chain (`/login`)
- [x] Form Master Produk: SKU, nama, kategori, suhu, dinamis repeater UOM + proteksi 1 Base UOM (`/master-data/products`)
- [x] Halaman Master Freezer Locations & Rak Gudang (+ zona karantina) (`/master-data/freezers`)
- [x] Halaman Master Pelanggan & Kategori (Modern Trade, GT, Horeka, Agen) (`/master-data/customers`)
- [x] Price List Manager: tabel matriks harga per segmen dan UOM dengan kalkulator margin (`/master-data/prices`)
- [x] Halaman Chart of Accounts (tree view hierarki akun standar) (`/accounting/coa`)
- [x] Layar Monitoring Rantai Dingin: telemetri 24 jam & log buku suhu manual (`/monitoring-suhu`)
- [x] Dasbor Eksekutif Terpadu: Bento Grid 4 KPI, Donat Penjualan, FEFO Watchlist (`/`)

#### QA / Testing — [SELESAI]
- [x] Unit test & constraint: Kalkulasi konversi UOM & validasi 1 Base UOM per produk
- [x] Unit test: Unique constraint matriks harga `(product_id, uom_id, category_id)`
- [x] Integration test & guard: Login flow & RBAC guard (`@Roles` & `JwtAuthGuard`)
- [x] Build validation: `nest build` backend lulus (Exit Code 0)
- [x] Build validation: `next build` frontend lulus (Exit Code 0, 11 static pages generated)

**Definition of Done Sprint 1:** Admin dapat login, kelola master produk dengan Multi-UOM, set harga pelanggan, kelola zona freezer, dan tinjau COA. (STATUS: TERCAPAI 100%)

---

### 📦 Sprint 2 (Minggu 3–4): Inbound, Batch, QC & Jurnal Pembelian

**Goal:** Penerimaan barang lengkap dengan validasi QC suhu, batch tracking, dan jurnal akuntansi otomatis.

#### Backend Tasks
- [ ] API Purchase Order (CRUD + status workflow)
- [ ] API Inbound: penerimaan barang, input batch + expiry + cost/PCS
- [ ] Validasi suhu truk: reject jika > -18°C (HTTP 422)
- [ ] Engine konversi UOM → Base UOM saat inbound
- [ ] Update `inventory_stocks` secara atomik (PostgreSQL transaction)
- [ ] **JournalEngine**: auto-create jurnal saat inbound di-approve
  - Debit: 1120 Persediaan | Kredit: 2101 Utang Usaha
- [ ] API Log Suhu: input + filter anomali + alert trigger
- [ ] WebSocket Gateway: broadcast alert suhu anomali ke role terkait
- [ ] BullMQ Queue: setup worker untuk notifikasi terjadwal

#### Frontend Tasks
- [ ] Form Purchase Order + item produk
- [ ] Form Inbound Barang:
  - Pilih PO, produk, UOM (Dus/Pack/Pcs)
  - Input Batch Number, Expiry Date, Cost/PCS
  - Input Suhu Truk + Status QC + Foto QC (upload S3)
  - Pilih Lokasi Freezer (dropdown)
- [ ] Halaman Riwayat Penerimaan + detail dengan ringkasan jurnal
- [ ] Form Input Log Suhu Harian Freezer
- [ ] Dashboard widget: status suhu freezer real-time

#### Mobile Tasks (DITANGGUHKAN / SKIPPED)
- [–] ~~Screen Inbound (input batch + suhu sederhana untuk operator lapangan)~~ *(Ditiadakan - Digantikan Web Inbound)*
- [–] ~~Screen Temperature Log (input suhu harian)~~ *(Ditiadakan - Digantikan Web Log Suhu)*

#### QA / Testing
- [ ] Test: Penerimaan batch berbeda untuk SKU sama
- [ ] Test: Reject inbound jika suhu > -18°C
- [ ] Test: Stok bertambah dalam Base UOM setelah inbound
- [ ] Test: Jurnal inbound balance (Σ Debit = Σ Kredit)
- [ ] Test: WebSocket menerima alert saat suhu anomali dicatat

**Definition of Done Sprint 2:** Inbound lengkap dengan QC suhu, stok terupdate, jurnal pembelian otomatis.

---

### 🚚 Sprint 3 (Minggu 5–6): FEFO Outbound, Matrix Pricing & Jurnal Penjualan/HPP

**Goal:** Sales Order dengan auto-pricing, picking FEFO, delivery, retur, dan semua jurnal penjualan otomatis.

#### Backend Tasks
- [ ] API Sales Order (CRUD + confirm + cancel)
- [ ] Auto-pricing lookup: `product_customer_prices` berdasarkan customer category
- [ ] FEFO Algorithm: generate picking list urut expired_date ASC
- [ ] API Picking List (start + complete + update qty picked)
- [ ] Atomik update stok saat picking selesai
- [ ] API Delivery Order (buat + depart + deliver + POD)
- [ ] **JournalEngine** Outbound:
  - Jurnal 1: D:Piutang (sesuai kategori) | K:Penjualan (sesuai kategori)
  - Jurnal 2: D:HPP | K:Persediaan (× FEFO cost per batch)
- [ ] API Breakdown/Repacking UOM (BREAKDOWN transaction, no journal)
- [ ] API Return Order (create → quarantine)
- [ ] API Return Disposition (write-off → jurnal spoilage)
- [ ] **JournalEngine** Spoilage: D:5201 Kerugian | K:1120 Persediaan

#### Frontend Tasks
- [ ] Form Sales Order:
  - Pilih pelanggan → auto-detect kategori
  - Tambah item → auto-fill harga dari matriks
  - Preview total tagihan sebelum submit
- [ ] Halaman Picking List: tabel urut FEFO (batch + lokasi + qty)
  - Tombol "Mulai Picking" dan update qty picked per item
- [ ] Interface Breakdown UOM (pilih produk + batch + qty)
- [ ] Form Delivery Order + konfirmasi berangkat (input suhu truk)
- [ ] Form POD (nama penerima + foto upload)
- [ ] Form Retur Pelanggan (pilih SO + produk + alasan)
- [ ] Halaman Karantina Stok

#### Mobile Tasks (DITANGGUHKAN / SKIPPED)
- [–] ~~Screen Picking List (scan barcode batch, input qty picked)~~ *(Ditiadakan - Digantikan Web Picking)*
- [–] ~~Screen Delivery (konfirmasi pengiriman + foto POD kamera)~~ *(Ditiadakan - Digantikan Web Delivery)*

#### QA / Testing
- [ ] Test: FEFO → batch BCH-001 (exp 2027-03) keluar lebih dulu dari BCH-002 (exp 2027-06)
- [ ] Test: Harga auto-fill beda antara pelanggan GT vs Agen
- [ ] Test: HPP kalkulasi multi-batch FEFO akurat
- [ ] Test: Stok berkurang setelah picking selesai (atomik)
- [ ] Test: Jurnal outbound (2 jurnal) balance
- [ ] Test: Jurnal write-off spoilage balance

**Definition of Done Sprint 3:** Siklus penjualan penuh (SO→Picking→Delivery→Jurnal) berjalan dengan benar.

---

### 📊 Sprint 4 (Minggu 7–8): Laporan Keuangan, Dasbor & UAT

**Goal:** Semua laporan keuangan tersedia, dasbor eksekutif berfungsi, UAT lulus, siap production.

#### Backend Tasks
- [ ] API Stock Opname (CRUD + approval + jurnal adjustment)
- [ ] API Laporan Jurnal Umum (filter tanggal, tipe, akun)
- [ ] API Buku Besar per akun (dengan saldo berjalan)
- [ ] API Neraca Saldo (Trial Balance) + validasi balance
- [ ] API Laporan Laba Rugi (dengan breakdown per kategori pelanggan)
- [ ] API Neraca (Balance Sheet)
- [ ] Export laporan ke PDF (puppeteer) dan Excel (exceljs)
- [ ] API Laporan Mutasi Stok multi-UOM (toggle view)
- [ ] API Dashboard summary (Redis cache 5 menit)
- [ ] API Near-expiry alerts
- [ ] Cron job near-expiry (BullMQ scheduler, jam 06:00 WIB)
- [ ] API Laporan Log Suhu Harian + grafik tren

#### Frontend Tasks
- [ ] **Halaman Laporan Jurnal Umum:** tabel paginasi + filter
- [ ] **Halaman Buku Besar:** pilih akun + tanggal + saldo berjalan
- [ ] **Halaman Neraca Saldo:** dua kolom debit/kredit + validasi balance
- [ ] **Halaman Laporan Laba Rugi:** terstruktur dengan subtotal
- [ ] **Halaman Neraca:** format standar dua sisi
- [ ] Semua laporan: tombol Export PDF dan Export Excel
- [ ] **Dasbor Eksekutif:**
  - Widget: Total Stok, Nilai Persediaan, Penjualan Hari Ini
  - Widget: Alert Near-Expiry, Anomali Suhu Aktif
  - Widget: Piutang Outstanding, Laba Kotor Bulan Ini
  - Grafik: Tren Penjualan 30 Hari
- [ ] **Tabel Stok Realtime:** toggle view Dus/Pack/Pcs/Mixed
- [ ] Halaman Stock Opname
- [ ] Notifikasi in-app (bell icon + dropdown)

#### Mobile Tasks (DITANGGUHKAN / SKIPPED)
- [–] ~~Screen Notifikasi~~ *(Ditiadakan - Digantikan Web In-App Notification)*
- [–] ~~Screen Stok Check (scan SKU → lihat stok realtime)~~ *(Ditiadakan - Digantikan Web Quick Search)*

#### QA / Testing & Deployment
- [ ] Test: Rekonsiliasi nilai Persediaan di Neraca vs total valuasi fisik
- [ ] Test: Neraca Saldo balance (Σ Debit = Σ Kredit)
- [ ] Test: Laba Rugi kalkulasi benar (Penjualan - HPP - Beban = Laba Bersih)
- [ ] E2E Test: Siklus penuh (Inbound → SO → Picking → Delivery → Laporan)
- [ ] **UAT** bersama tim logistik & tim akuntansi
- [ ] Performance test: API stok realtime < 200ms (dengan Redis cache)
- [ ] Deploy ke Staging environment
- [ ] Review keamanan: CORS, rate limit, JWT rotation
- [ ] Deploy ke Production
- [ ] Monitoring setup (uptime, error rate)

**Definition of Done Sprint 4:** UAT lulus, semua laporan keuangan akurat, aplikasi live di production.

---

## 13. Panduan Deployment

### Environment

| Env | URL | Deskripsi |
|---|---|---|
| **Development** | `localhost:3000` / `localhost:3001` | Lokal developer |
| **Staging** | `staging.wms.yourdomain.com` | UAT & QA testing |
| **Production** | `wms.yourdomain.com` | Live — user nyata |

### Checklist Pre-Deployment Production

- [ ] `.env` production terkonfigurasi (SECRET, DB password kuat)
- [ ] SSL/TLS certificate aktif (Let's Encrypt / ACM)
- [ ] `DB_SYNCHRONIZE=false` — gunakan migration
- [ ] Redis password diaktifkan
- [ ] CORS whitelist hanya domain production
- [ ] Rate limiting aktif
- [ ] Backup database otomatis terjadwal (harian)
- [ ] Log monitoring terkonfigurasi (e.g., Sentry / CloudWatch)
- [ ] Seed data COA dan Roles sudah dijalankan
- [ ] UAT sign-off dari stakeholder

---

## 14. Status Realisasi & Capaian Proyek

> **Pembaruan Terakhir:** 2026-10-31  
> **Status Fase:** Sprint 1 Selesai 100% (Build Verified) & Siap Masuk Sprint 2  
> **Repositori Git:** `https://github.com/boolank/icecreamwarehouse.git` (Branch: `main`)

### 14.1 Ringkasan Capaian per Komponen

| Komponen Arsitektur | Teknologi | Realisasi / Fitur yang Telah Dibangun | Status Verifikasi |
| :--- | :--- | :--- | :---: |
| **Backend API** | NestJS 10, TypeORM, PG, JWT, bcryptjs | • Arsitektur Modular: `auth`, `users`, `master-data`, `customers`, `pricing`, `accounting`<br>• Enkripsi kata sandi & otentikasi JWT + RolesGuard<br>• Entitas dengan metadata audit (`created_by`, `updated_by`, `is_deleted`) & `data_change_logs`<br>• Validasi bisnis: 1 Base UOM & lookup harga bertingkat | **LULUS (Exit Code 0)** |
| **Frontend Web Admin** | Next.js 14, Tailwind CSS, Lucide, Recharts | • Desain TailAdmin dengan dukungan Dark/Light mode penuh<br>• Header sticky dengan pill status suhu dingin (`-21.2°C`) & pencarian universal (`⌘ K`)<br>• Sidebar 100% Bahasa Indonesia mencakup 7 grup menu<br>• 7 Halaman aktif: Login, Dashboard Bento, Master Produk & UOM, Pelanggan, Matriks Harga, Freezer & Rak, Bagan Akun COA, dan Monitoring Suhu 24h | **LULUS (Exit Code 0)** |
| **Database DDL** | PostgreSQL 16 | • Skema DDL v2.1: 35 tabel, 5 views, 2 utility functions, trigger auto-audit `fn_audit_log_changes`<br>• Data awal: 8 Roles, Freezer Locations, Customer Categories, 60+ COA standard | **Siap Deploy** |
| **Kontainerisasi** | Docker, Docker Compose | • `docker-compose.yml` untuk PostgreSQL 16 (Port 5432) dan Redis 7 (Port 6379) dengan healthcheck | **Terkonfigurasi** |

### 14.2 Evaluasi Ruang Lingkup (Scope Review)
- **Aplikasi Mobile (React Native):** Sesuai arahan owner/stakeholder, pengerjaan aplikasi mobile ditangguhkan (*skipped*), sehingga seluruh alokasi waktu dan story point difokuskan pada penguatan antarmuka Web Admin dan keandalan REST API Backend.
- **Rantai Dingin (Cold Chain):** Seluruh visualisasi dan logika validasi suhu $\le -18^\circ\text{C}$ telah diterapkan secara konsisten pada antarmuka web.

---

## Dokumen Terkait

| Dokumen | Path | Deskripsi |
|---|---|---|
| Skema Database DDL | `docs/00_skema_database_lengkap.sql` | Seluruh DDL tabel, view, fungsi, index |
| Chart of Accounts | `docs/03_chart_of_accounts_coa.md` | COA lengkap + matriks jurnal otomatis |
| API Specification | `docs/02_spesifikasi_api_endpoint.md` | REST API endpoint lengkap |
| User Stories & Sprint Plan | `docs/04_user_stories_sprint_todolist.md` | User stories terinci, roadmap 4 sprint & to-do list (TailAdmin UI Bahasa Indonesia) |
| Rancangan Desain UI/UX | `rancangan_desain_ui_tailadmin_gudang_es_krim.md` | Spesifikasi antarmuka TailAdmin, token visual semantik & Dark Mode |
| Dokumen Asli v1 | `dokumentasi_teknis_perencanaan_agile_aplikasi_gudang_es_krim_v1.md` | Dokumen perencanaan awal |

