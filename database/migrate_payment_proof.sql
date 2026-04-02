-- Add payment proof image url to orders table
-- Run: mysql -u root nepal_techguard < database/migrate_payment_proof.sql

ALTER TABLE orders
  ADD COLUMN payment_proof_url VARCHAR(500) NULL AFTER payment_reference;

