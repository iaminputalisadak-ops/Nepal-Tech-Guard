<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$category_id = (int) ($input['category_id'] ?? 0);
$name = trim($input['name'] ?? '');
$slug = trim($input['slug'] ?? '');
$short_description = trim($input['short_description'] ?? '');
$description = trim($input['description'] ?? '');
$image_url = trim($input['image_url'] ?? '');
$price_min = isset($input['price_min']) ? (float) $input['price_min'] : 0;
$price_max = isset($input['price_max']) ? (float) $input['price_max'] : 0;
$original_price = isset($input['original_price']) && $input['original_price'] !== '' ? (float) $input['original_price'] : null;
$discount_percent = (int) ($input['discount_percent'] ?? 0);
$rating = isset($input['rating']) ? (float) $input['rating'] : 0;
$review_count = (int) ($input['review_count'] ?? 0);
$is_featured = !empty($input['is_featured']) ? 1 : 0;
$is_active = isset($input['is_active']) ? (int) (bool) $input['is_active'] : 1;
$brand_name = trim($input['brand_name'] ?? '');
$region = trim($input['region'] ?? 'Nepal') ?: 'Nepal';
$sold_count = (int) ($input['sold_count'] ?? 0);
$availability = trim($input['availability'] ?? 'In Stock') ?: 'In Stock';
$version_info = trim($input['version_info'] ?? 'Latest') ?: 'Latest';
$variants = $input['variants'] ?? [];

if (!$category_id || !$name) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Category and product name required']);
    exit;
}

if (!$slug) {
    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($name)));
}

$pdo = getConnection();

try {
    $stmt = $pdo->prepare('INSERT INTO products (category_id, name, slug, short_description, description, image_url, price_min, price_max, original_price, discount_percent, rating, review_count, brand_name, region, sold_count, availability, version_info, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $category_id, $name, $slug, $short_description, $description, $image_url ?: null,
        $price_min, $price_max, $original_price, $discount_percent, $rating, $review_count,
        $brand_name ?: null, $region, $sold_count, $availability, $version_info, $is_featured, $is_active
    ]);
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Unknown column') !== false) {
        $stmt = $pdo->prepare('INSERT INTO products (category_id, name, slug, short_description, description, image_url, price_min, price_max, original_price, discount_percent, rating, review_count, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $category_id, $name, $slug, $short_description, $description, $image_url ?: null,
            $price_min, $price_max, $original_price, $discount_percent, $rating, $review_count, $is_featured, $is_active
        ]);
    } else {
        throw $e;
    }
}
$product_id = (int) $pdo->lastInsertId();

foreach ($variants as $v) {
    $vname = trim($v['name'] ?? '');
    $vprice = isset($v['price']) ? (float) $v['price'] : 0;
    $vorig = isset($v['original_price']) && $v['original_price'] !== '' ? (float) $v['original_price'] : null;
    $vstock = (int) ($v['stock'] ?? 0);
    $vsku = trim($v['sku'] ?? '');
    if ($vname !== '' || $vprice > 0) {
        $ins = $pdo->prepare('INSERT INTO product_variants (product_id, name, price, original_price, stock, sku) VALUES (?, ?, ?, ?, ?, ?)');
        $ins->execute([$product_id, $vname ?: 'Default', $vprice, $vorig, $vstock, $vsku ?: null]);
    }
}

echo json_encode(['success' => true, 'data' => ['id' => $product_id]]);
