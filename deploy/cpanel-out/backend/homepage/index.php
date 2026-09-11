<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';

$pdo = getConnection();
$action = $_GET['action'] ?? 'active';

if ($action === 'active') {
    $stmt = $pdo->prepare('SELECT * FROM banners WHERE is_active = 1 AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()) ORDER BY sort_order ASC, id DESC');
    $stmt->execute();
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

if ($action === 'all') {
    $stmt = $pdo->query('SELECT * FROM banners ORDER BY sort_order ASC, id DESC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

if ($action === 'sections') {
    $stmt = $pdo->query('SELECT * FROM homepage_sections WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
    $rows = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $rows]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid action']);
