-- Add payment fields to orders table
-- Run: mysql -u root nepal_techguard < database/migrate_payment_fields.sql

ALTER TABLE orders
  ADD COLUMN payment_method VARCHAR(40) NULL AFTER status,
  ADD COLUMN payment_status ENUM('unpaid','pending','paid','failed') NOT NULL DEFAULT 'unpaid' AFTER payment_method,
  ADD COLUMN payment_reference VARCHAR(120) NULL AFTER payment_status;

