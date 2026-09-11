<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM menus ORDER BY id ASC');
    $menus = $stmt->fetchAll();

    foreach ($menus as &$m) {
        $itemsStmt = $pdo->prepare('SELECT * FROM menu_items WHERE menu_id = ? ORDER BY sort_order ASC, id ASC');
        $itemsStmt->execute([$m['id']]);
        $m['items'] = $itemsStmt->fetchAll();
    }
    echo json_encode(['success' => true, 'data' => $menus]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST' && ($_GET['type'] ?? '') === 'item') {
    $menu_id = (int) ($input['menu_id'] ?? 0);
    $parent_id = (int) ($input['parent_id'] ?? 0);
    $title = trim($input['title'] ?? '');
    $url = trim($input['url'] ?? '');
    $target = trim($input['target'] ?? '_self');
    $sort_order = (int) ($input['sort_order'] ?? 0);
    $is_active = !empty($input['is_active']) ? 1 : 0;

    if (!$menu_id || !$title || !$url) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Menu, title and URL required']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO menu_items (menu_id, parent_id, title, url, target, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$menu_id, $parent_id ?: null, $title, $url, $target, $sort_order, $is_active]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id && ($_GET['type'] ?? '') === 'menu') {
        $name = trim($input['name'] ?? '');
        $location = trim($input['location'] ?? 'main');
        $is_active = !empty($input['is_active']) ? 1 : 0;
        $stmt = $pdo->prepare('INSERT INTO menus (name, location, is_active) VALUES (?, ?, ?)');
        $stmt->execute([$name, $location, $is_active]);
        echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
        exit;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }

    if (($_GET['type'] ?? '') === 'item') {
        $updates = [];
        $params = [];
        foreach (['title', 'url', 'target', 'parent_id'] as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "`$f` = ?";
                $params[] = $input[$f] ?? null;
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
            $pdo->prepare('UPDATE menu_items SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
        }
    } else {
        $updates = [];
        $params = [];
        foreach (['name', 'location'] as $f) {
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
            $pdo->prepare('UPDATE menus SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
        }
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        exit;
    }
    if (($_GET['type'] ?? '') === 'item') {
        $pdo->prepare('DELETE FROM menu_items WHERE id = ?')->execute([$id]);
    } else {
        $pdo->prepare('DELETE FROM menus WHERE id = ?')->execute([$id]);
    }
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
