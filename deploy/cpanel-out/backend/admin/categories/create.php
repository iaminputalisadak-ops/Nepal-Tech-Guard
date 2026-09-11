<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$name = trim($input['name'] ?? '');
$slug = trim($input['slug'] ?? '');
$description = trim($input['description'] ?? '');
$image_url = trim($input['image_url'] ?? '');

if (!$name) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Category name required']);
    exit;
}
if (!$slug) {
    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
}

$pdo = getConnection();
$sort_order = (int) $pdo->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories')->fetchColumn();
$stmt = $pdo->prepare('INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$name, $slug, $description, $image_url ?: null, $sort_order]);
$id = (int) $pdo->lastInsertId();
echo json_encode(['success' => true, 'data' => ['id' => $id]]);
