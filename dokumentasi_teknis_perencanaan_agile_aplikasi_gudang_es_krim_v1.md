# Dokumentasi Lengkap & Perencanaan Agile: Aplikasi Sistem Manajemen Gudang & Akuntansi Distributor Es Krim (Cold Chain WMS & ERP Lite)

Dokumentasi ini menetapkan cetak biru arsitektur perangkat lunak terintegrasi, spesifikasi teknis, skema basis data relasional, dan peta jalan pengembangan *agile* untuk sistem manajemen gudang distributor es krim berbasis rantai dingin (*Cold Chain Warehouse Management System*) yang dilengkapi dengan modul pencatatan akuntansi berpasangan (*automated double-entry accounting*). Sistem ini mengintegrasikan protokol kendali mutu suhu rantai dingin ketat, pelacakan inventaris multi-satuan (*Multi-UOM*), strategi pengeluaran berbasis tanggal kedaluwarsa terdekat (*First Expired, First Out / FEFO*), segmentasi kategori pelanggan dan matriks harga bertingkat, serta pembentukan laporan keuangan standar (Jurnal Umum, Buku Besar, Neraca Saldo, Laporan Laba Rugi, dan Neraca).

---

## 1. Alur Proses Bisnis (*Business Flow*)

Operasional distributor es krim menuntut integrasi tanpa celah antara pemantauan integritas termal rantai dingin (*cold chain*), fleksibilitas konversi satuan bertingkat (*Multi-UOM*), dan kepatuhan pencatatan akuntansi keuangan pada setiap mutasi barang.

### 1.1 Inbound (Penerimaan Barang & Pengakuan Utang/Aset)
1. **Pemeriksaan Dokumen & Kendali Mutu Suhu (*QC Cold Chain*):** Petugas memeriksa kesesuaian dokumen Surat Jalan dan Purchase Order (PO), kemudian mengukur serta merekam suhu kabin pendingin truk armada pembawa dengan ambang kelayakan standar yaitu $\le -18^\circ\text{C}$ hingga $-25^\circ\text{C}$. Es krim diperiksa secara visual dan tekstural guna memastikan tidak terjadi peristiwa pencairan ulang (*refreezing*) atau kerusakan kemasan karton.
2. **Pencatatan Batch & Multi-UOM:** Barang masuk dicatat dalam satuan beli standar (misalnya: **DUS/Karton**). Petugas merekam Nomor *Batch*, Tanggal Kedaluwarsa (*Expiry Date*), dan UOM Penerimaan ke dalam sistem.
3. **Putaway Cepat:** Barang langsung diarahkan dan dipindahkan ke dalam ruang penyimpanan utama (*cold storage* atau *walk-in freezer*) sesuai alokasi rak palet guna meminimalkan waktu paparan suhu lingkungan luar.
4. **Pembentukan Jurnal Pembelian Otomatis:** Setelah status penerimaan diverifikasi (*approved*), sistem secara otomatis membentuk ayat jurnal: mendebit akun **Persediaan Barang Dagang - Es Krim** dan mengkredit akun **Utang Usaha** (atau Kas/Bank) sebesar nilai faktur pembelian.

### 1.2 Storage, Inventory Management, & Penilaian Persediaan
1. **Penyimpanan Berbasis FEFO (*First Expired, First Out*):** Sistem mengatur alokasi dan memprioritaskan stok es krim dengan tanggal kedaluwarsa paling awal agar dikeluarkan terlebih dahulu saat melayani pesanan.
2. **Konversi Satuan & Repacking (*Breakdown UOM*):** Sistem mendukung konversi stok fisik dari UOM tingkat tinggi (Dus) menjadi UOM pecahan (Pack atau Pcs) untuk memenuhi kebutuhan pesanan eceran tanpa menimbulkan selisih fisik maupun selisih nilai moneter persediaan.
3. **Monitoring Suhu & Stock Opname Berkala:** Pencatatan suhu harian pada seluruh zona *freezer* dilakukan secara berkala. Penyesuaian stok fisik (*stock opname*) dilakukan terjadwal; setiap selisih kuantitas otomatis disesuaikan di buku besar melalui jurnal penyesuaian persediaan.

### 1.3 Outbound (Penjualan, Penentuan Harga, FEFO Picking, & Pengakuan Pendapatan/HPP)
1. **Verifikasi Pesanan & Identifikasi Kategori Pelanggan:** Pesanan penjualan (*Sales Order*) memuat identitas pelanggan, kategori pelanggan (Modern Trade, General Trade, Horeka, atau Agen), serta daftar produk yang dipesan beserta UOM transaksi yang diminta.
2. **Penentuan Harga Otomatis (*Matrix Pricing Lookup*):** Sistem secara otomatis menetapkan harga jual yang berlaku berdasarkan kombinasi produk, UOM transaksi, dan kategori pelanggan yang terdaftar.
3. **Penerbitan Picking List FEFO:** Sistem menerbitkan instruksi pengambilan barang (*Picking List*) yang secara otomatis memandu staf gudang menuju lokasi *freezer* dan nomor *batch* es krim dengan masa kedaluwarsa terdekat.
4. **Picking & Packing:** Pengambilan barang dilakukan sesuai UOM permintaan (Dus untuk pesanan grosir, atau Pack/Pcs untuk eceran).
5. **Loading, Delivery, & Pembentukan Jurnal Penjualan/HPP:** Barang dimuat ke armada berpendingin (*refrigerated truck*) disertai pencetakan Surat Jalan dan Faktur Penjualan. Sistem mencatat dua pasang jurnal secara otomatis:
   * **Pengakuan Piutang & Pendapatan:** Mendebit **Piutang Usaha** (atau Kas) dan mengkredit **Pendapatan Penjualan Es Krim** sebesar harga jual.
   * **Pengakuan Beban Pokok Penjualan (HPP):** Mendebit **Beban Pokok Penjualan (HPP)** dan mengkredit **Persediaan Barang Dagang - Es Krim** berdasarkan harga modal (*cost*) dari batch produk yang dikeluarkan secara FEFO.

### 1.4 Retur Barang, Karantina, & Pemusnahan (*Disposal/Spoilage*)
1. **Karantina Retur:** Produk yang dikembalikan oleh pelanggan (akibat leleh saat pengiriman, salah kirim, atau mendekati masa kedaluwarsa) dialokasikan ke zona isolasi/karantina khusus.
2. **Disposisi & Rekonsiliasi Akuntansi:**
   * Jika barang dapat dikembalikan ke prinsipal: Diterbitkan jurnal pengurang utang atau piutang klaim supplier.
   * Jika barang rusak total/meleleh dan harus dimusnahkan (*write-off*): Sistem membentuk jurnal beban kerugian dengan mendebit **Beban Kerugian Barang Rusak/Mencair** dan mengkredit **Persediaan Barang Dagang - Es Krim**.

---

## 2. Ruang Lingkup Sistem (*System Scope*)

Ruang lingkup fungsional sistem mencakup modul-modul berikut:

1. **User & Role Management:** Manajemen multi-pengguna dengan kontrol akses berbasis peran (*Role-Based Access Control / RBAC*) yang mencakup Admin Sistem, Operator Inbound, Operator Outbound, Petugas Gudang, Pengemudi/Driver, Staf Akuntansi/Finance, dan Manajemen/Owner.
2. **Master Data & Multi-UOM Hierarchy:** Konfigurasi master data produk, lokasi penyimpanan *freezer*, data supplier, serta pendefinisian rasio konversi satuan berjenjang (misalnya: 1 Dus = 4 Pack = 24 Pcs) dengan penetapan tepat satu satuan dasar (*Base UOM*) terkecil (Pcs).
3. **Master Data Customer & Matrix Pricing:** Pengelompokan pelanggan ke dalam berbagai kategori bisnis (Modern Trade, General Trade, Horeka, dan Agen) serta pengelolaan tabel matriks harga jual bertingkat berdasarkan kombinasi produk, UOM, dan kategori pelanggan.
4. **Inbound & QC Cold Chain:** Pencatatan penerimaan barang, registrasi *batch* dan tanggal kedaluwarsa, pemeriksaan suhu kendaraan pembawa, validasi kelayakan kualitas es krim, dan pembaruan saldo persediaan fisik.
5. **Inventory & FEFO Management:** Pelacakan posisi stok *real-time* dalam satuan *Base UOM*, mesin rekomendasi pengeluaran barang berbasis FEFO, pencatatan proses *breakdown/repacking* UOM, serta peringatan dini (*alert*) untuk suhu kritis dan produk mendekati kedaluwarsa.
6. **Outbound & Delivery:** Pembuatan pesanan keluar dengan penarikan harga otomatis sesuai kategori pelanggan, penerbitan daftar pemungutan (*picking list*), pencetakan surat jalan/faktur, dan konfirmasi pengiriman (*Proof of Delivery*).
7. **Retur & Karantina:** Modul pencatatan barang retur, pemisahan stok bermasalah dari stok aktif, dan dokumentasi berita acara pemusnahan barang rusak.
8. **Pencatatan Akuntansi Terintegrasi (*Automated Financial Ledger*):** Bagan Akun (*Chart of Accounts / COA*), pembentukan jurnal otomatis dari transaksi gudang (Inbound, Outbound, Spoilage, dan Adjustment), serta jurnal manual untuk transaksi operasional umum.
9. **Pelaporan Terpadu & Dasbor Analitik:** Visualisasi dasbor operasional dan eksekutif, laporan mutasi inventaris Multi-UOM, log suhu harian, serta laporan keuangan standar (Jurnal Umum, Buku Besar, Neraca Saldo, Laporan Laba Rugi, dan Neraca).

---

## 3. Spesifikasi & Arsitektur Teknis (*Technical Documentation*)

### 3.1 Tech Stack Architecture
Arsitektur dirancang menggunakan pola *Decoupled Client-Server* dengan protokol komunikasi RESTful API yang aman, modular, dan terukur:

* **Frontend Web Admin & Keuangan:** Next.js / React.js dengan Tailwind CSS untuk antarmuka pengguna responsif bagi staf logistik, admin komersial, akuntan, dan manajemen.
* **Mobile Application (Gudang & Driver):** React Native (Android Base) yang dioptimalkan untuk perangkat genggam (*handheld barcode scanner* dan ponsel kurir).
* **Backend REST API:** Node.js dengan framework **NestJS** (atau **Express.js**) berarsitektur modular yang mendukung prinsip *Domain-Driven Design* (DDD) dan *Dependency Injection*.
* **Database Utama:** PostgreSQL sebagai sistem basis data relasional untuk menjamin kepatuhan transaksi ACID (*Atomicity, Consistency, Isolation, Durability*), integritas referensial data Multi-UOM, multi-kategori pelanggan, serta keseimbangan debit-kredit akuntansi.
* **Cache & Message Broker:** Redis untuk *caching* kueri stok berulang serta penanganan antrean asinkron (*background job queue*) pada rekam log suhu dan notifikasi peringatan.
* **Cloud Object Storage:** AWS S3 atau Google Cloud Storage untuk penyimpanan berkas bukti mutu (foto QC barang masuk, bukti berita acara pemusnahan, dan foto bukti serah terima POD).

### 3.2 Skema Basis Data Relasional Terintegrasi (PostgreSQL)

Skema basis data berikut menghubungkan modul inventaris rantai dingin, matriks harga pelanggan, dan pencatatan akuntansi berpasangan:

```sql
-- ============================================================================
-- MODUL 1: MASTER PRODUK & MULTI-UOM
-- ============================================================================

-- 1. Master Produk
CREATE TABLE products (\n    id SERIAL PRIMARY KEY,\n    sku VARCHAR(50) UNIQUE NOT NULL,\n    name VARCHAR(100) NOT NULL,\n    min_temp DECIMAL(5,2) DEFAULT -25.0,\n    max_temp DECIMAL(5,2) DEFAULT -18.0,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 2. Master UOM & Konversi Bertingkat\nCREATE TABLE product_uoms (\n    id SERIAL PRIMARY KEY,\n    product_id INT REFERENCES products(id) ON DELETE CASCADE,\n    uom_name VARCHAR(20) NOT NULL, -- Contoh: 'DUS', 'PACK', 'PCS'\n    conversion_factor INT NOT NULL, -- Jumlah dalam Base Unit (Pcs). Contoh: DUS = 24, PACK = 6, PCS = 1\n    is_base_uom BOOLEAN DEFAULT FALSE, -- Unit terkecil (PCS)\n    is_buying_uom BOOLEAN DEFAULT FALSE, -- Default UOM Inbound (DUS)\n    is_selling_uom BOOLEAN DEFAULT FALSE -- Default UOM Outbound\n);\n\n-- ============================================================================
-- MODUL 2: KATEGORI PELANGGAN & MATRIKS HARGA
-- ============================================================================

-- 3. Kategori Pelanggan
CREATE TABLE customer_categories (\n    id SERIAL PRIMARY KEY,\n    category_code VARCHAR(20) UNIQUE NOT NULL, -- Contoh: 'MT', 'GT', 'HOREKA', 'AGEN'\n    category_name VARCHAR(100) NOT NULL, -- 'Modern Trade', 'General Trade', 'Horeka', 'Agen/Grosir'\n    description TEXT,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 4. Master Pelanggan
CREATE TABLE customers (\n    id SERIAL PRIMARY KEY,\n    customer_code VARCHAR(50) UNIQUE NOT NULL,\n    name VARCHAR(150) NOT NULL,\n    category_id INT REFERENCES customer_categories(id) ON DELETE RESTRICT,\n    phone VARCHAR(20),\n    address TEXT,\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 5. Matriks Harga Produk per Kategori Pelanggan & Satuan (UOM)
CREATE TABLE product_customer_prices (\n    id SERIAL PRIMARY KEY,\n    product_id INT REFERENCES products(id) ON DELETE CASCADE,\n    product_uom_id INT REFERENCES product_uoms(id) ON DELETE CASCADE,\n    category_id INT REFERENCES customer_categories(id) ON DELETE CASCADE,\n    price DECIMAL(12,2) NOT NULL, -- Harga jual spesifik\n    effective_date DATE DEFAULT CURRENT_DATE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT unique_product_uom_category_price UNIQUE (product_id, product_uom_id, category_id)\n);\n\n-- ============================================================================
-- MODUL 3: BATCH, INVENTARIS FISIK & MUTASI GUDANG
-- ============================================================================

-- 6. Batch & Expiry Produk
CREATE TABLE product_batches (\n    id SERIAL PRIMARY KEY,\n    product_id INT REFERENCES products(id) ON DELETE CASCADE,\n    batch_number VARCHAR(50) NOT NULL,\n    expired_date DATE NOT NULL,\n    cost_price_per_base_uom DECIMAL(12,2) NOT NULL, -- Harga beli modal per PCS untuk perhitungan HPP akurat\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 7. Saldo Stok Fisik per Lokasi & Batch (Disimpan dalam Base Unit terkecil)
CREATE TABLE inventory_stocks (\n    id SERIAL PRIMARY KEY,\n    product_id INT REFERENCES products(id) ON DELETE CASCADE,\n    batch_id INT REFERENCES product_batches(id) ON DELETE CASCADE,\n    freezer_location_id INT NOT NULL,\n    quantity_in_base_uom INT NOT NULL DEFAULT 0, -- Seluruh stok dihitung dalam Base Unit (PCS)\n    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 8. Transaksi Mutasi Gudang
CREATE TABLE inventory_transactions (\n    id SERIAL PRIMARY KEY,\n    transaction_type VARCHAR(20) NOT NULL, -- 'INBOUND', 'OUTBOUND', 'BREAKDOWN', 'ADJUSTMENT', 'SPOILAGE'\n    product_id INT REFERENCES products(id) ON DELETE CASCADE,\n    batch_id INT REFERENCES product_batches(id) ON DELETE CASCADE,\n    customer_id INT REFERENCES customers(id) ON DELETE SET NULL,\n    input_quantity INT NOT NULL,\n    input_uom_id INT REFERENCES product_uoms(id) ON DELETE RESTRICT,\n    qty_in_base_uom INT NOT NULL, -- (input_quantity * conversion_factor)\n    unit_price DECIMAL(12,2), -- Harga jual per satuan input (saat Outbound)\n    total_amount DECIMAL(15,2), -- Nilai total transaksi (input_quantity * unit_price)\n    temp_check DECIMAL(5,2),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- ============================================================================
-- MODUL 4: AKUNTANSI KEUANGAN (DOUBLE-ENTRY BOOKKEEPING)
-- ============================================================================

-- 9. Master Bagan Akun (Chart of Accounts / COA)
CREATE TABLE chart_of_accounts (\n    id SERIAL PRIMARY KEY,\n    account_code VARCHAR(20) UNIQUE NOT NULL, -- '1101' Kas, '1102' Piutang, '1103' Persediaan, '2101' Utang, '4101' Penjualan, '5101' HPP, dll.\n    account_name VARCHAR(100) NOT NULL,\n    account_type VARCHAR(20) NOT NULL, -- 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'\n    normal_balance VARCHAR(6) NOT NULL, -- 'DEBIT' atau 'CREDIT'\n    parent_id INT REFERENCES chart_of_accounts(id),\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 10. Header Jurnal Transaksi Keuangan
CREATE TABLE journal_entries (\n    id SERIAL PRIMARY KEY,\n    entry_number VARCHAR(50) UNIQUE NOT NULL, -- Contoh: 'JV-202610-0001'\n    transaction_date DATE NOT NULL,\n    reference_type VARCHAR(30) NOT NULL, -- 'INBOUND', 'OUTBOUND', 'SPOILAGE', 'ADJUSTMENT', 'MANUAL'\n    reference_id INT, -- Menunjuk ke inventory_transactions(id) atau dokumen sumber terkait\n    description TEXT,\n    is_posted BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 11. Baris Rincian Ayat Jurnal (Debit & Kredit)
CREATE TABLE journal_lines (\n    id SERIAL PRIMARY KEY,\n    journal_id INT REFERENCES journal_entries(id) ON DELETE CASCADE,\n    account_id INT REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,\n    debit_amount DECIMAL(15,2) DEFAULT 0.00,\n    credit_amount DECIMAL(15,2) DEFAULT 0.00,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT check_positive_amounts CHECK (debit_amount >= 0 AND credit_amount >= 0),\n    CONSTRAINT check_non_zero CHECK (debit_amount > 0 OR credit_amount > 0)\n);\n```

---

## 4. Kebutuhan Fungsional & Kriteria Penerimaan (*User Stories*)

Matriks kebutuhan fungsional berikut merinci peran pengguna, tindakan yang diharapkan, manfaat operasional, serta kriteria penerimaan teknis sistem:

| ID Story | Peran (*As a*) | Tindakan (*I want to*) | Manfaat (*So that*) | Kriteria Penerimaan (*Acceptance Criteria*) |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | Admin Master Data | Mengatur hierarki Multi-UOM dan rasio konversi per SKU produk | Sistem dapat melakukan konversi kuantitas stok secara otomatis saat penerimaan maupun pengeluaran. | Pengguna dapat menambahkan beberapa UOM untuk 1 SKU; wajib menetapkan tepat 1 *Base UOM*; perhitungan faktor konversi tervalidasi matematis. |
| **US-02** | Admin Komersial | Mengelola kategori pelanggan dan menetapkan matriks harga jual berjenjang per UOM | Harga jual produk dapat dibedakan secara akurat antara segmen Modern Trade, General Trade, Horeka, dan Agen. | Antarmuka mendukung CRUD kategori pelanggan; penetapan harga unik per pasangan (Produk + UOM + Kategori Pelanggan); validasi nilai harga tidak boleh negatif. |
| **US-03** | Operator Inbound | Menerima pasokan es krim dalam satuan besar (Dus) disertai input Nomor Batch, Tanggal Kedaluwarsa, dan Suhu Truk | Barang tercatat secara akurat ke dalam inventaris tanpa perlu konversi manual ke satuan terkecil. | Form Inbound mendukung pemilihan UOM Grosir; sistem memvalidasi suhu $\le -18^\circ\text{C}$; saldo stok otomatis bertambah pada `inventory_stocks` dalam skala *Base UOM* (Pcs). |
| **US-04** | Operator Outbound | Menginput pesanan penjualan (*Sales Order*) pelanggan dengan harga yang ditarik otomatis sesuai kategori dan UOM | Mempercepat proses entri data pesanan serta mencegah kekeliruan penetapan harga jual. | Saat pelanggan, produk, dan UOM dipilih, sistem mengunci harga otomatis dari tabel `product_customer_prices`; staf dapat melihat total tagihan secara instan. |
| **US-05** | Petugas Gudang | Mengambil barang keluar berdasarkan rekomendasi sistem antrean FEFO | Produk dengan masa kedaluwarsa terdekat dikeluarkan terlebih dahulu untuk menghindari kerugian produk basi. | Sistem menerbitkan *Picking List* yang mengurutkan batch dan lokasi *freezer* berdasarkan *Expiry Date* paling awal; pemotongan stok dilakukan presisi. |
| **US-06** | Petugas Gudang | Menjalankan fungsi *Breakdown / Repacking UOM* (membuka 1 Dus menjadi 24 Pcs) | Persediaan satuan eceran siap dialokasikan untuk pemenuhan pesanan pelanggan non-karton. | Sistem memotong saldo UOM besar dan menambahkan saldo UOM kecil pada nomor batch dan lokasi penyimpanan yang sama tanpa mengubah total *Base Unit*. |
| **US-07** | Manajer Gudang | Mengakses laporan posisi stok dengan fitur peralihan tampilan (*Toggle View UOM*) | Memberikan visibilitas menyeluruh terhadap ketersediaan barang dalam skala karton maupun eceran. | Laporan menampilkan tombol pengalih tampilan (*All Dus*, *All Pcs*, atau representasi terurai *X Dus Y Pack Z Pcs*); pembaruan data bersifat *real-time*. |
| **US-08** | Petugas Gudang | Mencatat log suhu harian *cold storage* dan menerima peringatan otomatis saat terjadi anomali | Kondisi lingkungan penyimpanan es krim terkontrol ketat dan risiko pencairan produk dapat dicegah. | Input log suhu harian per *freezer*; sistem membunyikan peringatan visual dan notifikasi instan apabila pembacaan suhu melebihi $-18^\circ\text{C}$. |
| **US-09** | Staf Akuntansi / Finance | Memastikan setiap transaksi gudang (penerimaan, penjualan, dan pemusnahan barang rusak) otomatis memicu ayat jurnal berpasangan yang seimbang | Data akuntansi selalu sinkron dengan mutasi fisik barang tanpa re-entry manual yang rentan kesalahan. | Transaksi Inbound otomatis mendebit Persediaan dan mengkredit Utang/Kas; transaksi Outbound mendebit Piutang/Kas & mengkredit Penjualan, serta mendebit HPP & mengkredit Persediaan; total debit harus sama persis dengan total kredit ($\sum \text{Debit} = \sum \text{Kredit}$). |
| **US-10** | Manajer Keuangan / Owner | Mengakses laporan keuangan komprehensif (Jurnal Umum, Buku Besar, Neraca Saldo, Laporan Laba Rugi, dan Neraca) | Mengetahui profitabilitas operasional, nilai aset persediaan di freezer, dan posisi neraca perusahaan secara *real-time*. | Laporan Laba Rugi menyajikan Penjualan, HPP, Laba Kotor, serta kerugian barang rusak/leleh; Neraca menyajikan Aset Lancar (Kas, Piutang, Persediaan), Utang, dan Ekuitas secara seimbang. |

---

## 5. Peta Jalan Pengembangan Agile (*Sprint Roadmap & Execution*)

Pengembangan perangkat lunak terintegrasi dilaksanakan dalam siklus 4 *Sprint* berdurasi 2 minggu per tahapan:

### 🚀 Sprint 1: Master Data, Multi-UOM, Customer Pricing, Bagan Akun, & Fondasi Arsitektur (Minggu 1 - 2)
**Fokus:** Penyiapan arsitektur dasar backend Node.js (NestJS / Express), skema basis data PostgreSQL, modul autentikasi JWT & RBAC, master data produk Multi-UOM, matriks harga pelanggan, serta bagan akun akuntansi (*Chart of Accounts*).
* **Tugas Backend:**
  * Setup arsitektur proyek modular NestJS/Express dan migrasi basis data PostgreSQL (tabel produk, UOM, kategori pelanggan, harga, dan COA).
  * Implementasi modul autentikasi JWT dan *Role-Based Access Control* (termasuk peran khusus Finance).
  * API CRUD Master Produk, Master Lokasi Freezer, Supplier, Kategori Pelanggan, dan Pelanggan.
  * API Master UOM beserta logika validasi konversi satuan (*Conversion Factor* ke *Base UOM*).
  * API Matriks Harga Pelanggan (`product_customer_prices`) per kombinasi Produk, UOM, dan Kategori Pelanggan.
  * API Master Bagan Akun (`chart_of_accounts`) dan skema validasi jurnal debit-kredit.
* **Tugas Frontend:**
  * Inisialisasi UI Next.js/React dengan Tailwind CSS serta perancangan tata letak (*layout*) dasbor multifungsi.
  * Antarmuka form Master Produk dinamis untuk konfigurasi satuan Multi-UOM dan rasio konversi.
  * Antarmuka pengelolaan Kategori Pelanggan, Master Pelanggan, dan *Price List Manager*.
  * Antarmuka pengelolaan Bagan Akun (*Chart of Accounts*).
  * Halaman pengelolaan Master Freezer dan alokasi rak penyimpanan.
* **Pengujian Mutu (QA / Testing):**
  * *Unit testing* formula kalkulasi konversi satuan (misalnya: 2 Dus @ 24 Pcs + 3 Pack @ 6 Pcs = 66 Pcs).
  * Pengujian integritas relasi matriks harga agar tidak terjadi duplikasi harga pada kategori dan UOM yang sama.
  * Pengujian integritas skema akuntansi untuk memastikan validasi saldo normal akun (Debit/Kredit).

### 📦 Sprint 2: Inbound Management, Batching, QC Cold Chain, & Jurnal Pembelian (Minggu 3 - 4)
**Fokus:** Alur penerimaan pasokan grosir, registrasi nomor *batch* dan tanggal kedaluwarsa, pemeriksaan suhu kedatangan, pencatatan stok masuk ke dalam *Base UOM*, dan penjurnalan pembelian otomatis.
* **Tugas Backend:**
  * API Inbound / Penerimaan Purchase Order dengan dukungan UOM Beli (Dus/Karton).
  * Modul pencatatan *Product Batch*, penanggalan kedaluwarsa (*Expiry Date*), dan harga beli modal per *Base UOM*.
  * Integrasi perekaman log suhu truk armada pendingin pada saat transaksi penerimaan.
  * Logika pembaruan stok otomatis ke tabel `inventory_stocks` dalam kalkulasi *Base UOM*.
  * Engine penjurnalan otomatis transaksi Inbound: Debit Persediaan (`1103`) dan Kredit Utang Usaha (`2101`) / Kas (`1101`).
* **Tugas Frontend:**
  * Antarmuka form penerimaan barang dengan pilihan dropdown UOM (Dus/Pack/Pcs).
  * Form kontrol mutu suhu armada kedatangan serta penetapan status kelayakan es krim.
  * Halaman riwayat dan rincian penerimaan pasokan gudang beserta ringkasan jurnal akuntansinya.
* **Pengujian Mutu (QA / Testing):**
  * Pengujian penerimaan barang dengan nomor *batch* berbeda untuk SKU produk yang sama.
  * Pengujian validasi penolakan barang masuk jika suhu tercatat lebih hangat dari batas ambang $-18^\circ\text{C}$.
  * Verifikasi pembentukan ayat jurnal pembelian otomatis dengan keseimbangan nilai debit dan kredit.

### 🚚 Sprint 3: FEFO Outbound, Breakdown UOM, Matrix Pricing, & Jurnal Penjualan/HPP (Minggu 5 - 6)
**Fokus:** Alur pemrosesan pesanan penjualan, penentuan harga otomatis berbasis kategori pelanggan, algoritma pemungutan FEFO, pemotongan stok multi-satuan, dan pembentukan jurnal penjualan serta HPP.
* **Tugas Backend:**
  * Implementasi algoritma penentuan *batch* pengeluaran berbasis FEFO (*First Expired, First Out*).
  * API Pesanan Penjualan (*Sales Order*) dan Pengeluaran Barang (*Outbound*) dengan penarikan harga otomatis sesuai kategori pelanggan.
  * Engine penjurnalan ganda otomatis Outbound:
    * Pengakuan Pendapatan: Debit Piutang Usaha (`1102`) / Kas (`1101`) & Kredit Penjualan (`4101`).
    * Pengakuan HPP: Debit HPP (`5101`) & Kredit Persediaan (`1103`) berdasarkan kalkulasi harga pokok batch FEFO terkait.
  * API modul *Breakdown/Repacking UOM* untuk pemecahan satuan karton ke satuan eceran.
  * API modul retur barang, pengalokasian karantina, dan penjurnalan beban pemusnahan barang rusak (*spoilage*).
* **Tugas Frontend:**
  * Antarmuka form pesanan keluar (*Sales Order*) dengan fitur *auto-fill* harga sesuai kategori pelanggan yang dipilih.
  * Tampilan *Picking List* interaktif yang menampilkan rincian urutan lokasi *freezer* dan nomor *batch* FEFO.
  * Antarmuka khusus untuk eksekusi proses *Breakdown UOM* di gudang.
  * Form pencatatan retur pelanggan dan proses penghapusan persediaan rusak (*write-off*).
* **Pengujian Mutu (QA / Testing):**
  * Simulasi pengeluaran pesanan 5 Pcs es krim saat stok fisik tersimpan dalam satuan Dus.
  * Pengujian konsistensi harga otomatis untuk pelanggan kategori Agen dibandingkan kategori General Trade.
  * Pengujian kalkulasi nilai HPP otomatis pada transaksi pengeluaran stok FEFO multi-batch.

### 📊 Sprint 4: Laporan Keuangan Lengkap, Reporting Multi-UOM, & UAT (Minggu 7 - 8)
**Fokus:** Penyusunan laporan keuangan standar (Jurnal Umum, Buku Besar, Neraca Saldo, Laba Rugi, Neraca), analitik dasbor stok Multi-UOM, monitoring suhu, pengujian terpadu (*UAT*), dan rilis produksi.
* **Tugas Backend:**
  * API Laporan Jurnal Umum (*General Journal*) dan Buku Besar (*General Ledger*) dengan filter rentang tanggal dan akun.
  * API Neraca Saldo (*Trial Balance*) dengan pengecekan integritas keseimbangan total debit dan kredit.
  * API Laporan Laba Rugi (*Income Statement*) yang merinci Pendapatan, HPP, Beban Kerugian Barang Rusak, dan Laba Kotor/Bersih.
  * API Neraca (*Balance Sheet*) yang menyajikan rincian Aset (Kas, Piutang, Persediaan Es Krim), Kewajiban, dan Ekuitas.
  * API Dasbor Analitik Stok Multi-UOM, Laporan Mutasi Stok (*Toggle View*), dan log suhu harian via Redis.
* **Tugas Frontend:**
  * Modul Halaman Laporan Keuangan:
    * Tampilan tabel interaktif Jurnal Umum dan Buku Besar per akun.
    * Tampilan Neraca Saldo.
    * Tampilan terstruktur Laporan Laba Rugi dengan komparasi laba kotor per kategori produk/pelanggan.
    * Tampilan Neraca Keuangan resmi.
    * Fitur ekspor laporan ke format PDF dan Excel.
  * Dasbor utama eksekutif dengan widget visual indikator suhu, alert kedaluwarsa, dan ringkasan laba kotor.
  * Tabel stok *real-time* interaktif dengan filter dan *toggle view* Multi-UOM (Dus / Pack / Pcs).
* **Pengujian Mutu & Peluncuran (QA & Deployment):**
  * Pengujian rekonsiliasi nilai saldo akun Persediaan di Neraca terhadap total valuasi fisik stok di seluruh *freezer*.
  * Pengujian Penerimaan Pengguna (*User Acceptance Testing / UAT*) bersama perwakilan tim logistik dan tim akuntansi.
  * Penerapan aplikasi ke lingkungan *Staging* dan persiapan peluncuran ke *Production*.
