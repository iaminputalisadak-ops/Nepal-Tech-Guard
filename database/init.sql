-- Nepal TechGuard: Create database and all tables (run this first)
-- Run: mysql -u root -p < database/init.sql
-- Or with no password: mysql -u root < database/init.sql

CREATE DATABASE IF NOT EXISTS nepal_techguard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nepal_techguard;

-- Admin users (login: admin / password)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, email, password_hash, name) VALUES
('admin', 'admin@nepaltechguard.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin')
ON DUPLICATE KEY UPDATE username = username;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categories (id, name, slug, description, sort_order) VALUES
(1, 'Windows', 'windows', 'Windows 7, 8.1, 10 & 11 Pro, Home Retail and OEM', 1),
(2, 'MS Office', 'ms-office', 'Office 2016, 2019, 2021, 2024 Professional Plus', 2),
(3, 'Antivirus', 'antivirus', 'Quick Heal, Kaspersky, K7, McAfee and more', 3),
(4, 'Design & Editing', 'design-editing', 'Adobe Creative Cloud, Canva Pro', 4)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    description TEXT,
    image_url VARCHAR(500),
    price_min DECIMAL(10,2) DEFAULT 0,
    price_max DECIMAL(10,2) DEFAULT 0,
    original_price DECIMAL(10,2) NULL,
    discount_percent INT UNSIGNED DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT UNSIGNED DEFAULT 0,
    brand_name VARCHAR(100) NULL,
    region VARCHAR(50) DEFAULT 'Nepal',
    sold_count INT UNSIGNED DEFAULT 0,
    availability VARCHAR(50) DEFAULT 'In Stock',
    version_info VARCHAR(50) DEFAULT 'Latest',
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
);

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NULL,
    stock INT UNSIGNED DEFAULT 0,
    sku VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','paid','processing','delivered','cancelled') DEFAULT 'pending',
    payment_method VARCHAR(40) NULL,
    payment_status ENUM('unpaid','pending','paid','failed') NOT NULL DEFAULT 'unpaid',
    payment_reference VARCHAR(120) NULL,
    payment_proof_url VARCHAR(500) NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    variant_id INT UNSIGNED NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(150),
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id),
    INDEX idx_order (order_id)
);

-- Site settings (for footer / settings API)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT UNSIGNED PRIMARY KEY DEFAULT 1,
    settings_json JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (id, settings_json) VALUES (1, '{"contact_address":"Nepal TechGuard, Kathmandu, Nepal","contact_phone":"+977 9800000000","contact_email":"support@nepaltechguard.com","policy_links":[{"label":"Refund Policy","url":"/refund-policy"},{"label":"Privacy Policy","url":"/privacy-policy"},{"label":"Terms of Use","url":"/terms"},{"label":"Disclaimer","url":"/disclaimer"}],"info_links":[{"label":"About us","url":"/about"},{"label":"Contact us","url":"/contact"},{"label":"My Account","url":"/admin"},{"label":"Shop Page","url":"/"},{"label":"Blog","url":"/blog"}],"social_links":[{"platform":"facebook","label":"Facebook","url":"https://facebook.com"},{"platform":"instagram","label":"Instagram","url":"https://instagram.com"}],"company_name":"Nepal TechGuard","copyright_slogan":"Trusted Source for Genuine Keys","copyright_tagline":"Designed & Secured by","payment_methods":["UPI","Visa","MC","RuPay"]}')
ON DUPLICATE KEY UPDATE id = id;

-- Sample products (optional - so store has content)
INSERT INTO products (id, category_id, name, slug, short_description, price_min, price_max, original_price, discount_percent, rating, is_featured, is_active) VALUES
(1, 1, 'Windows 11 Pro Retail Key', 'windows-11-pro-retail', 'Lifetime license – instant delivery', 549, 549, 11489, 95, 4.8, 1, 1),
(2, 1, 'Windows 10 Pro Retail Key', 'windows-10-pro-retail', 'Genuine Windows 10 Pro – retail license', 549, 549, 8900, 94, 5.0, 1, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO product_variants (product_id, name, price, original_price)
SELECT p.id, 'Default', p.price_min, p.original_price FROM products p
WHERE p.id IN (1,2) AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);
