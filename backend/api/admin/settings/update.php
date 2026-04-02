<?php
/**
 * Admin API - Update site settings (requires auth)
 */
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../check_auth.php';

requireAdmin();

$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (empty($input) || !is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$allowed = [
    'contact_address', 'contact_phone', 'contact_email',
    'policy_links', 'info_links', 'social_links',
    'company_name', 'copyright_slogan', 'copyright_tagline',
    'payment_methods', 'page_contents',
    'payment_qr_image_url', 'payment_qr_title', 'payment_qr_instructions',
    'payment_thankyou_message',
];
$settings = [];
foreach ($allowed as $key) {
    if (array_key_exists($key, $input)) {
        $val = $input[$key];
        if (in_array($key, ['policy_links', 'info_links', 'social_links', 'payment_methods']) && !is_array($val)) {
            $val = [];
        }
        if ($key === 'page_contents' && !is_array($val)) {
            $val = [];
        }
        $settings[$key] = $val;
    }
}

try {
    $pdo = getConnection();
    $stmt = $pdo->query('SELECT settings_json FROM site_settings WHERE id = 1');
    $row = $stmt->fetch();
    $existing = $row ? json_decode($row['settings_json'], true) : [];
    if (!is_array($existing)) {
        $existing = [];
    }
    $merged = array_merge($existing, $settings);
    if (isset($settings['page_contents']) && is_array($settings['page_contents'])) {
        $merged['page_contents'] = array_merge($existing['page_contents'] ?? [], $settings['page_contents']);
    }
    $json = json_encode($merged);

    $stmt = $pdo->prepare('INSERT INTO site_settings (id, settings_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE settings_json = ?');
    $stmt->execute([$json, $json]);
    echo json_encode(['success' => true, 'data' => $merged]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error. Run database/migrate_site_settings.sql first.']);
}
