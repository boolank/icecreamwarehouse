# Chart of Accounts (COA) — Cold Chain WMS & ERP Lite
## Distributor Es Krim

> **Standar:** Akuntansi Berbasis Akrual (Accrual Basis), Double-Entry Bookkeeping
> **Mata Uang:** IDR (Rupiah Indonesia)
> **Struktur Kode:** [Tipe][Sub-tipe][Nomor Urut] — 4 digit

---

## Struktur Penomoran Akun

| Kode Awalan | Tipe Akun | Saldo Normal |
|---|---|---|
| **1xxx** | Aset (Asset) | Debit |
| **2xxx** | Liabilitas / Utang (Liability) | Kredit |
| **3xxx** | Ekuitas (Equity) | Kredit |
| **4xxx** | Pendapatan (Revenue) | Kredit |
| **5xxx** | Harga Pokok Penjualan (COGS) | Debit |
| **6xxx** | Beban Operasional (Expense) | Debit |

---

## Tabel COA Lengkap (SQL Seed Data)

```sql
-- ============================================================
-- SEED DATA: CHART OF ACCOUNTS
-- Cold Chain WMS & ERP Lite — Distributor Es Krim
-- ============================================================

INSERT INTO chart_of_accounts
    (account_code, account_name, account_type, normal_balance, parent_id, level, is_header)
VALUES

-- ============================================================
-- 1. ASET (ASSET) — Saldo Normal: DEBIT
-- ============================================================

-- Header Utama
('1000', 'ASET',                                    'ASSET', 'DEBIT', NULL, 1, TRUE),

-- 1.1 Aset Lancar
('1100', 'Aset Lancar',                             'ASSET', 'DEBIT', NULL, 2, TRUE),
('1101', 'Kas',                                     'ASSET', 'DEBIT', NULL, 3, FALSE),
('1102', 'Kas Kecil (Petty Cash)',                  'ASSET', 'DEBIT', NULL, 3, FALSE),
('1103', 'Bank — Rekening Operasional',             'ASSET', 'DEBIT', NULL, 3, FALSE),
('1104', 'Bank — Rekening Tabungan',                'ASSET', 'DEBIT', NULL, 3, FALSE),
('1110', 'Piutang Usaha',                           'ASSET', 'DEBIT', NULL, 3, FALSE),
('1111', 'Piutang Usaha — Modern Trade',            'ASSET', 'DEBIT', NULL, 3, FALSE),
('1112', 'Piutang Usaha — General Trade',           'ASSET', 'DEBIT', NULL, 3, FALSE),
('1113', 'Piutang Usaha — Horeka',                  'ASSET', 'DEBIT', NULL, 3, FALSE),
('1114', 'Piutang Usaha — Agen/Grosir',             'ASSET', 'DEBIT', NULL, 3, FALSE),
('1115', 'Cadangan Kerugian Piutang',               'ASSET', 'CREDIT', NULL, 3, FALSE),
                                                    -- Contra-asset (saldo normal kredit)
('1120', 'Persediaan Barang Dagang — Es Krim',      'ASSET', 'DEBIT', NULL, 3, FALSE),
('1121', 'Persediaan Barang dalam Karantina',       'ASSET', 'DEBIT', NULL, 3, FALSE),
('1130', 'Uang Muka Pembelian',                     'ASSET', 'DEBIT', NULL, 3, FALSE),
('1140', 'PPN Masukan (Pajak Dibayar Dimuka)',       'ASSET', 'DEBIT', NULL, 3, FALSE),
('1150', 'Biaya Dibayar Dimuka — Asuransi',         'ASSET', 'DEBIT', NULL, 3, FALSE),
('1151', 'Biaya Dibayar Dimuka — Sewa Gudang',      'ASSET', 'DEBIT', NULL, 3, FALSE),

-- 1.2 Aset Tidak Lancar
('1200', 'Aset Tidak Lancar',                       'ASSET', 'DEBIT', NULL, 2, TRUE),
('1210', 'Peralatan Gudang & Cold Storage',         'ASSET', 'DEBIT', NULL, 3, FALSE),
('1211', 'Akumulasi Penyusutan — Peralatan',        'ASSET', 'CREDIT', NULL, 3, FALSE),
                                                    -- Contra-asset
('1220', 'Kendaraan Armada Pendingin',              'ASSET', 'DEBIT', NULL, 3, FALSE),
('1221', 'Akumulasi Penyusutan — Kendaraan',        'ASSET', 'CREDIT', NULL, 3, FALSE),
('1230', 'Aset Tak Berwujud — Software Sistem',     'ASSET', 'DEBIT', NULL, 3, FALSE),
('1231', 'Akumulasi Amortisasi — Software',         'ASSET', 'CREDIT', NULL, 3, FALSE),
('1240', 'Uang Jaminan Sewa',                       'ASSET', 'DEBIT', NULL, 3, FALSE),


-- ============================================================
-- 2. LIABILITAS / UTANG (LIABILITY) — Saldo Normal: KREDIT
-- ============================================================

('2000', 'LIABILITAS',                              'LIABILITY', 'CREDIT', NULL, 1, TRUE),

-- 2.1 Liabilitas Jangka Pendek
('2100', 'Liabilitas Jangka Pendek',                'LIABILITY', 'CREDIT', NULL, 2, TRUE),
('2101', 'Utang Usaha — Supplier Es Krim',          'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2102', 'Uang Muka Penjualan (Deposit Pelanggan)', 'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2103', 'Utang Gaji & Tunjangan Karyawan',         'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2104', 'PPN Keluaran (Pajak Dipungut)',            'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2105', 'PPh 21 Karyawan Terutang',                'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2106', 'PPh 23 Jasa Terutang',                    'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2107', 'Biaya Akrual — Listrik & Utilitas',       'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2108', 'Biaya Akrual — Bahan Bakar Armada',       'LIABILITY', 'CREDIT', NULL, 3, FALSE),

-- 2.2 Liabilitas Jangka Panjang
('2200', 'Liabilitas Jangka Panjang',               'LIABILITY', 'CREDIT', NULL, 2, TRUE),
('2201', 'Utang Bank Jangka Panjang',               'LIABILITY', 'CREDIT', NULL, 3, FALSE),
('2202', 'Utang Leasing Kendaraan',                 'LIABILITY', 'CREDIT', NULL, 3, FALSE),


-- ============================================================
-- 3. EKUITAS (EQUITY) — Saldo Normal: KREDIT
-- ============================================================

('3000', 'EKUITAS',                                 'EQUITY', 'CREDIT', NULL, 1, TRUE),
('3101', 'Modal Disetor Pemilik',                   'EQUITY', 'CREDIT', NULL, 3, FALSE),
('3102', 'Laba Ditahan (Retained Earnings)',        'EQUITY', 'CREDIT', NULL, 3, FALSE),
('3103', 'Laba / Rugi Tahun Berjalan',              'EQUITY', 'CREDIT', NULL, 3, FALSE),
('3104', 'Prive / Pengambilan Pemilik',             'EQUITY', 'DEBIT', NULL, 3, FALSE),
                                                    -- Contra-equity


-- ============================================================
-- 4. PENDAPATAN (REVENUE) — Saldo Normal: KREDIT
-- ============================================================

('4000', 'PENDAPATAN',                              'REVENUE', 'CREDIT', NULL, 1, TRUE),
('4100', 'Pendapatan Penjualan',                    'REVENUE', 'CREDIT', NULL, 2, TRUE),
('4101', 'Penjualan Es Krim — Modern Trade',        'REVENUE', 'CREDIT', NULL, 3, FALSE),
('4102', 'Penjualan Es Krim — General Trade',       'REVENUE', 'CREDIT', NULL, 3, FALSE),
('4103', 'Penjualan Es Krim — Horeka',              'REVENUE', 'CREDIT', NULL, 3, FALSE),
('4104', 'Penjualan Es Krim — Agen/Grosir',         'REVENUE', 'CREDIT', NULL, 3, FALSE),
('4110', 'Retur Penjualan',                         'REVENUE', 'DEBIT', NULL, 3, FALSE),
                                                    -- Contra-revenue
('4111', 'Diskon Penjualan',                        'REVENUE', 'DEBIT', NULL, 3, FALSE),
                                                    -- Contra-revenue
('4200', 'Pendapatan Lain-lain',                    'REVENUE', 'CREDIT', NULL, 2, TRUE),
('4201', 'Pendapatan Klaim Asuransi',               'REVENUE', 'CREDIT', NULL, 3, FALSE),
('4202', 'Pendapatan Bunga Bank',                   'REVENUE', 'CREDIT', NULL, 3, FALSE),


-- ============================================================
-- 5. HARGA POKOK PENJUALAN / HPP (COGS) — Saldo Normal: DEBIT
-- ============================================================

('5000', 'HARGA POKOK PENJUALAN',                  'COGS', 'DEBIT', NULL, 1, TRUE),
('5101', 'Beban Pokok Penjualan (HPP) — Es Krim',  'COGS', 'DEBIT', NULL, 3, FALSE),
('5201', 'Beban Kerugian Barang Rusak / Meleleh',   'COGS', 'DEBIT', NULL, 3, FALSE),
('5202', 'Beban Kerugian Kedaluwarsa (Expired)',    'COGS', 'DEBIT', NULL, 3, FALSE),
('5203', 'Beban Selisih Stok (Susut Opname)',       'COGS', 'DEBIT', NULL, 3, FALSE),


-- ============================================================
-- 6. BEBAN OPERASIONAL (EXPENSE) — Saldo Normal: DEBIT
-- ============================================================

('6000', 'BEBAN OPERASIONAL',                       'EXPENSE', 'DEBIT', NULL, 1, TRUE),

-- 6.1 Beban Karyawan
('6100', 'Beban Karyawan',                          'EXPENSE', 'DEBIT', NULL, 2, TRUE),
('6101', 'Gaji & Upah Karyawan',                    'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6102', 'Tunjangan Transport & Makan',             'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6103', 'BPJS Ketenagakerjaan & Kesehatan',        'EXPENSE', 'DEBIT', NULL, 3, FALSE),

-- 6.2 Beban Operasional Gudang & Cold Chain
('6200', 'Beban Gudang & Cold Chain',               'EXPENSE', 'DEBIT', NULL, 2, TRUE),
('6201', 'Listrik Cold Storage / Freezer',          'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6202', 'Perawatan & Servis Freezer',              'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6203', 'Perlengkapan Gudang (APD, Packaging)',    'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6204', 'Sewa Gudang & Cold Storage',              'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6205', 'Penyusutan Peralatan Gudang',             'EXPENSE', 'DEBIT', NULL, 3, FALSE),

-- 6.3 Beban Pengiriman / Distribusi
('6300', 'Beban Distribusi & Pengiriman',           'EXPENSE', 'DEBIT', NULL, 2, TRUE),
('6301', 'Bahan Bakar Armada Pendingin',            'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6302', 'Servis & Perawatan Armada',               'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6303', 'Penyusutan Kendaraan Armada',             'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6304', 'Biaya Ekspedisi / Jasa Pengiriman',       'EXPENSE', 'DEBIT', NULL, 3, FALSE),

-- 6.4 Beban Administrasi & Umum
('6400', 'Beban Administrasi & Umum',               'EXPENSE', 'DEBIT', NULL, 2, TRUE),
('6401', 'Alat Tulis Kantor & Cetak',               'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6402', 'Internet, Telepon & Komunikasi',          'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6403', 'Biaya Perizinan & Legal',                 'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6404', 'Asuransi Kargo / Barang Dagang',          'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6405', 'Amortisasi Software Sistem',              'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6406', 'Biaya Konsultan & Jasa Profesional',      'EXPENSE', 'DEBIT', NULL, 3, FALSE),

-- 6.5 Beban Keuangan
('6500', 'Beban Keuangan',                          'EXPENSE', 'DEBIT', NULL, 2, TRUE),
('6501', 'Beban Bunga Pinjaman Bank',               'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6502', 'Biaya Administrasi Bank',                 'EXPENSE', 'DEBIT', NULL, 3, FALSE),
('6503', 'Selisih Kurs',                            'EXPENSE', 'DEBIT', NULL, 3, FALSE);
```

---

## Matriks Jurnal Otomatis per Jenis Transaksi

### A. Transaksi INBOUND (Penerimaan Barang dari Supplier)

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Persediaan Barang Dagang — Es Krim | 1120 | **DEBIT** | Nilai Faktur Pembelian |
| Utang Usaha — Supplier Es Krim | 2101 | **KREDIT** | Nilai Faktur Pembelian |

> _Jika pembayaran tunai:_ Kredit ke **Kas/Bank (1101/1103)** bukan Utang Usaha.

---

### B. Transaksi OUTBOUND (Penjualan ke Pelanggan)

**Jurnal 1 — Pengakuan Pendapatan Penjualan:**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Piutang Usaha (sesuai kategori) | 1110–1114 | **DEBIT** | Total Nilai Jual |
| Penjualan Es Krim (sesuai kategori) | 4101–4104 | **KREDIT** | Total Nilai Jual |

> _Jika pembayaran tunai:_ Debit ke **Kas/Bank (1101/1103)** bukan Piutang Usaha.

**Jurnal 2 — Pengakuan HPP (FEFO-based Cost):**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Beban Pokok Penjualan (HPP) | 5101 | **DEBIT** | Qty PCS × cost_price_per_base_uom |
| Persediaan Barang Dagang — Es Krim | 1120 | **KREDIT** | Qty PCS × cost_price_per_base_uom |

---

### C. Transaksi SPOILAGE / Write-Off (Barang Rusak / Meleleh)

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Beban Kerugian Barang Rusak / Meleleh | 5201 | **DEBIT** | Qty × Harga Pokok |
| Persediaan Barang Dagang — Es Krim | 1120 | **KREDIT** | Qty × Harga Pokok |

---

### D. Transaksi EXPIRED (Barang Kedaluwarsa)

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Beban Kerugian Kedaluwarsa (Expired) | 5202 | **DEBIT** | Qty × Harga Pokok |
| Persediaan Barang Dagang — Es Krim | 1120 | **KREDIT** | Qty × Harga Pokok |

---

### E. Transaksi STOCK ADJUSTMENT (Selisih Opname)

**Jika stok fisik LEBIH BANYAK dari sistem (surplus):**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Persediaan Barang Dagang — Es Krim | 1120 | **DEBIT** | Selisih × Harga Pokok |
| Beban Selisih Stok (Susut Opname) | 5203 | **KREDIT** | Selisih × Harga Pokok |

**Jika stok fisik LEBIH SEDIKIT dari sistem (shrinkage):**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Beban Selisih Stok (Susut Opname) | 5203 | **DEBIT** | Selisih × Harga Pokok |
| Persediaan Barang Dagang — Es Krim | 1120 | **KREDIT** | Selisih × Harga Pokok |

---

### F. Transaksi RETUR PELANGGAN

**Barang kondisi BAIK (dapat dijual kembali):**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Retur Penjualan | 4110 | **DEBIT** | Nilai Jual Retur |
| Piutang Usaha | 1110 | **KREDIT** | Nilai Jual Retur |
| Persediaan Barang Dagang — Es Krim | 1120 | **DEBIT** | Nilai Pokok Retur |
| Beban Pokok Penjualan (HPP) | 5101 | **KREDIT** | Nilai Pokok Retur |

**Barang kondisi RUSAK (harus dimusnahkan):**

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Retur Penjualan | 4110 | **DEBIT** | Nilai Jual Retur |
| Piutang Usaha | 1110 | **KREDIT** | Nilai Jual Retur |
| Beban Kerugian Barang Rusak | 5201 | **DEBIT** | Nilai Pokok |
| Persediaan Barang Dagang — Es Krim | 1120 | **KREDIT** | Nilai Pokok |

---

### G. Pelunasan Utang Usaha ke Supplier

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Utang Usaha — Supplier Es Krim | 2101 | **DEBIT** | Nilai Pembayaran |
| Bank — Rekening Operasional | 1103 | **KREDIT** | Nilai Pembayaran |

---

### H. Penerimaan Pembayaran Piutang dari Pelanggan

| Akun | Kode | Posisi | Nilai |
|---|---|---|---|
| Bank — Rekening Operasional | 1103 | **DEBIT** | Nilai Pembayaran |
| Piutang Usaha (sesuai kategori) | 1110 | **KREDIT** | Nilai Pembayaran |

---

## Laporan Keuangan Standar yang Dihasilkan

### 1. Jurnal Umum (General Journal)
Menampilkan seluruh ayat jurnal kronologis dengan filter tanggal, jenis transaksi, dan nomor referensi.

### 2. Buku Besar (General Ledger)
Menampilkan mutasi debit/kredit per akun COA beserta saldo berjalan.

### 3. Neraca Saldo (Trial Balance)
Membuktikan Σ Total Debit = Σ Total Kredit dari seluruh akun yang aktif.

### 4. Laporan Laba Rugi (Income Statement)
```
Pendapatan Penjualan Bersih         Rp XXX.XXX.XXX
  (-) Retur Penjualan               Rp   X.XXX.XXX
  (-) Diskon Penjualan              Rp     XXX.XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Penjualan Neto                      Rp XXX.XXX.XXX
  (-) Harga Pokok Penjualan (HPP)   Rp  XX.XXX.XXX
  (-) Kerugian Barang Rusak/Expired Rp   X.XXX.XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LABA KOTOR                          Rp  XX.XXX.XXX
  (-) Beban Operasional             Rp  XX.XXX.XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LABA OPERASIONAL                    Rp  XX.XXX.XXX
  (+/-) Pendapatan/Beban Lain       Rp   X.XXX.XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LABA BERSIH SEBELUM PAJAK           Rp  XX.XXX.XXX
```

### 5. Neraca (Balance Sheet)
```
ASET                                    LIABILITAS & EKUITAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aset Lancar:                            Liabilitas Jangka Pendek:
  Kas & Bank         Rp XXX             Utang Usaha           Rp XXX
  Piutang Usaha      Rp XXX             Utang Gaji            Rp XXX
  Persediaan Es Krim Rp XXX             PPN Keluaran          Rp XXX
  Biaya Dibayar Dmk  Rp XXX
                                        Liabilitas Jangka Panjang:
Aset Tidak Lancar:                      Utang Bank            Rp XXX
  Peralatan (Neto)   Rp XXX
  Kendaraan (Neto)   Rp XXX             Ekuitas:
                                        Modal Disetor         Rp XXX
                                        Laba Ditahan          Rp XXX
                                        Laba Berjalan         Rp XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ASET             Rp XXX           TOTAL LIAB + EKUITAS  Rp XXX
```

