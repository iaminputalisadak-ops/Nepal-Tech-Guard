<?php
/**
 * SEO-friendly front controller. Google gets real HTML; shop.js still runs for shoppers.
 */
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
$base = 'https://' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'shop.hedztech.com');
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$parts = array_values(array_filter(explode('/', $path), 'strlen'));
$page = $parts[0] ?? 'home';
$slug = isset($parts[1]) ? rawurldecode($parts[1]) : '';
$id = isset($parts[1]) ? (int) $parts[1] : 0;

$pdo = null;
foreach ([
    __DIR__ . '/config/database.php',
    __DIR__ . '/../config/database.php',
] as $file) {
    if (is_file($file)) {
        require_once $file;
        try { $pdo = getConnection(); } catch (Throwable $e) { $pdo = null; }
        break;
    }
}

function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function money_npr($n) { return 'Rs. ' . number_format((float) $n); }
function plain($s, $max = 155) {
    $s = html_entity_decode(strip_tags((string) $s), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $s = str_replace(["\xEF\xBF\xBD", '—', '–', '−'], '-', $s);
    $s = preg_replace('/\?{2,}/', '-', $s);
    $s = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $s);
    $s = preg_replace('/\s+/u', ' ', $s);
    $s = trim($s);
    if ($s === '') {
        return '';
    }
    if (function_exists('mb_strlen') && mb_strlen($s) > $max) {
        return rtrim(mb_substr($s, 0, $max - 1)) . '…';
    }
    if (strlen($s) > $max) {
        return rtrim(substr($s, 0, $max - 1)) . '…';
    }
    return $s;
}

$categories = [];
$products = [];
$product = null;
$category = null;
$blogPosts = [];
$blogPost = null;
$blogFile = __DIR__ . '/assets/blog-posts.json';
if (is_file($blogFile)) {
    $blogPosts = json_decode((string) file_get_contents($blogFile), true) ?: [];
}
if ($page === 'blog' && $slug !== '') {
    foreach ($blogPosts as $bp) {
        if (($bp['slug'] ?? '') === $slug) {
            $blogPost = $bp;
            break;
        }
    }
}
if ($pdo) {
    try {
        $categories = $pdo->query("SELECT id, name, slug, description FROM categories WHERE slug != 'assasassas' ORDER BY sort_order ASC, name ASC")->fetchAll();
    } catch (Throwable $e) {}
    try {
        if ($page === 'product' && ($id || $slug !== '')) {
            if ($id && ctype_digit((string) $parts[1])) {
                $st = $pdo->prepare('SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ? AND p.is_active = 1');
                $st->execute([$id]);
            } else {
                $st = $pdo->prepare('SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.slug = ? AND p.is_active = 1');
                $st->execute([$slug]);
            }
            $product = $st->fetch() ?: null;
            if ($product && !empty($product['slug']) && ctype_digit((string) ($parts[1] ?? ''))) {
                header('Location: ' . $base . '/product/' . rawurlencode($product['slug']), true, 301);
                exit;
            }
        } elseif ($page === 'category' && $slug) {
            foreach ($categories as $c) {
                if ($c['slug'] === $slug) { $category = $c; break; }
            }
            if ($category) {
                $st = $pdo->prepare('SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.is_active = 1 AND p.category_id = ? ORDER BY p.is_featured DESC, p.id DESC');
                $st->execute([(int) $category['id']]);
                $products = $st->fetchAll();
            }
        } elseif ($page !== 'blog') {
            $products = $pdo->query('SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON c.id = p.category_id WHERE p.is_active = 1 AND p.is_featured = 1 ORDER BY p.created_at DESC LIMIT 12')->fetchAll();
        }
    } catch (Throwable $e) {}
}

$title = 'Nepal TechGuard | Genuine Software & License Keys in Nepal';
$desc = 'Buy genuine Windows 11 Pro, MS Office, Antivirus and Adobe license keys in Nepal. Instant delivery in Kathmandu.';
$canon = $base . '/';
$ogType = 'website';
$ogImage = $base . '/assets/hero-shop.jpg';
$noindex = in_array($page, ['admin', 'cart', 'checkout', 'search'], true);

if ($page === 'category' && $category) {
    $title = $category['name'] . ' License Keys in Nepal | Nepal TechGuard';
    $desc = plain($category['description'], 110);
    $desc = ($desc ? $desc . ' ' : '') . 'Buy genuine ' . $category['name'] . ' license keys in Nepal. Instant delivery.';
    $desc = plain($desc, 160);
    $canon = $base . '/category/' . rawurlencode($category['slug']);
    $ogImage = $base . '/backend/cover.php?title=' . rawurlencode($category['name']) . '&slug=' . rawurlencode($category['slug']);
} elseif ($page === 'product' && $product) {
    $title = $product['name'] . ' | Buy in Nepal | Nepal TechGuard';
    $raw = $product['short_description'] ?: $product['description'] ?: $product['name'];
    $desc = plain($raw, 110);
    $desc = ($desc ? $desc . '. ' : '') . 'Genuine license key with instant delivery in Nepal.';
    $desc = plain($desc, 160);
    $canon = $base . '/product/' . rawurlencode((string) ($product['slug'] ?: $product['id']));
    $ogType = 'product';
    $ogImage = $base . '/backend/cover.php?title=' . rawurlencode($product['name']) . '&slug=' . rawurlencode((string) ($product['category_slug'] ?? ''));
} elseif ($page === 'blog' && $blogPost) {
    $title = $blogPost['title'] . ' | Nepal TechGuard';
    $desc = plain($blogPost['description'] ?? $blogPost['title'], 160);
    $canon = $base . '/blog/' . rawurlencode($blogPost['slug']);
    $ogType = 'article';
    $cover = (string) ($blogPost['cover'] ?? '/uploads/cat-windows.jpg');
    $ogImage = (strpos($cover, 'http') === 0) ? $cover : $base . $cover;
} elseif ($page === 'blog') {
    $title = 'Blog | Software Licensing Guides in Nepal | Nepal TechGuard';
    $desc = 'Guides on Windows 11 Pro keys, Office 2024 vs Microsoft 365, antivirus, and buying genuine software in Nepal.';
    $canon = $base . '/blog';
} elseif ($noindex) {
    $title = ucfirst($page) . ' | Nepal TechGuard';
    $desc = 'Nepal TechGuard shop.';
    $canon = $base . '/' . $page;
}

$jsonLd = [];
$jsonLd[] = [
    '@context' => 'https://schema.org',
    '@type' => 'Organization',
    'name' => 'Nepal TechGuard',
    'url' => $base . '/',
    'logo' => $base . '/uploads/product-default.jpg',
    'areaServed' => 'Nepal',
    'address' => [
        '@type' => 'PostalAddress',
        'addressLocality' => 'Kathmandu',
        'addressCountry' => 'NP',
    ],
];
$jsonLd[] = [
    '@context' => 'https://schema.org',
    '@type' => 'WebSite',
    'name' => 'Nepal TechGuard',
    'url' => $base . '/',
    'potentialAction' => [
        '@type' => 'SearchAction',
        'target' => $base . '/search?q={search_term_string}',
        'query-input' => 'required name=search_term_string',
    ],
];

if ($page === 'product' && $product) {
    $price = isset($product['price_min']) ? (string) $product['price_min'] : '0';
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $base . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $product['category_name'], 'item' => $base . '/category/' . rawurlencode((string) $product['category_slug'])],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $product['name'], 'item' => $canon],
        ],
    ];
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $product['name'],
        'description' => $desc,
        'image' => [$ogImage],
        'sku' => (string) $product['id'],
        'brand' => ['@type' => 'Brand', 'name' => $product['brand_name'] ?? $product['category_name'] ?? 'Nepal TechGuard'],
        'offers' => [
            '@type' => 'Offer',
            'url' => $canon,
            'priceCurrency' => 'NPR',
            'price' => $price,
            'availability' => 'https://schema.org/InStock',
            'seller' => ['@type' => 'Organization', 'name' => 'Nepal TechGuard'],
        ],
    ];
} elseif ($page === 'category' && $category) {
    $items = [];
    foreach (array_slice($products, 0, 40) as $i => $p) {
        $items[] = [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'url' => $base . '/product/' . rawurlencode((string) ($p['slug'] ?: $p['id'])),
            'name' => $p['name'],
        ];
    }
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $base . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $category['name'], 'item' => $canon],
        ],
    ];
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'CollectionPage',
        'name' => $category['name'] . ' license keys in Nepal',
        'url' => $canon,
        'mainEntity' => ['@type' => 'ItemList', 'itemListElement' => $items],
    ];
} elseif ($page === 'blog' && $blogPost) {
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $base . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => $base . '/blog'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $blogPost['title'], 'item' => $canon],
        ],
    ];
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'Article',
        'headline' => $blogPost['title'],
        'description' => $desc,
        'image' => [$ogImage],
        'author' => ['@type' => 'Organization', 'name' => 'Nepal TechGuard'],
        'publisher' => ['@type' => 'Organization', 'name' => 'Nepal TechGuard'],
        'datePublished' => $blogPost['publishedAt'] ?? $today ?? date('Y-m-d'),
        'dateModified' => $blogPost['publishedAt'] ?? date('Y-m-d'),
        'mainEntityOfPage' => $canon,
    ];
} elseif ($page === 'blog') {
    $items = [];
    foreach ($blogPosts as $i => $bp) {
        $items[] = [
            '@type' => 'ListItem',
            'position' => $i + 1,
            'url' => $base . '/blog/' . rawurlencode($bp['slug']),
            'name' => $bp['title'],
        ];
    }
    $jsonLd[] = [
        '@context' => 'https://schema.org',
        '@type' => 'Blog',
        'name' => 'Nepal TechGuard Blog',
        'url' => $canon,
        'blogPost' => $items,
    ];
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en-NP">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo h($title); ?></title>
    <meta name="description" content="<?php echo h($desc); ?>" />
    <meta name="keywords" content="Windows 11 Pro key Nepal, MS Office license Nepal, Office 2021 key Kathmandu, antivirus key Nepal, Adobe key Nepal, genuine software Nepal" />
    <meta name="robots" content="<?php echo $noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'; ?>" />
    <meta name="geo.region" content="NP" />
    <meta name="geo.placename" content="Kathmandu" />
    <meta name="author" content="Nepal TechGuard" />
    <link rel="canonical" href="<?php echo h($canon); ?>" />
    <meta property="og:type" content="<?php echo h($ogType); ?>" />
    <meta property="og:site_name" content="Nepal TechGuard" />
    <meta property="og:title" content="<?php echo h($title); ?>" />
    <meta property="og:description" content="<?php echo h($desc); ?>" />
    <meta property="og:url" content="<?php echo h($canon); ?>" />
    <meta property="og:image" content="<?php echo h($ogImage); ?>" />
    <meta property="og:locale" content="en_NP" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo h($title); ?>" />
    <meta name="twitter:description" content="<?php echo h($desc); ?>" />
    <meta name="twitter:image" content="<?php echo h($ogImage); ?>" />
    <link rel="stylesheet" href="/assets/shop.css?v=blog2" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700&display=swap" rel="stylesheet" />
    <?php foreach ($jsonLd as $block): ?>
    <script type="application/ld+json"><?php echo json_encode($block, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>
    <?php endforeach; ?>
  </head>
  <body>
    <div id="app"></div>
    <main id="seo">
      <header class="topbar"><div class="wrap topbar">
        <a class="brand" href="/"><span><b>NEPAL</b><b class="blue">TECH</b><b>GUARD</b></span></a>
        <nav class="nav-links">
          <a href="/">Home</a>
          <a href="/category/windows">Windows keys Nepal</a>
          <a href="/category/ms-office">MS Office license Nepal</a>
          <a href="/category/antivirus">Antivirus Nepal</a>
          <a href="/category/adobe-products">Adobe keys</a>
          <a href="/blog">Blog</a>
        </nav>
      </div></header>
<?php if ($product): ?>
      <article class="section wrap">
        <p><a href="/">Home</a> / <a href="/category/<?php echo h($product['category_slug']); ?>"><?php echo h($product['category_name']); ?></a></p>
        <h1><?php echo h($product['name']); ?></h1>
        <p><?php echo h(plain($product['short_description'] ?: $product['description'] ?: 'Genuine license key for Nepal with instant delivery.', 320)); ?></p>
        <p><strong><?php echo money_npr($product['price_min']); ?></strong></p>
        <p>Buy genuine <?php echo h($product['name']); ?> in Kathmandu, Nepal. Instant delivery after payment.</p>
      </article>
<?php elseif ($category): ?>
      <section class="section wrap">
        <h1><?php echo h($category['name']); ?> license keys in Nepal</h1>
        <p><?php echo h($category['description'] ?: 'Genuine ' . $category['name'] . ' keys with instant delivery in Nepal.'); ?></p>
        <ul>
          <?php foreach ($products as $p): ?>
          <li><a href="/product/<?php echo h($p['slug'] ?: $p['id']); ?>"><?php echo h($p['name']); ?></a> — <?php echo money_npr($p['price_min']); ?></li>
          <?php endforeach; ?>
        </ul>
      </section>
<?php elseif ($blogPost): ?>
      <article class="section wrap article">
        <p><a href="/">Home</a> / <a href="/blog">Blog</a></p>
        <h1><?php echo h($blogPost['title']); ?></h1>
        <p><?php echo h($blogPost['description']); ?></p>
        <?php echo $blogPost['html']; ?>
      </article>
<?php elseif ($page === 'blog'): ?>
      <section class="section wrap">
        <h1>Nepal TechGuard blog</h1>
        <p>Guides on Windows, Office, antivirus, and buying genuine software in Nepal.</p>
        <ul>
          <?php foreach ($blogPosts as $bp): ?>
          <li><a href="/blog/<?php echo h($bp['slug']); ?>"><?php echo h($bp['title']); ?></a></li>
          <?php endforeach; ?>
        </ul>
      </section>
<?php else: ?>
      <section class="hero"><div class="hero-inner">
        <h1>Genuine Windows, Office and Antivirus keys in Nepal</h1>
        <p>Nepal TechGuard sells genuine software license keys in Kathmandu — Windows 11 Pro, MS Office 2021/2024, antivirus and Adobe — with instant delivery.</p>
      </div></section>
      <section class="section wrap">
        <h2>Shop software license keys</h2>
        <ul>
          <?php foreach ($categories as $c): ?>
          <li><a href="/category/<?php echo h($c['slug']); ?>"><?php echo h($c['name']); ?></a> — <?php echo h($c['description']); ?></li>
          <?php endforeach; ?>
        </ul>
        <h2>Featured products</h2>
        <ul>
          <?php foreach ($products as $p): ?>
          <li><a href="/product/<?php echo h($p['slug'] ?: $p['id']); ?>"><?php echo h($p['name']); ?></a> — <?php echo money_npr($p['price_min']); ?></li>
          <?php endforeach; ?>
        </ul>
        <h2>Why buy license keys in Nepal from Nepal TechGuard?</h2>
        <p>Searchers looking for Windows 11 Pro key Nepal, Office 2021 Professional Plus Nepal, and genuine antivirus keys in Kathmandu can order online and receive delivery by email and WhatsApp.</p>
      </section>
<?php endif; ?>
    </main>
    <script src="/assets/shop.js?v=blog2"></script>
  </body>
</html>
