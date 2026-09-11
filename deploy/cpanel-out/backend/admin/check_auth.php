<?php
// Simple auth check - in production use JWT or session
// For now we accept Authorization: Bearer <token> and validate admin exists (demo: any non-empty token)
function requireAdmin(): void {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$auth && function_exists('getallheaders')) {
        $h = getallheaders();
        $auth = $h['Authorization'] ?? $h['authorization'] ?? '';
    }
    if (!preg_match('/Bearer\s+(.+)/', $auth, $m)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in again.']);
        exit;
    }
    $token = trim($m[1] ?? '');
    if (strlen($token) < 10) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token. Please log out and log in again.']);
        exit;
    }
}
