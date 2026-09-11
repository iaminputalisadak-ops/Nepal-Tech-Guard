<?php
/**
 * Unique product/category cover image from the item name.
 */
$title = trim((string) ($_GET['title'] ?? $_GET['name'] ?? 'Software License'));
$slug = strtolower(trim((string) ($_GET['slug'] ?? '')));
$title = substr($title, 0, 80);
if ($title === '') {
    $title = 'Software License';
}

$hay = strtolower($title . ' ' . $slug);
$theme = [29, 78, 216]; // default blue
if (preg_match('/windows\s*11|win\s*11/', $hay)) $theme = [14, 165, 233];
elseif (preg_match('/windows\s*10|win\s*10/', $hay)) $theme = [37, 99, 235];
elseif (preg_match('/enterprise|server|sql/', $hay)) $theme = [15, 23, 42];
elseif (preg_match('/bundle|multi/', $hay)) $theme = [8, 145, 178];
elseif (preg_match('/365|microsoft 365/', $hay)) $theme = [14, 165, 233];
elseif (preg_match('/2024/', $hay)) $theme = [202, 138, 4];
elseif (preg_match('/2021/', $hay)) $theme = [234, 88, 12];
elseif (preg_match('/2019/', $hay)) $theme = [220, 38, 38];
elseif (preg_match('/2016|2013|2010/', $hay)) $theme = [185, 28, 28];
elseif (preg_match('/project/', $hay)) $theme = [22, 163, 74];
elseif (preg_match('/visio/', $hay)) $theme = [124, 58, 237];
elseif (preg_match('/access/', $hay)) $theme = [153, 27, 27];
elseif (preg_match('/adobe|photoshop|illustrator|acrobat|premiere/', $hay)) $theme = [219, 39, 119];
elseif (preg_match('/antivirus|kaspersky|heal|mcafee|k7|security/', $hay)) $theme = [22, 163, 74];
elseif (preg_match('/canva/', $hay)) $theme = [0, 196, 204];
elseif (preg_match('/vmware|parallel/', $hay)) $theme = [71, 85, 105];
elseif (preg_match('/office|word|excel/', $hay)) $theme = [234, 88, 12];
else {
    $h = crc32($title);
    $theme = [40 + ($h % 160), 70 + (($h >> 8) % 90), 140 + (($h >> 16) % 80)];
}

$r = $theme[0]; $g = $theme[1]; $b = $theme[2];
$r2 = max(0, $r - 40); $g2 = max(0, $g - 40); $b2 = max(0, $b - 50);

$words = preg_split('/\s+/', $title) ?: [$title];
$lines = [];
$line = '';
foreach ($words as $w) {
    $try = trim($line . ' ' . $w);
    if (strlen($try) > 18 && $line !== '') {
        $lines[] = $line;
        $line = $w;
    } else {
        $line = $try;
    }
}
if ($line !== '') $lines[] = $line;
$lines = array_slice($lines, 0, 4);

$esc = static function (string $s): string {
    return htmlspecialchars($s, ENT_XML1 | ENT_QUOTES, 'UTF-8');
};

$y = 430 - (count($lines) - 1) * 22;
$text = '';
foreach ($lines as $i => $ln) {
    $text .= '<text x="320" y="' . ($y + $i * 28) . '" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="22" font-weight="700" fill="#fff">' . $esc($ln) . '</text>';
}

header('Content-Type: image/svg+xml; charset=utf-8');
header('Cache-Control: public, max-age=86400');
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="rgb(<?php echo "$r,$g,$b"; ?>)"/>
      <stop offset="1" stop-color="rgb(<?php echo "$r2,$g2,$b2"; ?>)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="#eef3f8"/>
  <rect x="90" y="70" width="430" height="500" rx="28" fill="url(#bg)"/>
  <rect x="118" y="108" width="374" height="250" rx="18" fill="rgba(255,255,255,0.16)"/>
  <circle cx="320" cy="220" r="54" fill="rgba(255,255,255,0.2)"/>
  <path d="M300 220h40M320 200v40" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
  <text x="320" y="390" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)" letter-spacing="3">NEPAL TECHGUARD</text>
  <?php echo $text; ?>
  <text x="320" y="540" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.75)">Genuine license key</text>
</svg>
