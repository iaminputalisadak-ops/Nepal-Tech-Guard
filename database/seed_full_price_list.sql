-- Full price list seed - ALL products with Windows 10 Enterprise image
-- Run: Get-Content database/seed_full_price_list.sql | C:\xampp\mysql\bin\mysql.exe -u root
-- Place: windows-10-enterprise-ltsc-2021.png in backend/uploads/
-- Uses: /Nepal-TechGuard/backend/uploads/windows-10-enterprise-ltsc-2021.png for ALL

USE nepal_techguard;
SET @img = '/Nepal-TechGuard/backend/uploads/windows-10-enterprise-ltsc-2021.png';

-- 1. Update ALL existing products to use the image
UPDATE products SET image_url = @img;

-- 2. Add missing categories
INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES
('Bundle Keys', 'bundle-keys', 'Windows multi-PC keys', 2),
('Lumion', 'lumion', 'Lumion PRO and EDU', 40),
('Parallel Desktop', 'parallel-desktop', 'Parallels Desktop for Mac', 41),
('Grammarly', 'grammarly', 'Grammarly licenses', 42),
('InVideo', 'invideo', 'InVideo subscriptions', 43),
('Canva', 'canva', 'Canva Pro and Edu', 44),
('Nitro', 'nitro', 'Nitro Pro PDF', 45),
('Other', 'other', 'IBM SPSS, MATLAB, and more', 46);

-- 3. Windows - add windows 10/11 Home OEM (1 PC) if missing
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows 10/11 Home OEM Key (1 PC)', 'windows-10-11-home-oem-1pc', '1 PC, 90 days warranty', 1200, 1200, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='windows' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='windows-10-11-home-oem-1pc') LIMIT 1;

-- Office 365
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 A3 5 users PC/Mac (Account+Password)', 'office-365-a3-5-users', 'Desktop apps, no OneDrive, lifetime', 600, 600, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-a3-5-users') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 E3 (Onedrive 5TB) Account + password', 'office-365-e3-onedrive-5tb', 'E3 with 5TB OneDrive, lifetime', 15000, 15000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-e3-onedrive-5tb') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 E3 MSDN Administrator account with 25 users', 'office-365-e3-msdn-25-users', 'MSDN Admin, 25 users, lifetime', 360000, 360000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-e3-msdn-25-users') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 Personal 1TB 1Year (Key to Extend)', 'office-365-personal-1tb-1year', 'Extend account/email, 1 year', 13500, 13500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-personal-1tb-1year') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 Family 6 users 6TB 1Year Global license', 'office-365-family-6users-6tb-1year', '6 users, 6TB, 1 year', 24000, 24000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-family-6users-6tb-1year') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 365 Family 6 users 6TB 1Year (key to Extend)', 'office-365-family-6users-extend', 'Key to extend account, 1 year', 15000, 15000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-365-family-6users-extend') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Microsoft 365 Business Premium Global Admin 10 users', 'microsoft-365-business-premium-10users', '10 users 1TB+, 300 basic, lifetime', 150000, 150000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='microsoft-365-office-365' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='microsoft-365-business-premium-10users') LIMIT 1;

-- VMware
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'VMware workstation pro 17 lifelong key for windows', 'vmware-workstation-pro-17', 'Lifetime key for Windows', 1200, 1200, @img, 'VMware', 0, 1 FROM categories c WHERE c.slug='vmware-virtualization' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='vmware-workstation-pro-17') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'VMware Fusion Pro 13 lifelong key for mac', 'vmware-fusion-pro-13-mac', 'Lifetime key for Mac', 1200, 1200, @img, 'VMware', 0, 1 FROM categories c WHERE c.slug='vmware-virtualization' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='vmware-fusion-pro-13-mac') LIMIT 1;

-- Power BI
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Power Bi account for lifetime', 'power-bi-account-lifetime', 'Lifetime account', 2700, 2700, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='power-bi' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='power-bi-account-lifetime') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Power Bi Pro account for lifetime', 'power-bi-pro-lifetime', 'Pro lifetime account', 6000, 6000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='power-bi' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='power-bi-pro-lifetime') LIMIT 1;

-- Office 2024
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2024 Home and Business win /mac', 'office-2024-home-business-win-mac', 'Win/Mac, 30 days warranty', 54000, 54000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2024' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2024-home-business-win-mac') LIMIT 1;

-- Office 2021
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2024 Home and Student win /mac', 'office-2024-home-student-win-mac', 'Win/Mac, 3 days warranty', 45000, 45000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2024' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2024-home-student-win-mac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 professional plus phone key', 'office-2021-pro-plus-phone-key', 'Phone key, 3 days warranty', 900, 900, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-pro-plus-phone-key') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Professional Plus Key (1 PC)', 'office-2021-pro-plus-1pc-flash', 'Flash Sale, 7 days warranty', 5400, 5400, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-pro-plus-1pc-flash') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Professional Plus Key (5 PC)', 'office-2021-pro-plus-5pc', '5 PC, 7 days warranty', 16200, 16200, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-pro-plus-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Professional Plus Key (1 PC Bind Account)', 'office-2021-pro-plus-1pc-bind', 'Bind Account, 7 days warranty', 13500, 13500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-pro-plus-1pc-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Home Business Key 1 PC/Mac (Bind Account)', 'office-2021-home-business-1pc-mac-bind', 'Excl Japan, China, Brazil. 30 days', 81000, 81000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-home-business-1pc-mac-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Home Business Key (1 MAC Bind Account)', 'office-2021-home-business-mac-bind', '1 MAC Bind, 7 days warranty', 11050, 11050, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-home-business-mac-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2021 Home Student Key (1 PC Bind Account)', 'office-2021-home-student-1pc-bind', '1 PC Bind, 90 days warranty', 47250, 47250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2021' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2021-home-student-1pc-bind') LIMIT 1;

-- Office 2019
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Professional Plus Key (1 PC) Retail', 'office-2019-pro-plus-1pc-retail', 'Retail, 7 days, Hot sale', 3600, 3600, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-pro-plus-1pc-retail') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Professional Plus Key (1 PC Bind Account)', 'office-2019-pro-plus-1pc-bind', 'Bind Account, 7 days', 11700, 11700, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-pro-plus-1pc-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 professional plus key for 5 devices', 'office-2019-pro-plus-5-devices', '5 devices, 7 days', 11700, 11700, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-pro-plus-5-devices') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Home Business Key 1 PC/Mac (Bind Account)', 'office-2019-home-business-1pc-mac-bind', 'Excl Japan, Brazil. 7 days', 45000, 45000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-home-business-1pc-mac-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Home Business Key (1 PC)', 'office-2019-home-business-1pc', '1 PC, 30 days', 13500, 13500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-home-business-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Home Business Key (1 MAC Bind Account)', 'office-2019-home-business-mac-bind', '1 MAC Bind, 7 days, Hot sale', 7800, 7800, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-home-business-mac-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2019 Home Student Key (1 PC Bind Account)', 'office-2019-home-student-1pc-bind', '1 PC Bind, 30 days', 23400, 23400, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2019' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2019-home-student-1pc-bind') LIMIT 1;

-- Office 2016/2013/2010
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2016 professional plus bind for windows', 'office-2016-pro-plus-bind-windows', 'Bind Windows, 7 days, Hot sale', 8550, 8550, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2016-pro-plus-bind-windows') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2016 Professional Plus Key (5 PC)', 'office-2016-pro-plus-5pc', '5 PC, 7 days, Hot sale', 6750, 6750, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2016-pro-plus-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2016 Home Business Key (1 MAC Bind Account)', 'office-2016-home-business-mac-bind', '1 MAC Bind, 7 days', 6300, 6300, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2016-home-business-mac-bind') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2016 Home Student Key (1 PC)', 'office-2016-home-student-1pc', '1 PC, 30 days', 3060, 3060, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2016-home-student-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2013 Professional Plus Key (5 PC)', 'office-2013-pro-plus-5pc', '5 PC, 7 days', 5400, 5400, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2013-pro-plus-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Office 2010 Professional Plus Key (5 PC)', 'office-2010-pro-plus-5pc', '5 PC, 7 days', 5400, 5400, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='office-2016-2013-2010' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='office-2010-pro-plus-5pc') LIMIT 1;

-- Project
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project standard 2024 (5 pc)', 'project-standard-2024-5pc', '5 PC, 7 days', 27000, 27000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-standard-2024-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project pro 2024 Bind key for 1 pc', 'project-pro-2024-bind-1pc', 'Bind 1 PC, 7 days', 15750, 15750, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2024-bind-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project Professional 2021 Key (2 PC)', 'project-pro-2021-2pc', '2 PC, 7 days', 2250, 2250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2021-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project Professional 2021 Key (5 PC)', 'project-pro-2021-5pc', '5 PC, 7 days', 2700, 2700, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2021-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project professional 2019 bind key 1 PC', 'project-pro-2019-bind-1pc', 'Bind 1 PC, 7 days, Hot sale', 3150, 3150, @img, 'Microsoft', 1, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2019-bind-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project Professional 2019 Key (2 PC)', 'project-pro-2019-2pc', '2 PC, 30 days', 1800, 1800, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2019-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Project Professional 2016 Key (2 PC)', 'project-pro-2016-2pc', '2 PC, 30 days', 1800, 1800, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='project' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='project-pro-2016-2pc') LIMIT 1;

-- Visio
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2024 Key (5 PC)', 'visio-pro-2024-5pc', '5 PC, 7 days', 27000, 27000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2024-5pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2024 Bind Key for 1 pc', 'visio-pro-2024-bind-1pc', 'Bind 1 PC, 7 days', 15750, 15750, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2024-bind-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2021 Key (2 PC)', 'visio-pro-2021-2pc', '2 PC, 7 days', 1800, 1800, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2021-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2019 Bind Key 1 PC', 'visio-pro-2019-bind-1pc', 'Bind 1 PC, 7 days', 3600, 3600, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2019-bind-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2019 Key (2 PC)', 'visio-pro-2019-2pc', '2 PC, 30 days', 2025, 2025, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2019-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Visio Professional 2016 Key (2 PC)', 'visio-pro-2016-2pc', '2 PC, 30 days', 2250, 2250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='visio' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='visio-pro-2016-2pc') LIMIT 1;

-- Access
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Access 2016 Key (2 PC)', 'access-2016-2pc', '2 PC, 30 days', 2250, 2250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='access' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='access-2016-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Access 2021 Key (2 PC)', 'access-2021-2pc', '2 PC, 30 days', 2700, 2700, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='access' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='access-2021-2pc') LIMIT 1;

-- Server & SQL
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'SQL Server 2019 Enterprise', 'sql-server-2019-enterprise', '30 days warranty', 4500, 4500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='sql-server-2019-enterprise') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'SQL Server 2010/2013/2016/2019 Standard Retail Key (1 PC)', 'sql-server-standard-retail-1pc', '30 days warranty', 9000, 9000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='sql-server-standard-retail-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'SQL Server 2022 standard Retail Key (1 PC)', 'sql-server-2022-standard-1pc', '7 days warranty', 37500, 37500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='sql-server-2022-standard-1pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Server 2025 Standard/Datacenter Retail Key (2 PC)', 'server-2025-standard-datacenter-2pc', '7 days warranty', 13500, 13500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2025-standard-datacenter-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Server 2022 Standard/Datacenter Retail Key (2 PC)', 'server-2022-standard-datacenter-2pc', '7 days warranty', 5250, 5250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2022-standard-datacenter-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Server 2021 Standard/Datacenter Retail Key (2 PC)', 'server-2021-standard-datacenter-2pc', '7 days warranty', 5250, 5250, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2021-standard-datacenter-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Server 2019 Standard/Datacenter/Essential Retail Key (2 PC)', 'server-2019-standard-datacenter-2pc', '7 days warranty', 4500, 4500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2019-standard-datacenter-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Server 2016 Standard/Datacenter/Essential Retail Key (2 PC)', 'server-2016-standard-datacenter-2pc', '30 days warranty', 4500, 4500, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2016-standard-datacenter-2pc') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2022 RDS 50 CAL', 'server-2022-rds-50-cal', 'Device/User CAL, 30 days', 6300, 9000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2022-rds-50-cal') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2019 RDS 50 CAL', 'server-2019-rds-50-cal', '7 days warranty', 9000, 9000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2019-rds-50-cal') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2016 RDS 50 CAL', 'server-2016-rds-50-cal', '7 days warranty', 9000, 9000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2016-rds-50-cal') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2012 R2 RDS 50 CAL', 'server-2012r2-rds-50-cal', '7 days warranty', 9000, 9000, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2012r2-rds-50-cal') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2012 RDS 50 CAL', 'server-2012-rds-50-cal', '7 days warranty', 5583, 5583, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2012-rds-50-cal') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Windows Server 2008 RDS 50 CAL', 'server-2008-rds-50-cal', '7 days warranty', 5583, 5583, @img, 'Microsoft', 0, 1 FROM categories c WHERE c.slug='server-sql' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='server-2008-rds-50-cal') LIMIT 1;

-- Google Drive
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Google Drive without limits', 'google-drive-unlimited', 'Lifelong (USD)', 7714, 7714, @img, 'Google', 0, 1 FROM categories c WHERE c.slug='cloud-storage' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='google-drive-unlimited') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Google Drive 10TB', 'google-drive-10tb', 'Lifelong (USD)', 3724, 3724, @img, 'Google', 0, 1 FROM categories c WHERE c.slug='cloud-storage' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='google-drive-10tb') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Google Drive 2TB', 'google-drive-2tb', 'Lifelong', 6000, 6000, @img, 'Google', 0, 1 FROM categories c WHERE c.slug='cloud-storage' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='google-drive-2tb') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Google Drive 100GB', 'google-drive-100gb', 'Lifelong', 2400, 2400, @img, 'Google', 0, 1 FROM categories c WHERE c.slug='cloud-storage' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='google-drive-100gb') LIMIT 1;

-- Lumion
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Lumion PRO key for one year', 'lumion-pro-1year', '1 year subscription', 90000, 90000, @img, 'Lumion', 0, 1 FROM categories c WHERE c.slug='lumion' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='lumion-pro-1year') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Lumion edu account and password for one year', 'lumion-edu-account-1year', 'All pro features, 1 year', 15750, 15750, @img, 'Lumion', 0, 1 FROM categories c WHERE c.slug='lumion' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='lumion-edu-account-1year') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Lumion edu key bind to user ID', 'lumion-edu-key-bind-1year', 'Bind to user ID, all pro features, 1 year', 20250, 20250, @img, 'Lumion', 0, 1 FROM categories c WHERE c.slug='lumion' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='lumion-edu-key-bind-1year') LIMIT 1;

-- Autodesk
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AutoCAD commercial 1 Year', 'autodesk-autocad-commercial-1y', '1 year, Hot sale', 91530, 91530, @img, 'Autodesk', 1, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-autocad-commercial-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Commercial Fusion 360/Revit/Inventor Pro/Maya/AutoCAD LT 1 Year', 'autodesk-commercial-suite-1y', '1 year', 91530, 91530, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-commercial-suite-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk BIM Collaborate Pro 1 Year', 'autodesk-bim-collaborate-1y', '1 year', 91530, 91530, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-bim-collaborate-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk PDMD Package 1 Year', 'autodesk-pdmd-1y', 'Product Design & Manufacturing, 1 year', 111870, 111870, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-pdmd-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AEC Package 1 Year', 'autodesk-aec-1y', 'Architecture & Engineering, 1 year', 122040, 122040, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-aec-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Auto Desk Commercial All Apps 1 Year', 'autodesk-all-apps-1y', '1 year', 259335, 259335, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-all-apps-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AutoCAD Edu 1 Year', 'autodesk-autocad-edu-1y', 'Full features, Hot sale', 3051, 3051, @img, 'Autodesk', 1, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-autocad-edu-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AutoCAD Edu 3 Year', 'autodesk-autocad-edu-3y', 'Subscription', 7628, 7628, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-autocad-edu-3y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk One Software Edu 1 Year', 'autodesk-one-software-edu-1y', 'Inventor/Maya/Civil 3D/Revit etc', 3559, 3559, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-one-software-edu-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk One Software Edu 3 Year', 'autodesk-one-software-edu-3y', 'Subscription', 8136, 8136, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-one-software-edu-3y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AEC edu Collection 1 Year', 'autodesk-aec-edu-1y', '1 year', 17798, 17798, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-aec-edu-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk AEC Collection edu 3 Years', 'autodesk-aec-edu-3y', '3 years', 30510, 30510, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-aec-edu-3y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk PDM Edu Collection 1 Year', 'autodesk-pdm-edu-1y', '13 apps, 1 year', 15255, 15255, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-pdm-edu-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk PDM Edu Collection 3 Year', 'autodesk-pdm-edu-3y', '13 apps, 3 years', 30510, 30510, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-pdm-edu-3y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk All 40 apps Edu 1 Year', 'autodesk-40-apps-edu-1y', 'Hot sale', 20340, 20340, @img, 'Autodesk', 1, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-40-apps-edu-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Autodesk All 40 apps Edu 3 Year', 'autodesk-40-apps-edu-3y', 'Subscription', 35595, 35595, @img, 'Autodesk', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='autodesk-40-apps-edu-3y') LIMIT 1;

-- Parallel Desktop
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 19 Standard Key Lifelong', 'parallel-19-standard', 'Lifelong', 12713, 12713, @img, 'Parallels', 0, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-19-standard') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 19 Pro Key Lifelong', 'parallel-19-pro', 'Lifelong, Hot sale', 14747, 14747, @img, 'Parallels', 1, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-19-pro') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 19 Business Key Lifelong', 'parallel-19-business', 'Lifelong', 19832, 19832, @img, 'Parallels', 0, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-19-business') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 20 Standard Key Lifelong', 'parallel-20-standard', 'Lifelong', 12713, 12713, @img, 'Parallels', 0, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-20-standard') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 20 Pro Key Lifelong', 'parallel-20-pro', 'Lifelong', 15255, 15255, @img, 'Parallels', 0, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-20-pro') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Parallel Desktop 20 Business Key Lifelong', 'parallel-20-business', 'Lifelong', 19832, 19832, @img, 'Parallels', 0, 1 FROM categories c WHERE c.slug='parallel-desktop' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='parallel-20-business') LIMIT 1;

-- ChatGPT, YouTube, Netflix (streaming / AI)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'ChatGPT 1 month account', 'chatgpt-1month', '1 month subscription', 3000, 3000, @img, 'OpenAI', 0, 1 FROM categories c WHERE c.slug='ai-others' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='chatgpt-1month') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Youtube premium 1 year in user ID', 'youtube-premium-1year', 'User own ID, subscription', 3200, 3200, @img, 'YouTube', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='youtube-premium-1year') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Netflix Premium 5 Screens 3 Months', 'netflix-premium-5screens-3m', '5 screens, 3 months', 4200, 4200, @img, 'Netflix', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='netflix-premium-5screens-3m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Netflix Premium 5 Screens 6 Months', 'netflix-premium-5screens-6m', '5 screens, 6 months', 8000, 8000, @img, 'Netflix', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='netflix-premium-5screens-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Netflix Premium 5 Screens 12 Months', 'netflix-premium-5screens-12m', '5 screens, 12 months', 18000, 18000, @img, 'Netflix', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='netflix-premium-5screens-12m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Netflix Premium 1 Screen 6 Months', 'netflix-premium-1screen-6m', '1 screen, 6 months', 3000, 3000, @img, 'Netflix', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='netflix-premium-1screen-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Netflix Premium 1 Screen 12 Months', 'netflix-premium-1screen-12m', '1 screen, 12 months', 6000, 6000, @img, 'Netflix', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='netflix-premium-1screen-12m') LIMIT 1;

-- Grammarly
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Grammarly 3 months edu', 'grammarly-3months-edu', 'Extremely stable', 15000, 15000, @img, 'Grammarly', 0, 1 FROM categories c WHERE c.slug='grammarly' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='grammarly-3months-edu') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Grammarly 1 year', 'grammarly-1year', '1 year key', 28500, 28500, @img, 'Grammarly', 0, 1 FROM categories c WHERE c.slug='grammarly' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='grammarly-1year') LIMIT 1;

-- Spotify
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Spotify Premium Account 6 Months', 'spotify-premium-6m', '6 months subscription', 4500, 4500, @img, 'Spotify', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='spotify-premium-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Spotify Premium Account 12 Months', 'spotify-premium-12m', '12 months subscription', 8700, 8700, @img, 'Spotify', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='spotify-premium-12m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Spotify Premium 6 Months Extend own account', 'spotify-extend-6m', 'Extend your own account', 4500, 4500, @img, 'Spotify', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='spotify-extend-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Spotify Premium 12 Months Extend own account', 'spotify-extend-12m', 'Extend your own account', 8700, 8700, @img, 'Spotify', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='spotify-extend-12m') LIMIT 1;

-- Archicad
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Archicad version 22 Mac and PC 1 year', 'archicad-22-1year', '2D and 3D features, subscription', 15000, 15000, @img, 'Graphisoft', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='archicad-22-1year') LIMIT 1;

-- Adobe
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe creative cloud admin panel 500 users', 'adobe-cc-admin-500-users', '500 users, NEW', 138000, 138000, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-cc-admin-500-users') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Creative Cloud all apps Enterprise 12 months', 'adobe-cc-all-apps-12m', '12 months, Hot sale', 21000, 21000, @img, 'Adobe', 1, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-cc-all-apps-12m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe ONE Software 1 Year enterprise', 'adobe-one-software-1y', 'Ps/Ae/Pr/Id/Ai/Acrobat etc', 30244, 30244, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-one-software-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Photoshop Elements 2023 win/mac Lifelong', 'adobe-photoshop-elements-2023', 'Official Lifelong', 32571, 32571, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-photoshop-elements-2023') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Premiere Elements 2023 win/mac Lifelong', 'adobe-premiere-elements-2023', 'Official Lifelong', 32571, 32571, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-premiere-elements-2023') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Premiere Elements 2021 win/mac Lifelong', 'adobe-premiere-elements-2021', 'Official Lifelong', 27918, 27918, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-premiere-elements-2021') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Acrobat Pro DC 2017 Lifetime Windows', 'adobe-acrobat-dc-2017-win', 'Lifetime Windows', 69795, 69795, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-acrobat-dc-2017-win') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Acrobat Pro DC 2017 Lifetime Mac', 'adobe-acrobat-dc-2017-mac', 'Lifetime Mac', 60489, 60489, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-acrobat-dc-2017-mac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Acrobat Pro DC 2019 Lifetime Windows', 'adobe-acrobat-dc-2019-win', 'Lifetime, Hot sale', 27918, 27918, @img, 'Adobe', 1, 1 FROM categories c WHERE c.slug='adobe-products' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='adobe-acrobat-dc-2019-win') LIMIT 1;

-- CorelDRAW
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CorelDRAW Graphic/Technical suite 2021 Windows', 'coreldraw-2021-windows', 'Commercial license, Lifetime', 37224, 37224, @img, 'Corel', 0, 1 FROM categories c WHERE c.slug='coreldraw' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='coreldraw-2021-windows') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CorelDRAW Graphic/Technical suite 2022 PC/Mac', 'coreldraw-2022-pcmac', 'Commercial license, Lifetime', 55836, 55836, @img, 'Corel', 0, 1 FROM categories c WHERE c.slug='coreldraw' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='coreldraw-2022-pcmac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CorelDRAW 2023 graphic suit key PC/MAC', 'coreldraw-2023-pcmac', 'Lifetime', 93060, 93060, @img, 'Corel', 0, 1 FROM categories c WHERE c.slug='coreldraw' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='coreldraw-2023-pcmac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CorelDRAW 2024 graphic suit key PC/MAC', 'coreldraw-2024-pcmac', 'Lifetime', 120978, 120978, @img, 'Corel', 0, 1 FROM categories c WHERE c.slug='coreldraw' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='coreldraw-2024-pcmac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CorelDraw 2024 Windows Preactivated', 'coreldraw-2024-windows-preactivated', 'Lifetime, Hot sale', 9306, 9306, @img, 'Corel', 1, 1 FROM categories c WHERE c.slug='coreldraw' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='coreldraw-2024-windows-preactivated') LIMIT 1;

-- Design (Corona, V-Ray, Sketchup, Enscape, Rhino)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Corona renderer account and password', 'corona-renderer-1y', '1 year', 83754, 83754, @img, 'Corona', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='corona-renderer-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'V-Ray account 1 year', 'vray-1y', '1 year subscription', 116325, 116325, @img, 'Chaos', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='vray-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Sketchup pro 1 year subscription', 'sketchup-pro-1y', '1 year', 93060, 93060, @img, 'Trimble', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='sketchup-pro-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Sketchup studio with Vray 1 year', 'sketchup-studio-vray-1y', '1 year', 102366, 102366, @img, 'Trimble', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='sketchup-studio-vray-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Enscape 1 year account', 'enscape-1y', 'Account and password, 1 year', 93060, 93060, @img, 'Enscape', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='enscape-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Rhino 8 lifetime user account', 'rhino-8-lifetime', 'All features, bind to user account', 325710, 325710, @img, 'McNeel', 0, 1 FROM categories c WHERE c.slug='design-architecture-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='rhino-8-lifetime') LIMIT 1;

-- LinkedIn
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'LinkedIn premium career 12 months', 'linkedin-premium-career-12m', '12 months', 23265, 23265, @img, 'LinkedIn', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='linkedin-premium-career-12m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'LinkedIn premium business 6 months', 'linkedin-premium-business-6m', '6 months', 11632, 11632, @img, 'LinkedIn', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='linkedin-premium-business-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'LinkedIn premium business 12 months', 'linkedin-premium-business-12m', '12 months', 20938, 20938, @img, 'LinkedIn', 0, 1 FROM categories c WHERE c.slug='streaming-subscriptions' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='linkedin-premium-business-12m') LIMIT 1;

-- Utility: CCleaner, Macrorit, Aomei
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CCleaner Pro Key 1 PC 1 Year', 'ccleaner-pro-1pc-1y', '1 PC, 1 year', 6514, 6514, @img, 'Piriform', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='ccleaner-pro-1pc-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CCleaner Pro Plus Key 3 PC 1 Year', 'ccleaner-pro-plus-3pc-1y', '3 PC, 1 year', 8375, 8375, @img, 'Piriform', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='ccleaner-pro-plus-3pc-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'CCleaner for mac', 'ccleaner-mac', 'Mac subscription', 8375, 8375, @img, 'Piriform', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='ccleaner-mac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Macrorit Partition Expert Pro', 'macrorit-partition-pro', 'Lifetime', 2791, 2791, @img, 'Macrorit', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='macrorit-partition-pro') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Macrorit Partition Expert Server', 'macrorit-partition-server', 'Lifetime', 6979, 6979, @img, 'Macrorit', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='macrorit-partition-server') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Macrorit Partition Expert Unlimited', 'macrorit-partition-unlimited', 'Lifetime', 11632, 11632, @img, 'Macrorit', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='macrorit-partition-unlimited') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Aomei Partition Assistant Professional 8.5 lifetime', 'aomei-partition-pro', 'Lifetime', 2326, 2326, @img, 'Aomei', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='aomei-partition-pro') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Aomei Partition Assistant Server 8.5 lifetime', 'aomei-partition-server', 'Lifetime', 4653, 4653, @img, 'Aomei', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='aomei-partition-server') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Aomei Partition Assistant Unlimited 8.5 lifetime', 'aomei-partition-unlimited', 'Lifetime', 6979, 6979, @img, 'Aomei', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='aomei-partition-unlimited') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Aomei Partition Assistant Technician 8.5 lifetime', 'aomei-partition-technician', 'Lifetime', 9306, 9306, @img, 'Aomei', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='aomei-partition-technician') LIMIT 1;

-- Other (IBM SPSS, MATLAB, etc)
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'IBM SPSS key for mac and windows', 'ibm-spss-lifetime', 'Lifetime', 20938, 20938, @img, 'IBM', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='ibm-spss-lifetime') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Trend Micro Maximum Security 1 Device 1 Year', 'trend-micro-1device-1y', '1 year', 3629, 3629, @img, 'Trend Micro', 0, 1 FROM categories c WHERE c.slug='antivirus-security' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='trend-micro-1device-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'ZebraDesigner 3 Pro activation license', 'zebradesigner-3-pro', 'Lifetime', 8840, 8840, @img, 'Zebra', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='zebradesigner-3-pro') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Bitdefender Total Security 5 Devices 90 Days', 'bitdefender-5devices-90d', '90 days account', 3722, 3722, @img, 'Bitdefender', 0, 1 FROM categories c WHERE c.slug='antivirus-security' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='bitdefender-5devices-90d') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'JetBrains Family bucket 2023 1 Device', 'jetbrains-family-1device', '1 year', 10236, 10236, @img, 'JetBrains', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='jetbrains-family-1device') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Acronis Cyber Protect Home Office 1 user', 'acronis-cyber-protect-1y', '1 year', 16285, 16285, @img, 'Acronis', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='acronis-cyber-protect-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'EndNote 21 Official license 1 Device', 'endnote-21-1device', 'Lifetime', 7444, 7444, @img, 'Clarivate', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='endnote-21-1device') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Internet Download Manager IDM official license', 'idm-official-license', 'Lifetime', 10236, 10236, @img, 'Tonec', 0, 1 FROM categories c WHERE c.slug='utility-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='idm-official-license') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Matlab 2016-2022A/B Programming Software', 'matlab-2016-2022', 'Official download, Lifetime', 8840, 8840, @img, 'MathWorks', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='matlab-2016-2022') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Tableau Pro Desktop Business license', 'tableau-pro-desktop-1y', '1 year', 4653, 4653, @img, 'Tableau', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='tableau-pro-desktop-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Bluebeam Revu 20', 'bluebeam-revu-20', 'Lifetime', 6979, 6979, @img, 'Bluebeam', 0, 1 FROM categories c WHERE c.slug='other' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='bluebeam-revu-20') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Maxon account Cinema 4D Redshift 1 year', 'maxon-account-1y', 'Cinema 4D, Red Giant, Redshift, NEW', 130284, 130284, @img, 'Maxon', 0, 1 FROM categories c WHERE c.slug='creative-video-tools' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='maxon-account-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Maxon in user own account 1 year', 'maxon-user-account-1y', 'Cinema 4D, Red Giant, Redshift, NEW', 325710, 325710, @img, 'Maxon', 0, 1 FROM categories c WHERE c.slug='creative-video-tools' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='maxon-user-account-1y') LIMIT 1;

-- InVideo
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'InVideo in your own ID 1 Month', 'invideo-1m', '1 month', 2791, 2791, @img, 'InVideo', 0, 1 FROM categories c WHERE c.slug='invideo' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='invideo-1m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'InVideo in your own ID 3 Month', 'invideo-3m', '3 months', 6979, 6979, @img, 'InVideo', 0, 1 FROM categories c WHERE c.slug='invideo' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='invideo-3m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'InVideo in your own ID 6 Month', 'invideo-6m', '6 months', 13028, 13028, @img, 'InVideo', 0, 1 FROM categories c WHERE c.slug='invideo' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='invideo-6m') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'InVideo in your own ID 12 Month', 'invideo-12m', '12 months, Hot sale', 23265, 23265, @img, 'InVideo', 1, 1 FROM categories c WHERE c.slug='invideo' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='invideo-12m') LIMIT 1;

-- Canva
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Canva Pro Private Account 1 Year', 'canva-pro-1y', '1 year, Hot sale', 6514, 6514, @img, 'Canva', 1, 1 FROM categories c WHERE c.slug='canva' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='canva-pro-1y') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Canva Edu Private Account Lifetime', 'canva-edu-lifetime', 'Lifetime', 930, 930, @img, 'Canva', 0, 1 FROM categories c WHERE c.slug='canva' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='canva-edu-lifetime') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Canva Edu Admin panel 490 seats lifelong', 'canva-edu-admin-490', 'Lifetime', 139590, 139590, @img, 'Canva', 0, 1 FROM categories c WHERE c.slug='canva' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='canva-edu-admin-490') LIMIT 1;

-- Nitro
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Nitro Pro 11', 'nitro-pro-11', 'Lifetime', 2326, 2326, @img, 'Nitro', 0, 1 FROM categories c WHERE c.slug='nitro' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='nitro-pro-11') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Nitro Pro 12', 'nitro-pro-12', 'Lifetime', 2791, 2791, @img, 'Nitro', 0, 1 FROM categories c WHERE c.slug='nitro' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='nitro-pro-12') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Nitro Pro 13 key', 'nitro-pro-13', 'Lifetime', 2791, 2791, @img, 'Nitro', 0, 1 FROM categories c WHERE c.slug='nitro' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='nitro-pro-13') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Nitro pro 14 key', 'nitro-pro-14', 'Lifetime, Hot sale', 2791, 2791, @img, 'Nitro', 1, 1 FROM categories c WHERE c.slug='nitro' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='nitro-pro-14') LIMIT 1;

-- QuickBooks
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBooks Enterprise Solutions 24.0 2024 US', 'quickbooks-enterprise-2024-us', 'Lifetime', 14889, 14889, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-enterprise-2024-us') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBook Enterprise Solutions 23.0 2023 US', 'quickbooks-enterprise-2023-us', 'Lifetime', 9306, 9306, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-enterprise-2023-us') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBook Enterprise Solutions 2023 Canada', 'quickbooks-enterprise-2023-canada', 'Lifetime', 9306, 9306, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-enterprise-2023-canada') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBook Desktop Pro 2020 For Mac', 'quickbooks-desktop-pro-2020-mac', 'Lifetime', 9306, 9306, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-desktop-pro-2020-mac') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBook Enterprise Accountant Edition 2023 US', 'quickbooks-enterprise-accountant-2023', 'Lifetime', 9306, 9306, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-enterprise-accountant-2023') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'QuickBook Enterprise Accountant Edition 2018 US', 'quickbooks-enterprise-accountant-2018', 'Lifetime', 9306, 9306, @img, 'QuickBooks', 0, 1 FROM categories c WHERE c.slug='accounting-software' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='quickbooks-enterprise-accountant-2018') LIMIT 1;

-- Installation
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Acrobat Pro DC 2021 Installation Mac/PC', 'installation-adobe-acrobat-dc-2021', 'Lifetime (USD)', 1330, 1330, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='installation-services' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='installation-adobe-acrobat-dc-2021') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Adobe Illustrator 2021/2020/2018/CS6 Installation', 'installation-adobe-illustrator', 'Lifetime', 4653, 4653, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='installation-services' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='installation-adobe-illustrator') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'Photoshop 2021 Installation', 'installation-photoshop-2021', 'Lifetime', 4653, 4653, @img, 'Adobe', 0, 1 FROM categories c WHERE c.slug='installation-services' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='installation-photoshop-2021') LIMIT 1;
INSERT INTO products (category_id, name, slug, short_description, price_min, price_max, image_url, brand_name, is_featured, is_active)
SELECT c.id, 'SmartDraw 2013 Enterprise Installation', 'installation-smartdraw-2013', 'Lifetime', 4653, 4653, @img, 'SmartDraw', 0, 1 FROM categories c WHERE c.slug='installation-services' AND NOT EXISTS (SELECT 1 FROM products WHERE slug='installation-smartdraw-2013') LIMIT 1;

-- 4. Add product variants for products without variants
INSERT INTO product_variants (product_id, name, price, stock)
SELECT p.id, 'Default', p.price_min, 0
FROM products p
WHERE NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id);
