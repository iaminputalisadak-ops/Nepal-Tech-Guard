-- Add Enterprise category products with Windows 10 Enterprise LTSC 2021 box image
-- Run: Get-Content database/seed_enterprise_products.sql | C:\xampp\mysql\bin\mysql.exe -u root

USE nepal_techguard;

SET @img = '/Nepal-TechGuard/backend/uploads/windows-10-enterprise-ltsc-2021.png';
SET @cat_id = (SELECT id FROM categories WHERE slug = 'windows-enterprise' LIMIT 1);

INSERT INTO products (category_id, name, slug, short_description, description, image_url, price_min, price_max, brand_name, region, is_featured, is_active) VALUES
(@cat_id, 'Windows 10 Enterprise LTSC 2021 MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2021-mak-20pc', 'LTSC 2021 MAK, 20 PCs, 7 days warranty', 'Windows 10 Enterprise LTSC 2021 MAK (Multiple Activation Key). Volume license for 20 PCs. 7 days warranty to activate.', @img, 9000, 9000, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise LTSC 2019 MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2019-mak-20pc', 'LTSC 2019 MAK, 20 PCs, 7 days warranty', 'Windows 10 Enterprise LTSC 2019 MAK. Volume license for 20 PCs. 7 days warranty.', @img, 9600, 9600, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise LTSC 2019 N MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2019-n-mak-20pc', 'LTSC 2019 N MAK (no media), 20 PCs, 7 days', 'Windows 10 Enterprise LTSC 2019 N MAK – European edition without Media Player. 20 PCs. 7 days warranty.', @img, 9600, 9600, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise LTSC 2019 MAK Key (50 PC)', 'windows-10-enterprise-ltsc-2019-mak-50pc', 'LTSC 2019 MAK, 50 PCs, 7 days warranty', 'Windows 10 Enterprise LTSC 2019 MAK. Volume license for 50 PCs. 7 days warranty.', @img, 8400, 8400, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise LTSB 2016 MAK Key (20 PC)', 'windows-10-enterprise-ltsb-2016-mak-20pc', 'LTSB 2016 MAK, 20 PCs, 7 days warranty', 'Windows 10 Enterprise LTSB 2016 MAK. Long-Term Servicing Branch. 20 PCs. 7 days warranty.', @img, 8400, 8400, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise MAK Key (20 PC)', 'windows-10-enterprise-mak-20pc', 'Enterprise MAK, 20 PCs, 7 days warranty', 'Windows 10 Enterprise MAK volume license. 20 PCs. 7 days warranty to activate.', @img, 9600, 9600, 'Microsoft', 'Nepal', 0, 1),
(@cat_id, 'Windows 10 Enterprise MAK Key (50 PC)', 'windows-10-enterprise-mak-50pc', 'Enterprise MAK, 50 PCs, 7 days warranty', 'Windows 10 Enterprise MAK volume license. 50 PCs. 7 days warranty to activate.', @img, 12000, 12000, 'Microsoft', 'Nepal', 0, 1);

INSERT INTO product_variants (product_id, name, price, original_price, stock)
SELECT p.id, 'Default', p.price_min, p.original_price, 0
FROM products p
WHERE p.slug IN (
  'windows-10-enterprise-ltsc-2021-mak-20pc',
  'windows-10-enterprise-ltsc-2019-mak-20pc',
  'windows-10-enterprise-ltsc-2019-n-mak-20pc',
  'windows-10-enterprise-ltsc-2019-mak-50pc',
  'windows-10-enterprise-ltsb-2016-mak-20pc',
  'windows-10-enterprise-mak-20pc',
  'windows-10-enterprise-mak-50pc'
)
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);

-- Add image to Windows Enterprise category for home page
UPDATE categories SET image_url = @img WHERE slug = 'windows-enterprise';
