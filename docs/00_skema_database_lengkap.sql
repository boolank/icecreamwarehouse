-- ============================================================================
-- COLD CHAIN WMS & ERP LITE — SKEMA DATABASE LENGKAP (PostgreSQL)
-- Versi     : 2.1 (Audit Metadata, Soft-Delete & Data Change Tracking Lengkap)
-- Dibuat    : 2026-10-31
-- Deskripsi : DDL lengkap seluruh tabel sistem manajemen gudang distributor
--             es krim dengan metadata penelusuran perubahan data (*audit trail*),
--             pencatatan otomatis siapa & kapan data dibuat/diubah/dihapus,
--             serta modul akuntansi double-entry terintegrasi.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- EKSTENSI
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MODUL 0: RBAC — USER, ROLE, PERMISSION & AUDIT LOGS
-- ============================================================================

-- 0.1. Master Role (Peran Sistem)
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    role_code   VARCHAR(30) UNIQUE NOT NULL,
    -- Nilai: 'ADMIN_SISTEM', 'OPERATOR_INBOUND', 'OPERATOR_OUTBOUND',
    --        'PETUGAS_GUDANG', 'DRIVER', 'STAF_FINANCE', 'MANAJER_GUDANG',
    --        'OWNER'
    role_name   VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by  INT,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by  INT
);

-- 0.2. Master User
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    user_code     VARCHAR(30) UNIQUE NOT NULL,           -- e.g. 'USR-0001'
    full_name     VARCHAR(150) NOT NULL,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,                         -- bcrypt hash
    email         VARCHAR(150) UNIQUE,
    phone         VARCHAR(20),
    is_active     BOOLEAN DEFAULT TRUE,
    is_deleted    BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by    INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by    INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at    TIMESTAMP,
    deleted_by    INT REFERENCES users(id) ON DELETE SET NULL
);

-- Tambahkan foreign key created_by & updated_by pada roles setelah users terdefinisi
ALTER TABLE roles ADD CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE roles ADD CONSTRAINT fk_roles_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

-- 0.3. Relasi User ↔ Role (Many-to-Many)
CREATE TABLE user_roles (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE,
    role_id     INT REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);

-- 0.4. Refresh Token (untuk autentikasi JWT)
CREATE TABLE refresh_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN DEFAULT FALSE,
    revoked_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 0.5. Log Aktivitas User (Tingkat Aksi Pengguna)
CREATE TABLE activity_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     INT REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,  -- e.g. 'CREATE_INBOUND', 'APPROVE_SO', 'LOGIN'
    entity_type VARCHAR(50),            -- e.g. 'purchase_orders', 'sales_orders'
    entity_id   INT,
    detail      JSONB,                  -- payload ringkasan perubahan
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 0.6. Log Riwayat Perubahan Data Terperinci (Data Change Capture / Historical Audit Trail)
--      Mencatat data lama (old_values) dan data baru (new_values) per baris tabel
CREATE TABLE data_change_logs (
    id              BIGSERIAL PRIMARY KEY,
    table_name      VARCHAR(60) NOT NULL,          -- e.g. 'products', 'product_customer_prices'
    record_id       BIGINT NOT NULL,               -- Primary key dari baris yang diubah
    operation       VARCHAR(10) NOT NULL,          -- 'INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE'
    old_data        JSONB,                         -- Snapshot data sebelum perubahan
    new_data        JSONB,                         -- Snapshot data sesudah perubahan
    changed_columns TEXT[],                        -- Kolom-kolom yang mengalami perubahan
    changed_by      INT REFERENCES users(id) ON DELETE SET NULL,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================================
-- MODUL 1: MASTER DATA OPERASIONAL
-- ============================================================================

-- 1.1. Master Lokasi Freezer / Zona Penyimpanan
CREATE TABLE freezer_locations (
    id              SERIAL PRIMARY KEY,
    location_code   VARCHAR(20) UNIQUE NOT NULL,  -- e.g. 'FRZ-A1', 'FRZ-B2'
    location_name   VARCHAR(100) NOT NULL,         -- e.g. 'Freezer Zone A Rak 1'
    zone            VARCHAR(10),                   -- e.g. 'A', 'B', 'KARANTINA'
    capacity_pcs    INT,                           -- kapasitas maksimal dalam Pcs
    min_temp        DECIMAL(5,2) DEFAULT -25.0,
    max_temp        DECIMAL(5,2) DEFAULT -18.0,
    is_quarantine   BOOLEAN DEFAULT FALSE,         -- TRUE untuk zona karantina
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 1.2. Master Supplier / Prinsipal
CREATE TABLE suppliers (
    id              SERIAL PRIMARY KEY,
    supplier_code   VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'SUP-0001'
    name            VARCHAR(150) NOT NULL,
    contact_person  VARCHAR(100),
    phone           VARCHAR(20),
    email           VARCHAR(150),
    address         TEXT,
    npwp            VARCHAR(20),
    payment_term_days INT DEFAULT 30,              -- Jatuh tempo pembayaran (hari)
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 1.3. Master Kategori Produk
CREATE TABLE product_categories (
    id              SERIAL PRIMARY KEY,
    category_code   VARCHAR(20) UNIQUE NOT NULL,   -- e.g. 'ICE-CUP', 'ICE-BAR'
    category_name   VARCHAR(100) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 1.4. Master Produk (Es Krim)
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    sku             VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    category_id     INT REFERENCES product_categories(id) ON DELETE SET NULL,
    brand           VARCHAR(100),
    description     TEXT,
    min_temp        DECIMAL(5,2) DEFAULT -25.0,    -- Suhu penyimpanan minimum (°C)
    max_temp        DECIMAL(5,2) DEFAULT -18.0,    -- Suhu penyimpanan maksimum (°C)
    shelf_life_days INT,                           -- Umur simpan (hari) dari produksi
    image_url       TEXT,                          -- URL foto produk (S3/GCS)
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 1.5. Master UOM (Satuan) & Konversi Bertingkat per Produk
CREATE TABLE product_uoms (
    id                SERIAL PRIMARY KEY,
    product_id        INT REFERENCES products(id) ON DELETE CASCADE,
    uom_name          VARCHAR(20) NOT NULL,     -- e.g. 'DUS', 'PACK', 'PCS'
    conversion_factor INT NOT NULL,             -- Jumlah Base Unit (PCS) dalam 1 unit ini
                                                -- DUS=24, PACK=6, PCS=1
    is_base_uom       BOOLEAN DEFAULT FALSE,    -- TRUE hanya untuk PCS
    is_buying_uom     BOOLEAN DEFAULT FALSE,    -- Default UOM pembelian (DUS)
    is_selling_uom    BOOLEAN DEFAULT FALSE,    -- Default UOM penjualan
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by        INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by        INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_product_uom UNIQUE (product_id, uom_name),
    CONSTRAINT one_base_uom CHECK (conversion_factor > 0)
);


-- ============================================================================
-- MODUL 2: MASTER PELANGGAN & MATRIKS HARGA
-- ============================================================================

-- 2.1. Kategori Pelanggan
CREATE TABLE customer_categories (
    id              SERIAL PRIMARY KEY,
    category_code   VARCHAR(20) UNIQUE NOT NULL, -- 'MT', 'GT', 'HOREKA', 'AGEN'
    category_name   VARCHAR(100) NOT NULL,        -- 'Modern Trade', 'General Trade', dll.
    description     TEXT,
    discount_pct    DECIMAL(5,2) DEFAULT 0.00,   -- Diskon dasar kategori (%)
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 2.2. Master Pelanggan
CREATE TABLE customers (
    id              SERIAL PRIMARY KEY,
    customer_code   VARCHAR(30) UNIQUE NOT NULL,  -- e.g. 'CUST-0001'
    name            VARCHAR(150) NOT NULL,
    category_id     INT REFERENCES customer_categories(id) ON DELETE RESTRICT,
    pic_name        VARCHAR(100),                 -- Nama kontak PIC
    phone           VARCHAR(20),
    email           VARCHAR(150),
    address         TEXT,
    city            VARCHAR(100),
    npwp            VARCHAR(20),
    credit_limit    DECIMAL(15,2) DEFAULT 0.00,  -- Batas kredit
    payment_term_days INT DEFAULT 0,             -- TOP (Terms of Payment)
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 2.3. Matriks Harga Jual: Produk × UOM × Kategori Pelanggan
CREATE TABLE product_customer_prices (
    id              SERIAL PRIMARY KEY,
    product_id      INT REFERENCES products(id) ON DELETE CASCADE,
    product_uom_id  INT REFERENCES product_uoms(id) ON DELETE CASCADE,
    category_id     INT REFERENCES customer_categories(id) ON DELETE CASCADE,
    price           DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    effective_date  DATE DEFAULT CURRENT_DATE,
    expired_date    DATE,                         -- NULL = berlaku hingga diganti
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_product_uom_category_price
        UNIQUE (product_id, product_uom_id, category_id)
);


-- ============================================================================
-- MODUL 3: PEMBELIAN (PURCHASE ORDER)
-- ============================================================================

-- 3.1. Header Purchase Order
CREATE TABLE purchase_orders (
    id              SERIAL PRIMARY KEY,
    po_number       VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'PO-202610-0001'
    supplier_id     INT REFERENCES suppliers(id) ON DELETE RESTRICT,
    order_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_date   DATE,                          -- Estimasi tanggal kedatangan
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                    -- 'DRAFT' | 'CONFIRMED' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED'
    notes           TEXT,
    total_amount    DECIMAL(15,2) DEFAULT 0.00,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    approved_by     INT REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at    TIMESTAMP,
    cancelled_by    INT REFERENCES users(id) ON DELETE SET NULL
);

-- 3.2. Item Purchase Order
CREATE TABLE purchase_order_items (
    id              SERIAL PRIMARY KEY,
    po_id           INT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id      INT REFERENCES products(id) ON DELETE RESTRICT,
    product_uom_id  INT REFERENCES product_uoms(id) ON DELETE RESTRICT,
    ordered_qty     INT NOT NULL CHECK (ordered_qty > 0),
    received_qty    INT DEFAULT 0,                 -- Akumulasi jumlah diterima
    unit_price      DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    total_price     DECIMAL(15,2) GENERATED ALWAYS AS (ordered_qty * unit_price) STORED,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL
);


-- ============================================================================
-- MODUL 4: BATCH, INVENTARIS FISIK & MUTASI GUDANG
-- ============================================================================

-- 4.1. Batch & Expiry Produk (Dibuat saat Inbound)
CREATE TABLE product_batches (
    id                      SERIAL PRIMARY KEY,
    product_id              INT REFERENCES products(id) ON DELETE CASCADE,
    supplier_id             INT REFERENCES suppliers(id) ON DELETE SET NULL,
    batch_number            VARCHAR(50) NOT NULL,
    production_date         DATE,
    expired_date            DATE NOT NULL,
    cost_price_per_base_uom DECIMAL(12,2) NOT NULL CHECK (cost_price_per_base_uom >= 0),
                            -- Harga beli modal per PCS — wajib untuk HPP FEFO
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by              INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by              INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_product_batch UNIQUE (product_id, batch_number)
);

-- 4.2. Saldo Stok Fisik per Batch × Lokasi Freezer
--      Seluruh stok SELALU disimpan dalam Base Unit (PCS)
CREATE TABLE inventory_stocks (
    id                  SERIAL PRIMARY KEY,
    product_id          INT REFERENCES products(id) ON DELETE CASCADE,
    batch_id            INT REFERENCES product_batches(id) ON DELETE CASCADE,
    freezer_location_id INT REFERENCES freezer_locations(id) ON DELETE RESTRICT,
    quantity_in_base_uom INT NOT NULL DEFAULT 0 CHECK (quantity_in_base_uom >= 0),
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by          INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT unique_stock_batch_location UNIQUE (product_id, batch_id, freezer_location_id)
);

-- 4.3. Transaksi Mutasi Gudang (Ledger pergerakan fisik barang)
CREATE TABLE inventory_transactions (
    id                  BIGSERIAL PRIMARY KEY,
    transaction_code    VARCHAR(30) UNIQUE NOT NULL,  -- e.g. 'TRX-IN-202610-0001'
    transaction_type    VARCHAR(20) NOT NULL,
                        -- 'INBOUND' | 'OUTBOUND' | 'BREAKDOWN' | 'ADJUSTMENT'
                        -- | 'SPOILAGE' | 'RETURN_IN' | 'RETURN_OUT'
    reference_doc       VARCHAR(30),                  -- No. PO / SO / Retur terkait
    product_id          INT REFERENCES products(id) ON DELETE CASCADE,
    batch_id            INT REFERENCES product_batches(id) ON DELETE CASCADE,
    freezer_location_id INT REFERENCES freezer_locations(id) ON DELETE RESTRICT,
    customer_id         INT REFERENCES customers(id) ON DELETE SET NULL,
    supplier_id         INT REFERENCES suppliers(id) ON DELETE SET NULL,
    input_quantity      INT NOT NULL,
    input_uom_id        INT REFERENCES product_uoms(id) ON DELETE RESTRICT,
    qty_in_base_uom     INT NOT NULL,  -- input_quantity × conversion_factor
    unit_cost           DECIMAL(12,2), -- Harga pokok/modal per base UOM (untuk HPP)
    unit_price          DECIMAL(12,2), -- Harga jual per satuan input (Outbound)
    total_cost          DECIMAL(15,2), -- Nilai HPP = qty_in_base_uom × unit_cost
    total_amount        DECIMAL(15,2), -- Nilai jual = input_quantity × unit_price
    temp_check          DECIMAL(5,2),  -- Suhu saat transaksi (°C), opsional
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by          INT REFERENCES users(id) ON DELETE SET NULL
);

-- 4.4. Log Suhu Harian Cold Storage
CREATE TABLE temperature_logs (
    id                  BIGSERIAL PRIMARY KEY,
    freezer_location_id INT REFERENCES freezer_locations(id) ON DELETE CASCADE,
    recorded_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature_celsius DECIMAL(5,2) NOT NULL,
    recorded_by         INT REFERENCES users(id) ON DELETE SET NULL,
    is_anomaly          BOOLEAN GENERATED ALWAYS AS (
                            temperature_celsius > -18.0 OR temperature_celsius < -25.0
                        ) STORED,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4.5. Stock Opname (Penyesuaian Stok Fisik)
CREATE TABLE stock_opnames (
    id              SERIAL PRIMARY KEY,
    opname_code     VARCHAR(30) UNIQUE NOT NULL,  -- e.g. 'OPN-202610-001'
    opname_date     DATE NOT NULL,
    status          VARCHAR(20) DEFAULT 'DRAFT', -- 'DRAFT' | 'APPROVED' | 'POSTED' | 'CANCELLED'
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    approved_by     INT REFERENCES users(id) ON DELETE SET NULL
);

-- 4.6. Item Stock Opname
CREATE TABLE stock_opname_items (
    id                      SERIAL PRIMARY KEY,
    opname_id               INT REFERENCES stock_opnames(id) ON DELETE CASCADE,
    product_id              INT REFERENCES products(id) ON DELETE RESTRICT,
    batch_id                INT REFERENCES product_batches(id) ON DELETE RESTRICT,
    freezer_location_id     INT REFERENCES freezer_locations(id) ON DELETE RESTRICT,
    system_qty_base_uom     INT NOT NULL DEFAULT 0, -- Stok menurut sistem
    physical_qty_base_uom   INT NOT NULL DEFAULT 0, -- Stok fisik hasil hitung
    difference_base_uom     INT GENERATED ALWAYS AS (
                                physical_qty_base_uom - system_qty_base_uom
                            ) STORED,
    unit_cost               DECIMAL(12,2),          -- Untuk valuasi selisih
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by              INT REFERENCES users(id) ON DELETE SET NULL
);


-- ============================================================================
-- MODUL 5: PENJUALAN (SALES ORDER & DELIVERY)
-- ============================================================================

-- 5.1. Header Sales Order
CREATE TABLE sales_orders (
    id              SERIAL PRIMARY KEY,
    so_number       VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'SO-202610-0001'
    customer_id     INT REFERENCES customers(id) ON DELETE RESTRICT,
    order_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    requested_date  DATE,                          -- Tanggal pengiriman diminta
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                    -- 'DRAFT' | 'CONFIRMED' | 'PICKING' | 'PACKED'
                    -- | 'DELIVERED' | 'PARTIAL' | 'CANCELLED'
    payment_type    VARCHAR(20) DEFAULT 'CREDIT',  -- 'CASH' | 'CREDIT'
    due_date        DATE,                          -- Jatuh tempo (jika CREDIT)
    subtotal        DECIMAL(15,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount    DECIMAL(15,2) DEFAULT 0.00,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    approved_by     INT REFERENCES users(id) ON DELETE SET NULL,
    cancelled_at    TIMESTAMP,
    cancelled_by    INT REFERENCES users(id) ON DELETE SET NULL
);

-- 5.2. Item Sales Order
CREATE TABLE sales_order_items (
    id              SERIAL PRIMARY KEY,
    so_id           INT REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id      INT REFERENCES products(id) ON DELETE RESTRICT,
    product_uom_id  INT REFERENCES product_uoms(id) ON DELETE RESTRICT,
    ordered_qty     INT NOT NULL CHECK (ordered_qty > 0),
    delivered_qty   INT DEFAULT 0,
    unit_price      DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
                    -- Diambil otomatis dari product_customer_prices
    discount_pct    DECIMAL(5,2) DEFAULT 0.00,
    subtotal        DECIMAL(15,2) GENERATED ALWAYS AS (
                        ordered_qty * unit_price * (1 - discount_pct / 100)
                    ) STORED,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 5.3. Picking List (Instruksi Pengambilan Barang FEFO)
CREATE TABLE picking_lists (
    id              SERIAL PRIMARY KEY,
    pl_number       VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'PL-202610-0001'
    so_id           INT REFERENCES sales_orders(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
    assigned_to     INT REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    completed_at    TIMESTAMP,
    completed_by    INT REFERENCES users(id) ON DELETE SET NULL
);

-- 5.4. Item Picking List (per Batch FEFO)
CREATE TABLE picking_list_items (
    id                  SERIAL PRIMARY KEY,
    pl_id               INT REFERENCES picking_lists(id) ON DELETE CASCADE,
    so_item_id          INT REFERENCES sales_order_items(id) ON DELETE CASCADE,
    product_id          INT REFERENCES products(id) ON DELETE RESTRICT,
    batch_id            INT REFERENCES product_batches(id) ON DELETE RESTRICT,
    freezer_location_id INT REFERENCES freezer_locations(id) ON DELETE RESTRICT,
    qty_to_pick_base    INT NOT NULL,  -- Dalam PCS
    qty_picked_base     INT DEFAULT 0,
    is_done             BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.5. Surat Jalan / Delivery Order
CREATE TABLE delivery_orders (
    id              SERIAL PRIMARY KEY,
    do_number       VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'DO-202610-0001'
    so_id           INT REFERENCES sales_orders(id) ON DELETE RESTRICT,
    driver_id       INT REFERENCES users(id) ON DELETE SET NULL,
    vehicle_plate   VARCHAR(15),
    departure_temp  DECIMAL(5,2),                  -- Suhu truk saat berangkat (°C)
    departure_time  TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING' | 'DELIVERING' | 'DELIVERED' | 'FAILED'
    pod_photo_url   TEXT,                          -- Foto Proof of Delivery (S3)
    received_by     VARCHAR(100),                  -- Nama penerima di lokasi pelanggan
    delivered_at    TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL
);


-- ============================================================================
-- MODUL 6: RETUR & KARANTINA
-- ============================================================================

-- 6.1. Header Retur
CREATE TABLE return_orders (
    id              SERIAL PRIMARY KEY,
    return_number   VARCHAR(30) UNIQUE NOT NULL,   -- e.g. 'RTN-202610-0001'
    return_type     VARCHAR(20) NOT NULL,           -- 'CUSTOMER_RETURN' | 'SUPPLIER_CLAIM'
    so_id           INT REFERENCES sales_orders(id) ON DELETE SET NULL,
    customer_id     INT REFERENCES customers(id) ON DELETE SET NULL,
    supplier_id     INT REFERENCES suppliers(id) ON DELETE SET NULL,
    return_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    reason          TEXT,
    status          VARCHAR(20) DEFAULT 'QUARANTINE',
                    -- 'QUARANTINE' | 'APPROVED_CLAIM' | 'DISPOSED' | 'CANCELLED'
    disposition     VARCHAR(20),
                    -- 'RETURN_TO_SUPPLIER' | 'WRITE_OFF' | 'RESTOCK'
    total_value     DECIMAL(15,2) DEFAULT 0.00,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    approved_by     INT REFERENCES users(id) ON DELETE SET NULL
);

-- 6.2. Item Retur
CREATE TABLE return_order_items (
    id                      SERIAL PRIMARY KEY,
    return_id               INT REFERENCES return_orders(id) ON DELETE CASCADE,
    product_id              INT REFERENCES products(id) ON DELETE RESTRICT,
    batch_id                INT REFERENCES product_batches(id) ON DELETE RESTRICT,
    freezer_location_id     INT REFERENCES freezer_locations(id) ON DELETE RESTRICT,
                            -- Wajib di zona KARANTINA
    return_qty_base_uom     INT NOT NULL CHECK (return_qty_base_uom > 0),
    unit_cost               DECIMAL(12,2),
    total_cost              DECIMAL(15,2),
    condition               VARCHAR(30) DEFAULT 'DAMAGED',
                            -- 'DAMAGED' | 'MELTED' | 'NEAR_EXPIRED' | 'WRONG_ITEM' | 'GOOD'
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by              INT REFERENCES users(id) ON DELETE SET NULL
);


-- ============================================================================
-- MODUL 7: AKUNTANSI (DOUBLE-ENTRY BOOKKEEPING)
-- ============================================================================

-- 7.1. Master Bagan Akun (Chart of Accounts / COA)
CREATE TABLE chart_of_accounts (
    id              SERIAL PRIMARY KEY,
    account_code    VARCHAR(10) UNIQUE NOT NULL,
                    -- Struktur: [Tipe][Sub][Nomor]
                    -- 1xxx = Aset, 2xxx = Liabilitas, 3xxx = Ekuitas
                    -- 4xxx = Pendapatan, 5xxx = HPP, 6xxx = Beban Operasional
    account_name    VARCHAR(150) NOT NULL,
    account_type    VARCHAR(20) NOT NULL,
                    -- 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'COGS' | 'EXPENSE'
    normal_balance  VARCHAR(6) NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    parent_id       INT REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    level           SMALLINT DEFAULT 1, -- 1=Header, 2=Sub-header, 3=Detail
    is_header       BOOLEAN DEFAULT FALSE, -- Header tidak boleh diposting langsung
    is_active       BOOLEAN DEFAULT TRUE,
    is_deleted      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    deleted_at      TIMESTAMP,
    deleted_by      INT REFERENCES users(id) ON DELETE SET NULL
);

-- 7.2. Header Jurnal Transaksi Keuangan
CREATE TABLE journal_entries (
    id              SERIAL PRIMARY KEY,
    entry_number    VARCHAR(30) UNIQUE NOT NULL,  -- e.g. 'JV-202610-0001'
    transaction_date DATE NOT NULL,
    reference_type  VARCHAR(30) NOT NULL,
                    -- 'INBOUND' | 'OUTBOUND' | 'SPOILAGE' | 'ADJUSTMENT'
                    -- | 'RETURN' | 'OPNAME' | 'MANUAL' | 'REVERSAL'
    reference_id    INT,                          -- FK ke tabel transaksi sumber
    reference_code  VARCHAR(30),                  -- Nomor dokumen sumber
    description     TEXT,
    total_debit     DECIMAL(15,2) DEFAULT 0.00,
    total_credit    DECIMAL(15,2) DEFAULT 0.00,
    is_balanced     BOOLEAN GENERATED ALWAYS AS (total_debit = total_credit) STORED,
    is_posted       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by      INT REFERENCES users(id) ON DELETE SET NULL,
    posted_at       TIMESTAMP,
    posted_by       INT REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_balanced CHECK (total_debit = total_credit)
);

-- 7.3. Baris Ayat Jurnal (Debit & Kredit)
CREATE TABLE journal_lines (
    id              BIGSERIAL PRIMARY KEY,
    journal_id      INT REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id      INT REFERENCES chart_of_accounts(id) ON DELETE RESTRICT,
    description     TEXT,
    debit_amount    DECIMAL(15,2) DEFAULT 0.00 CHECK (debit_amount >= 0),
    credit_amount   DECIMAL(15,2) DEFAULT 0.00 CHECK (credit_amount >= 0),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_positive_amounts CHECK (debit_amount >= 0 AND credit_amount >= 0),
    CONSTRAINT check_non_zero        CHECK (debit_amount > 0 OR credit_amount > 0),
    CONSTRAINT check_one_side        CHECK (NOT (debit_amount > 0 AND credit_amount > 0))
);


-- ============================================================================
-- MODUL 8: NOTIFIKASI & SISTEM ALERT
-- ============================================================================

-- 8.1. Template Notifikasi
CREATE TABLE notification_types (
    id          SERIAL PRIMARY KEY,
    type_code   VARCHAR(50) UNIQUE NOT NULL,
    -- 'TEMP_ANOMALY' | 'NEAR_EXPIRED_7D' | 'NEAR_EXPIRED_3D'
    -- | 'LOW_STOCK' | 'SO_APPROVED' | 'PO_RECEIVED' | 'JOURNAL_UNBALANCED'
    description TEXT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8.2. Notifikasi per User
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    type_id         INT REFERENCES notification_types(id) ON DELETE CASCADE,
    recipient_id    INT REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    body            TEXT,
    entity_type     VARCHAR(50),   -- e.g. 'temperature_logs', 'product_batches'
    entity_id       INT,
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8.3. Konfigurasi Alert per Role (Siapa yang menerima alert apa)
CREATE TABLE notification_role_settings (
    id                  SERIAL PRIMARY KEY,
    notification_type_id INT REFERENCES notification_types(id) ON DELETE CASCADE,
    role_id             INT REFERENCES roles(id) ON DELETE CASCADE,
    is_enabled          BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_notif_role UNIQUE (notification_type_id, role_id)
);


-- ============================================================================
-- AUTOMATED TRIGGERS: AUTO-UPDATE TIMESTAMP & DATA CHANGE AUDIT LOG
-- ============================================================================

-- TRG-FN1: Otomatis memperbarui kolom updated_at = CURRENT_TIMESTAMP
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRG-FN2: Generic Change Data Capture (Audit Trail)
-- Merekam snapshot OLD dan NEW dalam format JSONB ke data_change_logs
CREATE OR REPLACE FUNCTION fn_audit_log_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_record_id  BIGINT;
    v_changed_by INT;
    v_op         VARCHAR(10);
    v_old_data   JSONB := NULL;
    v_new_data   JSONB := NULL;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        v_op := 'INSERT';
        v_record_id := NEW.id;
        v_new_data  := to_jsonb(NEW);
        -- Cari ID user dari created_by jika ada
        BEGIN
            v_changed_by := NEW.created_by;
        EXCEPTION WHEN OTHERS THEN
            v_changed_by := NULL;
        END;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_record_id := NEW.id;
        v_old_data  := to_jsonb(OLD);
        v_new_data  := to_jsonb(NEW);
        
        -- Deteksi apakah operasi berupa soft delete
        IF (v_old_data ? 'is_deleted' AND (OLD.is_deleted = FALSE OR OLD.is_deleted IS NULL) AND NEW.is_deleted = TRUE) THEN
            v_op := 'SOFT_DELETE';
        ELSE
            v_op := 'UPDATE';
        END IF;

        BEGIN
            v_changed_by := NEW.updated_by;
        EXCEPTION WHEN OTHERS THEN
            v_changed_by := NULL;
        END;
    ELSIF (TG_OP = 'DELETE') THEN
        v_op := 'DELETE';
        v_record_id := OLD.id;
        v_old_data  := to_jsonb(OLD);
        v_changed_by := NULL;
    END IF;

    INSERT INTO data_change_logs (
        table_name,
        record_id,
        operation,
        old_data,
        new_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        v_record_id,
        v_op,
        v_old_data,
        v_new_data,
        v_changed_by
    );

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Penerapan Trigger Auto-Updated_At ke Seluruh Tabel yang Memiliki updated_at
CREATE TRIGGER trg_set_updated_at_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_roles BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_freezer_locations BEFORE UPDATE ON freezer_locations FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_suppliers BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_product_categories BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_product_uoms BEFORE UPDATE ON product_uoms FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_customer_categories BEFORE UPDATE ON customer_categories FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_product_customer_prices BEFORE UPDATE ON product_customer_prices FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_purchase_orders BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_purchase_order_items BEFORE UPDATE ON purchase_order_items FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_product_batches BEFORE UPDATE ON product_batches FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_inventory_stocks BEFORE UPDATE ON inventory_stocks FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_stock_opnames BEFORE UPDATE ON stock_opnames FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_sales_orders BEFORE UPDATE ON sales_orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_sales_order_items BEFORE UPDATE ON sales_order_items FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_picking_lists BEFORE UPDATE ON picking_lists FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_picking_list_items BEFORE UPDATE ON picking_list_items FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_delivery_orders BEFORE UPDATE ON delivery_orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_return_orders BEFORE UPDATE ON return_orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_chart_of_accounts BEFORE UPDATE ON chart_of_accounts FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_set_updated_at_journal_entries BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- Penerapan Trigger Audit Trail ke Tabel-Tabel Master & Transaksional Kritis
CREATE TRIGGER trg_audit_products AFTER INSERT OR UPDATE OR DELETE ON products FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_product_uoms AFTER INSERT OR UPDATE OR DELETE ON product_uoms FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_product_customer_prices AFTER INSERT OR UPDATE OR DELETE ON product_customer_prices FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_customers AFTER INSERT OR UPDATE OR DELETE ON customers FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_suppliers AFTER INSERT OR UPDATE OR DELETE ON suppliers FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_freezer_locations AFTER INSERT OR UPDATE OR DELETE ON freezer_locations FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_chart_of_accounts AFTER INSERT OR UPDATE OR DELETE ON chart_of_accounts FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_purchase_orders AFTER INSERT OR UPDATE OR DELETE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_sales_orders AFTER INSERT OR UPDATE OR DELETE ON sales_orders FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_inventory_stocks AFTER INSERT OR UPDATE OR DELETE ON inventory_stocks FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();
CREATE TRIGGER trg_audit_journal_entries AFTER INSERT OR UPDATE OR DELETE ON journal_entries FOR EACH ROW EXECUTE FUNCTION fn_audit_log_changes();


-- ============================================================================
-- INDEKS PERFORMA & PENELUSURAN AUDIT
-- ============================================================================

-- Data Change Logs — audit trail cepat per tabel & record
CREATE INDEX idx_change_log_table_record ON data_change_logs(table_name, record_id);
CREATE INDEX idx_change_log_created_at   ON data_change_logs(created_at DESC);
CREATE INDEX idx_change_log_user         ON data_change_logs(changed_by);

-- Inventory Stocks — query stok per produk & batch (FEFO sort)
CREATE INDEX idx_inv_stocks_product      ON inventory_stocks(product_id);
CREATE INDEX idx_inv_stocks_batch        ON inventory_stocks(batch_id);
CREATE INDEX idx_inv_stocks_location     ON inventory_stocks(freezer_location_id);

-- Inventory Transactions — query mutasi per tipe & tanggal
CREATE INDEX idx_inv_trx_type            ON inventory_transactions(transaction_type);
CREATE INDEX idx_inv_trx_created         ON inventory_transactions(created_at DESC);
CREATE INDEX idx_inv_trx_product         ON inventory_transactions(product_id);

-- Product Batches — FEFO sort utama
CREATE INDEX idx_batch_expired           ON product_batches(expired_date ASC);
CREATE INDEX idx_batch_product           ON product_batches(product_id);

-- Temperature Logs — monitoring suhu per lokasi & waktu
CREATE INDEX idx_temp_log_location       ON temperature_logs(freezer_location_id);
CREATE INDEX idx_temp_log_recorded       ON temperature_logs(recorded_at DESC);
CREATE INDEX idx_temp_log_anomaly        ON temperature_logs(is_anomaly) WHERE is_anomaly = TRUE;

-- Sales Orders
CREATE INDEX idx_so_customer             ON sales_orders(customer_id);
CREATE INDEX idx_so_status               ON sales_orders(status);
CREATE INDEX idx_so_order_date           ON sales_orders(order_date DESC);

-- Journal Entries — laporan keuangan per tanggal
CREATE INDEX idx_journal_date            ON journal_entries(transaction_date DESC);
CREATE INDEX idx_journal_type            ON journal_entries(reference_type);
CREATE INDEX idx_journal_posted          ON journal_entries(is_posted);

-- Journal Lines — buku besar per akun
CREATE INDEX idx_jlines_account          ON journal_lines(account_id);
CREATE INDEX idx_jlines_journal          ON journal_lines(journal_id);

-- Notifications
CREATE INDEX idx_notif_recipient         ON notifications(recipient_id, is_read);
CREATE INDEX idx_notif_created           ON notifications(created_at DESC);


-- ============================================================================
-- VIEW BERGUNA
-- ============================================================================

-- V1. Posisi Stok Real-time (FEFO order) — Joined dengan batch & lokasi
CREATE OR REPLACE VIEW v_stock_position AS
SELECT
    p.id            AS product_id,
    p.sku,
    p.name          AS product_name,
    pb.id           AS batch_id,
    pb.batch_number,
    pb.expired_date,
    pb.cost_price_per_base_uom,
    fl.id           AS location_id,
    fl.location_code,
    fl.location_name,
    fl.is_quarantine,
    ist.quantity_in_base_uom AS qty_pcs,
    ist.updated_at
FROM inventory_stocks ist
JOIN products         p   ON p.id  = ist.product_id
JOIN product_batches  pb  ON pb.id = ist.batch_id
JOIN freezer_locations fl ON fl.id = ist.freezer_location_id
WHERE ist.quantity_in_base_uom > 0
  AND fl.is_quarantine = FALSE
  AND p.is_deleted = FALSE
ORDER BY pb.expired_date ASC;

-- V2. Ringkasan Stok per Produk (Total PCS, Nilai Persediaan)
CREATE OR REPLACE VIEW v_stock_summary AS
SELECT
    p.id            AS product_id,
    p.sku,
    p.name          AS product_name,
    SUM(ist.quantity_in_base_uom)                                         AS total_qty_pcs,
    SUM(ist.quantity_in_base_uom * pb.cost_price_per_base_uom)            AS total_inventory_value,
    MIN(pb.expired_date)                                                   AS nearest_expiry,
    COUNT(DISTINCT pb.id)                                                  AS active_batch_count
FROM inventory_stocks ist
JOIN products         p   ON p.id  = ist.product_id
JOIN product_batches  pb  ON pb.id = ist.batch_id
JOIN freezer_locations fl ON fl.id = ist.freezer_location_id
WHERE ist.quantity_in_base_uom > 0
  AND fl.is_quarantine = FALSE
  AND p.is_deleted = FALSE
GROUP BY p.id, p.sku, p.name;

-- V3. Trial Balance (Neraca Saldo) — Saldo per Akun dari Journal Lines
CREATE OR REPLACE VIEW v_trial_balance AS
SELECT
    coa.account_code,
    coa.account_name,
    coa.account_type,
    coa.normal_balance,
    COALESCE(SUM(jl.debit_amount),  0.00) AS total_debit,
    COALESCE(SUM(jl.credit_amount), 0.00) AS total_credit,
    CASE coa.normal_balance
        WHEN 'DEBIT'  THEN COALESCE(SUM(jl.debit_amount),  0) - COALESCE(SUM(jl.credit_amount), 0)
        WHEN 'CREDIT' THEN COALESCE(SUM(jl.credit_amount), 0) - COALESCE(SUM(jl.debit_amount),  0)
    END AS ending_balance
FROM chart_of_accounts coa
LEFT JOIN journal_lines  jl  ON jl.account_id  = coa.id
LEFT JOIN journal_entries je ON je.id           = jl.journal_id AND je.is_posted = TRUE
WHERE coa.is_active = TRUE AND coa.is_header = FALSE AND coa.is_deleted = FALSE
GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
ORDER BY coa.account_code;

-- V4. Produk Mendekati Kedaluwarsa (≤ 7 hari)
CREATE OR REPLACE VIEW v_near_expiry_stocks AS
SELECT
    p.sku,
    p.name          AS product_name,
    pb.batch_number,
    pb.expired_date,
    pb.expired_date - CURRENT_DATE  AS days_remaining,
    fl.location_code,
    SUM(ist.quantity_in_base_uom)   AS qty_pcs
FROM inventory_stocks ist
JOIN products        p   ON p.id  = ist.product_id
JOIN product_batches pb  ON pb.id = ist.batch_id
JOIN freezer_locations fl ON fl.id = ist.freezer_location_id
WHERE pb.expired_date <= CURRENT_DATE + INTERVAL '7 days'
  AND ist.quantity_in_base_uom > 0
  AND fl.is_quarantine = FALSE
  AND p.is_deleted = FALSE
GROUP BY p.sku, p.name, pb.batch_number, pb.expired_date, fl.location_code
ORDER BY pb.expired_date ASC;

-- V5. Riwayat Audit Jejak Perubahan Data Terakhir (*Audit Feed View*)
CREATE OR REPLACE VIEW v_recent_audit_trail AS
SELECT
    cl.id,
    cl.table_name,
    cl.record_id,
    cl.operation,
    u.full_name AS changed_by_name,
    u.username  AS changed_by_username,
    cl.old_data,
    cl.new_data,
    cl.created_at
FROM data_change_logs cl
LEFT JOIN users u ON u.id = cl.changed_by
ORDER BY cl.created_at DESC;


-- ============================================================================
-- FUNGSI UTILITAS
-- ============================================================================

-- FN1. Konversi Qty ke representasi bertingkat: "X Dus Y Pack Z Pcs"
CREATE OR REPLACE FUNCTION fn_format_uom_display(
    p_product_id    INT,
    p_qty_base      INT
) RETURNS TEXT AS $$
DECLARE
    v_dus_factor    INT;
    v_pack_factor   INT;
    v_dus           INT;
    v_pack          INT;
    v_pcs           INT;
    v_remainder     INT;
BEGIN
    SELECT conversion_factor INTO v_dus_factor
    FROM product_uoms WHERE product_id = p_product_id AND uom_name = 'DUS';

    SELECT conversion_factor INTO v_pack_factor
    FROM product_uoms WHERE product_id = p_product_id AND uom_name = 'PACK';

    IF v_dus_factor IS NULL OR v_pack_factor IS NULL THEN
        RETURN p_qty_base || ' Pcs';
    END IF;

    v_dus       := p_qty_base / v_dus_factor;
    v_remainder := p_qty_base MOD v_dus_factor;
    v_pack      := v_remainder / v_pack_factor;
    v_pcs       := v_remainder MOD v_pack_factor;

    RETURN v_dus || ' Dus ' || v_pack || ' Pack ' || v_pcs || ' Pcs';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- FN2. Generate nomor dokumen otomatis: PREFIX-YYYYMM-NNNN
CREATE OR REPLACE FUNCTION fn_generate_doc_number(
    p_prefix    VARCHAR,
    p_table     VARCHAR,
    p_col       VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_period    VARCHAR(6);
    v_seq       INT;
    v_result    VARCHAR;
BEGIN
    v_period := TO_CHAR(CURRENT_DATE, 'YYYYMM');
    EXECUTE format(
        'SELECT COALESCE(MAX(CAST(SPLIT_PART(%I, ''-'', 3) AS INT)), 0) + 1 FROM %I WHERE %I LIKE $1',
        p_col, p_table, p_col
    ) USING p_prefix || '-' || v_period || '-%' INTO v_seq;
    v_result := p_prefix || '-' || v_period || '-' || LPAD(v_seq::TEXT, 4, '0');
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- DATA AWAL (SEED) — ROLES
-- ============================================================================

INSERT INTO roles (role_code, role_name, description) VALUES
('ADMIN_SISTEM',       'Admin Sistem',          'Akses penuh ke seluruh konfigurasi sistem dan master data'),
('OPERATOR_INBOUND',   'Operator Inbound',       'Input penerimaan barang, batch, QC suhu'),
('OPERATOR_OUTBOUND',  'Operator Outbound',      'Input Sales Order, konfirmasi pengeluaran barang'),
('PETUGAS_GUDANG',     'Petugas Gudang',         'Picking, breakdown UOM, log suhu, stock opname'),
('DRIVER',             'Pengemudi / Driver',     'Konfirmasi pengiriman dan Proof of Delivery'),
('STAF_FINANCE',       'Staf Akuntansi/Finance', 'Akses modul akuntansi, jurnal, dan laporan keuangan'),
('MANAJER_GUDANG',     'Manajer Gudang',         'Supervisi operasional gudang dan laporan stok'),
('OWNER',              'Pemilik / Owner',        'Akses baca seluruh laporan keuangan dan dasbor eksekutif');

-- ============================================================================
-- DATA AWAL (SEED) — NOTIFICATION TYPES
-- ============================================================================

INSERT INTO notification_types (type_code, description) VALUES
('TEMP_ANOMALY',        'Suhu freezer melebihi atau di bawah batas ambang'),
('NEAR_EXPIRED_7D',     'Produk akan kedaluwarsa dalam 7 hari'),
('NEAR_EXPIRED_3D',     'Produk akan kedaluwarsa dalam 3 hari'),
('EXPIRED_TODAY',       'Produk kedaluwarsa hari ini'),
('LOW_STOCK',           'Stok produk di bawah batas minimum'),
('SO_CONFIRMED',        'Sales Order telah dikonfirmasi'),
('PO_RECEIVED',         'Purchase Order telah diterima sepenuhnya'),
('JOURNAL_UNBALANCED',  'Jurnal tidak seimbang — memerlukan koreksi'),
('RETURN_QUARANTINE',   'Barang retur masuk ke zona karantina');

-- ============================================================================
-- DATA AWAL (SEED) — FREEZER LOCATIONS
-- ============================================================================

INSERT INTO freezer_locations
    (location_code, location_name, zone, capacity_pcs, min_temp, max_temp, is_quarantine) VALUES
('FRZ-A1', 'Freezer Zone A - Rak 1',   'A', 5000, -25.0, -18.0, FALSE),
('FRZ-A2', 'Freezer Zone A - Rak 2',   'A', 5000, -25.0, -18.0, FALSE),
('FRZ-B1', 'Freezer Zone B - Rak 1',   'B', 5000, -25.0, -18.0, FALSE),
('FRZ-B2', 'Freezer Zone B - Rak 2',   'B', 5000, -25.0, -18.0, FALSE),
('FRZ-C1', 'Freezer Zone C - Rak 1',   'C', 3000, -25.0, -18.0, FALSE),
('KRN-01', 'Zona Karantina 1',          'KARANTINA', 1000, -18.0, -10.0, TRUE);

-- ============================================================================
-- DATA AWAL (SEED) — CUSTOMER CATEGORIES
-- ============================================================================

INSERT INTO customer_categories (category_code, category_name, description, discount_pct) VALUES
('MT',     'Modern Trade',  'Supermarket, Hypermarket, Minimarket chain',    0.00),
('GT',     'General Trade', 'Toko kelontong, warung, pengecer tradisional',  0.00),
('HOREKA', 'Horeka',        'Hotel, Restoran, Kafe',                         0.00),
('AGEN',   'Agen / Grosir', 'Agen distributor dan grosir wilayah',           5.00);

-- ============================================================================
-- AKHIR SKEMA
-- ============================================================================
