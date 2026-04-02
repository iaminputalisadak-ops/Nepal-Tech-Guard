<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$category_id = isset($_GET['category_id']) ? (int) $_GET['category_id'] : null;
$limit = min(200, max(1, (int) ($_GET['limit'] ?? 50)));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

$sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE 1=1';
$params = [];
if ($category_id) {
    $sql .= ' AND p.category_id = ?';
    $params[] = $category_id;
}
$sql .= ' ORDER BY p.created_at DESC LIMIT ' . $limit . ' OFFSET ' . $offset;
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

foreach ($products as &$p) {
    $p['id'] = (int) $p['id'];
    $p['category_id'] = (int) $p['category_id'];
    $p['price_min'] = (float) $p['price_min'];
    $p['price_max'] = (float) $p['price_max'];
    $p['original_price'] = $p['original_price'] ? (float) $p['original_price'] : null;
    $p['is_featured'] = (int) $p['is_featured'];
    $p['is_active'] = (int) $p['is_active'];
    $v = $pdo->prepare('SELECT id, name, price, original_price, stock, sku FROM product_variants WHERE product_id = ? ORDER BY price ASC');
    $v->execute([$p['id']]);
    $p['variants'] = $v->fetchAll();
    foreach ($p['variants'] as &$pv) {
        $pv['id'] = (int) $pv['id'];
        $pv['price'] = (float) $pv['price'];
        $pv['original_price'] = $pv['original_price'] ? (float) $pv['original_price'] : null;
    }
}

echo json_encode(['success' => true, 'data' => $products]);
