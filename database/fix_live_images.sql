-- Unique category images. Import in phpMyAdmin after uploading /uploads files.

UPDATE categories SET image_url = '/uploads/cat-windows.jpg' WHERE slug = 'windows';
UPDATE categories SET image_url = '/uploads/cat-windows-enterprise.jpg' WHERE slug IN ('windows-enterprise', 'server-sql');
UPDATE categories SET image_url = '/uploads/cat-windows.jpg' WHERE slug = 'bundle-keys';
UPDATE categories SET image_url = '/uploads/cat-office-365.jpg' WHERE slug = 'microsoft-365-office-365';
UPDATE categories SET image_url = '/uploads/cat-office-2024.jpg' WHERE slug = 'office-2024';
UPDATE categories SET image_url = '/uploads/cat-office-2021.jpg' WHERE slug = 'office-2021';
UPDATE categories SET image_url = '/uploads/cat-office-2019.jpg' WHERE slug IN ('office-2019', 'office-2016-2013-2010');
UPDATE categories SET image_url = '/uploads/cat-office.jpg' WHERE slug = 'ms-office';
UPDATE categories SET image_url = '/uploads/cat-project.jpg' WHERE slug = 'project';
UPDATE categories SET image_url = '/uploads/cat-visio.jpg' WHERE slug = 'visio';
UPDATE categories SET image_url = '/uploads/cat-access.jpg' WHERE slug = 'access';
UPDATE categories SET image_url = '/uploads/cat-antivirus.jpg' WHERE slug IN ('antivirus', 'antivirus-security');
UPDATE categories SET image_url = '/uploads/cat-adobe.jpg' WHERE slug = 'adobe-products';
UPDATE categories SET image_url = '/uploads/cat-creative.jpg' WHERE slug IN ('design-editing', 'design-architecture-software', 'coreldraw', 'creative-video-tools', 'canva', 'lumion', 'invideo');
UPDATE categories SET image_url = '/uploads/cat-vmware.jpg' WHERE slug IN ('vmware-virtualization', 'parallel-desktop');
