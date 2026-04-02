-- Add product specification fields for detail page (run if you have existing DB without these columns)
-- If you get "Duplicate column" error, that column exists - ignore and continue with other statements
USE nepal_techguard;

ALTER TABLE products ADD COLUMN brand_name VARCHAR(100) NULL;
ALTER TABLE products ADD COLUMN region VARCHAR(50) DEFAULT 'Nepal';
ALTER TABLE products ADD COLUMN sold_count INT UNSIGNED DEFAULT 0;
ALTER TABLE products ADD COLUMN availability VARCHAR(50) DEFAULT 'In Stock';
ALTER TABLE products ADD COLUMN version_info VARCHAR(50) DEFAULT 'Latest';
