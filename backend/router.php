<?php
/**
 * Router for PHP built-in server - ensures /api/*.php requests are handled correctly.
 * Run from project root: php -S localhost:8000 backend/router.php
 */
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Serve uploaded static files (QR, product/category images, payment proofs, etc.)
if (strpos($uri, '/uploads/') === 0) {
    $rel = ltrim(substr($uri, strlen('/uploads/')), '/');
    $path = __DIR__ . '/uploads/' . str_replace(['..', '\\'], '', $rel);
    if (is_file($path)) {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $types = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
        ];
        header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
        header('Content-Length: ' . filesize($path));
        readfile($path);
        return true;
    }
}

if (strpos($uri, '/api/') === 0) {
    $file = __DIR__ . $uri;
    if (is_file($file) && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
        require $file;
        return true;
    }
}
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['success' => false, 'message' => 'Not Found', 'path' => $uri]);
return true;
