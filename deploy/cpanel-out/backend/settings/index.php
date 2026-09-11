<?php
/**
 * Public API - Get site settings (no auth required)
 */
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

try {
    $pdo = getConnection();
    $stmt = $pdo->query('SELECT settings_json FROM site_settings WHERE id = 1');
    $row = $stmt ? $stmt->fetch() : null;
    $settings = $row ? json_decode($row['settings_json'], true) : getDefaultSettings();
} catch (Throwable $e) {
    $settings = getDefaultSettings();
}
if (!is_array($settings)) {
    $settings = getDefaultSettings();
}
echo json_encode(['success' => true, 'data' => $settings]);

function getDefaultSettings(): array {
    return [
        'contact_address' => 'Nepal TechGuard, Kathmandu, Nepal',
        'contact_phone' => '+977 9800000000',
        'contact_email' => 'support@nepaltechguard.com',
        'policy_links' => [
            ['label' => 'Refund Policy', 'url' => '/refund-policy'],
            ['label' => 'Privacy Policy', 'url' => '/privacy-policy'],
            ['label' => 'Terms of Use', 'url' => '/terms'],
            ['label' => 'Disclaimer', 'url' => '/disclaimer'],
        ],
        'info_links' => [
            ['label' => 'About us', 'url' => '/about'],
            ['label' => 'Contact us', 'url' => '/contact'],
            ['label' => 'My Account', 'url' => '/admin'],
            ['label' => 'Shop Page', 'url' => '/'],
            ['label' => 'Blog', 'url' => '/blog'],
        ],
        'social_links' => [
            ['platform' => 'facebook', 'label' => 'Facebook', 'url' => 'https://facebook.com'],
            ['platform' => 'instagram', 'label' => 'Instagram', 'url' => 'https://instagram.com'],
            ['platform' => 'pinterest', 'label' => 'Pinterest', 'url' => 'https://pinterest.com'],
            ['platform' => 'youtube', 'label' => 'Youtube', 'url' => 'https://youtube.com'],
        ],
        'company_name' => 'Nepal TechGuard',
        'copyright_slogan' => 'Trusted Source for Genuine Keys',
        'copyright_tagline' => 'Designed & Secured by',
        'payment_methods' => ['UPI', 'Visa', 'MC', 'RuPay'],
        'page_contents' => [
            'refund-policy' => ['title' => 'Refund Policy', 'content' => 'We offer refunds within 7 days of purchase if the product key does not work. Contact our support team with your order number to initiate a refund. Digital products that have been delivered cannot be refunded unless there is a technical issue.'],
            'privacy-policy' => ['title' => 'Privacy Policy', 'content' => 'We collect your name, email, and payment information when you place an order. We use this information to process your order and deliver your license keys. We do not share your data with third parties except for payment processing. Your data is stored securely.'],
            'terms' => ['title' => 'Terms of Use', 'content' => 'By using Nepal TechGuard, you agree to purchase genuine software licenses only. You must not resell or redistribute keys beyond your license terms. We reserve the right to refuse service. Prices and availability may change without notice.'],
            'disclaimer' => ['title' => 'Disclaimer', 'content' => 'Nepal TechGuard sells genuine software licenses. We are an authorized reseller. Product names and logos are trademarks of their respective owners. We are not affiliated with Microsoft, Adobe, or other software vendors.'],
            'about' => ['title' => 'About us', 'content' => 'Nepal TechGuard is your trusted source for genuine Windows, MS Office, Antivirus, and Adobe software licenses. We provide instant delivery and 24/7 support. Based in Kathmandu, Nepal.'],
            'contact' => ['title' => 'Contact us', 'content' => 'Reach us at support@nepaltechguard.com or call +977 9800000000. We are available 24/7 for order support and technical assistance. Nepal TechGuard, Kathmandu, Nepal.'],
            'blog' => ['title' => 'Blog', 'content' => 'Welcome to our blog. Check back soon for updates, tips, and news about software licensing.'],
        ],
    ];
}
