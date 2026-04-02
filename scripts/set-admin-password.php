<?php
/**
 * Set a new admin password (avoids "password found in data breach" browser warning).
 * Run from project root: php scripts/set-admin-password.php
 * Or: C:\xampp\php\php.exe scripts/set-admin-password.php
 */
$newPassword = 'NtG#Admin24'; // Strong, unique - change if you prefer

require_once __DIR__ . '/../backend/config/database.php';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);
$pdo = getConnection();
$pdo->prepare("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'")->execute([$hash]);
echo "Admin password updated.\n";
echo "Username: admin\n";
echo "New password: " . $newPassword . "\n";
echo "Use these to log in at http://localhost:5173/admin\n";
