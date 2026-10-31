# Dokumentasi Lengkap & Perencanaan Agile
## Aplikasi Sistem Manajemen Gudang Distributor Es Krim (*Cold Chain WMS*)

---

## 1. Alur Proses Bisnis (*Business Flow*)

Proses bisnis gudang distributor es krim berfokus pada penanganan rantai dingin (*cold chain*) serta fleksibilitas konversi satuan (*Multi-UOM*):

### 1.1 Inbound (Penerimaan Barang)
1. **Pemeriksaan Dokumen & QC Suhu:** Petugas memeriksa Surat Jalan / PO dan wajib mengukur suhu truk pendingin (standar $\le -18^\circ\text{C}$ hingga $-25^\circ\text{C}$) serta mengecek fisik es krim (mencair/rusak).
2. **Pencatatan Batch & Multi-UOM:** Barang masuk umumnya menggunakan satuan besar (misal: **DUS/Karton**). Petugas merekam Nomor *Batch*, Tanggal Kedaluwarsa (*Expiry Date*), dan UOM Penerimaan.
3. **Putaway:** Barang langsung dipindahkan ke dalam *cold storage* atau *walk-in freezer* sesuai alokasi rak/lokasi.

### 1.2 Storage & Inventory Management
1. **Penyimpanan FEFO (*First Expired, First Out*):** Stok dikelola agar produk yang mendekati tanggal kedaluwarsa dikeluarkan terlebih dahulu.
2. **Konversi Satuan & Repacking (Breakdown UOM):** Sistem mendukung konversi stok dari UOM besar (Dus) ke UOM sedang/kecil (Pack/Pcs) saat ada kebutuhan eceran.
3. **Monitoring Suhu & Stock Opname:** Pencatatan suhu harian *cold storage* serta penyesuaian stok fisik secara berkala.

### 1.3 Outbound (Pengeluaran & Pengiriman)
1. **Verifikasi Order & Picking List:** Sistem menerbitkan *Picking List* otomatis berdasarkan algoritma FEFO dan lokasi freezer.
2. **Picking & Packing:** Pengambilan es krim dalam UOM Grosir (Dus) maupun Eceran (Pack/Pcs).
3. **Loading & Delivery:** Pemuatan ke armada berpendingin (*refrigerated truck*) dan penerbitan Surat Jalan beserta *Proof of Delivery* (POD).

### 1.4 Retur Barang (Returns)
1. **Karantina Retur:** Barang retur (meleleh, salah kirim, near-expired) dipisahkan di area karantina untuk proses pemusnahan atau klaim ke supplier.

---

## 2. Ruang Lingkup Sistem (*System Scope*)

1. **User & Role Management:** Multi-role (Admin, Operator Inbound/Outbound, Driver, Manager/Owner) dengan pengaturan hak akses.
2. **Master Data & Multi-UOM Hierarchy:** Pengaturan produk, lokasi freezer, supplier, pelanggan, serta rasio konversi satuan berjenjang (misal: 1 Dus = 4 Pack = 24 Pcs).
3. **Inbound & QC Cold Chain:** Input penerimaan barang, pencatatan batch/expired, pemeriksaan suhu kedatangan, dan penetapan status kelayakan.
4. **Inventory & FEFO Management:** Pelacakan stok real-time dalam *Base Unit* (Pcs), otomatisasi rekomendasi FEFO, repacking/breakdown UOM, dan alert suhu/expired.
5. **Outbound & Delivery:** Manajemen picking list FEFO, cetak surat jalan, packing status, dan konfirmasi penerimaan (POD).
6. **Retur & Karantina:** Pencatatan pengembalian es krim dan pemisahan stok retur.
7. **Laporan & Dasbor:** Widget stok real-time (toggle view per UOM), laporan mutasi, log suhu, dan analisis barang rusak/expired.

---

## 3. Spesifikasi & Arsitektur Teknis (*Technical Documentation*)

### 3.1 Tech Stack Recommendation
* **Frontend Web Admin:** Next.js / React.js (Tailwind CSS)
* **Mobile App (Gudang & Driver):** React Native / Flutter (Android Base)
* **Backend REST API:** Node.js (NestJS / Express) atau Go (Golang)
* **Database Utama:** PostgreSQL (Relational DB untuk transaksi ACD, kompleksitas Multi-UOM & Batch)
* **Cache & Queue:** Redis (Caching stok real-time & antrean log suhu/notifikasi)
* **Cloud Storage:** AWS S3 / Google Cloud Storage (Dokumentasi foto QC & POD)

### 3.2 Skema Database Utama (Multi-UOM & Cold Chain Focus)

```sql
-- 1. Master Produk
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_temp DECIMAL(5,2) DEFAULT -25.0,
    max_temp DECIMAL(5,2) DEFAULT -18.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master UOM & Konversi
CREATE TABLE product_uoms (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    uom_name VARCHAR(20) NOT NULL, -- Contoh: 'DUS', 'PACK', 'PCS'
    conversion_factor INT NOT NULL, -- Jumlah ke Base Unit (Pcs). Contoh: DUS = 24, PACK = 6, PCS = 1
    is_base_uom BOOLEAN DEFAULT FALSE, -- Base unit terkecil (PCS)
    is_buying_uom BOOLEAN DEFAULT FALSE, -- Default UOM Inbound (DUS)
    is_selling_uom BOOLEAN DEFAULT FALSE -- Default UOM Outbound
);

-- 3. Batch & Expiry
CREATE TABLE product_batches (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    batch_number VARCHAR(50) NOT NULL,
    expired_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stok Fisik per Lokasi & Batch (Disimpan dalam Base Unit terkecil)
CREATE TABLE inventory_stocks (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    batch_id INT REFERENCES product_batches(id),
    freezer_location_id INT NOT NULL,
    quantity_in_base_uom INT NOT NULL DEFAULT 0, -- Semua stok disimpan dalam PCS
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transaksi Gudang (Inbound/Outbound/Adjustment)
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL, -- 'INBOUND', 'OUTBOUND', 'BREAKDOWN', 'ADJUSTMENT'
    product_id INT REFERENCES products(id),
    batch_id INT REFERENCES product_batches(id),
    input_quantity INT NOT NULL, -- Jumlah yang diinput user
    input_uom_id INT REFERENCES product_uoms(id), -- UOM yang dipilih
    qty_in_base_uom INT NOT NULL, -- Hasil konversi otomatis (input_quantity * conversion_factor)
    temp_check DECIMAL(5,2), -- Suhu saat transaksi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. User Stories & Acceptance Criteria

| ID Story | Role (*As a*) | Action (*I want to*) | Benefit (*So that*) | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | Admin Master Data | Mengatur hirarki UOM & konversi satuan per produk | Sistem dapat mengonversi stok otomatis saat penerimaan/pengeluaran. | Menambah multi-UOM per SKU; menetapkan 1 *Base UOM*; perhitungan faktor konversi tervalidasi. |
| **US-02** | Operator Inbound | Menerima barang dalam satuan besar (Dus) dengan input No. Batch, Expiry, dan Suhu Truk | Barang tercatat akurat tanpa perlu konversi manual ke eceran. | Form Inbound mendukung pilihan UOM Grosir; validasi suhu $\le -18^\circ\text{C}$; stok otomatis bertambah dalam *Base Unit*. |
| **US-03** | Operator Outbound | Mengeluarkan barang dalam satuan kecil/eceran (Pack/Pcs) berbasis sistem FEFO | Barang dengan tanggal kedaluwarsa terdekat keluar lebih dulu. | Sistem menyarankan Batch & Lokasi Freezer sesuai urutan *Expired Date* terdekat; stok dipotong sesuai rasio UOM. |
| **US-04** | Petugas Gudang | Melakukan *Breakdown / Repacking UOM* (misal: buka 1 Dus jadi 24 Pcs) | Stok eceran siap diambil untuk order skala kecil. | Fitur pengurangan stok UOM besar dan penambahan stok UOM kecil pada batch & lokasi yang sama. |
| **US-05** | Manajer Gudang | Melihat laporan stok real-time dalam berbagai pilihan Tampilan UOM | Memudahkan analisa stok grosir maupun eceran. | Fitur *Toggle View* laporan (misal: Tampil sebagai Total Dus atau Detail Pcs). |
| **US-06** | Petugas Gudang | Merekam log suhu freezer harian dan menerima alert suhu | Kualitas es krim tetap terjaga dan terhindar dari kerosakan. | Input log suhu harian; sistem mengirimkan notifikasi *alert* jika suhu melebihi threshold max ($-18^\circ\text{C}$). |

---

## 5. Sprint Roadmap & To-Do List (Agile Execution)

### 🚀 Sprint 1: Master Data, Multi-UOM, & Arsitektur Dasar (Minggu 1 - 2)
**Fokus:** Fondasi database, autentikasi, serta master data produk dengan aturan Multi-UOM.

* [ ] **Backend Tasks:**
  * [ ] Setup struktur proyek backend & PostgreSQL database migration.
  * [ ] Implementasi Authentication (JWT) & Role-based Access Control.
  * [ ] API CRUD Master Produk, Master Freezer, Supplier, dan Customer.
  * [ ] API Master UOM & logika perhitungan konversi satuan (*Conversion Factor* ke *Base UOM*).
* [ ] **Frontend Tasks:**
  * [ ] Setup UI Framework (Next.js / React) & Layout Dashboard.
  * [ ] Form Master Produk dengan fitur dinamis penambahan UOM & faktor konversi.
  * [ ] Halaman kelola Master Freezer & Lokasi Penyimpanan.
* [ ] **QA / Testing:**
  * [ ] Unit testing logika kalkulasi konversi UOM (misal: 2 Dus @ 24 Pcs + 3 Pack @ 6 Pcs = 66 Pcs).

---

### 📦 Sprint 2: Inbound Management, Batching, & QC Cold Chain (Minggu 3 - 4)
**Fokus:** Penerimaan barang grosir (Dus), pencatatan batch/expired, dan pemeriksaan suhu kedatangan.

* [ ] **Backend Tasks:**
  * [ ] API Inbound / Purchase Order Receiving (Mendukung input UOM Pembelian/Dus).
  * [ ] Logika registrasi *Product Batch* & *Expiry Date*.
  * [ ] Integration log pemeriksaan suhu truk kedatangan.
  * [ ] Pembaruan stok otomatis ke `inventory_stocks` dalam skala *Base UOM*.
* [ ] **Frontend Tasks:**
  * [ ] UI Form Inbound Barang dengan *dropdown* pilihan UOM (Dus/Pack/Pcs).
  * [ ] Form QC Input Suhu Kedatangan & Status Kelayakan Es Krim.
  * [ ] Halaman Riwayat & Detail Penerimaan Barang.
* [ ] **QA / Testing:**
  * [ ] Testing penerimaan barang dengan batch terpisah untuk produk yang sama.

---

### 🚚 Sprint 3: FEFO Outbound, Breakdown UOM, & Picking (Minggu 5 - 6)
**Fokus:** Pengeluaran barang eceran, algoritma FEFO, proses picking, dan breakdown UOM.

* [ ] **Backend Tasks:**
  * [ ] Algoritma penentuan Batch berbasis **FEFO** (*First Expired, First Out*).
  * [ ] API Outbound / Pengeluaran Barang (Mendukung pemotongan stok UOM Eceran).
  * [ ] API Modul *Breakdown/Repacking UOM* (Buka Dus menjadi Pack/Pcs).
  * [ ] API Modul Retur Barang & Karantina.
* [ ] **Frontend Tasks:**
  * [ ] UI Form Pesanan Pengeluaran (*Sales Order / Outbound*).
  * [ ] Tampilan *Picking List* yang menampilkan rekomendasi lokasi freezer & batch FEFO.
  * [ ] Interface khusus fitur *Breakdown UOM*.
  * [ ] UI Form Retur & Pengelolaan Stok Karantina.
* [ ] **QA / Testing:**
  * [ ] Simulasi pengeluaran 5 Pcs produk saat stok tersimpan dalam hitungan Dus.
  * [ ] Testing pemotongan stok FEFO secara simultan.

---

### 📊 Sprint 4: Multi-UOM Reporting, Temperature Logging, & UAT (Minggu 7 - 8)
**Fokus:** Laporan mutasi stok fleksibel (Display Multi-UOM), monitoring suhu, dan rilis.

* [ ] **Backend Tasks:**
  * [ ] API Dashboard Analytics (Total Stok per UOM, Alert Near-Expired, Low Stock).
  * [ ] API Laporan Mutasi Stok (Fitur toggle view: Tampil sebagai Total Dus atau Total Pcs).
  * [ ] API Log Suhu Harian Freezer & sistem notifikasi/alert.
* [ ] **Frontend Tasks:**
  * [ ] Dashboard Utama dengan widget *Alert Near-Expired* & *Suhu Freezer*.
  * [ ] Tabel Stok Real-Time dengan *Toggle View UOM* (Dus / Pack / Pcs).
  * [ ] Interface Input Log Suhu Harian Freezer.
* [ ] **QA / Testing & Deployment:**
  * [ ] End-to-End (E2E) Integration Testing.
  * [ ] User Acceptance Testing (UAT) bersama tim operasional gudang.
  * [ ] Deployment aplikasi ke environment Staging/Production.