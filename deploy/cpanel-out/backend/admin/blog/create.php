<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$title = trim($input['title'] ?? '');
$slug = trim($input['slug'] ?? '');
$description = trim($input['description'] ?? '');
$cover_image_url = trim($input['cover_image_url'] ?? '');
$content_html = (string) ($input['content_html'] ?? '');
$seo_title = trim($input['seo_title'] ?? '');
$seo_description = trim($input['seo_description'] ?? '');
$status = trim($input['status'] ?? 'draft');
$published_at = trim($input['published_at'] ?? '');

if ($title === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Title required']);
    exit;
}

if ($slug === '') {
    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $title));
    $slug = trim($slug, '-');
}

if ($status !== 'draft' && $status !== 'published') $status = 'draft';
if ($status === 'published' && $published_at === '') {
    $published_at = date('Y-m-d H:i:s');
}
if ($status === 'draft') {
    $published_at = null;
}

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare('INSERT INTO blog_posts (slug, title, description, cover_image_url, content_html, seo_title, seo_description, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $slug,
        $title,
        $description !== '' ? $description : null,
        $cover_image_url !== '' ? $cover_image_url : null,
        $content_html,
        $seo_title !== '' ? $seo_title : null,
        $seo_description !== '' ? $seo_description : null,
        $status,
        $published_at,
    ]);
    echo json_encode(['success' => true, 'data' => ['id' => (int)$pdo->lastInsertId()]]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

