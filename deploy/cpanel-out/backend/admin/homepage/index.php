<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM homepage_sections ORDER BY sort_order ASC, id ASC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $section_type = $input['section_type'] ?? '';
    $title = trim($input['title'] ?? '');
    $subtitle = trim($input['subtitle'] ?? '');
    $is_active = !empty($input['is_active']) ? 1 : 0;
    $sort_order = (int) ($input['sort_order'] ?? 0);
    $config = $input['config'] ?? null;

    if (!$section_type) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Section type required']);
        exit;
    }

    $sort_order = (int) $pdo->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM homepage_sections')->fetchColumn();
    $stmt = $pdo->prepare('INSERT INTO homepage_sections (section_type, title, subtitle, is_active, sort_order, config) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$section_type, $title, $subtitle, $is_active, $sort_order, $config ? json_encode($config) : null]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Section ID required']);
        exit;
    }

    $updates = [];
    $params = [];
    foreach (['section_type', 'title', 'subtitle'] as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "`$f` = ?";
            $params[] = $input[$f] ?: null;
        }
    }
    if (array_key_exists('is_active', $input)) {
        $updates[] = 'is_active = ?';
        $params[] = !empty($input['is_active']) ? 1 : 0;
    }
    if (array_key_exists('sort_order', $input)) {
        $updates[] = 'sort_order = ?';
        $params[] = (int) $input['sort_order'];
    }
    if (array_key_exists('config', $input)) {
        $updates[] = 'config = ?';
        $params[] = $input['config'] ? json_encode($input['config']) : null;
    }

    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE homepage_sections SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Section ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM homepage_sections WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
