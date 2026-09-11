<?php
/**
 * Dynamic XML sitemap for Google Search Console.
 * Always emit https URLs. Product query is defensive so a missing column cannot empty the file.
 */
header('Content-Type: application/xml; charset=utf-8');
header('X-Robots-Tag: noindex');
header('Cache-Control: public, max-age=600');

$host = $_SERVER['HTTP_HOST'] ?? 'shop.hedztech.com';
$base = 'https://' . preg_replace('/^www\./', '', $host);
$today = date('Y-m-d');

$urls = [
    ['loc' => $base . '/', 'priority' => '1.0', 'freq' => 'daily', 'lastmod' => $today],
];

$configFile = null;
foreach ([
    __DIR__ . '/../config/database.php',
    __DIR__ . '/../../config/database.php',
    dirname(__DIR__, 2) . '/config/database.php',
] as $file) {
    if (is_file($file)) {
        $configFile = $file;
        break;
    }
}

if ($configFile) {
    try {
        require_once $configFile;
        $pdo = getConnection();

        try {
            $cats = $pdo->query("SELECT slug, updated_at FROM categories WHERE slug IS NOT NULL AND slug != '' AND slug != 'assasassas' ORDER BY sort_order ASC");
            foreach ($cats as $c) {
                $slug = rawurlencode((string) $c['slug']);
                $urls[] = [
                    'loc' => $base . '/category/' . $slug,
                    'priority' => '0.9',
                    'freq' => 'weekly',
                    'lastmod' => substr((string) ($c['updated_at'] ?? $today), 0, 10),
                ];
            }
        } catch (Throwable $e) {
        }

        try {
            $prods = $pdo->query('SELECT id, slug, updated_at FROM products WHERE is_active = 1 ORDER BY id DESC');
            foreach ($prods as $p) {
                $slug = trim((string) ($p['slug'] ?? ''));
                $path = $slug !== '' ? '/product/' . rawurlencode($slug) : '/product/' . (int) $p['id'];
                $urls[] = [
                    'loc' => $base . $path,
                    'priority' => '0.8',
                    'freq' => 'weekly',
                    'lastmod' => substr((string) ($p['updated_at'] ?? $today), 0, 10),
                ];
            }
        } catch (Throwable $e) {
        }
    } catch (Throwable $e) {
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($u['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
    if (!empty($u['lastmod'])) {
        echo '    <lastmod>' . htmlspecialchars($u['lastmod'], ENT_XML1) . "</lastmod>\n";
    }
    echo '    <changefreq>' . $u['freq'] . "</changefreq>\n";
    echo '    <priority>' . $u['priority'] . "</priority>\n";
    echo "  </url>\n";
}
echo "</urlset>\n";
