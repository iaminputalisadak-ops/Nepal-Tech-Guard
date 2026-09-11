<?php
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$pdo = getConnection();
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $key = $_GET['key'] ?? '';
    $stmt = $pdo->prepare('SELECT settings_json FROM site_settings WHERE id = 1');
    $stmt->execute();
    $row = $stmt->fetch();
    $settings = $row ? json_decode($row['settings_json'], true) : [];

    if ($key) {
        echo json_encode(['success' => true, 'data' => $settings[$key] ?? []]);
    } else {
        echo json_encode(['success' => true, 'data' => $settings]);
    }
    exit;
}

$allowed = [
    'homepage_seo', 'page_seo', 'open_graph',
    'canonical_urls', 'meta_keywords', 'robots_settings'
];
$settings = [];
foreach ($allowed as $key) {
    if (array_key_exists($key, $input)) {
        $settings[$key] = $input[$key];
    }
}

$stmt = $pdo->prepare('SELECT settings_json FROM site_settings WHERE id = 1');
$stmt->execute();
$row = $stmt->fetch();
$existing = $row ? json_decode($row['settings_json'], true) : [];
if (!is_array($existing)) $existing = [];
$merged = array_merge($existing, $settings);
$json = json_encode($merged);
$stmt = $pdo->prepare('INSERT INTO site_settings (id, settings_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_json = ?');
$stmt->execute([$json, $json]);
echo json_encode(['success' => true, 'data' => $merged]);
