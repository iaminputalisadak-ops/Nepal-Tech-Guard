<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM coupons ORDER BY id DESC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($method === 'POST') {
    $code = strtoupper(trim($input['code'] ?? ''));
    $type = $input['type'] ?? 'percentage';
    $discount_value = (float) ($input['discount_value'] ?? 0);
    $min_order_amount = (float) ($input['min_order_amount'] ?? 0);
    $max_discount = array_key_exists('max_discount', $input) && $input['max_discount'] !== '' ? (float) $input['max_discount'] : null;
    $usage_limit = (int) ($input['usage_limit'] ?? 0);
    $starts_at = $input['starts_at'] ?: null;
    $expires_at = $input['expires_at'] ?: null;
    $applicable_categories = $input['applicable_categories'] ?? null;
    $applicable_products = $input['applicable_products'] ?? null;

    if (!$code || $discount_value <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Code and discount value required']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO coupons (code, type, discount_value, min_order_amount, max_discount, usage_limit, starts_at, expires_at, applicable_categories, applicable_products) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$code, $type, $discount_value, $min_order_amount, $max_discount, $usage_limit ?: null, $starts_at, $expires_at, $applicable_categories ? json_encode($applicable_categories) : null, $applicable_products ? json_encode($applicable_products) : null]);
    echo json_encode(['success' => true, 'data' => ['id' => (int) $pdo->lastInsertId()]]);
    exit;
}

if ($method === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Coupon ID required']);
        exit;
    }

    $updates = [];
    $params = [];
    $fields = ['code', 'type', 'min_order_amount', 'starts_at', 'expires_at'];
    foreach ($fields as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "`$f` = ?";
            $params[] = $input[$f] ?: null;
        }
    }
    if (array_key_exists('discount_value', $input)) {
        $updates[] = 'discount_value = ?';
        $params[] = (float) $input['discount_value'];
    }
    if (array_key_exists('max_discount', $input)) {
        $updates[] = 'max_discount = ?';
        $params[] = $input['max_discount'] !== '' ? (float) $input['max_discount'] : null;
    }
    if (array_key_exists('usage_limit', $input)) {
        $updates[] = 'usage_limit = ?';
        $params[] = (int) $input['usage_limit'];
    }
    if (array_key_exists('is_active', $input)) {
        $updates[] = 'is_active = ?';
        $params[] = !empty($input['is_active']) ? 1 : 0;
    }
    if (array_key_exists('applicable_categories', $input)) {
        $updates[] = 'applicable_categories = ?';
        $params[] = $input['applicable_categories'] ? json_encode($input['applicable_categories']) : null;
    }
    if (array_key_exists('applicable_products', $input)) {
        $updates[] = 'applicable_products = ?';
        $params[] = $input['applicable_products'] ? json_encode($input['applicable_products']) : null;
    }

    if (!empty($updates)) {
        $params[] = $id;
        $pdo->prepare('UPDATE coupons SET ' . implode(', ', $updates) . ' WHERE id = ?')->execute($params);
    }
    echo json_encode(['success' => true, 'data' => ['id' => $id]]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? $input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Coupon ID required']);
        exit;
    }
    $pdo->prepare('DELETE FROM coupons WHERE id = ?')->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
