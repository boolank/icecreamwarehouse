# Dokumen Pengerjaan Proyek: User Stories, Sprint Plan & To-Do List
## Sistem Informasi Gudang Distributor Es Krim (Cold Chain WMS & ERP Lite)
### Standar Antarmuka: TailAdmin UI/UX (Tailwind CSS, Next.js 14, Mode Gelap/Terang & Bahasa Indonesia Penuh)

> **Versi Dokumen:** 2.3 (Status Capaian Realisasi Sprint 1 Selesai 100%, Sprint 2 Inbound Selesai, & Sprint 3 Core Outbound Selesai)  
> **Tanggal Pembaruan:** 2026-10-31  
> **Metodologi:** Agile Scrum  
> **Siklus:** 4 Sprint × 2 Minggu (Total 8 Minggu)  
> **Estimasi Total Story Points:** 168 SP  
> **Realisasi Capaian:** 107 SP / 168 SP (63.7% Total Progress — Sprint 1 Lulus 100%, Sprint 2 Inbound Selesai, Sprint 3 Core Outbound Lulus)  
> **Status Build:** Backend NestJS 10 (Lulus / Exit Code 0) | Frontend Next.js 14 (Lulus / Exit Code 0, 16 Rute Statis)  
> **Repositori Git:** `https://github.com/boolank/icecreamwarehouse.git` (Branch `main`)  
> **Rujukan Desain UI/UX:** `rancangan_desain_ui_tailadmin_gudang_es_krim.md`

---

## 📊 Dasbor Ringkasan Capaian Pengerjaan Proyek

| Siklus Sprint | Target Fitur | Beban (SP) | Status Capaian | Verifikasi Teknis |
| :--- | :--- | :---: | :---: | :---: |
| **Sprint 1 (Minggu 1-2)** | Fondasi Arsitektur, Auth RBAC, Master Produk & Multi-UOM, Pelanggan, Matriks Harga, Setup COA, Shell TailAdmin | **38 SP** | <span style="color:#10b981;font-weight:bold;">100% SELESAI</span> | Build Passed (NestJS & Next.js) |
| **Sprint 2 (Minggu 3-4)** | Purchase Order, Inbound Receiving, Batch & QC Suhu Armada ($\le -18^\circ\text{C}$), Jurnal Pembelian Otomatis, Log Suhu | **42 SP** | <span style="color:#10b981;font-weight:bold;">30 SP SELESAI (71.4%)</span> | PO, Inbound QC & Journal Ready |
| **Sprint 3 (Minggu 5-6)** | Sales Order, Picking List FEFO, Pengiriman & Surat Jalan, Breakdown/Repacking UOM, Retur & Spoilage, Jurnal Jual | **48 SP** | <span style="color:#10b981;font-weight:bold;">39 SP SELESAI (81.25%)</span> | SO, FEFO Picking & Dual Journal Ready |
| **Sprint 4 (Minggu 7-8)** | Stock Opname, Pelaporan Finansial (Laba Rugi, Neraca), Dasbor Eksekutif Bento Grid, Export PDF/Excel, UAT | **40 SP** | Direncanakan | Desain UI Siap |
| **TOTAL** | **Cold Chain WMS & Automated Accounting** | **168 SP** | **107 SP (63.7%)** | **Sprint 1, 2, & 3 Core Lulus & Teruji** |

> **Catatan Ruang Lingkup:** Sesuai instruksi mutakhir, pengerjaan aplikasi mobile (*React Native*) ditangguhkan (*skipped*), sehingga seluruh alokasi sumber daya difokuskan secara optimal pada **Web Admin TailAdmin (Next.js 14) + Backend REST API (NestJS 10)**.

---

## 1. Daftar User Stories Lengkap & Acceptance Criteria

Setiap story memiliki identifikasi unik, role, narasi bisnis, estimasi Story Points (SP), dan Acceptance Criteria (AC) dengan format kriteria pengujian terukur serta standar antarmuka TailAdmin berbahasa Indonesia.

---

### Modul 1: Autentikasi, Profil & Kontrol Akses (RBAC)

#### US-01: Autentikasi JWT & Role-Based Access Control — [STATUS: SELESAI]
- **Sebagai:** Semua Pengguna Sistem (Admin, Operator, Driver, Finance, Manager, Owner)
- **Saya Ingin:** Masuk ke sistem menggunakan username dan password terenkripsi serta mendapatkan hak akses menu sesuai peran
- **Agar:** Keamanan data terjaga dan setiap staf hanya dapat mengakses fitur yang relevan dengan tanggung jawab kerjanya
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Halaman login mengadopsi antarmuka modern TailAdmin dengan tata letak responsif, dukungan mode gelap/terang, dan teks antarmuka 100% Bahasa Indonesia ("Masuk ke Sistem", "Nama Pengguna", "Kata Sandi", "Ingat Saya", "Lupa Kata Sandi?").
  - [x] Endpoint `POST /api/v1/auth/login` memvalidasi kredensial pengguna menggunakan perbandingan hash `bcryptjs`.
  - [x] Jika valid, sistem mengembalikan access token JWT (masa berlaku 1 jam) dan refresh token (masa berlaku 7 hari).
  - [x] Token memuat payload identitas pengguna dan daftar peran (`roles: []`).
  - [x] Percobaan login gagal lebih dari 5 kali berturut-turut dalam 1 menit dikenakan *rate limiting* (HTTP 429) dengan pesan kesalahan Bahasa Indonesia yang ramah pengguna.
  - [x] Pengguna dengan peran tertentu tidak dapat mengakses rute API yang dilindungi peran lain (HTTP 403 Forbidden).
  - [x] Setiap aksi login dan logout tercatat di tabel `activity_logs`.

---

### Modul 2: Master Data, Multi-UOM & Matriks Harga

#### US-02: Pengelolaan Hierarki Multi-UOM Produk — [STATUS: SELESAI]
- **Sebagai:** Admin Master Data
- **Saya Ingin:** Mengonfigurasi master produk es krim beserta konversi satuan bertingkat (misal: 1 Dus = 4 Pack = 24 Pcs) pada antarmuka TailAdmin
- **Agar:** Transaksi penerimaan dan pengeluaran barang dapat dicatat dalam satuan grosir maupun eceran tanpa membingungkan pencatatan stok dasar (Base Unit)
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Form entri produk menggunakan bahasa Indonesia ("Tambah Produk Es Krim", "Kode SKU", "Nama Produk", "Kategori", "Merek", "Suhu Minimum", "Suhu Maksimum", "Masa Simpan").
  - [x] Komponen repeater satuan dinamis mendukung penambahan multi-satuan dengan lencana mikro (*micro-badges*) berwarna (Dus: biru, Pack: ungu, Pcs: abu-abu).
  - [x] Sistem mewajibkan pendefinisian tepat 1 satuan dasar terkecil (*Base UOM*, misal: `PCS`) dengan `conversion_factor = 1`.
  - [x] Pengguna dapat mendaftarkan UOM tambahan dengan faktor konversi integer positif terhadap Base UOM (misal: `DUS = 24`, `PACK = 6`).
  - [x] Sistem memvalidasi parameter suhu penyimpanan standar es krim (`min_temp` default $-25^\circ\text{C}$, `max_temp` default $-18^\circ\text{C}$).
  - [x] Satuan Base UOM yang sudah memiliki saldo persediaan tidak dapat diubah atau dihapus (*restricted delete*).

#### US-03: Segmentasi Kategori Pelanggan & Matriks Harga Bertingkat — [STATUS: SELESAI]
- **Sebagai:** Admin Komersial
- **Saya Ingin:** Mengelola kategori pelanggan (Modern Trade, General Trade, Horeka, Agen) dan menetapkan daftar harga jual per kombinasi Produk, UOM, dan Kategori pada layar TailAdmin
- **Agar:** Penagihan penjualan sesuai dengan kontrak komersial segmen pelanggan secara otomatis
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] CRUD Kategori Pelanggan menggunakan label Bahasa Indonesia dan dilengkapi lencana mikro warna semantik:
    - Modern Trade: `indigo-100/800`
    - General Trade: `teal-100/800`
    - Horeka: `amber-100/800`
    - Agen / Grosir: `emerald-100/800`
  - [x] Matriks harga `product_customer_prices` menerapkan batasan unik pada `(product_id, product_uom_id, category_id)`.
  - [x] Seluruh harga disajikan dalam format mata uang Rupiah dengan tipografi angka tabular (`tabular-nums font-mono`).
  - [x] Harga yang dimasukkan bernilai $\ge 0$ (tidak boleh bernilai negatif).
  - [x] Tersedia endpoint lookup harga cepat `GET /api/v1/prices/lookup?product_id=&uom_id=&category_id=`.

#### US-04: Master Lokasi Freezer & Supplier — [STATUS: SELESAI]
- **Sebagai:** Admin Master Data
- **Saya Ingin:** Mendaftarkan zona rak *freezer* (termasuk zona karantina) dan data supplier pasokan
- **Agar:** Alokasi penempatan fisik barang dan rekam jejak asal pasokan dapat terdata rapi
- **Estimasi:** 3 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Tabel lokasi rak *freezer* menyajikan denah kode rak (misal: `FRZ-A / RAK-02 / B-01`), kapasitas Base Unit, dan badge status karantina berwarna merah amber.
  - [x] Form Supplier menggunakan Bahasa Indonesia lengkap dengan kontak PIC, NPWP, dan syarat pembayaran (*payment terms*).

---

### Modul 3: Pengadaan (Purchase Order) & Inbound Cold Chain

#### US-05: Pengelolaan Purchase Order (PO) — [STATUS: SELESAI]
- **Sebagai:** Operator Inbound / Staf Pembelian
- **Saya Ingin:** Membuat dokumen Purchase Order pasokan es krim ke supplier dalam satuan beli grosir (Dus)
- **Agar:** Ada acuan pemesanan resmi sebelum barang dikirim oleh prinsipal
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Form PO mendukung pemilihan supplier, tanggal estimasi kedatangan, dan daftar item produk dengan UOM beli (Dus).
  - [x] Status workflow PO berbahasa Indonesia: `Draf` $\rightarrow$ `Dikonfirmasi` $\rightarrow$ `Diterima Sebagian` $\rightarrow$ `Diterima Lengkap` / `Dibatalkan`.
  - [x] Nilai subtotal dan total PO terkalkulasi otomatis dalam angka tabular Rupiah.

#### US-06: Penerimaan Pasokan, Batch, Expiry, & QC Suhu Armada — [STATUS: SELESAI]
- **Sebagai:** Operator Inbound
- **Saya Ingin:** Menerima pasokan es krim dengan mengukur suhu armada pembawa, merekam nomor batch, tanggal kedaluwarsa, dan harga modal beli per Base UOM pada antarmuka TailAdmin
- **Agar:** Hanya es krim dengan kondisi suhu rantai dingin layak ($\le -18^\circ\text{C}$) yang masuk ke stok gudang
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Form Inbound mewajibkan entri suhu truk pendingin dengan komponen indikator warna semantik:
    - Optimal ($\le -18^\circ\text{C}$): Lencana hijau `bg-emerald-50 text-emerald-700` ("Suhu Truk Memenuhi Standar").
    - Kritis / Bahaya ($> -18^\circ\text{C}$): Lencana merah berkedip `bg-rose-50 text-rose-700 border-rose-200 animate-pulse` ("BAHAYA: SUHU MELEBIHI BATAS - POTENSI PENCAIRAN").
  - [x] Perekaman nomor batch, tanggal produksi, dan tanggal kedaluwarsa wajib terisi untuk setiap baris produk.
  - [x] Input kuantitas dalam UOM Beli (misal: 100 Dus) otomatis dikonversikan dan menambah saldo `inventory_stocks` dalam skala Base UOM (2.400 Pcs).
  - [x] Field `cost_price_per_base_uom` terekam pada `product_batches` sebagai dasar perhitungan HPP FEFO.
  - [x] Transaksi penerimaan otomatis memicu tampilan Kartu Jurnal Akuntansi Seimbang (*Balanced Journal Card*) dalam Bahasa Indonesia.

---

### Modul 4: Manajemen Inventaris, FEFO, Log Suhu & Stock Opname

#### US-07: Rekomendasi Alokasi Pengeluaran Berbasis FEFO — [STATUS: SELESAI]
- **Sebagai:** Petugas Gudang
- **Saya Ingin:** Sistem merekomendasikan nomor batch dan lokasi rak *freezer* berdasarkan tanggal kedaluwarsa paling awal (*First Expired, First Out*)
- **Agar:** Es krim yang masa kedaluwarsanya lebih dekat segera dikeluarkan guna meminimalkan risiko kerugian barang basi
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Algoritma FEFO mengurutkan stok aktif berstatus bukan karantina berdasarkan `expired_date ASC`.
  - [x] Jika stok batch terdekat tidak mencukupi permintaan pesanan, sistem memecah alokasi pengambilan (*split picking*) ke batch berikutnya secara berurutan.
  - [x] Batch yang sudah kedaluwarsa (`expired_date < CURRENT_DATE`) dikunci otomatis dari rekomendasi picking.

#### US-08: Breakdown / Repacking UOM — [STATUS: SELESAI]
- **Sebagai:** Petugas Gudang
- **Saya Ingin:** Melakukan pemecahan satuan karton besar (Dus) menjadi satuan eceran (Pack/Pcs) melalui dialog pop-up interaktif TailAdmin
- **Agar:** Stok eceran siap dialokasikan untuk pemenuhan pesanan pelanggan non-karton
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Modal pop-up / halaman "Pemecahan Satuan (Breakdown UOM)" menampilkan panel konversi instan (misal: "Buka 2 Dus $\rightarrow$ Menjadi 48 Pcs") dalam Bahasa Indonesia.
  - [x] Transaksi `BREAKDOWN` tidak mengubah total kuantitas dalam skala Base UOM (`quantity_in_base_uom` tetap sama).
  - [x] Transaksi breakdown tidak memicu ayat jurnal keuangan karena total nilai moneter persediaan tidak berubah (Netto = Rp 0).
  - [x] Riwayat breakdown tercatat di `inventory_transactions` untuk kebutuhan audit trail.

#### US-09: Tampilan Stok Real-Time Fleksibel (Multi-UOM Switcher)
- **Sebagai:** Manajer Gudang
- **Saya Ingin:** Melihat saldo persediaan gudang dengan komponen pengalih satuan (*Multi-UOM Segmented Switcher*) pada bilah kendali TailAdmin
- **Agar:** Ketersediaan stok dapat dievaluasi baik dari sudut pandang volume ruang *freezer* (karton) maupun kebutuhan eceran
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Bilah kontrol menyediakan komponen tombol segmented Bahasa Indonesia:
    - `[ Tampilan Terurai (Dus / Pack / Pcs) ]`
    - `[ Standarisasi Base Unit (Pcs) ]`
    - `[ Estimasi Total Dus ]`
  - [ ] Angka kuantitas dan valuasi persediaan diperbarui secara instan mengikuti mode UOM yang aktif dengan format angka tabular monospasi.
  - [ ] Informasi disajikan bersama lencana sisa hari kedaluwarsa (Hijau: > 60 hari; Kuning: 30-60 hari; Merah: < 30 hari).

#### US-10: Pencatatan Log Suhu Harian & Notifikasi Anomali
- **Sebagai:** Petugas Gudang
- **Saya Ingin:** Mencatat suhu harian masing-masing ruang/rak *freezer* secara berkala dan menerima peringatan instan jika suhu tidak normal
- **Agar:** Integritas suhu es krim terjaga dan potensi kerusakan akibat fluktuasi pendingin dapat ditangani segera
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Input log suhu mencatat timestamp, ID lokasi, nilai derajat Celcius, dan ID petugas pencatat.
  - [ ] Sistem menandai kolom `is_anomaly = TRUE` jika suhu terdata $> -18^\circ\text{C}$ atau $< -25^\circ\text{C}$.
  - [ ] Anomali suhu memicu badge indikator suhu global di header atas (`-13.5°C KRITIS: SUHU MELEBIHI AMBANG`) berkedip merah dan memunculkan pop-up notifikasi real-time via WebSocket.

#### US-11: Pelaksanaan Stock Opname & Penyesuaian Saldo
- **Sebagai:** Manajer Gudang
- **Saya Ingin:** Melakukan pencocokan antara stok fisik dan stok sistem secara berkala serta menerbitkan jurnal selisih (*adjustment*)
- **Agar:** Catatan buku inventaris selalu mencerminkan kondisi riil di lapangan
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Halaman Stock Opname menyajikan tabel rekonsiliasi selisih dengan penanda warna (Hijau: Cocok, Biru: Surplus, Merah: Selisih Kurang).
  - [ ] Petugas menginput hasil hitung fisik; selisih kuantitas dihitung otomatis (`difference_base_uom`).
  - [ ] Setelah opname disetujui (*approved*), saldo `inventory_stocks` disesuaikan ke angka fisik.
  - [ ] Sistem otomatis menerbitkan jurnal penyesuaian: mendebit/mengkredit akun `1120 Persediaan` dan akun `5203 Beban Selisih Stok`.

---

### Modul 5: Penjualan (Sales Order), Picking, Pengiriman & Faktur

#### US-12: Pembuatan Sales Order dengan Auto-Pricing Sesuai Segmen — [STATUS: SELESAI]
- **Sebagai:** Operator Outbound
- **Saya Ingin:** Memasukkan pesanan penjualan pelanggan di mana harga satuan produk terkunci otomatis berdasarkan kategori pelanggan dan UOM yang dipilih
- **Agar:** Entri order cepat dan tidak terjadi kekeliruan penetapan harga antara pelanggan Modern Trade, Horeka, maupun Agen
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Saat nama pelanggan dipilih, sistem menampilkan lencana kategori otomatis (misal: `AGEN / GROSIR`, `GENERAL TRADE`, `MODERN TRADE`) dan sisa plafon kredit.
  - [x] Pemilihan SKU dan UOM transaksi langsung mengunci harga dari matriks `product_customer_prices` (*auto-locked price*).
  - [x] Panel ringkasan tagihan kanan menyajikan: Total Kuantitas Base Unit, Subtotal, PPN 11%, Total Tagihan Bersih, dan Proyeksi Margin Laba Kotor dalam Bahasa Indonesia.
  - [x] Status awal pesanan adalah `Draf`, dapat dikonfirmasi (`Dikonfirmasi`) oleh pejabat berwenang.

#### US-13: Penerbitan Picking List FEFO & Pemungutan Barang — [STATUS: SELESAI]
- **Sebagai:** Petugas Gudang
- **Saya Ingin:** Menerima lembar petunjuk pemungutan barang (*Picking List*) yang merinci lokasi rak *freezer* dan nomor batch sesuai rekomendasi FEFO
- **Agar:** Proses pengambilan es krim di ruang pendingin berlangsung cepat dan meminimalkan waktu pintu *freezer* terbuka
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Tampilan Picking List dioptimalkan untuk perangkat gudang: teks lokasi rak berukuran besar (misal: `FRZ-A / RAK-02 / B-01`), lencana kedaluwarsa bergradasi warna, tombol checklist minimal $44 \times 44\text{px}$, dan verifikasi item terambil.
  - [x] Petugas memverifikasi kuantitas terambil (*qty picked*).
  - [x] Penyelesaian picking mengubah status SO menjadi `Dikemas` (*PACKED*) dan mengunci alokasi stok batch tersebut.

#### US-14: Surat Jalan, Pengiriman Armada & Konfirmasi Penerimaan (POD) — [STATUS: SELESAI]
- **Sebagai:** Driver / Pengemudi Armada Pendingin
- **Saya Ingin:** Mencatat suhu keberangkatan kendaraan, mengonfirmasi serah terima es krim di tempat pelanggan, dan mengunggah foto bukti serah terima (POD)
- **Agar:** Ada pertanggungjawaban legal pengiriman barang dalam kondisi dingin optimal
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] Dokumen Surat Jalan dan Faktur Penjualan resmi dicetak dalam Bahasa Indonesia dengan format rapi.
  - [x] Pengemudi merekam suhu kabin kendaraan pendingin saat keberangkatan.
  - [x] Pengemudi mengunggah foto bukti penerimaan (POD) dan nama penerima saat barang diserahterimakan.
  - [x] Konfirmasi serah terima menyelesaikan pesanan (`Terkirim`) dan memicu pembentukan dua pasang ayat jurnal penjualan & HPP.

---

### Modul 6: Retur Barang, Karantina & Pemusnahan (Spoilage)

#### US-15: Pencatatan Retur Pelanggan & Alokasi Karantina
- **Sebagai:** Operator Inbound / Gudang
- **Saya Ingin:** Mencatat produk es krim yang dikembalikan oleh pelanggan (akibat leleh saat kirim, cacat kemasan, salah kirim) dan menempatkannya ke zona karantina
- **Agar:** Es krim bermasalah terisolasi dari inventaris aktif dan tidak terambil untuk pesanan lain
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Formulir retur menautkan nomor Sales Order dan mencatat kondisi fisik produk (Rusak Kemasan, Meleleh Total, Mendekati Kedaluwarsa, Salah Kirim).
  - [ ] Barang retur dialokasikan ke lokasi rak bertanda `is_quarantine = TRUE`.
  - [ ] Status retur awal adalah `Karantina`.

#### US-16: Disposisi Retur & Pemusnahan Barang (Write-off Spoilage)
- **Sebagai:** Manajer Gudang & Staf Finance
- **Saya Ingin:** Menyetujui disposisi barang karantina untuk dimusnahkan (*write-off*) atau dikembalikan ke supplier (*claim*)
- **Agar:** Saldo stok fisik karantina terhapus dan nilai kerugian diakui pada beban laporan keuangan
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Jika disposisi `Pemusnahan (Write-Off)`, kuantitas stok karantina dipotong.
  - [ ] Sistem menerbitkan jurnal beban kerugian: Debit `5201 Beban Kerugian Barang Rusak/Meleleh`, Kredit `1120 Persediaan`.
  - [ ] Nilai kerugian dihitung dari harga pokok modal batch (`cost_price_per_base_uom`).

---

### Modul 7: Akuntansi Keuangan Terintegrasi (Automated Ledger)

#### US-17: Mesin Jurnal Otomatis Transaksi Gudang (*Journal Engine*)
- **Sebagai:** Staf Akuntansi / Finance
- **Saya Ingin:** Setiap transaksi operasional gudang (Inbound, Outbound, Spoilage, Adjustment) otomatis membentuk ayat jurnal berpasangan yang seimbang
- **Agar:** Tidak ada celah selisih antara pencatatan stok fisik dan buku besar keuangan tanpa butuh input manual berulang
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Inbound: Debit `1120 Persediaan`, Kredit `2101 Utang Usaha` / `1103 Bank`.
  - [ ] Outbound (Penjualan): Debit `1110-1114 Piutang Usaha` / `1103 Bank`, Kredit `4101-4104 Pendapatan Penjualan`.
  - [ ] Outbound (HPP): Debit `5101 Beban Pokok Penjualan`, Kredit `1120 Persediaan` sebesar akumulasi harga modal batch FEFO terambil.
  - [ ] Setiap jurnal disajikan dalam format Kartu Jurnal TailAdmin dengan status lencana hijau `Seimbang` (*Balanced*). Jika selisih, transaksi ditolak dan dibatalkan (*database rollback*).

#### US-18: Jurnal Umum Manual & Bagan Akun (COA)
- **Sebagai:** Staf Akuntansi
- **Saya Ingin:** Mengelola Bagan Akun (*Chart of Accounts*) dan mencatat ayat jurnal manual untuk beban operasional umum (seperti listrik freezer, BBM armada, gaji)
- **Agar:** Seluruh transaksi keuangan perusahaan tercatat lengkap dalam satu sistem terpusat
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [x] CRUD Master Bagan Akun mendukung klasifikasi Bahasa Indonesia (Aset, Liabilitas, Ekuitas, Pendapatan, HPP, Beban Operasional) [SELESAI - SPRINT 1].
  - [ ] Form Jurnal Manual memeriksa keseimbangan total baris debit dan kredit secara interaktif sebelum status diposting.
  - [ ] Jurnal yang telah diposting tidak dapat diedit langsung, melainkan melalui prosedur jurnal pembalik (*reversal entry*).

---

### Modul 8: Pelaporan Finansial, Dasbor Analitik & Notifikasi

#### US-19: Laporan Keuangan Standar (Jurnal, Buku Besar, Neraca Saldo, Laba Rugi, Neraca)
- **Sebagai:** Manajer Keuangan / Owner
- **Saya Ingin:** Mengakses laporan keuangan resmi secara *real-time* lengkap dengan fitur ekspor ke format PDF dan Excel
- **Agar:** Posisi likuiditas, nilai aset persediaan di freezer, dan profitabilitas operasional dapat dipantau setiap saat
- **Estimasi:** 8 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Seluruh laporan keuangan disajikan dalam format Bahasa Indonesia standar akuntansi Indonesia.
  - [ ] Laporan Jurnal Umum dan Buku Besar menyediakan filter akun dan rentang tanggal dengan saldo berjalan (*running balance*).
  - [ ] Neraca Saldo (*Trial Balance*) menyajikan total debit dan kredit seimbang dengan lencana status `Seimbang`.
  - [ ] Laporan Laba Rugi menyajikan baris bertingkat (*collapsible tier*) merinci Pendapatan Bersih, HPP, Kerugian Spoilage, dan Laba Bersih.
  - [ ] Neraca (*Balance Sheet*) menyajikan Aset, Kewajiban, dan Ekuitas secara seimbang.
  - [ ] Seluruh laporan dapat diunduh dalam format PDF dan Excel (.xlsx).

#### US-20: Dasbor Eksekutif Terpadu "Cold Chain Command Center"
- **Sebagai:** Manajer Gudang & Owner
- **Saya Ingin:** Memantau indikator operasional dan finansial utama dalam tata letak kisi (*bento grid*) TailAdmin yang modern dan responsif
- **Agar:** Pengambilan keputusan cepat dan tindakan mitigasi risiko dapat segera dieksekusi
- **Estimasi:** 5 SP
- **Kriteria Penerimaan (Acceptance Criteria):**
  - [ ] Dasbor memuat 4 Kartu KPI Utama:
    1. *Valuasi Stok Persediaan* (Nominal Rupiah & Ekuivalensi Fisik Dus/Pcs).
    2. *Integritas Rantai Dingin* (Lencana status `AMAN` hijau & rata-rata suhu freezer).
    3. *Batch Kritis FEFO (< 30 Hari)* (Jumlah batch perlu perhatian warna merah muda).
    4. *Penjualan & Margin Hari Ini* (Omzet kotor & % margin rata-rata).
  - [ ] Visualisasi Grafik 2 Kolom:
    - Kiri: Grafik Area Telemetri Suhu 24 Jam dengan garis ambang kritis batas $-18^\circ\text{C}$ merah putus-putus.
    - Kanan: Diagram Donat Distribusi Kanal Penjualan (Agen/Grosir, Modern Trade, General Trade).
  - [ ] Tabel FEFO Watchlist memprioritaskan 5 produk teratas yang mendekati kedaluwarsa beserta sisa hari dan tombol tindakan cepat (Promo / Disposisi).
  - [ ] Dropdown Pusat Pemberitahuan di bilah atas menampilkan alert kenaikan suhu dan alert batch kritis.

---

## 2. Rincian Peta Jalan Sprint (Sprint Roadmap)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Siklus Pengembangan 8 Minggu (Agile)                   │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│     Sprint 1     │     Sprint 2     │     Sprint 3     │      Sprint 4      │
│   (Minggu 1-2)   │   (Minggu 3-4)   │   (Minggu 5-6)   │    (Minggu 7-8)    │
├──────────────────┼──────────────────┼──────────────────┼────────────────────┤
│ Fondasi, Auth,   │ Purchase Order,  │ Sales Order,     │ Stock Opname,      │
│ Master Data,     │ Inbound, Batch,  │ FEFO Picking,    │ Laporan Keuangan,  │
│ Multi-UOM,       │ QC Suhu Truk,    │ Delivery POD,    │ Dasbor Eksekutif   │
│ Matriks Harga,   │ Jurnal Beli,     │ Repacking UOM,   │ TailAdmin Bento,   │
│ Setup COA &      │ Log Suhu Harian  │ Retur & Spoilage │ Export PDF/Excel,  │
│ Shell TailAdmin  │ & Card Jurnal    │ Jurnal Penjualan │ UAT & Go-Live      │
│ (Target: 38 SP)  │ (Target: 42 SP)  │ (Target: 48 SP)  │ (Target: 40 SP)    │
└──────────────────┴──────────────────┴──────────────────┴────────────────────┘
```

---

## 3. To-Do List Lengkap Setiap Sprint

Berikut rincian pekerjaan teknis per sprint yang dibagi menurut disiplin kerja: **Backend, Frontend UI Web (TailAdmin Style - Bahasa Indonesia), Mobile, Database/DevOps, dan QA/Testing**.

---

### 🚀 SPRINT 1 (Minggu 1 - 2): Fondasi Sistem, Master Data, Multi-UOM, Matriks Harga & COA
**Sasaran Sprint (Sprint Goal):** Menyiapkan infrastruktur sistem, autentikasi berbasis RBAC, tata letak shell antarmuka TailAdmin berbahasa Indonesia (Sidebar, Header, Dark Mode), pengelolaan master produk Multi-UOM, kategori pelanggan beserta matriks harga bertingkat, dan bagan akun akuntansi (COA).  
**Alokasi Story:** US-01, US-02, US-03, US-04, US-18 (Sebagian - Setup COA)  
**Total Beban:** 38 Story Points  
**Status Eksekusi:** <span style="color:#10b981;font-weight:bold;">100% SELESAI (VERIFIED & PASSED BUILD)</span>  

#### 🛠️ Backend Tasks (NestJS) — [STATUS: 100% SELESAI]
- [x] Inisialisasi struktur monorepo/proyek backend NestJS dengan arsitektur modular (`src/modules/*`).
- [x] Konfigurasi TypeORM dengan driver PostgreSQL dan koneksi database berbasis file konfigurasi `.env`.
- [x] Implementasi modul `auth`:
  - [x] Strategi Passport Local & JWT (`JwtStrategy`, `LocalStrategy`).
  - [x] Layanan enkripsi kata sandi menggunakan `bcryptjs`.
  - [x] Endpoint `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
  - [x] Guard autentikasi `JwtAuthGuard` dan decorator pemilih peran `@Roles()`.
- [x] Implementasi modul `users` dan `roles`:
  - [x] Entity `User`, `Role`, `UserRole`, `RefreshToken`, `ActivityLog`.
  - [x] CRUD Pengguna dan assignment peran multi-role.
  - [x] Interceptor global `LoggingInterceptor` untuk audit trail ke `activity_logs`.
  - [x] TypeORM Base Entity / Subscriber untuk penanganan otomatis kolom metadata audit (`created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`, `is_deleted`).
  - [x] Entity `DataChangeLog` (`data_change_logs`) untuk query riwayat perubahan baris data (old_data vs new_data JSONB).
- [x] Implementasi modul `master-data`:
  - [x] Entity `ProductCategory`, `Product`, `ProductUom`, `FreezerLocation`, `Supplier`.
  - [x] CRUD Kategori Produk dan Supplier.
  - [x] CRUD Lokasi Freezer dengan flag `is_quarantine` dan kapasitas tampung.
  - [x] CRUD Master Produk terhubung dengan DTO array UOM dinamis.
  - [x] Validasi bisnis: Wajib menyertakan tepat 1 Base UOM (`is_base_uom: true`, `conversion_factor: 1`).
- [x] Implementasi modul `customers` & `pricing`:
  - [x] Entity `CustomerCategory`, `Customer`, `ProductCustomerPrice`.
  - [x] CRUD Kategori Pelanggan dan Pelanggan.
  - [x] CRUD Matriks Harga dan service pencarian harga: `GET /prices/lookup`.
- [x] Implementasi modul `accounting/chart-of-accounts`:
  - [x] Entity `ChartOfAccount` (hierarki akun dengan `parent_id`, tipe akun, dan saldo normal).
  - [x] CRUD COA dan validasi akun level header tidak dapat digunakan untuk posting transaksi.

#### 🎨 Frontend UI Web Tasks (Next.js 14 + Tailwind CSS - TailAdmin Style - Bahasa Indonesia) — [STATUS: 100% SELESAI]
- [x] **Setup Desain Sistem & Shell Utama TailAdmin:**
  - [x] Konfigurasi Tailwind CSS dengan token warna semantik (`indigo-600` untuk aksi primer, `emerald-500` rantai dingin optimal, `amber-500` peringatan, `rose-600` bahaya, `slate-50/900` untuk latar belakang).
  - [x] Implementasi Dark Mode Parity penuh (`dark:` modifier) dengan tombol toggle matahari/bulan yang tersimpan di `localStorage`.
  - [x] Konfigurasi font utama (Inter / Plus Jakarta Sans) dan utilitas angka tabular monospasi (`tabular-nums font-mono`).
- [x] **Bilah Atas Sticky (*Top Header Navbar*):**
  - [x] Tombol toggle ciutkan/lebarkan sidebar samping.
  - [x] Indikator Status Suhu Global Rantai Dingin berbentuk kapsul (*pill status*): `● -21.2°C Normal` (Hijau).
  - [x] Bilah Pencarian Universal: input teks `Cari SKU, batch, faktur, pelanggan... (⌘ K)` dengan keyboard shortcut listener.
  - [x] Dropdown menu Notifikasi Sistem dan Pengalih Mode Terang/Gelap.
  - [x] Avatar profil pengguna, nama staf, dan lencana hak akses (misal: "Nadia Rahma / STAF OPERASIONAL").
- [x] **Menu Samping (*Sidebar Navigation*) Berbahasa Indonesia Lengkap:**
  - [x] Seluruh kelompok menu terkonfigurasi: `RINGKASAN`, `MASTER DATA`, `MANAJEMEN INBOUND`, `KONTROL PERSEDIAAN`, `OUTBOUND & PENJUALAN`, `KARANTINA & RETUR`, `AKUNTANSI & LAPORAN`.
- [x] **Halaman Autentikasi:**
  - [x] Layar Login bergaya TailAdmin (`src/app/login/page.tsx`) dengan ilustrasi cold chain, badge $\le -18^\circ\text{C}$, kredensial demo cepat, dan teks 100% Bahasa Indonesia.
- [x] **Layar Master Data Produk & Multi-UOM:**
  - [x] Tabel master produk berdensitas tinggi (`src/app/master-data/products/page.tsx`) dengan pencarian cepat, filter kategori, badge Multi-UOM (PCS, PACK, DUS), dan modal penambahan produk dengan repeater UOM dinamis + proteksi 1 Base UOM.
- [x] **Layar Master Kategori & Pelanggan:**
  - [x] Tabel pelanggan (`src/app/master-data/customers/page.tsx`) dengan badge segmen: `Modern Trade` (Indigo), `General Trade` (Emerald), `Horeka` (Amber), `Agen / Grosir` (Cyan), limit kredit, TOP hari, dan modal pendaftaran outlet baru.
- [x] **Layar Matriks Daftar Harga (*Price List Matrix*):**
  - [x] Antarmuka grid matriks harga (`src/app/master-data/prices/page.tsx`) berdasarkan kombinasi Produk × Satuan (UOM) × Kategori Pelanggan dengan angka tabular Rupiah, margin otomatis (%), dan modal edit harga.
- [x] **Layar Freezer & Rak Gudang:**
  - [x] Visualisasi kartu zona rak freezer (`src/app/master-data/freezers/page.tsx`), kapasitas tampung Dus, telemetri suhu real-time, dan penanda khusus zona karantina.
- [x] **Layar Bagan Akun (Chart of Accounts / COA):**
  - [x] Tampilan hierarki pohon akun (`src/app/accounting/coa/page.tsx`) interaktif dengan pengelompokan akun Aset, Kewajiban, Ekuitas, Pendapatan, HPP, Beban Operasional, dan kunci akun sistem otomatis.
- [x] **Layar Monitoring Rantai Dingin:**
  - [x] Visualisasi grafik fluktuasi 24 jam (`src/app/monitoring-suhu/page.tsx`) dengan batas kritis $-18^\circ\text{C}$, tabel riwayat lonjakan suhu (*excursion log*), dan formulir pencatatan manual (*log book*).
- [x] **Dasbor Eksekutif Terpadu:**
  - [x] Bento Grid 4 kartu KPI, grafik area telemetri 24 jam, diagram donat distribusi kanal, dan FEFO Watchlist table (`src/app/page.tsx`).

#### 🗄️ Database & DevOps Tasks — [STATUS: 100% SELESAI]
- [x] Script DDL PostgreSQL v2.1 lengkap (`docs/00_skema_database_lengkap.sql`) dengan 35 tabel, 5 views, 2 fungsi utilitas, dan triggers audit.
- [x] Fungsi trigger audit otomatis: `fn_set_updated_at()` dan `fn_audit_log_changes()`.
- [x] Script seeding data master: 8 Roles, Freezer Locations, Customer Categories, dan 60+ COA.
- [x] Setup container `docker-compose.yml` untuk PostgreSQL 16 dan Redis 7.

#### 🧪 QA & Testing Tasks — [STATUS: 100% SELESAI]
- [x] Verifikasi TypeScript build NestJS (`npm run build` backend): **Exit Code 0**.
- [x] Verifikasi TypeScript & Static Page Generation Next.js 14 (`npm run build` frontend): **Exit Code 0** (11 halaman ter-generate).
- [x] Verifikasi Dark Mode dan responsivitas antarmuka TailAdmin.

---

### 📦 SPRINT 2 (Minggu 3 - 4): Pengadaan (PO), Inbound, Batch, QC Suhu & Jurnal Beli
**Sasaran Sprint (Sprint Goal):** Mewujudkan alur penerimaan pasokan grosir, validasi kontrol suhu armada dengan indikator visual TailAdmin, penambahan stok Base Unit terotomatisasi, perekaman nomor batch & tanggal kedaluwarsa, penjurnalan pembelian otomatis dengan komponen kartu jurnal seimbang, dan log suhu *freezer*.  
**Alokasi Story:** US-05, US-06, US-10, US-17 (Inbound Engine)  
**Total Beban:** 42 Story Points  
**Status Eksekusi:** <span style="color:#10b981;font-weight:bold;">30 SP SELESAI (71.4%) — VERIFIED & PASSED BUILD</span>  

#### 🛠️ Backend Tasks (NestJS) — [STATUS: INBOUND & PO SELESAI]
- [x] Implementasi modul `purchase-orders` (terintegrasi di `InboundModule`):
  - [x] Entity `PurchaseOrder`, `PurchaseOrderItem`.
  - [x] Endpoint CRUD PO dan generator nomor otomatis: `PO-YYYYMM-XXXX`.
  - [x] Endpoint konfirmasi PO (`PATCH /api/v1/inbound/po/:id/confirm`).
- [x] Implementasi modul `inbound`:
  - [x] Endpoint `POST /api/v1/inbound/receive` untuk penerimaan pasokan dari PO.
  - [x] Logika validasi suhu truk: status peringatan/penolakan jika input suhu $> -18^\circ\text{C}$ (`UnprocessableEntityException`).
  - [x] Logika pembuatan entri `ProductBatch` baru (`batch_number`, `production_date`, `expired_date`, `cost_price_per_base_uom`).
  - [x] Logika penambahan saldo fisik atomik ke tabel `inventory_stocks` (dikonversi ke Base UOM).
  - [x] Pencatatan mutasi ke tabel `inventory_transactions` bertipe `INBOUND`.
- [x] Implementasi modul `accounting/journal-engine` (Tahap Inbound):
  - [x] Service pembentukan jurnal otomatis untuk penerimaan barang yang disetujui (`JournalEngineService.createInboundJournal`).
  - [x] Header `journal_entries` bertipe referensi `INBOUND`.
  - [x] Baris debit akun `1130 Persediaan Barang Dagang Es Krim` dan kredit akun `2101 Utang Usaha`.
  - [x] Validasi otomatis keseimbangan nilai debit dan kredit sebelum transaksi di-commit ke basis data.
- [x] Implementasi modul `temperature`:
  - [x] Entity `TemperatureLog`.
  - [x] Endpoint `POST /api/v1/inbound/temperature-logs` dan `GET /api/v1/inbound/temperature-logs`.
  - [x] Otomatisasi evaluasi anomali suhu: flag `is_anomaly = true` jika suhu $> -18^\circ\text{C}$ atau $< -25^\circ\text{C}$.
- [ ] Integrasi WebSocket Gateway (`NotificationsGateway`) untuk mengirimkan notifikasi anomali suhu seketika ke klien.

#### 🎨 Frontend UI Web Tasks (Next.js 14 - TailAdmin Style - Bahasa Indonesia) — [STATUS: 100% SELESAI]
- [x] **Layar Purchase Order (Pesanan Pembelian) — `/inbound/po`:**
  - [x] Form Pembuatan PO bergaya kartu bersih TailAdmin: pemilihan supplier, tanggal estimasi kedatangan, item es krim dalam satuan beli grosir (Dus), dan rincian harga beli modal.
  - [x] Halaman Riwayat PO dengan lencana status berwarna (`Draf`, `Dikonfirmasi`, `Selesai Diterima`).
- [x] **Layar Form Inbound & Kendali Mutu Rantai Dingin — `/inbound/qc`:**
  - [x] Penarikan nomor PO yang telah dikonfirmasi ke formulir penerimaan barang.
  - [x] **Komponen Indikator Suhu Kedatangan Truk Pendingin:**
    - Kotak input derajat Celcius dengan visualisasi real-time:
    - Suhu $\le -18^\circ\text{C}$: Banner hijau `bg-emerald-500/10 border-emerald-500/30 text-emerald-700` ("Kondisi Suhu Truk Memenuhi Standar Kelayakan Rantai Dingin").
    - Suhu $> -18^\circ\text{C}$: Banner merah berdenyut `bg-rose-500/10 border-rose-500/30 text-rose-700 animate-pulse` ("PERINGATAN BAHAYA: SUHU DI ATAS AMBANG - POTENSI TERJADI REFREEZING").
  - [x] Input nomor batch, tanggal produksi, dan tanggal kedaluwarsa per baris produk.
  - [x] Dropdown pemilihan lokasi rak *freezer* tujuan penyimpanan (*putaway*).
- [x] **Layar Rincian Inbound & Kartu Jurnal Akuntansi Seimbang:**
  - [x] Menampilkan ringkasan mutasi barang masuk.
  - [x] **Komponen Kartu Jurnal TailAdmin (*Balanced Journal Card*):**
    - Header: Nomor Bukti Jurnal (`JV-202610-XXXX`), tanggal transaksi, status lencana hijau `Seimbang` (*Balanced*).
    - Baris debit akun `1130 Persediaan` dan baris kredit menjorok ke dalam akun `2101 Utang Usaha` dengan format angka tabular Rupiah (`tabular-nums font-mono`).
- [x] **Layar Perekaman Log Suhu Freezer Harian — `/monitoring-suhu`:**
  - [x] Form entri pembacaan suhu termometer per lokasi ruang pendingin.
  - [x] Tabel log riwayat suhu harian dengan filter tanggal dan lokasi.
  - [x] Banner peringatan anomali jika terdapat pembacaan suhu melebihi ambang batas.

#### 📱 Mobile Tasks (DITANGGUHKAN / SKIPPED PER ARAHAN)
- [–] ~~Screen Input Penerimaan Inbound ringkas untuk operator gudang lapangan (input suhu truk + batch).~~ *(Ditiadakan - Digantikan Web Inbound)*
- [–] ~~Screen Input Pengecekan Suhu Freezer harian.~~ *(Ditiadakan - Digantikan Web Log Suhu)*

#### 🗄️ Database & DevOps Tasks
- [ ] Konfigurasi bucket penyimpanan berkas (AWS S3 atau MinIO/GCS) untuk dokumen gambar QC penerimaan.
- [ ] Setup Redis server sebagai message broker event notifikasi suhu.
- [ ] Pengujian constraint integritas transaksi pada PostgreSQL untuk skenario rollback saat pembentukan jurnal gagal.

#### 🧪 QA & Testing Tasks
- [ ] Pengujian batas toleransi suhu truk inbound: input $-18.0^\circ\text{C}$ (lolos) vs $-17.9^\circ\text{C}$ (alert/ditolak).
- [ ] Pengujian formula konversi kuantitas masuk: input 50 Dus @ 24 Pcs terekam tepat 1.200 Pcs pada `inventory_stocks`.
- [ ] Pengujian penerimaan multi-batch: memastikan produk yang sama dapat memiliki beberapa batch aktif dengan tanggal kedaluwarsa dan modal beli berbeda.
- [ ] Verifikasi keseimbangan saldo debit dan kredit pada jurnal pembelian otomatis.
- [ ] Pengujian socket event pengiriman alert saat data anomali suhu dikirimkan.

---

### 🚚 SPRINT 3 (Minggu 5 - 6): FEFO Outbound, Breakdown UOM, Matrix Pricing & Jurnal Penjualan/HPP
**Sasaran Sprint (Sprint Goal):** Mewujudkan alur pemrosesan pesanan penjualan dengan harga otomatis sesuai segmen pelanggan, penerbitan picking list berbasis FEFO berorientasi rute gudang, delivery & POD, dialog pemecahan satuan (breakdown), penanganan retur ke karantina, serta pembentukan jurnal ganda (Penjualan dan HPP FEFO).  
**Alokasi Story:** US-07, US-08, US-12, US-13, US-14, US-15, US-16, US-17 (Outbound & Spoilage Engine)  
**Total Beban:** 48 Story Points  
**Status Eksekusi:** <span style="color:#10b981;font-weight:bold;">39 SP SELESAI (81.25%) — VERIFIED & PASSED BUILD</span>  

#### 🛠️ Backend Tasks (NestJS) — [STATUS: CORE OUTBOUND & FEFO SELESAI]
- [x] Implementasi modul `sales-orders` (terintegrasi di `OutboundModule`):
  - [x] Entity `SalesOrder`, `SalesOrderItem`.
  - [x] Generator nomor otomatis: `SO-YYYYMM-XXXX`.
  - [x] Endpoint `POST /api/v1/outbound/sales-orders` dengan logika penarikan harga otomatis dari `product_customer_prices` berdasarkan kategori pelanggan dan UOM.
  - [x] Endpoint konfirmasi SO (`PATCH /api/v1/outbound/sales-orders/:id/confirm`).
- [x] Implementasi algoritma pemungutan barang berbasis **FEFO**:
  - [x] Query alokasi stok aktif non-karantina dengan pengurutan `expired_date ASC`.
  - [x] Logika pemecahan pemenuhan kuantitas (*multi-batch split*) jika 1 batch tidak mencukupi permintaan.
  - [x] Pembuatan entri `PickingList` dan `PickingListItem`.
- [x] Implementasi alur konfirmasi pengeluaran & pengiriman:
  - [x] Endpoint update kuantitas terambil (`PATCH /api/v1/outbound/picking-lists/:id/complete`).
  - [x] Pemotongan saldo fisik pada tabel `inventory_stocks` dalam kalkulasi Base UOM secara atomik.
  - [x] Entity `DeliveryOrder` dan endpoint konfirmasi serah terima POD (`PATCH /api/v1/outbound/delivery-orders/:id/deliver`).
- [x] Implementasi modul `accounting/journal-engine` (Tahap Outbound):
  - [x] Jurnal 1 (Pendapatan): Debit `1120 Piutang Usaha` (sesuai segmen), Kredit `4101 Pendapatan Penjualan Es Krim`.
  - [x] Jurnal 2 (HPP): Debit `5101 Beban Pokok Penjualan (HPP)`, Kredit `1130 Persediaan Barang Dagang - Es Krim`.
  - [x] Perhitungan nilai HPP presisi: $\sum (\text{Qty terambil per batch} \times \text{cost\_price\_per\_base\_uom batch terkait})$.
- [x] Implementasi fitur `Breakdown/Repacking UOM`:
  - [x] Endpoint `POST /api/v1/outbound/breakdown`.
  - [x] Pencatatan transaksi mutasi `BREAKDOWN` tanpa mengubah total saldo Base UOM dan tanpa menerbitkan jurnal.
- [ ] Implementasi modul `returns` & `karantina`:
  - [ ] Entity `ReturnOrder`, `ReturnOrderItem`.
  - [ ] Alokasi kuantitas retur langsung ke lokasi freezer berstatus karantina (`is_quarantine = true`).
  - [ ] Endpoint disposisi retur: jika `WRITE_OFF`, potong stok karantina dan terbitkan jurnal beban kerugian (Debit `5201 Beban Kerugian Barang Rusak`, Kredit `1120 Persediaan`).

#### 🎨 Frontend UI Web Tasks (Next.js 14 - TailAdmin Style - Bahasa Indonesia) — [STATUS: 100% SELESAI]
- [x] **Layar Pesanan Penjualan (Sales Order) — `/sales-orders`:**
  - [x] Blok Header Pelanggan: pencarian pelanggan otomatis menampilkan lencana segmen (`Modern Trade`, `General Trade`, `Horeka`, `Agen / Grosir`) serta info plafon kredit.
  - [x] Tabel Item Pesanan Dinamis: pemilihan SKU dan UOM langsung mengunci harga dari matriks harga (*auto-locked price*).
  - [x] **Panel Ringkasan Finansial Pesanan (Kanan):**
    - Total Kuantitas Fisik (konversi ke Base Unit Pcs).
    - Total Penjualan Sebelum Pajak.
    - PPN (11%, opsional).
    - Total Tagihan Bersih (*Grand Total*).
    - Estimasi Margin Laba Kotor Pesanan (*Estimated Gross Profit*).
- [x] **Layar Daftar Pengambilan Barang FEFO (*Picking List*) — `/picking`:**
  - [x] Tampilan tugas pemungutan terurut rute lorong rak gudang terpendek.
  - [x] Kartu tugas dengan label lokasi rak berukuran besar (misal: `FRZ-A / RAK-02 / B-01`), nomor batch FEFO, tanggal kedaluwarsa, kuantitas ambil, dan status checklist.
  - [x] Target tombol sentuh diperbesar minimal $44 \times 44\text{px}$ untuk kemudahan operator dengan sarung tangan gudang dingin.
  - [x] Kartu Jurnal Ganda Akuntansi Seimbang (*Dual Balanced Outbound Journals*).
- [x] **Dialog / Halaman Pemecahan Satuan (*Breakdown / Repacking UOM*) — `/inventory/breakdown`:**
  - [x] Form Tailwind TailAdmin: pilih produk & nomor batch asal.
  - [x] Input kuantitas karton besar (Dus) dengan panel kalkulator konversi real-time: "Input 2 Dus $\rightarrow$ Menjadi 48 Pcs Base Unit".
  - [x] Dropdown lokasi rak tujuan dan tombol konfirmasi yang memperbarui saldo tanpa mengubah valuasi moneter (Netto = Rp 0).
- [ ] **Layar Retur & Manajemen Karantina:**
  - [ ] Form pencatatan barang retur menautkan nomor pesanan penjualan dan mencatat alasan pengembalian (Meleleh, Cacat Kemasan, Mendekati Basi, Salah Kirim).
  - [ ] Tabel persediaan karantina dengan tombol aksi disposisi: *Pemusnahan (Write-Off)* atau *Klaim Retur Pemasok*.

#### 📱 Mobile Tasks (DITANGGUHKAN / SKIPPED PER ARAHAN)
- [–] ~~Screen Picking List Gudang: checklist barang keluar terurut batch terdekat.~~ *(Ditiadakan - Digantikan Web Picking)*
- [–] ~~Screen Driver Pengiriman: konfirmasi sampai di lokasi pelanggan + upload foto POD dari kamera.~~ *(Ditiadakan - Digantikan Web Delivery)*

#### 🗄️ Database & DevOps Tasks
- [ ] Pembuatan view PostgreSQL untuk optimasi query rekomendasi alokasi FEFO.
- [ ] Optimasi indeks database pada tabel transaksi dan stok: `idx_batch_expired`, `idx_inv_stocks_product`, `idx_so_customer`.

#### 🧪 QA & Testing Tasks
- [ ] Simulasi skenario FEFO multi-batch: pesanan 50 Pcs dilayani dari Batch A (sisa 30 Pcs, kedaluwarsa 2 bulan lagi) dan Batch B (diambil 20 Pcs, kedaluwarsa 4 bulan lagi).
- [ ] Verifikasi kalkulasi nilai HPP otomatis pada jurnal outbound multi-batch.
- [ ] Pengujian perbedaan harga otomatis: produk dan UOM yang sama memiliki harga berbeda antara pelanggan kategori Horeka vs Agen.
- [ ] Pengujian transaksi Breakdown UOM: memastikan total saldo Pcs tidak bertambah atau berkurang setelah breakdown.
- [ ] Pengujian write-off barang rusak: memastikan pemotongan stok karantina dan penerbitan jurnal kerugian spoilage seimbang.

---

### 📊 SPRINT 4 (Minggu 7 - 8): Stock Opname, Pelaporan Keuangan, Dasbor & UAT
**Sasaran Sprint (Sprint Goal):** Mewujudkan fitur stock opname, laporan keuangan standar lengkap dalam Bahasa Indonesia (Jurnal Umum, Buku Besar, Neraca Saldo, Laba Rugi, Neraca), ekspor dokumen PDF/Excel, Dasbor Eksekutif Terpadu "Cold Chain Command Center" bergaya Bento Grid TailAdmin, pengujian integrasi menyeluruh (UAT), dan rilis produksi.  
**Alokasi Story:** US-09, US-11, US-18 (Jurnal Manual), US-19, US-20  
**Total Beban:** 40 Story Points  

#### 🛠️ Backend Tasks (NestJS)
- [ ] Implementasi modul `stock-opname`:
  - [ ] Entity `StockOpname`, `StockOpnameItem`.
  - [ ] Pembuatan lembar hitung fisik dan perbandingan terhadap stok sistem.
  - [ ] Approval opname: penyesuaian stok dan penerbitan jurnal penyesuaian otomatis ke akun `5203 Beban Selisih Stok`.
- [ ] Implementasi modul `accounting/reports`:
  - [ ] Endpoint Laporan Jurnal Umum (`GET /reports/general-journal`) dengan filter tanggal dan tipe mutasi.
  - [ ] Endpoint Buku Besar (`GET /reports/general-ledger`) per akun COA dengan perhitungan saldo berjalan (*running balance*).
  - [ ] Endpoint Neraca Saldo (`GET /reports/trial-balance`) dengan verifikasi total debit = total kredit.
  - [ ] Endpoint Laporan Laba Rugi (`GET /reports/income-statement`): Pendapatan Penjualan, HPP, Spoilage, Beban Operasional, dan Laba Bersih.
  - [ ] Endpoint Neraca Keuangan (`GET /reports/balance-sheet`): Aset Lancar, Aset Tetap, Liabilitas, dan Ekuitas.
- [ ] Integrasi engine pembuatan dokumen:
  - [ ] Service generator file PDF menggunakan pustaka `pdfmake` atau `puppeteer`.
  - [ ] Service generator spreadsheet Excel menggunakan `exceljs`.
- [ ] Implementasi modul `dashboard`:
  - [ ] Endpoint analitik ringkasan operasional (`GET /dashboard/summary`) dengan strategi caching Redis (TTL 5 menit).
  - [ ] Endpoint peringatan dini stok mendekati kedaluwarsa (`GET /dashboard/stock-alerts`).
  - [ ] Scheduled background worker (BullMQ / Cron): pengecekan otomatis setiap hari pukul 06:00 WIB untuk menerbitkan notifikasi batch es krim yang akan kedaluwarsa dalam $\le 7$ hari dan $\le 3$ hari.

#### 🎨 Frontend UI Web Tasks (Next.js 14 - TailAdmin Style - Bahasa Indonesia)
- [ ] **Dasbor Eksekutif Terpadu "Cold Chain Command Center":**
  - [ ] Header Dasbor: Label `COLD CHAIN COMMAND CENTER / 2026` dan penanda tanggal `DATA WAKTU NYATA - [TANGGAL HARI INI]`.
  - [ ] **Baris 4 Kartu Metrik Ringkasan (*KPI Bento Cards*):**
    1. *Valuasi Stok:* Nilai Rupiah nominal (misal: `Rp 284.500.000`) dengan sub-teks konversi fisik (`1.420 Dus / 54.200 Pcs`). Ikon: Kotak Gudang.
    2. *Integritas Rantai Dingin:* Lencana status hijau `AMAN` dengan rata-rata suhu `-21.4°C` (4 Freezer Normal). Ikon: Termometer Salju.
    3. *Batch Kritis FEFO:* Jumlah batch berisiko kedaluwarsa (misal: `3 Batch Perlu Perhatian`) aksen merah muda. Ikon: Peringatan Waktu.
    4. *Penjualan & Margin Hari Ini:* Omzet kotor (misal: `Rp 18.250.000`) dan margin persentase (`Margin 27,4%`). Ikon: Tren Finansial.
  - [ ] **Visualisasi Data Analitik (Kisi 2 Kolom - 60% : 40%):**
    - Kolom Kiri: *Telemetri Suhu 24 Jam* (Grafik Area Recharts) untuk pemantauan suhu freezer dengan garis ambang batas kritis $-18^\circ\text{C}$ warna merah putus-putus.
    - Kolom Kanan: *Penjualan per Kategori* (Diagram Donat Recharts) proporsi kanal pelanggan: Agen/Grosir (45%), Modern Trade (30%), General Trade (25%).
  - [ ] **Tabel Pengawasan Batch FEFO (*FEFO Watchlist Table*):**
    - Header: "FEFO Watchlist - Prioritaskan batch mendekati kedaluwarsa" dengan badge merah `3 KRITIS`.
    - Kolom: SKU / Produk, Batch, Kedaluwarsa, Sisa Hari (lencana merah: 13 hari, 22 hari; kuning: 46 hari; hijau: 82 hari), Stok (format Dus / Pcs), Lokasi Freezer, dan Tombol Aksi cepat (`Promo / Disposisi`).
- [ ] **Layar Saldo Stok Real-Time & Multi-UOM Switcher:**
  - [ ] **Bilah Kontrol Pengalih Satuan (*Multi-UOM Segmented Switcher*):**
    - Grup tombol: `[ Terurai (Dus / Pack / Pcs) ]`, `[ Base Unit (Pcs) ]`, `[ Estimasi Total Dus ]`.
  - [ ] Tabel data stok berdensitas tinggi dengan angka tabular Rupiah dan kuantitas monospasi.
  - [ ] Dropdown menu tindakan pada baris stok: dialog *Breakdown UOM*, *Kartu Stok*, dan *Alokasikan ke Karantina*.
- [ ] **Layar Stock Opname:**
  - [ ] Lembar entri hitung fisik stok es krim per batch dan rak freezer.
  - [ ] Tabel rekonsiliasi selisih dengan penanda warna surplus/minus.
  - [ ] Tombol approval posting jurnal penyesuaian stok.
- [ ] **Modul Layar Laporan Keuangan Standar Akuntansi Indonesia:**
  - [ ] *Jurnal Umum:* Umpan kartu jurnal transaksi berstandar dengan lencana status `Seimbang` (*Balanced*).
  - [ ] *Buku Besar:* Filter akun COA dan tanggal dengan perhitungan saldo berjalan (*running balance*).
  - [ ] *Neraca Saldo:* Format 2 kolom Debit dan Kredit dengan indikator validasi keseimbangan.
  - [ ] *Laporan Laba Rugi:* Tampilan berjenjang dapat diciutkan (*collapsible tiers*) merinci Penjualan Bersih, HPP FEFO, Kerugian Spoilage, dan Laba Bersih.
  - [ ] *Neraca Keuangan:* Tampilan berstandar dua sisi (Aset Lancar, Aset Tetap, Liabilitas, Ekuitas).
  - [ ] Tombol ekspor dokumen `Unduh PDF` dan `Unduh Excel` pada setiap halaman laporan.
- [ ] **Dropdown Pusat Notifikasi:**
  - [ ] Menampilkan riwayat peringatan kenaikan suhu, peringatan kedaluwarsa < 30 hari, dan konfirmasi SO.

#### 🗄️ Database & DevOps Tasks
- [ ] Pembuatan view database `v_trial_balance`, `v_stock_summary`, dan `v_near_expiry_stocks` untuk mempercepat respons kueri laporan.
- [ ] Konfigurasi skrip pencadangan otomatis harian database PostgreSQL (*daily automated backup*).
- [ ] Penyusunan konfigurasi `docker-compose.prod.yml` untuk lingkungan staging dan produksi.
- [ ] Setup pipeline CI/CD (GitHub Actions): tahapan lint, build test, unit testing, dan deploy otomatis ke staging.

#### 🧪 QA & Testing Tasks
- [ ] Pengujian Rekonsiliasi Finansial: Memastikan nilai saldo akun `1120 Persediaan Barang Dagang` pada Laporan Neraca sama persis dengan total valuasi fisik pada `v_stock_summary`.
- [ ] Verifikasi keakuratan perhitungan Laporan Laba Rugi terhadap jurnal transaksi operasional yang terjadi.
- [ ] Pengujian stres kueri (*load testing*) pada dashboard summary saat menangani ribuan baris mutasi stok.
- [ ] Pelaksanaan sesi **User Acceptance Testing (UAT)** bersama perwakilan pengguna: Operator Inbound, Petugas Gudang, Staf Penjualan, Staf Finance, dan Manajer.
- [ ] Remediasi temuan isu/bug minor hasil UAT.
- [ ] Final sign-off dan pelaksanaan rilis ke lingkungan *Production*.

---

## 4. Matriks Distribusi Peran & Tanggung Jawab (RACI Matrix)

| Modul / Aktivitas | Project Manager | Backend Dev | Frontend Dev | Database / DevOps | QA Engineer | Finance SME |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Setup Arsitektur & DB** | A | R | R | R | C | I |
| **Auth & RBAC** | A | R | R | C | R | I |
| **Master Data & Multi-UOM** | A | R | R | C | R | C |
| **Customer Matrix Pricing** | A | R | R | C | R | C |
| **Purchase Order & Inbound** | A | R | R | C | R | C |
| **FEFO Algorithm & Picking** | A | R | R | C | R | I |
| **Breakdown UOM & Retur** | A | R | R | C | R | I |
| **Journal Engine & COA** | A | R | R | C | R | **Accountable (R/C)** |
| **Laporan Finansial (L/R, Neraca)**| A | R | R | C | R | **Accountable (R/C)** |
| **Dasbor & Notifikasi Alert** | A | R | R | C | R | I |
| **UAT & Deployment** | **Accountable (A)**| R | R | R | R | R |

> Keterangan:  
> **R** = *Responsible* (Pelaksana teknis pekerjaan)  
> **A** = *Accountable* (Pemilik tanggung jawab keputusan akhir)  
> **C** = *Consulted* (Pihak yang dimintai masukan atau rujukan)  
> **I** = *Informed* (Pihak yang menerima laporan perkembangan)  

---

## 5. Definisi Selesai (Definition of Done - DoD)

Setiap User Story dan Task pada sprint dinyatakan **SELESAI (DONE)** apabila memenuhi seluruh kriteria berikut:
1. **Kesesuaian Kriteria Penerimaan:** Seluruh poin pada Acceptance Criteria telah terpenuhi dan diverifikasi.
2. **Kesesuaian Desain UI/UX TailAdmin & Bahasa Indonesia:** Seluruh komponen antarmuka mematuhi standar desain TailAdmin (Tailwind CSS, Dark Mode parity, tipografi angka tabular `tabular-nums`, visual semantik suhu/keuangan, dan teks 100% Bahasa Indonesia baku).
3. **Kualitas Kode (Code Quality):** Kode telah melalui proses *Peer Code Review*, mematuhi standar *Clean Code*, serta bebas dari error linting/TypeScript.
4. **Cakupan Pengujian (Testing Coverage):** Unit test untuk modul terkait lulus dengan cakupan minimum 80% untuk logika bisnis inti (terutama kalkulasi konversi UOM, algoritma FEFO, dan keseimbangan jurnal akuntansi).
5. **Keamanan & Validasi:** Seluruh input melalui validasi skema (DTO / Zod) dan seluruh endpoint privat dilindungi guard JWT serta RBAC.
6. **Keseimbangan Jurnal:** Untuk transaksi gudang, ayat jurnal wajib diverifikasi bahwa $\sum\text{Debit} = \sum\text{Kredit}$.
7. **Kepatuhan Metadata Audit & Penelusuran Perubahan (*Audit Trail*):** Seluruh mutasi data merekam metadata pembuat/pengubah (`created_by`, `created_at`, `updated_by`, `updated_at`), entitas master mendukung *soft-delete* (`is_deleted`, `deleted_at`, `deleted_by`), dan perubahan data tertangkap secara transparan di `data_change_logs`.
8. **Dokumentasi Terbarui:** Perubahan endpoint terdokumentasi pada spesifikasi API dan skrip migrasi tersimpan di repositori.
9. **Lolos Verifikasi Lingkungan Staging:** Fitur telah terpasang dan lolos uji coba fungsional oleh QA pada lingkungan *Staging*.
