-- Add Windows category products with images from Wikimedia Commons
-- Run: Get-Content database/seed_windows_products.sql | C:\xampp\mysql\bin\mysql.exe -u root

USE nepal_techguard;

-- Image URLs from Wikimedia Commons (public domain)
-- Windows 11 logo, Windows 10 logo, Windows 8 logo
SET @img_win11 = 'https://upload.wikimedia.org/wikipedia/commons/1/17/Windows11logo.png';
SET @img_win10 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Windows_10_Logo.svg/256px-Windows_10_Logo.svg.png';
SET @img_win8 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Windows_8_logo_and_wordmark_-_2012.svg/256px-Windows_8_logo_and_wordmark_-_2012.svg.png';

INSERT INTO products (category_id, name, slug, short_description, description, image_url, price_min, price_max, original_price, discount_percent, brand_name, region, is_featured, is_active) VALUES
(1, 'Windows 8.1 Pro Retail Key (1 PC)', 'windows-81-pro-retail-key-1pc', 'Genuine Windows 8.1 Pro – 1 PC, 30 days warranty', 'Original Windows 8.1 Professional Retail license key. Valid for 1 PC. 30 days warranty to activate.', @img_win8, 1000, 1000, NULL, 0, 'Microsoft', 'Nepal', 0, 1),
(1, 'Windows 10/11 Pro Retail Key (1 PC)', 'windows-10-11-pro-retail-key-1pc', 'Flash Sale – Windows 10 or 11 Pro Retail, 1 PC, 30 days', 'Upgrade to Windows 10 or 11 Pro with this genuine Retail key. Works on 1 PC. 30 days warranty. A flash sale!', @img_win11, 750, 750, NULL, 0, 'Microsoft', 'Nepal', 1, 1),
(1, 'Windows 10/11 Pro OEM Key (1 PC)', 'windows-10-11-pro-oem-key-1pc', 'Hot sale – OEM key, 90 days warranty', 'Windows 10 or 11 Pro OEM license. Binds to motherboard. 1 PC, 90 days warranty. Hot sale!', @img_win11, 2500, 2500, NULL, 0, 'Microsoft', 'Nepal', 1, 1),
(1, 'Windows 10 Education', 'windows-10-education', 'Windows 10 Education edition, 30 days warranty', 'Windows 10 Education for students and institutions. 30 days warranty to activate.', @img_win10, 6000, 6000, NULL, 0, 'Microsoft', 'Nepal', 0, 1),
(1, 'Windows 10 Workstation', 'windows-10-workstation', 'Windows 10 Workstation Pro, 30 days warranty', 'Windows 10 Workstation for power users and workstations. 30 days warranty.', @img_win10, 6000, 6000, NULL, 0, 'Microsoft', 'Nepal', 0, 1),
(1, 'Windows 10 Student', 'windows-10-student', 'Windows 10 Student edition, 30 days warranty', 'Windows 10 Student license for students. 30 days warranty to activate.', @img_win10, 10200, 10200, NULL, 0, 'Microsoft', 'Nepal', 0, 1),
(1, 'Windows 10/11 Pro N', 'windows-10-11-pro-n', 'Windows 10/11 Pro N (no media), 30 days warranty', 'Windows 10 or 11 Pro N edition – European version without Windows Media Player. 30 days warranty.', @img_win11, 7200, 7200, NULL, 0, 'Microsoft', 'Nepal', 0, 1)
;

-- Add variants for each product
INSERT INTO product_variants (product_id, name, price, original_price, stock)
SELECT p.id, 'Default', p.price_min, p.original_price, 0
FROM products p
WHERE p.slug IN (
  'windows-81-pro-retail-key-1pc',
  'windows-10-11-pro-retail-key-1pc',
  'windows-10-11-pro-oem-key-1pc',
  'windows-10-education',
  'windows-10-workstation',
  'windows-10-student',
  'windows-10-11-pro-n'
)
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);
