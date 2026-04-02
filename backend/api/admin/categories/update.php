<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Category ID required']);
    exit;
}

$name = array_key_exists('name', $input) ? trim($input['name']) : null;
$slug = array_key_exists('slug', $input) ? trim($input['slug']) : null;
$description = array_key_exists('description', $input) ? trim($input['description']) : null;
$image_url = array_key_exists('image_url', $input) ? trim($input['image_url']) : null;
$sort_order = array_key_exists('sort_order', $input) ? (int) $input['sort_order'] : null;

$pdo = getConnection();
$stmt = $pdo->prepare('SELECT id FROM categories WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Category not found']);
    exit;
}

$updates = [];
$params = [];
foreach (['name' => $name, 'slug' => $slug, 'description' => $description, 'image_url' => $image_url, 'sort_order' => $sort_order] as $col => $val) {
    if ($val !== null) {
        $updates[] = "`$col` = ?";
        $params[] = $val;
    }
}
if (!empty($updates)) {
    $params[] = $id;
    $pdo->prepare('UPDATE categories SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
}
echo json_encode(['success' => true, 'data' => ['id' => $id]]);
