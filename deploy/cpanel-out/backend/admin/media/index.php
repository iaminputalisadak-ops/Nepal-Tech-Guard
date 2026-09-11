<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $product_id = isset($_GET['product_id']) ? (int) $_GET['product_id'] : 0;
    if ($product_id) {
        $stmt = $pdo->prepare('SELECT pi.*, p.name AS product_name FROM product_images pi JOIN products p ON p.id = pi.product_id WHERE pi.product_id = ? ORDER BY pi.sort_order ASC, pi.id ASC');
        $stmt->execute([$product_id]);
    } else {
        $stmt = $pdo->query('SELECT pi.*, p.name AS product_name FROM product_images pi JOIN products p ON p.id = pi.product_id ORDER BY pi.product_id ASC, pi.sort_order ASC, pi.id ASC');
    }
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $product_id = (int) ($input['product_id'] ?? 0);
    $image_url = trim($input['image_url'] ?? '');
    $is_main = !empty($input['is_main']) ? 1 : 0;
    $sort_order = (int) ($input['sort_order'] ?? 0);

    if (!$product_id || !$image_url) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID and image URL required']);
        exit;
    }

    if ($is_main) {
        $pdo->prepare('UPDATE product_images SET is_main = 0 WHERE product_id = ?')->execute([$product_id]);
    }

    $stmt = $pdo->prepare('INSERT INTO product_images (product_id, image_url, is_main, sort_order) VALUES (?, ?, ?, ?)');
    $stmt->execute([$product_id, $image_url, $is_main, $sort_order]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Image ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM product_images WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
