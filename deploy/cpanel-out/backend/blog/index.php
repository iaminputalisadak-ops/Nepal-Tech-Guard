<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$limit = min(50, max(1, (int) ($_GET['limit'] ?? 20)));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare("SELECT id, slug, title, description, cover_image_url, seo_title, seo_description, published_at
                           FROM blog_posts
                           WHERE status = 'published'
                           ORDER BY published_at DESC, id DESC
                           LIMIT $limit OFFSET $offset");
    $stmt->execute();
    $rows = $stmt->fetchAll() ?: [];
    echo json_encode(['success' => true, 'data' => $rows]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

