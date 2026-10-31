# Spesifikasi REST API — Cold Chain WMS & ERP Lite
## Distributor Es Krim

> **Base URL:** `https://api.icecream-wms.com/api/v1`
> **Autentikasi:** Bearer Token (JWT) — header `Authorization: Bearer <token>`
> **Format:** JSON (`Content-Type: application/json`)
> **Versi API:** v1

---

## Konvensi Umum

### HTTP Status Code

| Code | Makna |
|---|---|
| `200 OK` | Request berhasil |
| `201 Created` | Resource berhasil dibuat |
| `400 Bad Request` | Validasi input gagal |
| `401 Unauthorized` | Token tidak valid / kedaluwarsa |
| `403 Forbidden` | Role tidak punya izin akses |
| `404 Not Found` | Resource tidak ditemukan |
| `409 Conflict` | Duplikasi data (misal: SKU sudah ada) |
| `422 Unprocessable Entity` | Logic bisnis gagal (misal: stok tidak cukup) |
| `500 Internal Server Error` | Kesalahan server |

### Format Response Sukses
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### Format Response Error
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stok tidak mencukupi untuk batch #B001",
    "details": [ ... ]
  }
}
```

### Query Parameter Pagination (semua endpoint GET list)
| Param | Default | Deskripsi |
|---|---|---|
| `page` | 1 | Halaman aktif |
| `limit` | 20 | Jumlah data per halaman (max: 100) |
| `search` | - | Pencarian teks bebas |
| `sort` | `created_at` | Field pengurutan |
| `order` | `desc` | `asc` atau `desc` |

---

## MODUL 0 — AUTENTIKASI

### `POST /auth/login`
Login dan dapatkan JWT token.

**Request Body:**
```json
{
  "username": "operator01",
  "password": "P@ssw0rd"
}
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJI...",
    "refresh_token": "dGhpcyBpcyBh...",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "full_name": "Ahmad Operator",
      "username": "operator01",
      "roles": ["OPERATOR_INBOUND"]
    }
  }
}
```

### `POST /auth/refresh`
Perbarui access token menggunakan refresh token.

**Request Body:** `{ "refresh_token": "..." }`

### `POST /auth/logout`
Revoke refresh token.

### `GET /auth/me`
Ambil profil user yang sedang login.

---

## MODUL 1 — MASTER DATA

### Master Produk
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/products` | Daftar produk | Semua |
| `GET` | `/products/:id` | Detail produk + UOM | Semua |
| `POST` | `/products` | Buat produk baru | ADMIN_SISTEM |
| `PUT` | `/products/:id` | Update produk | ADMIN_SISTEM |
| `DELETE` | `/products/:id` | Nonaktifkan produk | ADMIN_SISTEM |

**POST /products — Request Body:**
```json
{
  "sku": "ICE-CUP-001",
  "name": "Es Krim Cup Coklat 80ml",
  "category_id": 1,
  "brand": "SejukMart",
  "min_temp": -25.0,
  "max_temp": -18.0,
  "shelf_life_days": 365,
  "uoms": [
    { "uom_name": "DUS",  "conversion_factor": 24, "is_base_uom": false, "is_buying_uom": true,  "is_selling_uom": false },
    { "uom_name": "PACK", "conversion_factor": 6,  "is_base_uom": false, "is_buying_uom": false, "is_selling_uom": true  },
    { "uom_name": "PCS",  "conversion_factor": 1,  "is_base_uom": true,  "is_buying_uom": false, "is_selling_uom": true  }
  ]
}
```

### Master UOM
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/products/:id/uoms` | Daftar UOM produk | Semua |
| `POST` | `/products/:id/uoms` | Tambah UOM | ADMIN_SISTEM |
| `PUT` | `/products/:id/uoms/:uomId` | Update UOM | ADMIN_SISTEM |

### Master Lokasi Freezer
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/freezer-locations` | Daftar lokasi | Semua |
| `GET` | `/freezer-locations/:id` | Detail lokasi | Semua |
| `POST` | `/freezer-locations` | Tambah lokasi | ADMIN_SISTEM |
| `PUT` | `/freezer-locations/:id` | Update lokasi | ADMIN_SISTEM |

### Master Supplier
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/suppliers` | Daftar supplier | Semua |
| `GET` | `/suppliers/:id` | Detail supplier | Semua |
| `POST` | `/suppliers` | Tambah supplier | ADMIN_SISTEM |
| `PUT` | `/suppliers/:id` | Update supplier | ADMIN_SISTEM |

---

## MODUL 2 — PELANGGAN & HARGA

### Kategori Pelanggan
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/customer-categories` | Daftar kategori | Semua |
| `POST` | `/customer-categories` | Tambah kategori | ADMIN_SISTEM |
| `PUT` | `/customer-categories/:id` | Update kategori | ADMIN_SISTEM |

### Master Pelanggan
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/customers` | Daftar pelanggan | Semua |
| `GET` | `/customers/:id` | Detail pelanggan | Semua |
| `POST` | `/customers` | Tambah pelanggan | ADMIN_SISTEM |
| `PUT` | `/customers/:id` | Update pelanggan | ADMIN_SISTEM |

### Matriks Harga
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/prices` | Daftar harga (filter: product_id, category_id) | Semua |
| `POST` | `/prices` | Set harga baru | ADMIN_SISTEM |
| `PUT` | `/prices/:id` | Update harga | ADMIN_SISTEM |
| `GET` | `/prices/lookup` | Cari harga spesifik | Semua |

**GET /prices/lookup — Query Params:**
```
?product_id=1&uom_id=2&category_id=3
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "product_name": "Es Krim Cup Coklat 80ml",
    "uom_name": "PACK",
    "category_name": "General Trade",
    "price": 75000.00,
    "effective_date": "2026-10-01"
  }
}
```

---

## MODUL 3 — PURCHASE ORDER

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/purchase-orders` | Daftar PO (filter: status, supplier_id) | Semua |
| `GET` | `/purchase-orders/:id` | Detail PO + items | Semua |
| `POST` | `/purchase-orders` | Buat PO baru (status: DRAFT) | ADMIN_SISTEM, OPERATOR_INBOUND |
| `PUT` | `/purchase-orders/:id` | Update PO (jika DRAFT) | ADMIN_SISTEM |
| `PATCH` | `/purchase-orders/:id/confirm` | Konfirmasi PO → CONFIRMED | MANAJER_GUDANG |
| `PATCH` | `/purchase-orders/:id/cancel` | Batalkan PO | ADMIN_SISTEM |

**POST /purchase-orders — Request Body:**
```json
{
  "supplier_id": 1,
  "order_date": "2026-10-30",
  "expected_date": "2026-11-02",
  "notes": "Pesanan rutin mingguan",
  "items": [
    {
      "product_id": 1,
      "product_uom_id": 1,
      "ordered_qty": 100,
      "unit_price": 240000
    }
  ]
}
```

---

## MODUL 4 — INBOUND (PENERIMAAN BARANG)

### Penerimaan Barang dari PO
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/inbound` | Riwayat penerimaan | Semua |
| `GET` | `/inbound/:id` | Detail penerimaan + jurnal | Semua |
| `POST` | `/inbound` | Proses penerimaan barang | OPERATOR_INBOUND |

**POST /inbound — Request Body:**
```json
{
  "po_id": 1,
  "received_date": "2026-10-30",
  "truck_temp_celsius": -20.5,
  "qc_status": "APPROVED",
  "qc_notes": "Semua produk dalam kondisi baik, tidak ada tanda refreezing",
  "qc_photo_url": "https://storage.gcs.com/qc/foto-truk-001.jpg",
  "items": [
    {
      "po_item_id": 1,
      "product_id": 1,
      "batch_number": "BCH-2026-001",
      "production_date": "2026-09-01",
      "expired_date": "2027-09-01",
      "cost_price_per_base_uom": 10000,
      "received_qty": 50,
      "input_uom_id": 1,
      "freezer_location_id": 1
    }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "transaction_code": "TRX-IN-202610-0001",
    "status": "APPROVED",
    "total_qty_pcs": 1200,
    "journal_entry": {
      "entry_number": "JV-202610-0001",
      "description": "Penerimaan barang PO-202610-0001",
      "lines": [
        { "account_code": "1120", "account_name": "Persediaan Barang Dagang", "debit": 12000000, "credit": 0 },
        { "account_code": "2101", "account_name": "Utang Usaha — Supplier",   "debit": 0, "credit": 12000000 }
      ]
    }
  }
}
```

---

## MODUL 5 — INVENTORY MANAGEMENT

### Stok Real-time
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/inventory/stocks` | Posisi stok semua produk | Semua |
| `GET` | `/inventory/stocks/:productId` | Stok produk tertentu per batch & lokasi | Semua |
| `GET` | `/inventory/stocks/summary` | Ringkasan stok (total PCS + nilai) | Semua |
| `GET` | `/inventory/stocks/fefo` | Rekomendasi batch FEFO per produk | PETUGAS_GUDANG, OPERATOR_OUTBOUND |
| `GET` | `/inventory/stocks/near-expiry` | Produk mendekati kedaluwarsa (≤ 7 hari) | Semua |
| `GET` | `/inventory/stocks/view` | Tampilan toggle UOM (query: `?view=DUS/PACK/PCS/MIXED`) | Semua |

**GET /inventory/stocks/view?product_id=1&view=MIXED — Response:**
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Es Krim Cup Coklat 80ml",
    "total_qty_pcs": 1450,
    "display": "60 Dus 4 Pack 1 Pcs",
    "inventory_value": 14500000,
    "batches": [
      {
        "batch_number": "BCH-2026-001",
        "expired_date": "2027-09-01",
        "qty_pcs": 720,
        "location": "FRZ-A1"
      }
    ]
  }
}
```

### Breakdown / Repacking UOM
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `POST` | `/inventory/breakdown` | Breakdown UOM besar → kecil | PETUGAS_GUDANG |

**POST /inventory/breakdown — Request Body:**
```json
{
  "product_id": 1,
  "batch_id": 1,
  "freezer_location_id": 1,
  "from_uom_id": 1,
  "from_qty": 2,
  "to_uom_id": 3
}
```
> Sistem akan mengkonversi 2 DUS (= 48 PCS) dan mencatat transaksi BREAKDOWN.

### Log Suhu Harian
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/temperature-logs` | Riwayat log suhu (filter: location_id, date) | Semua |
| `POST` | `/temperature-logs` | Input log suhu harian | PETUGAS_GUDANG |
| `GET` | `/temperature-logs/anomalies` | Daftar log anomali suhu | MANAJER_GUDANG, OWNER |

**POST /temperature-logs — Request Body:**
```json
{
  "freezer_location_id": 1,
  "temperature_celsius": -20.5,
  "recorded_at": "2026-10-30T08:00:00",
  "notes": "Suhu normal, pintu freezer tertutup rapat"
}
```

### Stock Opname
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/stock-opnames` | Daftar opname | Semua |
| `POST` | `/stock-opnames` | Buat opname baru | MANAJER_GUDANG |
| `PUT` | `/stock-opnames/:id/items` | Input hasil hitung fisik | PETUGAS_GUDANG |
| `PATCH` | `/stock-opnames/:id/approve` | Approve opname → posting jurnal adjustment | MANAJER_GUDANG |

---

## MODUL 6 — SALES ORDER & OUTBOUND

### Sales Order
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/sales-orders` | Daftar SO (filter: status, customer_id) | Semua |
| `GET` | `/sales-orders/:id` | Detail SO + items | Semua |
| `POST` | `/sales-orders` | Buat SO baru (harga auto-fill) | OPERATOR_OUTBOUND |
| `PATCH` | `/sales-orders/:id/confirm` | Konfirmasi SO → generate Picking List | MANAJER_GUDANG |
| `PATCH` | `/sales-orders/:id/cancel` | Batalkan SO (jika belum picking) | OPERATOR_OUTBOUND, MANAJER_GUDANG |

**POST /sales-orders — Request Body:**
```json
{
  "customer_id": 5,
  "order_date": "2026-10-30",
  "requested_date": "2026-10-31",
  "payment_type": "CREDIT",
  "notes": "Kirim ke gudang utama pelanggan",
  "items": [
    {
      "product_id": 1,
      "product_uom_id": 2,
      "ordered_qty": 10
    }
  ]
}
```
**Response 201:** Harga otomatis ditarik dari `product_customer_prices` berdasarkan `customer.category_id`.

### Picking List
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/picking-lists` | Daftar picking list | Semua |
| `GET` | `/picking-lists/:id` | Detail picking list FEFO | PETUGAS_GUDANG |
| `PATCH` | `/picking-lists/:id/start` | Mulai proses picking | PETUGAS_GUDANG |
| `PATCH` | `/picking-lists/:id/complete` | Selesaikan picking → update stok & jurnal | PETUGAS_GUDANG |

**GET /picking-lists/:id — Response:**
```json
{
  "success": true,
  "data": {
    "pl_number": "PL-202610-0001",
    "so_number": "SO-202610-0001",
    "customer": "Minimarket Sejuk",
    "items": [
      {
        "product_name": "Es Krim Cup Coklat 80ml",
        "batch_number": "BCH-2026-001",
        "expired_date": "2027-09-01",
        "location": "FRZ-A1 Rak 1",
        "qty_to_pick_pcs": 60,
        "picked_pcs": 0
      }
    ]
  }
}
```

### Delivery Order
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/delivery-orders` | Daftar surat jalan | Semua |
| `POST` | `/delivery-orders` | Buat surat jalan dari SO | OPERATOR_OUTBOUND |
| `PATCH` | `/delivery-orders/:id/depart` | Konfirmasi keberangkatan + suhu truk | DRIVER |
| `PATCH` | `/delivery-orders/:id/deliver` | Konfirmasi pengiriman (POD) + foto | DRIVER |

**PATCH /delivery-orders/:id/deliver — Request Body:**
```json
{
  "received_by": "Pak Budi (Gudang Pelanggan)",
  "delivered_at": "2026-10-30T14:30:00",
  "pod_photo_url": "https://storage.gcs.com/pod/foto-pod-001.jpg",
  "notes": "Diterima lengkap, kondisi baik"
}
```

---

## MODUL 7 — RETUR & KARANTINA

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/returns` | Daftar retur | Semua |
| `GET` | `/returns/:id` | Detail retur | Semua |
| `POST` | `/returns` | Catat barang retur (langsung ke karantina) | OPERATOR_INBOUND, OPERATOR_OUTBOUND |
| `PATCH` | `/returns/:id/approve` | Proses disposisi retur | MANAJER_GUDANG |
| `PATCH` | `/returns/:id/dispose` | Write-off / musnahkan barang rusak | MANAJER_GUDANG |

**PATCH /returns/:id/dispose — Request Body:**
```json
{
  "disposition": "WRITE_OFF",
  "notes": "Produk meleleh total, tidak dapat dijual kembali",
  "disposal_date": "2026-10-30"
}
```
> Sistem otomatis membentuk jurnal: Debit **5201 Beban Kerugian** | Kredit **1120 Persediaan**.

---

## MODUL 8 — AKUNTANSI

### Chart of Accounts
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/accounts` | Daftar akun COA (tree/flat) | STAF_FINANCE, OWNER |
| `POST` | `/accounts` | Tambah akun baru | STAF_FINANCE |
| `PUT` | `/accounts/:id` | Update akun | STAF_FINANCE |
| `PATCH` | `/accounts/:id/toggle` | Aktifkan/nonaktifkan akun | STAF_FINANCE |

### Journal Entries
| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/journals` | Daftar jurnal (filter: date, type, reference) | STAF_FINANCE, OWNER |
| `GET` | `/journals/:id` | Detail jurnal + lines | STAF_FINANCE, OWNER |
| `POST` | `/journals` | Buat jurnal manual | STAF_FINANCE |
| `PATCH` | `/journals/:id/post` | Posting jurnal (is_posted=true) | STAF_FINANCE |
| `PATCH` | `/journals/:id/reverse` | Buat jurnal koreksi/balik | STAF_FINANCE |

**POST /journals — Request Body (Jurnal Manual):**
```json
{
  "transaction_date": "2026-10-30",
  "reference_type": "MANUAL",
  "description": "Pembayaran listrik freezer Oktober 2026",
  "lines": [
    { "account_id": 45, "description": "Beban Listrik Cold Storage", "debit_amount": 5000000, "credit_amount": 0 },
    { "account_id": 5,  "description": "Pembayaran via Bank BCA",   "debit_amount": 0, "credit_amount": 5000000 }
  ]
}
```

---

## MODUL 9 — LAPORAN KEUANGAN

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/reports/general-journal` | Jurnal Umum | STAF_FINANCE, OWNER |
| `GET` | `/reports/general-ledger` | Buku Besar per akun | STAF_FINANCE, OWNER |
| `GET` | `/reports/trial-balance` | Neraca Saldo | STAF_FINANCE, OWNER |
| `GET` | `/reports/income-statement` | Laporan Laba Rugi | STAF_FINANCE, OWNER |
| `GET` | `/reports/balance-sheet` | Neraca | STAF_FINANCE, OWNER |
| `GET` | `/reports/stock-mutation` | Laporan Mutasi Stok | Semua |
| `GET` | `/reports/temperature-log` | Log Suhu Harian | MANAJER_GUDANG, OWNER |

**Query Parameter Laporan Keuangan:**
```
?date_from=2026-10-01&date_to=2026-10-31&account_id=1120&format=json|pdf|excel
```

**GET /reports/income-statement?date_from=2026-10-01&date_to=2026-10-31 — Response:**
```json
{
  "success": true,
  "data": {
    "period": "Oktober 2026",
    "revenue": {
      "total_sales": 150000000,
      "sales_return": 2000000,
      "discount": 500000,
      "net_sales": 147500000
    },
    "cogs": {
      "hpp": 90000000,
      "spoilage_loss": 1500000,
      "total_cogs": 91500000
    },
    "gross_profit": 56000000,
    "operating_expenses": 20000000,
    "operating_profit": 36000000,
    "other_income": 500000,
    "net_profit": 36500000
  }
}
```

---

## MODUL 10 — DASBOR & ANALITIK

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Widget utama dasbor | Semua |
| `GET` | `/dashboard/stock-alerts` | Alert stok (near-expiry, low-stock) | MANAJER_GUDANG |
| `GET` | `/dashboard/temperature-status` | Status suhu realtime semua freezer | PETUGAS_GUDANG, MANAJER_GUDANG |
| `GET` | `/dashboard/finance-snapshot` | Snapshot keuangan (piutang, utang, profit) | STAF_FINANCE, OWNER |

**GET /dashboard/summary — Response:**
```json
{
  "success": true,
  "data": {
    "total_products_active": 25,
    "total_stock_pcs": 45230,
    "total_inventory_value": 452300000,
    "near_expiry_count": 3,
    "pending_so_count": 8,
    "today_sales_amount": 12500000,
    "today_received_qty_pcs": 5760,
    "freezer_anomaly_count": 0,
    "quarantine_qty_pcs": 240
  }
}
```

---

## MODUL 11 — NOTIFIKASI

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/notifications` | Notifikasi user aktif (filter: is_read) | Semua |
| `PATCH` | `/notifications/:id/read` | Tandai sudah dibaca | Semua |
| `PATCH` | `/notifications/read-all` | Tandai semua sudah dibaca | Semua |

**Mekanisme Pengiriman Notifikasi:**
- **WebSocket (Real-time):** Channel `/ws/notifications?token=<jwt>` — Push langsung ke browser/app saat anomali suhu atau near-expiry terdeteksi.
- **Background Job (Redis Bull Queue):** Scheduler cron harian pukul 06:00 untuk cek near-expiry (3 hari & 7 hari). Job diantrekan ke Redis dan diproses oleh worker.
- **In-App:** Notifikasi tersimpan di tabel `notifications` dan dapat dibaca via polling endpoint di atas.

---

## MODUL 12 — USER MANAGEMENT (Admin Sistem)

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| `GET` | `/users` | Daftar user | ADMIN_SISTEM |
| `GET` | `/users/:id` | Detail user | ADMIN_SISTEM |
| `POST` | `/users` | Buat user baru | ADMIN_SISTEM |
| `PUT` | `/users/:id` | Update data user | ADMIN_SISTEM |
| `PATCH` | `/users/:id/roles` | Assign / revoke role | ADMIN_SISTEM |
| `PATCH` | `/users/:id/toggle` | Aktifkan / nonaktifkan user | ADMIN_SISTEM |
| `PATCH` | `/users/:id/reset-password` | Reset password user | ADMIN_SISTEM |
| `GET` | `/roles` | Daftar role | ADMIN_SISTEM |

---

## Catatan Keamanan API

1. **Rate Limiting:** Max 100 request/menit per IP. Endpoint login max 5 request/menit.
2. **JWT Expiry:** Access token valid **1 jam**. Refresh token valid **7 hari**.
3. **HTTPS Only:** Seluruh komunikasi wajib menggunakan TLS 1.2+.
4. **Input Sanitization:** Semua input divalidasi dengan `class-validator` (NestJS) sebelum diproses.
5. **Audit Log:** Setiap operasi CREATE, UPDATE, DELETE dicatat ke tabel `activity_logs`.
6. **CORS:** Whitelist domain frontend yang diizinkan di environment variable `ALLOWED_ORIGINS`.

