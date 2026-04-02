<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Product ID required']);
    exit;
}

$category_id = isset($input['category_id']) ? (int) $input['category_id'] : null;
$name = array_key_exists('name', $input) ? trim($input['name']) : null;
$slug = array_key_exists('slug', $input) ? trim($input['slug']) : null;
$short_description = array_key_exists('short_description', $input) ? trim($input['short_description']) : null;
$description = array_key_exists('description', $input) ? trim($input['description']) : null;
$image_url = array_key_exists('image_url', $input) ? trim($input['image_url']) : null;
$price_min = array_key_exists('price_min', $input) ? (float) $input['price_min'] : null;
$price_max = array_key_exists('price_max', $input) ? (float) $input['price_max'] : null;
$original_price = array_key_exists('original_price', $input) ? ($input['original_price'] === '' || $input['original_price'] === null ? null : (float) $input['original_price']) : null;
$discount_percent = array_key_exists('discount_percent', $input) ? (int) $input['discount_percent'] : null;
$rating = array_key_exists('rating', $input) ? (float) $input['rating'] : null;
$review_count = array_key_exists('review_count', $input) ? (int) $input['review_count'] : null;
$is_featured = array_key_exists('is_featured', $input) ? (int) (bool) $input['is_featured'] : null;
$is_active = array_key_exists('is_active', $input) ? (int) (bool) $input['is_active'] : null;
$brand_name = array_key_exists('brand_name', $input) ? trim($input['brand_name']) : null;
$region = array_key_exists('region', $input) ? trim($input['region']) : null;
$sold_count = array_key_exists('sold_count', $input) ? (int) $input['sold_count'] : null;
$availability = array_key_exists('availability', $input) ? trim($input['availability']) : null;
$version_info = array_key_exists('version_info', $input) ? trim($input['version_info']) : null;
$variants = $input['variants'] ?? null;

$pdo = getConnection();
$stmt = $pdo->prepare('SELECT id FROM products WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
}

$updates = [];
$params = [];
$allowed = [
    'category_id' => $category_id, 'name' => $name, 'slug' => $slug,
    'short_description' => $short_description, 'description' => $description,
    'image_url' => $image_url, 'price_min' => $price_min, 'price_max' => $price_max,
    'original_price' => $original_price, 'discount_percent' => $discount_percent,
    'rating' => $rating, 'review_count' => $review_count,
    'brand_name' => $brand_name, 'region' => $region, 'sold_count' => $sold_count,
    'availability' => $availability, 'version_info' => $version_info,
    'is_featured' => $is_featured, 'is_active' => $is_active
];
foreach ($allowed as $col => $val) {
    if ($val !== null) {
        $updates[] = "`$col` = ?";
        $params[] = $val;
    }
}
if (!empty($updates)) {
    $params[] = $id;
    $sql = 'UPDATE products SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $pdo->prepare($sql)->execute($params);
}

if (is_array($variants)) {
    $pdo->prepare('DELETE FROM product_variants WHERE product_id = ?')->execute([$id]);
    foreach ($variants as $v) {
        $vname = trim($v['name'] ?? '');
        $vprice = isset($v['price']) ? (float) $v['price'] : 0;
        $vorig = isset($v['original_price']) && $v['original_price'] !== '' ? (float) $v['original_price'] : null;
        $vstock = (int) ($v['stock'] ?? 0);
        $vsku = trim($v['sku'] ?? '');
        if ($vname !== '' || $vprice > 0) {
            $ins = $pdo->prepare('INSERT INTO product_variants (product_id, name, price, original_price, stock, sku) VALUES (?, ?, ?, ?, ?, ?)');
            $ins->execute([$id, $vname ?: 'Default', $vprice, $vorig, $vstock, $vsku ?: null]);
        }
    }
}

echo json_encode(['success' => true, 'data' => ['id' => $id]]);
