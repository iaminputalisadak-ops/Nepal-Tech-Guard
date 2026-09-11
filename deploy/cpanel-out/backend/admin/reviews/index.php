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
        $stmt = $pdo->prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC');
        $stmt->execute([$product_id]);
    } else {
        $stmt = $pdo->query('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 200');
    }
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Review ID required']);
        exit;
    }
    $updates = [];
    $params = [];
    foreach (['is_approved', 'is_hidden'] as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "$f = ?";
            $params[] = !empty($input[$f]) ? 1 : 0;
        }
    }
    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE reviews SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Review ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM reviews WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
