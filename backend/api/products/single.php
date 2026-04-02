<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$id = (int) ($_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Product ID required']);
    exit;
}

$pdo = getConnection();
$stmt = $pdo->prepare('SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ? AND p.is_active = 1');
$stmt->execute([$id]);
$product = $stmt->fetch();

if (!$product) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
}

$product['id'] = (int) $product['id'];
$product['category_id'] = (int) $product['category_id'];
$product['price_min'] = (float) $product['price_min'];
$product['price_max'] = (float) $product['price_max'];
$product['original_price'] = $product['original_price'] ? (float) $product['original_price'] : null;

$v = $pdo->prepare('SELECT id, name, price, original_price, sku FROM product_variants WHERE product_id = ? ORDER BY price ASC');
$v->execute([$product['id']]);
$product['variants'] = $v->fetchAll();
foreach ($product['variants'] as &$pv) {
    $pv['id'] = (int) $pv['id'];
    $pv['price'] = (float) $pv['price'];
    $pv['original_price'] = $pv['original_price'] ? (float) $pv['original_price'] : null;
}

echo json_encode(['success' => true, 'data' => $product]);
