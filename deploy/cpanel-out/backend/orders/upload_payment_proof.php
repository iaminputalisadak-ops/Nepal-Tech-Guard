<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$order_number = trim($_POST['order_number'] ?? '');
if (!$order_number) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'order_number required']);
    exit;
}

if (empty($_FILES['image'])) {
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

if (!in_array($file['type'] ?? '', $allowed, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Allowed: JPG, PNG, GIF, WebP']);
    exit;
}

if (($file['size'] ?? 0) > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Max size 5MB']);
    exit;
}

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare('SELECT id FROM orders WHERE order_number = ? LIMIT 1');
    $stmt->execute([$order_number]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }

    $uploadDir = dirname(dirname(__DIR__)) . '/uploads/payment_proofs/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION)) ?: 'jpg';
    $name = uniqid('pay_') . '.' . $ext;
    $path = $uploadDir . $name;

    if (!move_uploaded_file($file['tmp_name'], $path)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Save failed']);
        exit;
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = dirname(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? ''))); // backend folder e.g. /Nepal-TechGuard/backend
    $base = str_replace('\\', '/', $scriptDir);
    $url = $scheme . '://' . $host . rtrim($base, '/') . '/uploads/payment_proofs/' . $name;

    $upd = $pdo->prepare('UPDATE orders SET payment_proof_url = ?, payment_status = ? WHERE order_number = ?');
    $upd->execute([$url, 'pending', $order_number]);

    echo json_encode(['success' => true, 'url' => $url]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error']);
}

