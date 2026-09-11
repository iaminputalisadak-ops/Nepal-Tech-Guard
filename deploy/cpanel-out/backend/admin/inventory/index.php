<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $low = (int) $pdo->query('SELECT COUNT(*) FROM product_variants WHERE stock > 0 AND stock <= 5')->fetchColumn();
    $out = (int) $pdo->query('SELECT COUNT(*) FROM product_variants WHERE stock = 0')->fetchColumn();

    $stmt = $pdo->query('SELECT pv.id, pv.product_id, p.name AS product_name, pv.name AS variant_name, pv.sku, pv.stock, CASE WHEN pv.stock = 0 THEN "out_of_stock" WHEN pv.stock <= 5 THEN "low_stock" ELSE "in_stock" END AS stock_status FROM product_variants pv JOIN products p ON p.id = pv.product_id ORDER BY pv.stock ASC, p.name ASC LIMIT 200');
    $rows = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'low_stock_count' => $low,
            'out_of_stock_count' => $out,
            'items' => $rows,
        ]
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = (int) ($input['id'] ?? $_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Variant ID required']);
        exit;
    }
    if (!array_key_exists('stock', $input)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Stock value required']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT stock FROM product_variants WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Variant not found']);
        exit;
    }

    $oldStock = (int) $row['stock'];
    $newStock = (int) $input['stock'];
    $change = $newStock - $oldStock;

    $pdo->prepare('UPDATE product_variants SET stock = ? WHERE id = ?')->execute([$newStock, $id]);
    $productId = (int) ($input['product_id'] ?? 0);
    if ($productId) {
        $pdo->prepare('INSERT INTO inventory_log (product_id, variant_id, change_type, quantity_change, previous_stock, new_stock, notes) VALUES (?, ?, "adjustment", ?, ?, ?, ?)')->execute([$productId, $id, $change, $oldStock, $newStock, $input['notes'] ?? '']);
    }

    echo json_encode(['success' => true, 'data' => ['id' => $id, 'stock' => $newStock]]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
