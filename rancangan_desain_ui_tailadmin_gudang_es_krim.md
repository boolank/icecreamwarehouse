# Rancangan Desain Antarmuka Sistem Manajemen Gudang & Keuangan Es Krim (TailAdmin Style)

Dokumen ini memuat spesifikasi desain antarmuka pengguna (UI) dan pengalaman pengguna (UX) untuk Sistem Informasi Manajemen Gudang (*Cold Chain Warehouse Management System*) dan Akuntansi Terpadu Distributor Es Krim. Perancangan mengacu pada prinsip arsitektur desain **TailAdmin** (berbasis **Tailwind CSS** dan Next.js/React) yang menekankan antarmuka modern, bersih, modular, serta berdensitas data tinggi (*data-dense interface*) untuk menjamin efisiensi operasional gudang dan akurasi audit keuangan.

---

## 1. Pendahuluan & Prinsip Desain UI/UX

Sistem ini melayani dua disiplin kerja yang berbeda dalam satu platform terpadu: operasional logistik rantai dingin (*cold chain logistics*) dan pencatatan akuntansi keuangan berpasangan (*double-entry accounting*). Desain antarmuka dirancang dengan empat pilar utama:

1. **Kejelasan Operasional Ekstrem (*Operational Clarity*):** Informasi kritis seperti suhu ruangan *freezer*, tanggal kedaluwarsa produk (*FEFO*), dan satuan konversi (*Multi-UOM*) disajikan dengan indikator visual instan tanpa memerlukan kalkulasi mental dari operator.
2. **Keterbacaan Finansial (*Financial Legibility*):** Seluruh data moneter, kuantitas satuan dasar, dan saldo jurnal menggunakan tipografi bertipe tabular (*tabular numbers*) dengan kontras tinggi untuk mempermudah verifikasi dan rekonsiliasi.
3. **Pemberian Umpan Balik Cepat (*Rapid Feedback Loops*):** Status anomali suhu dan peringatan kedaluwarsa menggunakan penandaan warna semantik yang kontras dan animasi visual halus guna mencegah kerusakan barang inventaris.
4. **Dukungan Dark Mode Penuh (*Full Dark Mode Parity*):** Memfasilitasi kenyamanan visual pengguna saat bekerja di area pergudangan dengan pencahayaan redup maupun di ruang kantor administrasi.

---

## 2. Sistem Desain & Visual Tokens (Tailwind CSS)

### 2.1 Palet Warna Semantik

Palet warna disusun menggunakan token standar Tailwind CSS dengan pembagian fungsional yang tegas:

* **Primary & Brand Identity:**
  * `indigo-600` (`#4F46E5`): Tombol aksi primer, status menu navigasi aktif, dan fokus interaksi form.
  * `indigo-700` (`#4338CA`): Status *hover* pada elemen primer.
  * `indigo-50` (`#EEF2FF`): Latar belakang seleksi ringan (*light tint highlight*).
* **Indikator Rantai Dingin (*Cold Chain Thermal Indicators*):**
  * **Suhu Aman / Optimal ($-25^\circ\text{C}$ s.d. $-18^\circ\text{C}$):**
    * Token: `emerald-500` (`#10B981`) dan `teal-500` (`#14B8A6`).
    * Komponen: `bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800`.
  * **Suhu Peringatan / Kritis ($-17.9^\circ\text{C}$ s.d. $-15^\circ\text{C}$):**
    * Token: `amber-500` (`#F59E0B`).
    * Komponen: `bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800`.
  * **Suhu Bahaya / Meleleh (> $-15^\circ\text{C}$):**
    * Token: `rose-600` (`#E11D48`).
    * Komponen: `bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse`.
* **Indikator Finansial & Akuntansi:**
  * **Debit / Kredit Seimbang (*Balanced*):** `emerald-600` (`#059669`).
  * **Jurnal Tidak Seimbang (*Unbalanced*):** `rose-600` (`#E11D48`).
  * **Piutang Berjalan / Jatuh Tempo:** `sky-600` (`#0284C7`) / `orange-600` (`#EA580C`).
* **Permukaan & Latar Belakang Netral (Neutral Surfaces):**
  * Latar Belakang Utama: `bg-slate-50` (`#F8FAFC`) pada mode terang, `bg-slate-900` (`#0F172A`) pada mode gelap.
  * Panel Kartu / Surface: `bg-white` (`#FFFFFF`) pada mode terang, `bg-slate-800` (`#1E293B`) pada mode gelap.
  * Border & Pembatas: `border-slate-200` (`#E2E8F0`) pada mode terang, `border-slate-700` (`#334155`) pada mode gelap.
  * Teks Utama: `text-slate-900` (`#0F172A`) / `text-white` (`#FFFFFF`).
  * Teks Sekunder: `text-slate-500` (`#64748B`) / `text-slate-400` (`#94A3B8`).

### 2.2 Tipografi & Angka Tabular

* **Font Utama:** Inter atau Plus Jakarta Sans (`font-sans`) untuk teks antarmuka, judul, dan label formulir.
* **Format Angka & Finansial:** Mengaktifkan fitur varian angka monospasi (`tabular-nums` atau `font-mono`) pada seluruh tabel stok inventaris, nilai mata uang (Rupiah), kuantitas UOM, dan baris pembukuan jurnal agar seluruh angka tersusun lurus secara vertikal.

### 2.3 Komponen Lencana Mikro (*Micro-Badges*)

Sistem memanfaatkan lencana mikro (`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold`) untuk menampilkan metadata ringkas:
* **Satuan (UOM):**
  * Dus: `bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300`
  * Pack: `bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300`
  * Pcs (Base Unit): `bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200`
* **Kategori Pelanggan:**
  * Modern Trade: `bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300`
  * General Trade: `bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300`
  * Horeka: `bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`
  * Agen / Grosir: `bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300`

---

## 3. Arsitektur Informasi & Navigasi Global

Tata letak mengadopsi struktur standar TailAdmin yang terdiri dari tiga zona utama: Sidebar Navigasi Kiri (dapat diciutkan), Bilah Atas (*Top Header*), dan Area Kerja Konten (*Main Workspace*).

### 3.1 Bilah Atas (*Top Header Navbar*)

Bilah atas diposisikan secara *sticky* di bagian atas layar dengan elemen-elemen berikut:
1. **Tombol Toggle Sidebar:** Mengatur ekspansi atau penciutan navigasi samping.
2. **Indikator Cepat Rantai Dingin (*Global Cold Chain Status*):** Widget ringkas yang menampilkan suhu rata-rata fasilitas *cold storage* secara waktu nyata (misal: `-21.2°C Normal`).
3. **Pencarian Cepat Global (*Universal Search Bar*):** Kolom input dengan pintasan keyboard (`Ctrl + K` atau `Cmd + K`) untuk mencari SKU produk, nomor *batch*, nomor faktur, atau nama pelanggan secara instan.
4. **Pemberitahuan Sistem (*Notification Center Dropdown*):**
   * *Alert* Kenaikan Suhu: Menampilkan peringatan jika terdapat *freezer* yang suhunya berada di atas batas ambang $-18^\circ\text{C}$.
   * *Alert* FEFO: Menampilkan daftar produk dengan sisa masa kedaluwarsa kurang dari 30 hari.
5. **Tombol Alih Tema (*Dark / Light Mode Switcher*):** Ikon matahari/bulan dengan persistensi penyimpanan lokal (*localStorage*).
6. **Profil Pengguna & Peran (*User Profile & Role Badge*):** Menampilkan avatar, nama staf, dan lencana hak akses (misal: "Admin Keuangan", "Operator Gudang").

### 3.2 Struktur Menu Samping (*Sidebar Menu*)

Navigasi samping dikelompokkan secara logis berdasarkan divisi operasional:

* **Dasbor Utama (*Overview*):**
  * *Ringkasan Operasional:* Monitoring terintegrasi stok, pergerakan barang, dan performa distribusi.
  * *Monitoring Rantai Dingin:* Grafik telemetri suhu seluruh ruangan *freezer* dan truk pendingin.
  * *Dasbor Eksekutif Finansial:* Ringkasan nilai aset persediaan, pendapatan harian, dan margin kotor.
* **Master Data Manajemen:**
  * *Produk & Multi-UOM:* Pengaturan SKU, rasio konversi bertingkat, dan batas toleransi suhu.
  * *Kategori & Pelanggan:* Pengelompokan segmen pelanggan (MT, GT, Horeka, Agen) dan data kontak.
  * *Matriks Daftar Harga (*Price List Matrix*):* Pengaturan tarif harga jual per kombinasi produk, satuan, dan kategori.
  * *Freezer & Rak Gudang:* Denah tata letak lokasi fisik dan kapasitas volume *cold storage*.
  * *Bagan Akun (*Chart of Accounts / COA*):* Konfigurasi kode akun akuntansi dan saldo normal.
* **Manajemen Inbound (Penerimaan Barang):**
  * *Penerimaan Barang (*Purchase Order Receiving*):* Form entri barang masuk satuan grosir (Dus).
  * *Pemeriksaan QC Suhu & Batch:* Verifikasi suhu kendaraan logistik dan pencatatan kedaluwarsa.
* **Manajemen Persediaan (*Inventory Control*):**
  * *Stok Real-Time:* Saldo barang aktif dengan fitur *Toggle View Multi-UOM*.
  * *Breakdown / Repacking UOM:* Eksekusi pemecahan satuan karton besar ke satuan eceran.
  * *Log Suhu Freezer:* Perekaman manual/otomatis suhu harian ruangan pendingin.
  * *Stock Opname:* Form audit penyesuaian fisik barang dan selisih persediaan.
* **Manajemen Outbound & Penjualan:**
  * *Pesanan Penjualan (*Sales Order*):* Pembuatan pesanan dengan sistem *auto-lookup* matriks harga.
  * *Picking List FEFO:* Rekomendasi otomatis urutan pengambilan barang berdasarkan tanggal kedaluwarsa.
  * *Pengiriman & Surat Jalan:* Cetak dokumen perjalanan dan verifikasi bukti serah terima (*POD*).
* **Karantina & Retur:**
  * *Penerimaan Retur Pelanggan:* Isolasi barang leleh, rusak kemasan, atau salah kirim.
  * *Disposisi & Berita Acara:* Pemusnahan (*write-off*) atau pengajuan retur ke pemasok.
* **Modul Akuntansi & Laporan Keuangan:**
  * *Jurnal Umum (*General Journal*):* Rekam kronologis transaksi debit-kredit otomatis.
  * *Buku Besar (*General Ledger*):* Filter riwayat pergerakan saldo per akun akuntansi.
  * *Neraca Saldo (*Trial Balance*):* Validasi keseimbangan total debit dan kredit.
  * *Laporan Laba Rugi (*Income Statement*):* Analisis pendapatan, HPP metode FEFO, kerugian produk rusak, dan laba bersih.
  * *Neraca Keuangan (*Balance Sheet*):* Posisi nilai aset lancar, persediaan es krim, liabilitas, dan ekuitas.
  * *Laporan Mutasi Persediaan:* Rekapitulasi kartu stok multi-satuan.

---

## 4. Rincian Desain Layar Utama (*Key Screens Specification*)

### 4.1 Dasbor Operasional & Finansial Terpadu

Layar dasbor mengimplementasikan tata letak kisi (*bento grid*) yang menyajikan data tingkat tinggi:

1. **Baris Kartu Metrik Ringkasan (*KPI Metric Cards - 4 Kolom*):**
   * *Valuasi Stok Persediaan:* Nilai nominal Rupiah (misal: `Rp 284.500.000`) dengan sub-teks ekuivalensi fisik (`1.420 Dus / 54.200 Pcs`). Ikon: Kotak Gudang (`cube`).
   * *Integritas Rantai Dingin:* Lencana status `AMAN` warna hijau dengan nilai rata-rata `-21.4°C` (4 Freezer Normal). Ikon: Termometer (`thermometer-snowflake`).
   * *Batch Kritis FEFO (< 30 Hari):* Menampilkan jumlah *batch* mendekati batas waktu konsumsi (misal: `3 Batch Perlu Perhatian`) dengan warna aksen merah muda. Ikon: Peringatan Waktu (`clock-alert`).
   * *Penjualan & Margin Hari Ini:* Nilai omzet kotor (misal: `Rp 18.250.000`) dengan persentase margin kotor rata-rata (`27,4%`). Ikon: Tren Finansial (`trending-up`).
2. **Visualisasi Data Analitik (*Grafik 2 Kolom - 60% : 40%*):**
   * *Kolom Kiri (Area Chart Suhu):* Grafik garis telemetri suhu 24 jam terakhir yang memplot sensor tiap *freezer*. Garis batas toleransi merah putus-putus diletakkan pada posisi $-18^\circ\text{C}$ sebagai panduan batas kritis.
   * *Kolom Kanan (Donut Chart Penjualan):* Diagram lingkaran proporsi penjualan berdasarkan kategori pelanggan (Agen/Grosir: 45%, Modern Trade: 30%, General Trade: 25%).
3. **Tabel Pengawasan Batch Terdekat (*FEFO Watchlist Table*):**
   * Menampilkan 5 produk teratas dengan tanggal kedaluwarsa paling mendesak.
   * Kolom: SKU, Nama Produk, Nomor Batch, Tanggal Kedaluwarsa, Sisa Hari Menuju Kedaluwarsa, Saldo Stok (Dus/Pcs), Lokasi Rak Freezer, dan Tombol Pintas Pembuatan Promo/Disposisi.

### 4.2 Layar Saldo Stok Real-Time & Komponen Multi-UOM Switcher

Halaman ini berfungsi sebagai pusat kendali inventaris dengan fitur fleksibilitas satuan:

1. **Bilah Filter Atas (*Control Header Bar*):**
   * Kolom pencarian SKU atau Nama Produk es krim.
   * Dropdown pemilihan lokasi spesifik *freezer* (Freezer 01, 02, Karantina).
   * **Komponen Pengalih Satuan (*Multi-UOM Segmented Control*):**
     Grup tombol interaktif bergaya TailAdmin dengan tiga pilihan tampilan:
     * `[ Tampilan Terurai (Dus / Pack / Pcs) ]`: Memecah kuantitas ke dalam denominasi terbesar hingga terkecil (misal: *10 Dus, 2 Pack, 4 Pcs*).
     * `[ Standarisasi Base Unit (Pcs) ]`: Mengonversi seluruh saldo ke dalam satuan dasar terkecil (misal: *256 Pcs*).
     * `[ Estimasi Total Dus ]`: Menampilkan angka desimal ekuivalensi karton (misal: *10,67 Dus*).
2. **Struktur Kolom Tabel Data Stok:**
   * *SKU & Informasi Es Krim:* Kode barang dan nama produk dengan *thumbnail* visual es krim.
   * *Nomor Batch & Kedaluwarsa:* Label nomor batch beserta lencana status kedaluwarsa berwarna (Hijau: > 60 hari; Kuning: 30-60 hari; Merah: < 30 hari).
   * *Lokasi Rak Freezer:* Kode rak terstruktur (misal: `FRZ-A / RAK-02 / B-01`).
   * *Kuantitas Stok Tersedia:* Angka kuantitas yang dinamis mengikuti pilihan tombol *UOM Switcher*.
   * *Valuasi Persediaan:* Nilai nominal Rupiah hasil perkalian *Base Unit* (Pcs) dengan harga beli modal (*HPP*).
   * *Menu Tindakan (*Action Dropdown*):* Tombol aksi untuk memicu dialog *Breakdown UOM*, melihat Kartu Stok (*Stock Card Ledger*), atau mengalokasikan stok ke karantina.

### 4.3 Dialog Interaktif Pemecahan Satuan (*Breakdown / Repacking UOM*)

Komponen modal pop-up yang muncul saat petugas gudang perlu membuka karton besar untuk pesanan eceran:
* Header: Informasi SKU dan Nomor Batch yang dipilih.
* Input Kuantitas Sumber: Jumlah satuan besar (Dus) yang akan dibuka fisiknya di dalam *cold storage*.
* Panel Konversi Real-Time: Menampilkan perhitungan instan faktor konversi (misal: *Input 2 Dus $\rightarrow$ Otomatis menghasilkan 48 Pcs Base Unit* berdasarkan rasio konversi produk).
* Lokasi Tujuan: Konfirmasi lokasi rak penyimpanan untuk satuan eceran hasil pemecahan.
* Catatan Operasional: Kolom input keterangan staf pelaksana.
* Validasi: Tombol konfirmasi yang secara otomatis memotong stok Dus, menambah stok Pcs, dan mencatat transaksi mutasi tipe `BREAKDOWN` tanpa mengubah total valuasi keuangan barang.

### 4.4 Layar Pesanan Penjualan (*Sales Order*) & Penarikan Matriks Harga Otomatis

Formulir transaksi penjualan yang dirancang untuk mencegah kekeliruan penetapan harga:

1. **Informasi Pelanggan (*Customer Header Block*):**
   * Form pencarian otomatis nama pelanggan.
   * Begitu pelanggan dipilih, sistem menampilkan lencana kategori secara otomatis (misal: `AGEN / GROSIR`, `GENERAL TRADE`, atau `MODERN TRADE`).
   * Alamat pengiriman dan syarat pembayaran (*Terms of Payment*).
2. **Tabel Baris Item Pesanan Dinamis (*Dynamic Order Items*):**
   * *Pilihan Produk:* Dropdown SKU / Nama es krim.
   * *Pilihan Satuan Transaksi (UOM):* Pilihan satuan yang didukung (Dus, Pack, atau Pcs).
   * *Kuantitas Pesanan:* Input jumlah pesanan dalam satuan yang dipilih.
   * *Harga Satuan (*Auto-Locked Price*):* Bidang input harga yang secara otomatis terisi dari tabel matriks harga (`product_customer_prices`) sesuai pasangan produk, UOM, dan kategori pelanggan. Staf operasional tidak dapat mengubah angka ini secara manual kecuali memiliki otorisasi manajerial khusus.
   * *Subtotal & Estimasi HPP:* Perhitungan nilai kotor penjualan dan estimasi beban pokok penjualan yang dihitung dari *batch* FEFO yang akan dialokasikan.
3. **Panel Ringkasan Tagihan (*Financial Order Summary Card*):**
   * Total Kuantitas Fisik (dikonversi ke total *Base Unit* Pcs).
   * Total Nilai Penjualan Sebelum Pajak.
   * Pajak Pertambahan Nilai (PPN 11%, jika berlaku).
   * Total Tagihan Bersih (*Grand Total*).
   * Proyeksi Estimasi Laba Kotor Pesanan (*Estimated Gross Profit*).

### 4.5 Layar Daftar Pengambilan Barang FEFO (*Picking List*)

Tampilan kerja dioptimalkan untuk perangkat *handheld scanner* operator gudang:
* Disusun urut berdasarkan rute lorong rak penyimpanan terpendek (*optimized warehouse routing*).
* Setiap baris tugas memuat:
  * Lokasi rak target (dicetak dengan ukuran teks besar: `RAK A-03`).
  * Nomor Batch dan Tanggal Kedaluwarsa yang wajib diambil (memastikan produk terlama keluar lebih dahulu).
  * SKU dan Nama Es Krim.
  * Kuantitas dan Satuan Pengambilan (misal: `Ambil 5 Dus` atau `Ambil 12 Pcs`).
  * Kotak Konfirmasi Pemindaian Kode Batang (*Barcode Scan Input*).

### 4.6 Layar Jurnal Umum & Laporan Keuangan

Antarmuka pembukuan yang menyatukan logistik fisik dengan laporan keuangan formal:

1. **Tampilan Kartu Jurnal Transaksi (*Journal Entry Feed*):**
   * Setiap aktivitas gudang (Inbound, Outbound, Retur, Pemusnahan) disajikan dalam format kartu akuntansi berstandar:
     * Header: Nomor Bukti Jurnal (`JV-202610-0089`), Tanggal Transaksi, dan Tautan Dokumen Sumber (misal: `Surat Jalan Outbound #SJ-1044`).
     * Rincian Ayat Jurnal Berpasangan:
       * Baris Debit: Kode Akun, Nama Akun, dan Nilai Nominal Debit.
       * Baris Kredit: Kode Akun (diberi indentasi visual ke dalam), Nama Akun, dan Nilai Nominal Kredit.
     * Footer Kartu: Indikator Validasi `Status: Balanced` warna hijau jika total debit sama persis dengan total kredit.
2. **Laporan Laba Rugi (*Income Statement Screen*):**
   * Format laporan bertingkat (*collapsible multi-tier view*) dengan perbandingan periode berjalan dan periode sebelumnya:
     * Kelompok Pendapatan: Penjualan Grosir (Agen), Penjualan Retail (GT), Penjualan Modern Trade.
     * Beban Pokok Penjualan (HPP): Nilai persediaan keluar berdasarkan alokasi *batch* FEFO riil.
     * Laba Kotor (*Gross Profit*).
     * Beban Operasional Gudang & Rantai Dingin: Beban listrik freezer, biaya bahan bakar armada pendingin, serta kerugian penyusutan barang rusak/meleleh (*Cold Chain Spoilage Loss*).
     * Laba Bersih Operasional.
3. **Laporan Neraca (*Balance Sheet Screen*):**
   * Sisi Aset: Kas & Bank, Piutang Usaha Pelanggan, dan Persediaan Es Krim (disinkronkan dengan saldo fisik akhir di gudang).
   * Sisi Liabilitas: Utang Dagang Pemasok/Prinsipal.
   * Sisi Ekuitas: Modal Pemilik dan Laba Ditahan.

---

## 5. Komponen Tailwind CSS Siap Pakai (Gaya TailAdmin)

Berikut adalah kode komponen antarmuka esensial yang dapat langsung digunakan dalam proyek:

### 5.1 Indikator Suhu Rantai Dingin (*Cold Chain Status Badge*)

```html
<!-- Status Optimal / Aman -->
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
  <span class="relative flex h-2 w-2">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
  <span>Freezer Utama: -21.8°C (Optimal)</span>
</div>

<!-- Status Bahaya / Anomali Suhu -->
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse">
  <span class="relative flex h-2 w-2">
    <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
  </span>
  <span>Freezer B: -13.5°C (KRITIS: SUHU MELEBIHI AMBANG)</span>
</div>
```

### 5.2 Pengalih Tampilan Satuan (*Multi-UOM Segmented Switcher*)

```html
<div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
  <!-- Pilihan Aktif: Terurai -->
  <button type="button" class="px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold transition">
    Terurai (Dus / Pack / Pcs)
  </button>
  <!-- Pilihan Pasif: Base Unit -->
  <button type="button" class="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
    Base Unit (Pcs)
  </button>
  <!-- Pilihan Pasif: Estimasi Dus -->
  <button type="button" class="px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
    Estimasi Total Dus
  </button>
</div>
```

### 5.3 Kartu Jurnal Akuntansi Seimbang (*Balanced Journal Card*)

```html
<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
  <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">JV-202610-0112</span>
      <h4 class="text-sm font-semibold text-slate-800 dark:text-white">Pengakuan Piutang & HPP Penjualan (SO #1094)</h4>
    </div>
    <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
      Balanced
    </span>
  </div>
  
  <div class="mt-3 divide-y divide-slate-100 font-mono text-xs dark:divide-slate-700/60">
    <div class="flex justify-between py-1.5">
      <span class="text-slate-700 dark:text-slate-200">1102 - Piutang Usaha (Toko Subur)</span>
      <div class="space-x-4 tabular-nums">
        <span class="font-semibold text-slate-900 dark:text-white">Rp 1.450.000</span>
        <span class="text-slate-400">-</span>
      </div>
    </div>
    <div class="flex justify-between py-1.5 pl-4">
      <span class="text-slate-600 dark:text-slate-400">4101 - Pendapatan Penjualan Es Krim</span>
      <div class="space-x-4 tabular-nums">
        <span class="text-slate-400">-</span>
        <span class="font-semibold text-slate-900 dark:text-white">Rp 1.450.000</span>
      </div>
    </div>
    <div class="flex justify-between py-1.5">
      <span class="text-slate-700 dark:text-slate-200">5101 - Beban Pokok Penjualan (FEFO Cost)</span>
      <div class="space-x-4 tabular-nums">
        <span class="font-semibold text-slate-900 dark:text-white">Rp 1.050.000</span>
        <span class="text-slate-400">-</span>
      </div>
    </div>
    <div class="flex justify-between py-1.5 pl-4">
      <span class="text-slate-600 dark:text-slate-400">1103 - Persediaan Es Krim Gudang</span>
      <div class="space-x-4 tabular-nums">
        <span class="text-slate-400">-</span>
        <span class="font-semibold text-slate-900 dark:text-white">Rp 1.050.000</span>
      </div>
    </div>
  </div>
</div>
```

---

## 6. Pertimbangan Perangkat & Responsivitas Antarmuka

Antarmuka dirancang adaptif untuk mendukung dua skenario penggunaan utama:

1. **Perangkat Desktop Administrasi (Layar Lebar $\ge 1024\text{px}$):**
   * Mode tampilan penuh dengan bilah navigasi samping terbuka permanen.
   * Tabel data menampilkan seluruh kolom secara lengkap (SKU, Batch, UOM terurai, harga beli, margin, dan valuasi).
   * Menampilkan panel ringkasan ganda pada transaksi pesanan keluar dan entri jurnal akuntansi.
2. **Perangkat Bergerak & Handheld Barcode Scanner Gudang (Layar Kecil $< 768\text{px}$):**
   * Bilah navigasi samping otomatis diciutkan menjadi menu *drawer* tersembunyi.
   * Ukuran tombol dan target sentuh diperbesar minimal $44 \times 44\text{px}$ untuk kenyamanan petugas yang mengenakan sarung tangan termal pelindung suhu dingin.
   * Tabel beralih menjadi tampilan kartu (*card stack*) yang memprioritaskan nomor rak, nomor batch, nama es krim, dan tombol pemindai kode batang.
   * Input teks dioptimalkan agar secara otomatis membuka papan ketik numerik saat memasukkan kuantitas UOM atau derajat suhu.
