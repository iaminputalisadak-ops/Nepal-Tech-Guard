<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$action = $_GET['action'] ?? 'stats';

if ($action === 'stats') {
    $totalProducts = (int) $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $totalOrders = (int) $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    $pendingOrders = (int) $pdo->query('SELECT COUNT(*) FROM orders WHERE status IN ("pending","paid")')->fetchColumn();
    $completedOrders = (int) $pdo->query('SELECT COUNT(*) FROM orders WHERE status IN ("delivered")')->fetchColumn();
    $totalCustomers = (int) $pdo->query('SELECT COUNT(*) FROM customers')->fetchColumn();
    $totalSales = (float) $pdo->query('SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != "cancelled"')->fetchColumn();
    $lowStock = (int) $pdo->query('SELECT COUNT(*) FROM product_variants WHERE stock > 0 AND stock <= 5')->fetchColumn();
    $outOfStock = (int) $pdo->query('SELECT COUNT(*) FROM product_variants WHERE stock = 0')->fetchColumn();

    echo json_encode([
        'success' => true,
        'data' => [
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'completed_orders' => $completedOrders,
            'total_customers' => $totalCustomers,
            'total_sales' => $totalSales,
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
        ]
    ]);
    exit;
}

if ($action === 'recent_orders') {
    $stmt = $pdo->query('SELECT id, order_number, customer_name, total_amount, status, payment_status, created_at FROM orders ORDER BY id DESC LIMIT 10');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

if ($action === 'recent_customers') {
    $stmt = $pdo->query('SELECT id, name, email, phone, total_orders, total_spent, created_at FROM customers ORDER BY id DESC LIMIT 10');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

if ($action === 'sales_chart') {
    $days = isset($_GET['days']) ? min(90, max(1, (int) $_GET['days'])) : 30;
    $stmt = $pdo->prepare('SELECT DATE(created_at) as date, SUM(total_amount) as total FROM orders WHERE status != "cancelled" AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) GROUP BY DATE(created_at) ORDER BY date ASC');
    $stmt->execute([$days]);
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid action']);
