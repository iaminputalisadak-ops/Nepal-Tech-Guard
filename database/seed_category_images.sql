-- Add professional images to category cards (Wikimedia Commons - public domain)
USE nepal_techguard;

UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/1/17/Windows11logo.png' WHERE slug = 'windows';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/1/17/Windows11logo.png' WHERE slug = 'windows-enterprise';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/220px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png' WHERE slug IN ('microsoft-365-office-365', 'ms-office');
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/220px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png' WHERE slug IN ('office-2024', 'office-2021', 'office-2019', 'office-2016-2013-2010');
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Microsoft_Office_Project_%282019%E2%80%93present%29.svg/220px-Microsoft_Office_Project_%282019%E2%80%93present%29.svg.png' WHERE slug = 'project';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_Office_Visio_%282019%E2%80%93present%29.svg/220px-Microsoft_Office_Visio_%282019%E2%80%93present%29.svg.png' WHERE slug = 'visio';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/220px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png' WHERE slug = 'access';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Windows_logo_-_2012.svg/220px-Windows_logo_-_2012.svg.png' WHERE slug = 'server-sql';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/VMware_Workstation_16_icon.svg/220px-VMware_Workstation_16_icon.svg.png' WHERE slug = 'vmware-virtualization';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Power_BI_logo.svg/220px-Power_BI_logo.svg.png' WHERE slug = 'power-bi';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Google_Drive_logo.svg/220px-Google_Drive_logo.svg.png' WHERE slug = 'cloud-storage';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/AutoCAD_Logo.svg/220px-AutoCAD_Logo.svg.png' WHERE slug IN ('design-architecture-software', 'design-editing');
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Creative_Cloud_icon.svg/220px-Adobe_Creative_Cloud_icon.svg.png' WHERE slug = 'adobe-products';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/CorelDRAW_2020_Logo.svg/220px-CorelDRAW_2020_Logo.svg.png' WHERE slug = 'coreldraw';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Kaspersky_Lab_logo.svg/220px-Kaspersky_Lab_logo.svg.png' WHERE slug IN ('antivirus-security', 'antivirus');
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/220px-Netflix_2015_logo.svg.png' WHERE slug = 'streaming-subscriptions';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/CCleaner_logo.svg/220px-CCleaner_logo.svg.png' WHERE slug = 'utility-software';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Intuit_QuickBooks_logo.svg/220px-Intuit_QuickBooks_logo.svg.png' WHERE slug = 'accounting-software';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/220px-Adobe_Premiere_Pro_CC_icon.svg.png' WHERE slug = 'creative-video-tools';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/220px-ChatGPT_logo.svg.png' WHERE slug = 'ai-others';
UPDATE categories SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OOjs_UI_icon_install.svg/220px-OOjs_UI_icon_install.svg.png' WHERE slug = 'installation-services';
