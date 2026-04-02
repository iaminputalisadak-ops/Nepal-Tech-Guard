<?php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

try {
    $pdo = getConnection();
    $stmt = $pdo->query('SELECT id, order_number, customer_name, customer_email, customer_phone, total_amount, status, payment_status, payment_method, payment_reference, payment_proof_url, created_at FROM orders ORDER BY id DESC LIMIT 200');
    $rows = $stmt ? $stmt->fetchAll() : [];
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

