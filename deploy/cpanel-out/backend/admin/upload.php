<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/check_auth.php';

requireAdmin();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No image file']);
    exit;
}

$file = $_FILES['image'];
$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Upload failed']);
    exit;
}

if (!in_array($file['type'] ?? '', $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Allowed: JPG, PNG, GIF, WebP']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Max size 5MB']);
    exit;
}

$uploadDir = dirname(dirname(__DIR__)) . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
$name = uniqid('img_') . '.' . $ext;
$path = $uploadDir . $name;

if (!move_uploaded_file($file['tmp_name'], $path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Save failed']);
    exit;
}

require_once __DIR__ . '/../media.php';
$url = publicSiteBase() . '/uploads/' . $name;

echo json_encode(['success' => true, 'url' => $url]);
