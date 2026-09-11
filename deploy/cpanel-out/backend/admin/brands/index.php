<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM brands ORDER BY name ASC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $name = trim($input['name'] ?? '');
    $slug = trim($input['slug'] ?? '');
    $description = trim($input['description'] ?? '');
    $logo_url = trim($input['logo_url'] ?? '');
    $is_active = !empty($input['is_active']) ? 1 : 0;

    if (!$name) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Brand name required']);
        exit;
    }
    if (!$slug) {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
    }

    $stmt = $pdo->prepare('INSERT INTO brands (name, slug, description, logo_url, is_active) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$name, $slug, $description, $logo_url ?: null, $is_active]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Brand ID required']);
        exit;
    }

    $updates = [];
    $params = [];
    foreach (['name', 'slug', 'description', 'logo_url'] as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "`$f` = ?";
            $params[] = $input[$f] ?: null;
        }
    }
    if (array_key_exists('is_active', $input)) {
        $updates[] = 'is_active = ?';
        $params[] = !empty($input['is_active']) ? 1 : 0;
    }
    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE brands SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Brand ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM brands WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
