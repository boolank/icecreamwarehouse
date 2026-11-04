# Panduan Pengujian Alur Bisnis Menyeluruh (End-to-End Testing Guide)
## Sistem Informasi Manajemen Gudang & Akuntansi Distributor Es Krim (FROST/FLOW)
### Berdasarkan Dokumen Faktur PO PT. Indo Van Houten & Price List Alaska

---

## 📌 1. Pendahuluan & Skenario Kasus Uji

Panduan ini disusun untuk memandu pengujian fungsional sistem secara runtut dari hulu ke hilir (*End-to-End Business Flow*). Skenario pengetesan menggunakan data operasional nyata dari:
1. **Faktur Pengadaan / PO No. `DIS10114` (Ref: `2610/K011` / `D033 DIS KORUDO`)**:
   - **Penerbit (Prinsipal):** PT. INDO VAN HOUTEN (Jakarta) - Merk Miami Ice Cream
   - **Pembeli (Distributor):** PESAT JAYA SENTOSA (Sukabumi)
   - **Total Pasokan:** 560 Dus (19 varian item es krim)
   - **Subtotal DPP:** Rp 36.747.940,00 | **PPN 11%:** Rp 4.042.274,00 | **Total:** Rp 40.790.214,00
   - **Term Pembayaran:** Tunai / COD 0 Hari
2. **Katalog Daftar Harga Resmi PT. ALASKA FOOD INDUSTRY**:
   - Skema Multi-UOM (Satuan Dasar `PCS`, Satuan Kemasan `DUS` isi 24, 40, 50, atau 60 Pcs).
   - Struktur harga bertingkat: Harga Beli Distributor (HPP), Harga Agen/Grosir, dan Harga General Trade (Warung/Eceran).

---

## 🔑 2. Kredensial Masuk Sistem (Demo Login)

Buka aplikasi pada peramban web: **`http://localhost:3000/login`**

| Peran Akun | Username | Password | Ruang Lingkup Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin Sistem / Gudang** | `admin_gudang` | `password123` | Akses penuh master data, manajemen pengguna, inbound, dan outbound |
| **Staf Akuntansi & Keuangan** | `staf_akuntansi` | `password123` | Akses modul AP Hutang, Loans Pinjaman, Jurnal Umum, dan Laporan Finansial |
| **Operator Cold Storage** | `operator_gudang` | `password123` | Inbound QC Suhu, Picking List FEFO, dan Log Suhu Freezer |

---

## 🗺️ 3. Peta 9 Langkah Pengujian Alur Bisnis (Testing Step-by-Step)

```
[Tahap 1: Master Data & Harga] ──► [Tahap 2: Purchase Order PO-DIS10114]
                 │                                    │
                 ▼                                    ▼
[Tahap 4: Hutang AP & Voucher Kas] ◄── [Tahap 3: QC Suhu Truk Inbound ≤ -18°C]
                 │
                 ▼
[Tahap 5: Sales Order & Diskon] ──► [Tahap 6: Picking List FEFO (-25°C)]
                 │                                    │
                 ▼                                    ▼
[Tahap 8: Retur & Berita Acara BAP] ◄── [Tahap 7: Pelepasan Truk & Surat Jalan DO]
                 │
                 ▼
[Tahap 9: Laporan Keuangan & Audit Jurnal Otomatis]
```

---

### 🧪 TAHAP 1: Verifikasi Master Produk Multi-UOM & Matriks Harga
* **Tujuan:** Memastikan produk es krim Miami/Alaska telah terkonfigurasi dengan rasio konversi UOM yang tepat (1 Base Unit PCS) dan matriks harga kanal.
* **Langkah-Langkah:**
  1. Buka menu **`MASTER DATA` $\rightarrow$ `Produk & Multi-UOM`** (`/master-data/products`).
  2. Cari produk es krim Miami (misal: `Blueberry Ice 60/114`, `Choco Corn 40/140`, `Golden Corn 40/140`, `Double Crumble Cho`).
  3. Klik tombol **Detail / UOM** pada `Blueberry Ice 60/114`:
     - Verifikasi Satuan Dasar: `PCS` (Rasio: 1, Flag Base Unit: Aktif).
     - Verifikasi Satuan Kemasan: `DUS` (Rasio konversi: 60 Pcs).
  4. Buka menu **`MASTER DATA` $\rightarrow$ `Price List Matrix`** (`/master-data/prices`).
  5. Periksa baris produk `Blueberry Ice 60/114`:
     - HPP Beli Distributor: `Rp 64.865 / Dus`
     - Harga Agen / Grosir: `Rp 99.000 / Dus`
     - Harga General Trade (Warung/Ecer): `Rp 120.000 / Dus`
     - Laba Kotor Margin: $\ge 27\%$ terhitung otomatis.
* **Hasil yang Diharapkan:** Data produk dan satuan bertingkat tampil konsisten, angka tabular rapi, dan margin profit otomatis dikalkulasi.

---

### 🧪 TAHAP 2: Pengadaan & Konfirmasi Purchase Order
* **Tujuan:** Memvalidasi pencatatan PO resmi pabrik PT. Indo Van Houten sebesar 560 Dus.
* **Langkah-Langkah:**
  1. Buka menu **`MANAJEMEN INBOUND` $\rightarrow$ `Purchase Order Receiving`** (`/inbound/po`).
  2. Periksa baris PO teratas: **`PO-DIS10114`** dengan pemasok **`PT. INDO VAN HOUTEN (Miami Ice Cream)`**.
  3. Klik ikon mata (**Lihat Rincian PO**):
     - Pastikan terdapat 19 varian item es krim (25 Dus Blueberry Ice, 75 Dus Choco Corn, 80 Dus Golden Corn, 25 Dus Double Crumble, dll.).
     - Pastikan total nilai: **`Rp 40.790.214`** (DPP Rp 36.747.940 + PPN 11% Rp 4.042.274).
  4. Klik tombol **`Konfirmasi PO`** untuk mengunci status pesanan menjadi `CONFIRMED`.
* **Hasil yang Diharapkan:** Status PO berubah menjadi `CONFIRMED` dan siap dijadwalkan untuk penerimaan armada ekspedisi di dermaga bongkar (*unloading dock*).

---

### 🧪 TAHAP 3: Pemeriksaan QC Suhu Armada Truk & Penerimaan Inbound
* **Tujuan:** Menguji aturan gerbang mutu rantai dingin ($\le -18^\circ\text{C}$) saat truk pabrik tiba di gudang distributor.
* **Langkah-Langkah:**
  1. Buka menu **`MANAJEMEN INBOUND` $\rightarrow$ `Pemeriksaan QC Suhu & Batch`** (`/inbound/qc`).
  2. Pada dropdown **Pilih Dokumen PO**, pilih **`PO-DIS10114 (PT. INDO VAN HOUTEN - 560 Dus)`**.
  3. **Uji Kasus Negatif (Suhu Hangat / Pelanggaran Rantai Dingin):**
     - Ubah input suhu truk menjadi **`-15.0°C`**.
     - Perhatikan indikator: Berubah menjadi **MERAH** bertuliskan `"SUHU KRITIS - BAHAYA PECAH RANTAI DINGIN"`.
     - Klik tombol **`Terima Pasokan`**: Sistem akan memblokir dan menolak penerimaan barang karena suhu lebih hangat dari $-18^\circ\text{C}$.
  4. **Uji Kasus Positif (Suhu Dingin Lolos Standar):**
     - Kembalikan suhu truk ke **`-21.4°C`** (Indikator berubah menjadi **HIJAU** `"SUHU DINGIN OPTIMAL"`).
     - Periksa alokasi rak freezer tujuan (misal: `FRZ-A/RAK-01`, `FRZ-B/RAK-02`).
     - Klik tombol **`Terima Pasokan & Eksekusi Jurnal Otomatis`**.
* **Hasil yang Diharapkan:**
  - Tampil notifikasi sukses penerimaan pasokan.
  - Kartu Jurnal Otomatis terbentuk berimbang:
    - `[Debit] 1130 Persediaan Es Krim`
    - `[Kredit] 2101 Utang Usaha — Supplier Es Krim`
  - Saldo stok fisik bertambah otomatis di **`Stok Real-Time`** (`/inventory/stocks`).

---

### 🧪 TAHAP 4: Manajemen Hutang Usaha (AP Aging) & Pembayaran Pelunasan
* **Tujuan:** Menguji pengawasan jadwal jatuh tempo faktur pabrik dan eksekusi voucher pengeluaran kas keluar.
* **Langkah-Langkah:**
  1. Buka menu **`HUTANG & PEMBIAYAAN` $\rightarrow$ `Hutang Usaha Supplier`** (`/accounting/payable`).
  2. Temukan faktur **`JR-2610/K011`** (Ref PO: `PO-DIS10114`) dari **`PT. INDO VAN HOUTEN`** dengan nilai tagihan **`Rp 40.790.214`**.
  3. Klik tombol **`Bayar`** pada baris faktur tersebut:
     - Pilih tipe: **Pelunasan Penuh (100%)** atau cicilan.
     - Pilih akun kas: **`1103 Bank BCA — Rekening Operasional`**.
     - Masukkan no referensi transfer (misal: `TRF-BCA-IVH-001`).
     - Amati kartu preview jurnal berimbang otomatis:
       - `[Debit] 2101 Utang Usaha: Rp 40.790.214`
       - `[Kredit] 1103 Bank BCA: Rp 40.790.214`
     - Klik **`Konfirmasi Pembayaran Kas Keluar`**.
  4. Klik tombol **`Riwayat Pembayaran`** (ikon jam):
     - Klik tombol ikon printer pada transaksi pembayaran yang baru dilakukan.
     - Dokumen **`Bukti Kas Keluar / Payment Voucher`** formal akan muncul.
     - Tekan **`Cetak Voucher (Ctrl+P)`** untuk memvalidasi pratinjau cetak bersih tanpa sidebar.
* **Hasil yang Diharapkan:** Status faktur di tabel berubah menjadi **`LUNAS`**, sisa saldo hutang menjadi Rp 0, dan voucher kas keluar tercetak rapi.

---

### 🧪 TAHAP 5: Pesanan Penjualan (Sales Order) & Mesin Diskon Bertingkat
* **Tujuan:** Menguji pembuatan pesanan penjualan toko mitra dengan diskon per item (% atau Rp), diskon faktur global, dan cetak faktur komersial.
* **Langkah-Langkah:**
  1. Buka menu **`OUTBOUND & PENJUALAN` $\rightarrow$ `Sales Order`** (`/sales-orders`).
  2. Klik tombol **`+ Buat Sales Order Baru`**:
     - Masukkan Nama Toko: `Minimarket Sumber Makmur BSD`.
     - Pilih Kanal: `General Trade (Warung/Kelontong)` atau `Agen / Grosir`.
     - Tipe Pembayaran: `Kredit (Term of Payment 14 Hari)`.
  3. Tambahkan baris produk es krim Miami:
     - Pilih `MIA-BLU-60 - Blueberry Ice 60/114`: Qty `10 Dus` @ Rp 120.000.
     - Masukkan Diskon Item: `5%` (Potongan diskon Rp 60.000 otomatis terkalkulasi).
     - Tambahkan item kedua `MIA-CRN-40 - Choco Corn 40/140`: Qty `10 Dus` @ Rp 120.000.
  4. Masukkan **Diskon Promosi Faktur Global Tambahan**: `Rp 50.000`.
  5. Amati kotak ringkasan kalkulasi finansial:
     - Subtotal Bruto: `Rp 2.400.000`
     - Total Potongan Diskon (Contra-Revenue Akun 4111): `-Rp 110.000`
     - Dasar Pengenaan Pajak (DPP): `Rp 2.290.000`
     - Total Netto Tagihan: `Rp 2.290.000`
  6. Klik **`Simpan Pesanan & Kunci Diskon`**.
  7. Klik tombol ikon printer pada baris SO yang baru dibuat:
     - Dokumen **`Faktur Penjualan (Commercial Invoice)`** formal akan terbuka.
     - Berisi data toko, rincian potongan diskon, nomor rekening transfer BCA, dan kolom tanda tangan.
* **Hasil yang Diharapkan:** Pesanan SO tersimpan, jurnal otomatis mencatat diskon ke contra-revenue `4111 Diskon Penjualan`, dan dokumen faktur siap cetak.

---

### 🧪 TAHAP 6: Eksekusi Alokasi FEFO & Lembar Kerja Picking Cold Room
* **Tujuan:** Menguji pemilihan batch otomatis berdasarkan tanggal kedaluwarsa terdekat dan lembar kerja fisik kru gudang cold room $-25^\circ\text{C}$.
* **Langkah-Langkah:**
  1. Buka menu **`OUTBOUND & PENJUALAN` $\rightarrow$ `Picking List FEFO`** (`/picking`).
  2. Klik dokumen picking yang aktif di panel kiri (misal: `PL-202610-001`).
  3. Perhatikan daftar item yang direkomendasikan sistem:
     - Produk `King Durian 60` yang kedaluwarsa dalam **16 Hari** otomatis diprioritaskan di baris pertama dengan badge merah `Kritis / Prioritas FEFO`.
  4. Klik tombol **`Cetak Lembar Picking`**:
     - Dokumen **`Physical Picking Sheet FEFO`** akan muncul.
     - Format ini dirancang khusus untuk kru cold storage: terdapat **kotak centang fisik [ ]**, kode lokasi rak freezer (`FRZ-A / RAK-03`), nomor batch, dan kolom tanda tangan picker & checker.
     - Tekan **`Cetak Lembar Kerja (Ctrl+P)`**.
  5. Lakukan checklist centang item es krim yang diambil, lalu klik **`Konfirmasi Selesai`**.
* **Hasil yang Diharapkan:** Status picking menjadi `SELESAI`, stok fisik terpotong berdasarkan batch kedaluwarsa terdekat (FEFO), dan jurnal HPP otomatis tercatat.

---

### 🧪 TAHAP 7: Pelepasan Armada Pengiriman & Cetak Surat Jalan (DO)
* **Tujuan:** Memvalidasi SOP keberangkatan truk reefer berpendingin dan dokumen Surat Jalan resmi.
* **Langkah-Langkah:**
  1. Buka menu **`OUTBOUND & PENJUALAN` $\rightarrow$ `Pengiriman & Surat Jalan`** (`/delivery`).
  2. Perhatikan banner SOP: **100% armada wajib pre-cooling $\le -18^\circ\text{C}$**.
  3. Pada tabel pengiriman, klik tombol printer pada baris `SJ-202610-001` (Tujuan: Supermarket Fresh Mart):
     - Dokumen **`Surat Jalan (Delivery Order)`** resmi akan terbuka.
     - Terdapat nomor DO, nomor ref SO, nomor plat truk pendingin (`B 9124 KLD`), nama driver (`Budi Santoso`), status verifikasi suhu box (`-20.4°C Lolos Mutu`), tabel muatan Dus & Pcs, klausul jaminan es krim tidak boleh meleleh, dan **4 kolom tanda tangan** (Gudang, QC Suhu, Supir, Toko Penerima).
  4. Tekan tombol **`Cetak Dokumen (Ctrl+P)`**.
* **Hasil yang Diharapkan:** Surat Jalan tercetak secara proporsional di kertas A4 tanpa terpotong dan elemen UI navigasi otomatis disembunyikan.

---

### 🧪 TAHAP 8: Penanganan Retur Karantina & Berita Acara Pemusnahan (BAP)
* **Tujuan:** Menguji alur es krim rusak/meleleh akibat putus rantai dingin di toko mitra hingga diterbitkannya Berita Acara Pemusnahan dan pengakuan jurnal beban kerugian.
* **Langkah-Langkah:**
  1. Buka menu **`KARANTINA & RETUR` $\rightarrow$ `Penerimaan Retur Pelanggan`** (`/returns`):
     - Memeriksa produk es krim retur yang masuk ke ruang karantina freezer `KRN-01`.
  2. Buka menu **`KARANTINA & RETUR` $\rightarrow$ `Disposisi & Berita Acara`** (`/returns/disposition`).
  3. Pada produk es krim yang meleleh (`MELTED`), klik tombol **`Disposisi`**:
     - Pilih opsi keputusan: **`Pemusnahan Total (Write-Off / Spoilage)`**.
     - Masukkan catatan berita acara pemusnahan.
     - Klik **`Sahkan Disposisi & Terbitkan Berita Acara`**.
  4. Klik tombol ikon printer pada baris disposisi:
     - Dokumen **`Berita Acara Pemusnahan (BAP)`** legal akan terbuka.
     - Berisi kronologi es krim cair, valuasi modal yang dimusnahkan, ayat jurnal pembukuan beban kerugian (`Debit 5201 Beban Kerusakan Persediaan`), dan 4 saksi penandatangan (Petugas Karantina, Supervisor Gudang, Finance, Manajer).
* **Hasil yang Diharapkan:** Barang di ruang karantina dikeluarkan dari aset persediaan, jurnal beban kerugian terposting, dan dokumen legal BAP siap diarsipkan untuk klaim audit.

---

### 🧪 TAHAP 9: Audit Laporan Finansial Otomatis
* **Tujuan:** Memastikan seluruh transaksi fisik logistik dari Tahap 1 s/d Tahap 8 telah mengalir ke buku akuntansi secara berimbang tanpa entri jurnal manual.
* **Langkah-Langkah:**
  1. **Jurnal Umum (`/reports/general-journal`):**
     - Periksa bahwa seluruh transaksi (Inbound PO DIS10114, Pelunasan Kas Keluar BCA, Penjualan SO Diskon, dan Pemusnahan Retur) tercatat lengkap dengan status **`BALANCED (DEBIT = KREDIT)`**.
  2. **Buku Besar (`/reports/general-ledger`):**
     - Filter akun `1130 Persediaan Es Krim`, `2101 Utang Usaha`, `1110 Piutang Usaha`, dan `4111 Diskon Penjualan` untuk melihat mutasi debet/kredit terperinci.
  3. **Neraca Saldo (`/reports/trial-balance`):**
     - Pastikan baris total paling bawah: $\sum\text{Debit} = \sum\text{Kredit}$.
  4. **Laporan Laba Rugi (`/reports/income-statement`):**
     - Periksa struktur: Pendapatan Penjualan Bruto $-$ Diskon Penjualan (4111) $=$ Penjualan Bersih $-$ Beban Pokok Penjualan (HPP) $-$ Beban Kerusakan/Spoilage (5201) $-$ Beban Bunga Pinjaman Bank (6501) $=$ Laba Bersih.
  5. **Laporan Neraca (`/reports/balance-sheet`):**
     - Pastikan persamaan dasar akuntansi terpenuhi: $\text{Total Aset} = \text{Total Kewajiban} + \text{Total Ekuitas}$.
* **Hasil yang Diharapkan:** Seluruh laporan keuangan mencerminkan kondisi bisnis nyata secara *real-time*.

---

## 📋 4. Matriks Ringkasan Checklist Pengujian

| No | Modul / Layar | Kode Rute | Skenario Pengujian Kunci | Status Hasil |
|:---:|:---|:---|:---|:---:|
| 1 | Master Produk | `/master-data/products` | Verifikasi 1 Base Unit PCS & konversi Dus 60 Pcs (Miami) | [x] LULUS |
| 2 | Matriks Harga | `/master-data/prices` | Validasi harga HPP, Grosir, Eceran, dan margin profit % | [x] LULUS |
| 3 | Purchase Order | `/inbound/po` | PO-DIS10114 PT. Indo Van Houten (560 Dus, Rp 40.790.214) | [x] LULUS |
| 4 | QC Suhu Inbound | `/inbound/qc` | Blokir suhu hangat ($-15^\circ\text{C}$), loloskan suhu dingin ($-21.4^\circ\text{C}$) | [x] LULUS |
| 5 | Hutang Usaha (AP) | `/accounting/payable` | Pelunasan tagihan supplier PT. IVH & cetak Payment Voucher | [x] LULUS |
| 6 | Sales Order & Diskon | `/sales-orders` | Diskon per baris item + diskon faktur & cetak Invoice resmi | [x] LULUS |
| 7 | Picking List FEFO | `/picking` | Prioritas batch $\le 30$ hari & cetak lembar kerja cold room | [x] LULUS |
| 8 | Pelepasan Pengiriman | `/delivery` | Verifikasi pre-cooling $\le -18^\circ\text{C}$ & cetak Surat Jalan (DO) | [x] LULUS |
| 9 | Disposisi Spoilage | `/returns/disposition` | Pemusnahan es krim meleleh & cetak Berita Acara (BAP) | [x] LULUS |
| 10 | Pelaporan Keuangan | `/reports/*` | Keseimbangan Jurnal Umum, Laba Rugi, Neraca, & Mutasi Stok | [x] LULUS |

---
*Dokumen ini merupakan standar operasional prosedur pengetesan resmi untuk distributor es krim sistem FROST/FLOW.*
