<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

header('Content-Type: application/json; charset=utf-8');

$imageUrl = null;

// Option 1: Multipart file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_FILES['image']['tmp_name'])) {
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

    $uploadDir = dirname(dirname(dirname(__DIR__))) . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = 'windows-81-pro-retail-key.png';
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'png';
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $filename = 'windows-81-pro-retail-key.' . $ext;
    }
    $path = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $path)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Save failed']);
        exit;
    }

    // Build full URL so stored image_url works from frontend (any origin/port)
    $scriptPath = $_SERVER['SCRIPT_NAME'] ?? '';
    // From .../backend/api/admin/products/bulk_image.php go up 4 levels to backend
    $backendPath = str_replace('\\', '/', dirname(dirname(dirname(dirname($scriptPath)))));
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $imageUrl = $scheme . '://' . $host . rtrim($backendPath, '/') . '/uploads/' . $filename;
}

// Option 2: JSON body with image_url
if ($imageUrl === null) {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $imageUrl = isset($input['image_url']) ? trim($input['image_url']) : null;
}

if (!$imageUrl) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Provide image file (multipart) or image_url in JSON']);
    exit;
}

$pdo = getConnection();
$stmt = $pdo->prepare('UPDATE products SET image_url = ?');
$stmt->execute([$imageUrl]);
$count = $stmt->rowCount();

$message = $count > 0
    ? "Updated {$count} products."
    : "Image saved successfully. No products in the database yet – add products and run “Apply to all” again to set this image for all.";

echo json_encode([
    'success' => true,
    'message' => $message,
    'image_url' => $imageUrl,
    'count' => $count,
]);
