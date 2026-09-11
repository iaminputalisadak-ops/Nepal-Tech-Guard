<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM banners ORDER BY sort_order ASC, id DESC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    $subtitle = trim($input['subtitle'] ?? '');
    $image_url = trim($input['image_url'] ?? '');
    $cta_text = trim($input['cta_text'] ?? '');
    $cta_link = trim($input['cta_link'] ?? '');
    $is_active = !empty($input['is_active']) ? 1 : 0;
    $sort_order = (int) ($input['sort_order'] ?? 0);
    $start_date = $input['start_date'] ?: null;
    $end_date = $input['end_date'] ?: null;

    if (!$title || !$image_url) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title and image are required']);
        exit;
    }

    $sort_order = (int) $pdo->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM banners')->fetchColumn();
    $stmt = $pdo->prepare('INSERT INTO banners (title, subtitle, image_url, cta_text, cta_link, is_active, sort_order, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$title, $subtitle, $image_url, $cta_text, $cta_link, $is_active, $sort_order, $start_date, $end_date]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Banner ID required']);
        exit;
    }

    $updates = [];
    $params = [];
    $fields = ['title', 'subtitle', 'image_url', 'cta_text', 'cta_link', 'start_date', 'end_date'];
    foreach ($fields as $f) {
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

    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE banners SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Banner ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM banners WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
