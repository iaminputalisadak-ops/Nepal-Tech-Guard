<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getConnection();
$stmt = $pdo->query('SELECT id, name, slug, description, image_url, sort_order FROM categories ORDER BY sort_order ASC, name ASC');
$categories = $stmt->fetchAll();

foreach ($categories as &$c) {
    $c['id'] = (int) $c['id'];
}

echo json_encode(['success' => true, 'data' => $categories]);
