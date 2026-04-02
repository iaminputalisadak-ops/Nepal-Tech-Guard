-- Add Bundle Keys category and products with Windows 8.1 Pro Retail box image
-- Run: Get-Content database/seed_bundle_keys.sql | C:\xampp\mysql\bin\mysql.exe -u root

USE nepal_techguard;

-- Image: Windows 8.1 Pro Retail Key box (in backend/uploads/)
-- Use relative path for XAMPP deployment
SET @img = '/Nepal-TechGuard/backend/uploads/windows-81-pro-retail-box.png';

-- Add Bundle Keys category if not exists
INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES ('Bundle Keys', 'bundle-keys', 'Windows multi-PC Retail and MAK keys', 2);

-- Get category ID
SET @cat_id = (SELECT id FROM categories WHERE slug = 'bundle-keys' LIMIT 1);

INSERT INTO products (category_id, name, slug, short_description, description, image_url, price_min, price_max, brand_name, region, is_featured, is_active) VALUES
(@cat_id, 'Windows 10/11 Home OEM Key (1 PC)', 'windows-10-11-home-oem-key-1pc', 'Home OEM key, 1 PC, 90 days warranty', 'Windows 10 or 11 Home OEM license. Binds to motherboard. 1 PC. 90 days warranty to activate.', @img, 1200, 1200, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 8.1 Pro Retail Key (5 PC)', 'windows-81-pro-retail-key-5pc', 'Genuine Windows 8.1 Pro – 5 PC, 7 days warranty', 'Original Windows 8.1 Professional Retail license. Valid for 5 PCs. 7 days warranty to activate.', @img, 7200, 7200, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 11/10 Home Retail Key (5 PC)', 'windows-11-10-home-retail-key-5pc', 'Home Retail key for 5 PCs, 7 days warranty', 'Windows 10 or 11 Home Retail license. Valid for 5 PCs. 7 days warranty.', @img, 13200, 13200, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10/11 Pro MAK Key (20 PC)', 'windows-10-11-pro-mak-key-20pc', 'MAK volume key, 20 PCs, 7 days warranty', 'Windows 10/11 Pro MAK (Multiple Activation Key). Volume license for 20 PCs. 7 days warranty.', @img, 19200, 19200, 'Microsoft', 'Nepal', 0, 1);

-- Add variants
INSERT INTO product_variants (product_id, name, price, original_price, stock)
SELECT p.id, 'Default', p.price_min, p.original_price, 0
FROM products p
WHERE p.slug IN (
  'windows-10-11-home-oem-key-1pc',
  'windows-81-pro-retail-key-5pc',
  'windows-11-10-home-retail-key-5pc',
  'windows-10-11-pro-mak-key-20pc'
)
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

-- Add image to Bundle Keys category for home page
UPDATE categories SET image_url = @img WHERE slug = 'bundle-keys';
