<?php
/**
 * Database config for cPanel - Nepal TechGuard
 *
 * 1. Copy this file to: config/database.php (on your server, inside the "config" folder you uploaded)
 * 2. Replace the 3 values below with your cPanel MySQL details.
 *
 * Where to find these in cPanel:
 * - Log in to cPanel → MySQL® Databases
 * - Create Database → note the full name (e.g. myuser_nepaltech)
 * - Create User → note username and password
 * - Add User to Database → give ALL PRIVILEGES
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'YOUR_CPANEL_DATABASE_NAME');   // e.g. myuser_nepaltech
define('DB_USER', 'YOUR_CPANEL_DATABASE_USER');  // e.g. myuser_dbuser
define('DB_PASS', 'YOUR_CPANEL_DATABASE_PASSWORD');
define('DB_CHARSET', 'utf8mb4');

function getConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
}
