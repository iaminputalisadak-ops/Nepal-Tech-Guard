-- Site settings for footer and other editable content
-- Run: mysql -u root nepal_techguard < database/migrate_site_settings.sql

USE nepal_techguard;

CREATE TABLE IF NOT EXISTS site_settings (
    id INT UNSIGNED PRIMARY KEY DEFAULT 1,
    settings_json JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default values
INSERT INTO site_settings (id, settings_json) VALUES (1, '{
  "contact_address": "Nepal TechGuard, Kathmandu, Nepal",
  "contact_phone": "+977 9800000000",
  "contact_email": "support@nepaltechguard.com",
  "policy_links": [
    {"label": "Refund Policy", "url": "/refund-policy"},
    {"label": "Privacy Policy", "url": "/privacy-policy"},
    {"label": "Terms of Use", "url": "/terms"},
    {"label": "Disclaimer", "url": "/disclaimer"}
  ],
  "info_links": [
    {"label": "About us", "url": "/about"},
    {"label": "Contact us", "url": "/contact"},
    {"label": "My Account", "url": "/admin"},
    {"label": "Shop Page", "url": "/"},
    {"label": "Blog", "url": "/"}
  ],
  "social_links": [
    {"platform": "facebook", "label": "Facebook", "url": "https://facebook.com"},
    {"platform": "instagram", "label": "Instagram", "url": "https://instagram.com"},
    {"platform": "pinterest", "label": "Pinterest", "url": "https://pinterest.com"},
    {"platform": "youtube", "label": "Youtube", "url": "https://youtube.com"}
  ],
  "company_name": "Nepal TechGuard",
  "copyright_slogan": "Trusted Source for Genuine Keys",
  "copyright_tagline": "Designed & Secured by",
  "payment_methods": ["UPI", "Visa", "MC", "RuPay"]
}') ON DUPLICATE KEY UPDATE id = id;
