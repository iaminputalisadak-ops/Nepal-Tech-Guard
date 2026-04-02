<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$customer_name = trim($input['customer_name'] ?? '');
$customer_email = trim($input['customer_email'] ?? '');
$customer_phone = trim($input['customer_phone'] ?? '');
$items = $input['items'] ?? [];
$notes = trim($input['notes'] ?? '');
$payment_method = trim($input['payment_method'] ?? '');

if (!$customer_name || !$customer_email || empty($items)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email and at least one item required']);
    exit;
}

$pdo = getConnection();
$order_number = 'NTG-' . strtoupper(substr(uniqid(), -8)) . '-' . date('Ymd');
$total = 0;
$order_items = [];
foreach ($items as $item) {
    $product_id = (int) ($item['product_id'] ?? 0);
    $variant_id = isset($item['variant_id']) ? (int) $item['variant_id'] : null;
    $qty = max(1, (int) ($item['quantity'] ?? 1));
    $unit_price = (float) ($item['unit_price'] ?? 0);
    $product_name = trim($item['product_name'] ?? '');
    $variant_name = trim($item['variant_name'] ?? '');
    if ($product_id && $unit_price > 0) {
        $order_items[] = compact('product_id', 'variant_id', 'product_name', 'variant_name', 'qty', 'unit_price');
        $total += $unit_price * $qty;
    }
}
if (empty($order_items)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid order items required']);
    exit;
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total_amount, status, payment_method, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $order_number,
        $customer_name,
        $customer_email,
        $customer_phone,
        $total,
        'pending',
        ($payment_method !== '' ? $payment_method : null),
        'unpaid',
        $notes ?: null,
    ]);
    $order_id = (int) $pdo->lastInsertId();
    $ins = $pdo->prepare('INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($order_items as $oi) {
        $ins->execute([$order_id, $oi['product_id'], $oi['variant_id'], $oi['product_name'], $oi['variant_name'] ?: null, $oi['qty'], $oi['unit_price'], $oi['unit_price'] * $oi['qty']]);
    }
    $pdo->commit();
    echo json_encode(['success' => true, 'data' => ['id' => $order_id, 'order_number' => $order_number, 'total' => $total, 'payment_method' => ($payment_method !== '' ? $payment_method : null), 'payment_status' => 'unpaid']]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Order failed']);
}
