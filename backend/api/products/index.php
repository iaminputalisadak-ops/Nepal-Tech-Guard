<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getConnection();

$category_id = isset($_GET['category_id']) ? (int) $_GET['category_id'] : null;
$featured = isset($_GET['featured']) ? (int) $_GET['featured'] : null;
$search = isset($_GET['search']) ? trim($_GET['search']) : null;
$limit = min(100, max(1, (int) ($_GET['limit'] ?? 50)));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

$sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        JOIN categories c ON c.id = p.category_id
        WHERE p.is_active = 1';
$params = [];

if ($category_id) {
    $sql .= ' AND p.category_id = ?';
    $params[] = $category_id;
}
if ($featured === 1 && !$search) {
    $sql .= ' AND p.is_featured = 1';
}
if ($search) {
    $sql .= ' AND (p.name LIKE ? OR p.short_description LIKE ? OR p.brand_name LIKE ?)';
    $term = '%' . $search . '%';
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
}

$sql .= ' ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ' . $limit . ' OFFSET ' . $offset;

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

// Attach variants
foreach ($products as &$p) {
    $p['id'] = (int) $p['id'];
    $p['category_id'] = (int) $p['category_id'];
    $p['price_min'] = (float) $p['price_min'];
    $p['price_max'] = (float) $p['price_max'];
    $p['original_price'] = $p['original_price'] ? (float) $p['original_price'] : null;
    $v = $pdo->prepare('SELECT id, name, price, original_price, sku FROM product_variants WHERE product_id = ? ORDER BY price ASC');
    $v->execute([$p['id']]);
    $p['variants'] = $v->fetchAll();
    foreach ($p['variants'] as &$pv) {
        $pv['id'] = (int) $pv['id'];
        $pv['price'] = (float) $pv['price'];
        $pv['original_price'] = $pv['original_price'] ? (float) $pv['original_price'] : null;
    }
}

echo json_encode(['success' => true, 'data' => $products]);
