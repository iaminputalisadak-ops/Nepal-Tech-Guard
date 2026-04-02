<?php
/**
 * Database connection test - upload to your cPanel SUBDOMAIN ROOT and open in browser.
 * Example: https://yoursubdomain.com/test-db-connection.php
 * DELETE this file after fixing the connection (security).
 */
header('Content-Type: application/json; charset=utf-8');

$out = ['ok' => false, 'message' => '', 'config_path' => ''];

// Config must be in: document_root/config/database.php (same level as api/, not inside api/)
$configPath = __DIR__ . '/config/database.php';
$out['config_path'] = $configPath;
$out['config_exists'] = file_exists($configPath);

if (!file_exists($configPath)) {
    $out['message'] = 'config/database.php NOT FOUND. Create folder "config" in your subdomain root and put database.php inside it with your cPanel DB name, user, password.';
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

require_once $configPath;

try {
    $pdo = getConnection();
    $stmt = $pdo->query('SELECT 1');
    $out['ok'] = true;
    $out['message'] = 'Database connected successfully.';
    // Check if tables exist
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $out['tables'] = $tables;
    if (!in_array('admin_users', $tables)) {
        $out['message'] .= ' But table admin_users is missing. Import database/init.sql in phpMyAdmin.';
    }
} catch (PDOException $e) {
    $out['message'] = 'Connection failed: ' . $e->getMessage();
    $out['hint'] = 'Check DB_NAME, DB_USER, DB_PASS in config/database.php. In cPanel, add the user to the database with ALL PRIVILEGES.';
} catch (Throwable $e) {
    $out['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($out, JSON_PRETTY_PRINT);
