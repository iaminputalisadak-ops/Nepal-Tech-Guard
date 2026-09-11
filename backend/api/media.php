<?php
/**
 * Turn stored localhost / relative upload paths into live site URLs.
 */
function publicSiteBase(): string {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    return $scheme . '://' . $host;
}

function rewriteMediaUrl(?string $url): ?string {
    if ($url === null || $url === '') {
        return $url;
    }
    if (preg_match('#(/uploads/[^/?#]+)$#', $url, $m)) {
        return publicSiteBase() . $m[1];
    }
    if (strpos($url, 'localhost') !== false || strpos($url, '127.0.0.1') !== false) {
        $path = parse_url($url, PHP_URL_PATH);
        if ($path) {
            return publicSiteBase() . $path;
        }
    }
    return $url;
}

function isAdminUpload(?string $url): bool {
    return is_string($url) && preg_match('#/uploads/img_#i', $url);
}

function isGenericMedia(?string $url): bool {
    if ($url === null || $url === '') {
        return true;
    }
    return (bool) preg_match('/localhost|127\.0\.0\.1|default-category|cat-office\.jpg|cat-windows\.jpg|cat-antivirus\.jpg|cat-creative\.jpg|product-default/i', $url);
}

function coverUrl(string $title, string $slug = ''): string {
    return publicSiteBase() . '/backend/cover.php?title=' . rawurlencode($title) . '&slug=' . rawurlencode($slug);
}

function categoryCoverFile(string $slug): ?string {
    $map = [
        'windows' => '/uploads/cat-windows.jpg',
        'windows-enterprise' => '/uploads/cat-windows-enterprise.jpg',
        'bundle-keys' => '/uploads/cat-windows.jpg',
        'microsoft-365-office-365' => '/uploads/cat-office-365.jpg',
        'office-2024' => '/uploads/cat-office-2024.jpg',
        'office-2021' => '/uploads/cat-office-2021.jpg',
        'office-2019' => '/uploads/cat-office-2019.jpg',
        'office-2016-2013-2010' => '/uploads/cat-office-2019.jpg',
        'ms-office' => '/uploads/cat-office.jpg',
        'project' => '/uploads/cat-project.jpg',
        'visio' => '/uploads/cat-visio.jpg',
        'access' => '/uploads/cat-access.jpg',
        'antivirus' => '/uploads/cat-antivirus.jpg',
        'antivirus-security' => '/uploads/cat-antivirus.jpg',
        'adobe-products' => '/uploads/cat-adobe.jpg',
        'design-editing' => '/uploads/cat-creative.jpg',
        'design-architecture-software' => '/uploads/cat-creative.jpg',
        'vmware-virtualization' => '/uploads/cat-vmware.jpg',
        'parallel-desktop' => '/uploads/cat-vmware.jpg',
    ];
    return $map[$slug] ?? null;
}

function productImageUrl(?string $url, string $name, string $slug = ''): string {
    if (isAdminUpload($url)) {
        return rewriteMediaUrl($url);
    }
    return coverUrl($name !== '' ? $name : 'Software License', $slug);
}

function categoryImageUrl(?string $url, string $name, string $slug = ''): string {
    if (isAdminUpload($url)) {
        return rewriteMediaUrl($url);
    }
    $file = categoryCoverFile($slug);
    if ($file) {
        return publicSiteBase() . $file;
    }
    return coverUrl($name !== '' ? $name : $slug, $slug);
}
