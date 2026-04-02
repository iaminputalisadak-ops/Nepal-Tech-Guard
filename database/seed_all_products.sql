-- Nepal TechGuard: Seed ALL products from price list
-- Run: mysql -u root -p nepal_techguard < database/seed_all_products.sql
-- Uses image: /Nepal-TechGuard/backend/uploads/windows-10-enterprise-ltsc-2021.png for ALL products

USE nepal_techguard;

SET @img = '/Nepal-TechGuard/backend/uploads/windows-10-enterprise-ltsc-2021.png';

-- 1. Add missing categories (Lumion, Parallel Desktop, Grammarly)
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Bundle Keys', 'bundle-keys', 'Windows multi-PC Retail and MAK keys', 2),
('Lumion', 'lumion', 'Lumion PRO and EDU keys', 41),
('Parallel Desktop', 'parallel-desktop', 'Parallels Desktop for Mac', 42),
('Grammarly', 'grammarly', 'Grammarly Edu and annual licenses', 43)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 2. Insert ALL products (category by slug lookup, skip empty rows)
-- Windows (1)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 7 Pro Retail Key', 'windows-7-pro-retail-key', 'Lifetime license, 7 days warranty', 499, 499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 7 Home Premium Lifetime Key', 'windows-7-home-premium-lifetime-key', 'Lifetime license, 7 days warranty', 499, 499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 7 Ultimate (Full Pack) 32/64 bit', 'windows-7-ultimate-full-pack-32-64-bit', 'Full pack license, 7 days warranty', 1499, 1499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 8.1 Pro Retail Key', 'windows-81-pro-retail-key', 'Lifetime license, 7 days warranty', 499, 499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 10 Pro Retail License Key', 'windows-10-pro-retail-license-key', 'Lifetime license, 7 days warranty', 549, 549, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 10 Pro OEM Product Key', 'windows-10-pro-oem-product-key', 'OEM license, 7 days warranty', 899, 899, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 10 Home Retail License Key', 'windows-10-home-retail-license-key', 'Lifetime license, 7 days warranty', 549, 549, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 11 Pro OEM Key', 'windows-11-pro-oem-key', 'OEM license, 7 days warranty', 899, 899, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 11 Pro Lifetime Retail Key', 'windows-11-pro-lifetime-retail-key', 'Lifetime license, 7 days warranty', 549, 549, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='windows' LIMIT 1), 'Windows 11 Home Retail License Key', 'windows-11-home-retail-license-key', 'Lifetime license, 7 days warranty', 549, 549, @img, 'Microsoft', 'Nepal', 0, 1);

-- Bundle Keys (32)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='bundle-keys' LIMIT 1), 'Windows 10/11 Home OEM Key (1 PC)', 'windows-10-11-home-oem-key-1pc', 'Home OEM key, 1 PC, 90 days warranty', 1200, 1200, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='bundle-keys' LIMIT 1), 'Windows 8.1 Pro Retail Key (5 PC)', 'windows-81-pro-retail-key-5pc', 'Genuine Windows 8.1 Pro - 5 PC, 7 days warranty', 7200, 7200, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='bundle-keys' LIMIT 1), 'Windows 11/10 Home Retail Key (5 PC)', 'windows-11-10-home-retail-key-5pc', 'Home Retail key for 5 PCs, 7 days warranty', 13200, 13200, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='bundle-keys' LIMIT 1), 'Windows 10/11 Pro MAK Key (20 PC)', 'windows-10-11-pro-mak-key-20pc', 'MAK volume key, 20 PCs, 7 days warranty', 19200, 19200, @img, 'Microsoft', 'Nepal', 0, 1);

-- Windows Enterprise (5)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise LTSC 2021 MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2021-mak-20pc', 'LTSC 2021 MAK, 20 PCs, 7 days warranty', 9000, 9000, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise LTSC 2019 MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2019-mak-20pc', 'LTSC 2019 MAK, 20 PCs, 7 days warranty', 9600, 9600, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise LTSC 2019 N MAK Key (20 PC)', 'windows-10-enterprise-ltsc-2019-n-mak-20pc', 'LTSC 2019 N MAK (no media), 20 PCs, 7 days', 9600, 9600, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise LTSC 2019 MAK Key (50 PC)', 'windows-10-enterprise-ltsc-2019-mak-50pc', 'LTSC 2019 MAK, 50 PCs, 7 days warranty', 8400, 8400, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise LTSB 2016 MAK Key (20 PC)', 'windows-10-enterprise-ltsb-2016-mak-20pc', 'LTSB 2016 MAK, 20 PCs, 7 days warranty', 8400, 8400, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise MAK Key (20 PC)', 'windows-10-enterprise-mak-20pc', 'Enterprise MAK, 20 PCs, 7 days warranty', 9600, 9600, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='windows-enterprise' LIMIT 1), 'Windows 10 Enterprise MAK Key (50 PC)', 'windows-10-enterprise-mak-50pc', 'Enterprise MAK, 50 PCs, 7 days warranty', 12000, 12000, @img, 'Microsoft', 'Nepal', 0, 1);

-- Microsoft 365 / Office 365 (6)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='microsoft-365-office-365' LIMIT 1), 'Office 365 Pro Plus - 5 Devices PC/MAC/MOBILE', 'office-365-pro-plus-5-devices', 'PC/MAC/Mobile - 5 devices, 7 days warranty', 349, 6499, @img, 'Microsoft', 'Nepal', 1, 1);

-- Office 2024 (7)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='office-2024' LIMIT 1), 'MS Office 2024 Home and Business Email Bind - PC/MAC', 'ms-office-2024-home-business-email-bind', 'Email bind license, 7 days warranty', 6499, 6499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='office-2024' LIMIT 1), 'Office 2024 Pro Plus Lifetime License Key', 'office-2024-pro-plus-lifetime-license-key', 'Lifetime validity, 7 days warranty', 649, 649, @img, 'Microsoft', 'Nepal', 1, 1);

-- Office 2021 (8)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='office-2021' LIMIT 1), 'MS Office 2021 Pro Plus', 'ms-office-2021-pro-plus', 'Lifetime - Word, Excel, PowerPoint, Outlook, 7 days warranty', 449, 699, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='office-2021' LIMIT 1), 'MS Office 2021 Pro Plus Email Bind License Key LIFETIME VALIDITY', 'ms-office-2021-pro-plus-email-bind-license', 'Email bind license, 7 days warranty', 2999, 2999, @img, 'Microsoft', 'Nepal', 0, 1);

-- Office 2019 (9)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='office-2019' LIMIT 1), 'MS Office 2019 Professional Plus Online Activation', 'ms-office-2019-professional-plus-online-activation', 'Online activation, 7 days warranty', 499, 499, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='office-2019' LIMIT 1), 'MS Office 2019 Professional Plus Email Bind License', 'ms-office-2019-professional-plus-email-bind', 'Email bind license, 7 days warranty', 1999, 1999, @img, 'Microsoft', 'Nepal', 0, 1);

-- Office 2016/2013/2010 (10)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='office-2016-2013-2010' LIMIT 1), 'Office 2016 Professional Plus License Key', 'office-2016-professional-plus-license-key', 'Lifetime license, 7 days warranty', 449, 449, @img, 'Microsoft', 'Nepal', 1, 1);

-- Project (11)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='project' LIMIT 1), 'MS Project 2019 License Key', 'ms-project-2019-license-key', 'Lifetime license, 7 days warranty', 449, 449, @img, 'Microsoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='project' LIMIT 1), 'MS Project 2024 Email Bind Key - PC', 'ms-project-2024-email-bind-key-pc', 'Email bind key, 7 days warranty', 1500, 2500, @img, 'Microsoft', 'Nepal', 1, 1);

-- Visio (12)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='visio' LIMIT 1), 'MS Visio 2024 Email Bind Key Lifetime Validity - PC/MAC', 'ms-visio-2024-email-bind-key', 'Email bind key, 7 days warranty', 1500, 2500, @img, 'Microsoft', 'Nepal', 1, 1),
((SELECT id FROM categories WHERE slug='visio' LIMIT 1), 'MS Visio License Key 2019 and 2021', 'ms-visio-license-key-2019-2021', 'Lifetime license, 7 days warranty', 449, 449, @img, 'Microsoft', 'Nepal', 0, 1);

-- Adobe Products (19)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='adobe-products' LIMIT 1), 'Adobe Creative Cloud All Apps (Email-Bind License)', 'adobe-creative-cloud-all-apps-email-bind', 'Email bind license, 7 days warranty', 9599, 9599, @img, 'Adobe', 'Nepal', 1, 1);

-- Design & Architecture (18)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='design-architecture-software' LIMIT 1), 'Canva Pro 1-Year Subscription (Email Activation)', 'canva-pro-1-year-subscription', '1 year subscription, 7 days warranty', 1499, 3199, @img, 'Canva', 'Nepal', 1, 1);

-- Antivirus & Security (21)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Quick Heal Total Security 1 User 1 Year', 'quick-heal-total-security-1-user-1-year', '1 PC, 1 year, 7 days warranty', 1299, 1299, @img, 'Quick Heal', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Quick Heal Total Security 1 User 3 Years', 'quick-heal-total-security-1-user-3-years', '1 PC, 3 years, 7 days warranty', 2199, 2199, @img, 'Quick Heal', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Quick Heal Total Security 1 User 3 Years Renewal', 'quick-heal-total-security-1-user-3-years-renewal', 'Renewal, 7 days warranty', 2199, 2199, @img, 'Quick Heal', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Quick Heal Total Security 1 User 1 Year Renewal', 'quick-heal-total-security-1-user-1-year-renewal', 'Renewal, 7 days warranty', 1299, 1299, @img, 'Quick Heal', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Quick Heal Antivirus Pro 1 Pc 1 Year', 'quick-heal-antivirus-pro-1-pc-1-year', '1 PC, 1 year, 7 days warranty', 499, 499, @img, 'Quick Heal', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'K7 Total Security 1 User 1 Year', 'k7-total-security-1-user-1-year', '1 PC, 1 year, 7 days warranty', 499, 499, @img, 'K7', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'K7 Antivirus Premium 1 Pc 1 Year', 'k7-antivirus-premium-1-pc-1-year', '1 PC, 1 year, 7 days warranty', 299, 299, @img, 'K7', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Net Protector Total Security 1 User 1 Year', 'net-protector-total-security-1-user-1-year', '1 PC, 1 year, 7 days warranty', 599, 599, @img, 'Net Protector', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Guardian Total Security 1 User 1 Year', 'guardian-total-security-1-user-1-year', '1 PC, 1 year, 7 days warranty', 749, 749, @img, 'Guardian', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='antivirus-security' LIMIT 1), 'Renew McAfee Total Protection 1 Pc 3 Years', 'renew-mcafee-total-protection-1-pc-3-years', '3 years renewal, 7 days warranty', 1799, 1799, @img, 'McAfee', 'Nepal', 0, 1);


-- Cloud Storage (17), Streaming (22), AI (26), Design (18), Accounting (24), Lumion, Parallel Desktop, Grammarly
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, region, is_featured, is_active) VALUES
((SELECT id FROM categories WHERE slug='cloud-storage' LIMIT 1), 'Google Drive Storage', 'google-drive-storage', 'Cloud storage plans, 7 days warranty', 0, 0, @img, 'Google', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='streaming-subscriptions' LIMIT 1), 'YouTube Premium', 'youtube-premium', 'YouTube Premium subscription, 7 days warranty', 2800, 2800, @img, 'YouTube', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='ai-others' LIMIT 1), 'ChatGPT Plus', 'chatgpt-plus', 'ChatGPT Plus subscription, 7 days warranty', 5800, 5800, @img, 'OpenAI', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='design-architecture-software' LIMIT 1), 'Archicad', 'archicad', 'Archicad 2D/3D for Mac and PC, 7 days warranty', 0, 0, @img, 'Graphisoft', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='accounting-software' LIMIT 1), 'QuickBooks Key', 'quickbooks-key', 'QuickBooks license key, 7 days warranty', 0, 0, @img, 'QuickBooks', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='lumion' LIMIT 1), 'Lumion PRO', 'lumion-pro', 'Lumion PRO key, 7 days warranty', 0, 0, @img, 'Lumion', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='parallel-desktop' LIMIT 1), 'Parallels Desktop for Mac', 'parallels-desktop-for-mac', 'Parallels Desktop for Mac, 7 days warranty', 5800, 5800, @img, 'Parallels', 'Nepal', 0, 1),
((SELECT id FROM categories WHERE slug='grammarly' LIMIT 1), 'Grammarly Premium', 'grammarly-premium', 'Grammarly Premium subscription, 7 days warranty', 2800, 2800, @img, 'Grammarly', 'Nepal', 0, 1);

-- 3. Add product_variants for each product (Default, price_min, 0 stock)
INSERT INTO product_variants (product_id, name, price, stock)
SELECT p.id, 'Default', p.price_min, 0
FROM products p
WHERE p.image_url = @img
AND NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);




