-- Add Nepal TechGuard categories to admin panel
-- Run: mysql -u root -p nepal_techguard < database/seed_categories.sql
-- Or import in phpMyAdmin

USE nepal_techguard;

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Windows', 'windows', 'Windows operating system keys', 1),
('Windows Enterprise', 'windows-enterprise', 'Windows Enterprise editions', 2),
('Microsoft 365 / Office 365', 'microsoft-365-office-365', 'Microsoft 365 and Office 365 subscriptions', 3),
('Office 2024', 'office-2024', 'Office 2024 licenses', 4),
('Office 2021', 'office-2021', 'Office 2021 licenses', 5),
('Office 2019', 'office-2019', 'Office 2019 licenses', 6),
('Office 2016 / 2013 / 2010', 'office-2016-2013-2010', 'Office 2016, 2013, and 2010 licenses', 7),
('Project', 'project', 'Microsoft Project', 8),
('Visio', 'visio', 'Microsoft Visio', 9),
('Access', 'access', 'Microsoft Access', 10),
('Server & SQL', 'server-sql', 'Windows Server and SQL Server', 11),
('VMware & Virtualization', 'vmware-virtualization', 'VMware and virtualization software', 12),
('Power BI', 'power-bi', 'Power BI analytics and reporting', 13),
('Cloud Storage', 'cloud-storage', 'Google Drive and cloud storage', 14),
('Design & Architecture Software', 'design-architecture-software', 'CAD, BIM, and architecture tools', 15),
('Adobe Products', 'adobe-products', 'Adobe Creative Cloud and Adobe software', 16),
('CorelDRAW', 'coreldraw', 'CorelDRAW graphics suite', 17),
('Antivirus & Security', 'antivirus-security', 'Antivirus and security software', 18),
('Streaming & Subscriptions', 'streaming-subscriptions', 'Netflix, Spotify, YouTube Premium, etc.', 19),
('Utility Software', 'utility-software', 'CCleaner, partition tools, and utilities', 20),
('Accounting Software', 'accounting-software', 'QuickBooks and accounting tools', 21),
('Creative & Video Tools', 'creative-video-tools', 'Video editing and creative software', 22),
('AI / Others', 'ai-others', 'AI tools, ChatGPT, and other software', 23),
('Installation Services', 'installation-services', 'Software installation and setup', 24)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), sort_order=VALUES(sort_order);
