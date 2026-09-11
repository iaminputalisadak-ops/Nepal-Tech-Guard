<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../config/database.php';

$slug = trim($_GET['slug'] ?? '');
if (!$slug) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'slug required']);
    exit;
}

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare("SELECT id, slug, title, description, cover_image_url, content_html, seo_title, seo_description, published_at
                           FROM blog_posts
                           WHERE slug = ? AND status = 'published'
                           LIMIT 1");
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Not found']);
        exit;
    }
    echo json_encode(['success' => true, 'data' => $row]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

