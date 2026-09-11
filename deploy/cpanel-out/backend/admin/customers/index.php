<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM customers ORDER BY id DESC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Customer ID required']);
        exit;
    }
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $updates = [];
    $params = [];
    foreach (['name', 'email', 'phone'] as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "`$f` = ?";
            $params[] = $input[$f];
        }
    }
    if (array_key_exists('is_active', $input)) {
        $updates[] = 'is_active = ?';
        $params[] = !empty($input['is_active']) ? 1 : 0;
    }
    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE customers SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
