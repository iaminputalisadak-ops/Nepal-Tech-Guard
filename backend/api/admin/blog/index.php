<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$limit = min(200, max(1, (int) ($_GET['limit'] ?? 50)));
$offset = max(0, (int) ($_GET['offset'] ?? 0));
$status = trim($_GET['status'] ?? '');

try {
    $pdo = getConnection();
    $sql = "SELECT id, slug, title, description, cover_image_url, seo_title, seo_description, status, published_at, created_at, updated_at
            FROM blog_posts WHERE 1=1";
    $params = [];
    if ($status === 'draft' || $status === 'published') {
        $sql .= " AND status = ?";
        $params[] = $status;
    }
    $sql .= " ORDER BY updated_at DESC, id DESC LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll() ?: [];
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

