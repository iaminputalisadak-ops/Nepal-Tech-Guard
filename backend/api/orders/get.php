<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$order_number = trim($_GET['order_number'] ?? '');
if (!$order_number) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'order_number required']);
    exit;
}

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare('SELECT id, order_number, customer_name, customer_email, customer_phone, total_amount, status, payment_status, payment_method, payment_reference, payment_proof_url, created_at FROM orders WHERE order_number = ? LIMIT 1');
    $stmt->execute([$order_number]);
    $order = $stmt->fetch();
    if (!$order) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    $itemsStmt = $pdo->prepare('SELECT product_id, variant_id, product_name, variant_name, quantity, unit_price, total_price FROM order_items WHERE order_id = ? ORDER BY id ASC');
    $itemsStmt->execute([(int)$order['id']]);
    $items = $itemsStmt->fetchAll() ?: [];
    echo json_encode(['success' => true, 'data' => ['order' => $order, 'items' => $items]]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

