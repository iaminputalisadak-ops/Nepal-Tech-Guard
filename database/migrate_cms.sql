-- CMS Database Migration - All additional tables
-- Run: mysql -u root nepal_techguard < database/migrate_cms.sql

USE nepal_techguard;

-- Banners / Hero Slides
CREATE TABLE IF NOT EXISTS banners (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url VARCHAR(500) NOT NULL,
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_sort (is_active, sort_order)
);

-- Navigation Menus
CREATE TABLE IF NOT EXISTS menus (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) DEFAULT 'main',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    menu_id INT UNSIGNED NOT NULL,
    parent_id INT UNSIGNED DEFAULT 0,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(500) NOT NULL,
    target VARCHAR(20) DEFAULT '_self',
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    INDEX idx_menu (menu_id, sort_order)
);

-- Coupons / Promotions
CREATE TABLE IF NOT EXISTS coupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2) NULL,
    usage_limit INT UNSIGNED DEFAULT 0,
    usage_count INT UNSIGNED DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    starts_at DATETIME NULL,
    expires_at DATETIME NULL,
    applicable_categories JSON NULL,
    applicable_products JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_active (is_active)
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    password_hash VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    total_orders INT UNSIGNED DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_order_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Product Images (multi-image support)
CREATE TABLE IF NOT EXISTS product_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_main TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id, sort_order)
);

-- Product Tags
CREATE TABLE IF NOT EXISTS product_tags (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_tag_map (
    product_id INT UNSIGNED NOT NULL,
    tag_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES product_tags(id) ON DELETE CASCADE
);

-- Product SEO
CREATE TABLE IF NOT EXISTS product_seo (
    product_id INT UNSIGNED PRIMARY KEY,
    seo_title VARCHAR(255),
    seo_description TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url VARCHAR(500),
    canonical_url VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Category SEO
CREATE TABLE IF NOT EXISTS category_seo (
    category_id INT UNSIGNED PRIMARY KEY,
    seo_title VARCHAR(255),
    seo_description TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_url VARCHAR(500),
    canonical_url VARCHAR(500),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Homepage Sections (managed from CMS)
CREATE TABLE IF NOT EXISTS homepage_sections (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    section_type ENUM('featured_products', 'new_arrivals', 'best_sellers', 'flash_sale', 'promo_banner', 'category_grid', 'trust_bar', 'announcement') NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    config JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type_sort (section_type, sort_order)
);

-- Product Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255),
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    title VARCHAR(255),
    comment TEXT,
    is_approved TINYINT(1) DEFAULT 0,
    is_hidden TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id, is_approved)
);

-- Inventory Log
CREATE TABLE IF NOT EXISTS inventory_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NULL,
    variant_id INT UNSIGNED NULL,
    change_type ENUM('adjustment', 'order', 'restock') NOT NULL,
    quantity_change INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- Media Library
CREATE TABLE IF NOT EXISTS media (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes INT UNSIGNED,
    alt_text VARCHAR(255),
    uploaded_by INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_filename (filename)
);

-- Expand orders table with new fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(120) NULL AFTER notes;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url VARCHAR(500) NULL AFTER tracking_number;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at DATETIME NULL AFTER updated_at;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2) NULL AFTER cancelled_at;

-- Expand products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller TINYINT(1) DEFAULT 0 AFTER is_featured;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival TINYINT(1) DEFAULT 0 AFTER is_bestseller;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status ENUM('published', 'draft', 'hidden') DEFAULT 'published' AFTER is_active;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(50) NULL AFTER brand_name;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSON NULL AFTER sku;
ALTER TABLE products ADD COLUMN IF NOT EXISTS attributes JSON NULL AFTER tags;

-- Expand categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active TINYINT(1) DEFAULT 1 AFTER sort_order;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) NULL AFTER is_active;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS seo_description TEXT NULL AFTER seo_title;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id INT UNSIGNED DEFAULT 0 AFTER seo_description;

-- Homepage SEO in site_settings
UPDATE site_settings SET settings_json = JSON_SET(settings_json, '$.homepage_seo', JSON_OBJECT()) 
WHERE id = 1 AND JSON_EXTRACT(settings_json, '$.homepage_seo') IS NULL;

-- Default menus
INSERT IGNORE INTO menus (id, name, location) VALUES (1, 'Main Menu', 'main'), (2, 'Footer', 'footer');

-- Default homepage sections
INSERT IGNORE INTO homepage_sections (id, section_type, title, sort_order) VALUES
(1, 'featured_products', 'Featured Products', 1),
(2, 'best_sellers', 'Best Sellers', 2),
(3, 'new_arrivals', 'New Arrivals', 3),
(4, 'trust_bar', 'Why Choose Us', 4);

-- Default brands
INSERT IGNORE INTO brands (id, name, slug) VALUES (1, 'Microsoft', 'microsoft'), (2, 'Quick Heal', 'quick-heal'), (3, 'K7 Computing', 'k7-computing');
