<?php
/**
 * Auto SEO and Image Updater for Nepal TechGuard Products
 * Run this by visiting: http://localhost:8000/api/admin/auto_seo_updater.php
 * Or via browser with an admin session.
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../cors.php';

// In local development, we allow direct execution
$pdo = getConnection();

$stmt = $pdo->query('SELECT id, name, slug, brand_name, price_min FROM products');
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

$updated = 0;

foreach ($products as $p) {
    $id = $p['id'];
    $name = $p['name'];
    $slug = $p['slug'] ?: strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
    $price = $p['price_min'] ? 'Rs. ' . number_format($p['price_min']) : 'best price';

    // High quality, professional SEO long description
    $description = "{$name} provides authentic, certified digital licensing for users and businesses across Nepal.\n\n"
                 . "Key Features & Benefits:\n"
                 . "- 100% Genuine and authentic activation verified online.\n"
                 . "- Instant digital delivery directly via Email, WhatsApp, and SMS within 60 seconds.\n"
                 . "- Lifetime validity or full-term official subscription guarantee.\n"
                 . "- Dedicated customer support from Kathmandu for effortless installation.\n\n"
                 . "Technical Requirements:\n"
                 . "- High-speed internet for digital license activation.\n"
                 . "- Compatible with official vendor installation media.\n\n"
                 . "Why choose Nepal TechGuard?\n"
                 . "We ensure safe, affordable, and certified license keys across Kathmandu, Pokhara, and all major cities in Nepal.";

    $short_description = "Buy genuine {$name} in Nepal with instant WhatsApp, SMS & Email delivery. Verified activation warranty.";

    // Branded Cover Image URL
    $image_url = "https://shop.hedztech.com/backend/cover.php?title=" . urlencode($name) . "&slug=" . urlencode($slug);

    $up = $pdo->prepare('UPDATE products SET slug = ?, short_description = ?, description = ?, image_url = ? WHERE id = ?');
    $up->execute([$slug, $short_description, $description, $image_url, $id]);
    $updated++;
}

echo json_encode([
    'success' => true,
    'message' => "Successfully updated SEO and images for {$updated} products.",
    'products_count' => $updated
]);
