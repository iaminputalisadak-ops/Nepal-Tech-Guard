-- Seed categories from OSP price list
-- Run: mysql -u root -p nepal_techguard < database/seed_categories_from_price_list.sql
-- Or import via phpMyAdmin

USE nepal_techguard;

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Windows', 'windows', 'Windows 8.1, 10, 11 Pro, Home Retail and OEM keys', 1),
('Bundle Keys', 'bundle-keys', 'Windows multi-PC Retail and MAK keys', 2),
('Enterprise', 'enterprise', 'Windows 10 Enterprise LTSC/LTSB MAK keys', 3),
('Office 365', 'office-365', 'Office 365 A3, E3, Personal, Family accounts', 4),
('VMware', 'vmware', 'VMware Workstation and Fusion Pro keys', 5),
('Power BI', 'power-bi', 'Power BI accounts and Pro licenses', 6),
('Office 2024', 'office-2024', 'Office 2024 Home and Business, Student', 7),
('Office 2021', 'office-2021', 'Office 2021 Professional Plus, Home & Student', 8),
('Office 2019', 'office-2019', 'Office 2019 Professional Plus, Home & Student', 9),
('Office 2016', 'office-2016', 'Office 2016 Professional Plus, Home & Student', 10),
('Office 2013', 'office-2013', 'Office 2013 Professional Plus keys', 11),
('Office 2010', 'office-2010', 'Office 2010 Professional Plus keys', 12),
('Project', 'project', 'Microsoft Project Standard and Professional', 13),
('Visio', 'visio', 'Visio Professional keys', 14),
('Access', 'access', 'Microsoft Access keys', 15),
('Server', 'server', 'SQL Server, Windows Server, RDS CALs', 16),
('Google Drive', 'google-drive', 'Google Drive storage plans', 17),
('Lumion', 'lumion', 'Lumion PRO and EDU keys', 18),
('Autodesk', 'autodesk', 'AutoCAD, Revit, Fusion 360, Maya and collections', 19),
('Parallel Desktop', 'parallel-desktop', 'Parallels Desktop for Mac', 20),
('Antivirus', 'antivirus', 'Kaspersky, E-scan, NOD32 antivirus', 21),
('ChatGPT', 'chatgpt', 'ChatGPT accounts and subscriptions', 22),
('YouTube', 'youtube', 'YouTube Premium subscriptions', 23),
('Netflix', 'netflix', 'Netflix Premium accounts', 24),
('Grammarly', 'grammarly', 'Grammarly Edu and annual licenses', 25),
('Spotify', 'spotify', 'Spotify Premium accounts and extensions', 26),
('Archicad', 'archicad', 'Archicad 2D/3D for Mac and PC', 27),
('Adobe', 'adobe', 'Adobe Creative Cloud, Acrobat, Photoshop, Premiere', 28),
('Design Software', 'design-software', 'Corona, V-Ray, SketchUp, Enscape, Rhino', 29),
('LinkedIn', 'linkedin', 'LinkedIn Premium Career and Business', 30),
('CCleaner', 'ccleaner', 'CCleaner Pro and Pro Plus keys', 31),
('Macrorit', 'macrorit', 'Macrorit Partition Expert', 32),
('Aomei', 'aomei', 'Aomei Partition Assistant', 33),
('InVideo', 'invideo', 'InVideo subscriptions', 34),
('Canva', 'canva', 'Canva Pro and Edu accounts', 35),
('Nitro', 'nitro', 'Nitro Pro PDF software', 36),
('QuickBooks', 'quickbooks', 'QuickBooks Enterprise and Desktop', 37),
('Installation', 'installation', 'Software installation services', 38),
('CorelDRAW', 'coreldraw', 'CorelDRAW Graphic Suite licenses', 39),
('Other', 'other', 'IBM SPSS, MATLAB, Tableau, EndNote, IDM, and more', 40)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), sort_order=VALUES(sort_order);
