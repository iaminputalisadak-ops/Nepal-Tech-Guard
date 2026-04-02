<?php
require_once __DIR__ . '/../cors.php';

// Read credentials: raw body (JSON or form string) first, then $_POST, then $_REQUEST
$raw = file_get_contents('php://input') ?: '';
$input = [];
if ($raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $input = $decoded;
    } else {
        parse_str($raw, $input);
        $input = is_array($input) ? $input : [];
    }
}
$input = array_merge($input, $_POST, $_REQUEST);
$login = trim((string) ($input['username'] ?? $input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

if (!$login || !$password) {
    http_response_code(400);
    $err = 'Username/email and password required';
    echo json_encode(['success' => false, 'message' => $err, 'error' => $err]);
    exit;
}

require_once __DIR__ . '/../../config/database.php';

$pdo = getConnection();
// Support login by username or email
$stmt = $pdo->prepare('SELECT id, username, email, password_hash, name FROM admin_users WHERE username = ? OR email = ?');
$stmt->execute([$login, $login]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    $err = 'Invalid credentials';
    echo json_encode(['success' => false, 'message' => $err, 'error' => $err]);
    exit;
}

// Simple token (use JWT in production)
$token = bin2hex(random_bytes(32));
// Store token in DB or cache in production; for demo we return user + token
echo json_encode([
    'success' => true,
    'token'   => $token,
    'user'    => [
        'id'       => (int) $user['id'],
        'username' => $user['username'] ?? $user['email'],
        'email'    => $user['email'] ?? null,
        'name'     => $user['name'],
    ],
]);
