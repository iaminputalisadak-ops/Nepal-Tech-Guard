-- Run this if you have an existing database (created before username was added)
-- Adds username column and sets simple login: admin / password

USE nepal_techguard;

-- Add username column (may error if column already exists - that's ok)
ALTER TABLE admin_users ADD COLUMN username VARCHAR(50) UNIQUE AFTER id;

-- Set first admin to username 'admin'
UPDATE admin_users SET username = 'admin' WHERE username IS NULL OR username = '' ORDER BY id LIMIT 1;

-- If no admin exists, insert one (username=admin, password=password)
INSERT IGNORE INTO admin_users (username, email, password_hash, name) VALUES
('admin', 'admin@nepaltechguard.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin');
