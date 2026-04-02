/**
 * Deploy Nepal TechGuard to XAMPP htdocs
 * Run: npm run deploy:xampp
 */
const fs = require('fs');
const path = require('path');

const XAMPP_HTDOCS = process.env.XAMPP_HTDOCS || 'C:\\xampp\\htdocs';
const PROJECT_NAME = 'Nepal-TechGuard';
const DEST = path.join(XAMPP_HTDOCS, PROJECT_NAME);

const projectRoot = path.resolve(__dirname, '..');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const f of fs.readdirSync(src)) {
      if (f === 'node_modules' || f === '.git') continue;
      copyRecursive(path.join(src, f), path.join(dest, f));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function rmRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) rmRecursive(p);
    else fs.unlinkSync(p);
  }
  fs.rmdirSync(dir);
}

console.log('Deploying to', DEST);

// Create dest folder
if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

// Copy frontend build (dist) - contents go to project root
const distDir = path.join(projectRoot, 'frontend', 'dist');
if (!fs.existsSync(distDir)) {
  console.error('Error: frontend/dist not found. Run npm run build:xampp first.');
  process.exit(1);
}
for (const f of fs.readdirSync(distDir)) {
  const src = path.join(distDir, f);
  const dest = path.join(DEST, f);
  if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) rmRecursive(dest);
  copyRecursive(src, dest);
}

// Copy backend
copyRecursive(path.join(projectRoot, 'backend'), path.join(DEST, 'backend'));

// Copy .htaccess
const htaccessSrc = path.join(projectRoot, 'deploy', '.htaccess');
const htaccessDest = path.join(DEST, '.htaccess');
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
  console.log('  .htaccess copied');
} else {
  // Write default .htaccess
  const htaccess = `# Nepal TechGuard - SPA + API routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /${PROJECT_NAME}/
  # Allow Authorization header (needed for admin API)
  RewriteCond %{HTTP:Authorization} .
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
  # API requests go to backend
  RewriteCond %{REQUEST_URI} ^/${PROJECT_NAME}/backend/
  RewriteRule ^ - [L]
  # Static assets
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  # SPA fallback - all other requests to index.html
  RewriteRule ^ index.html [L]
</IfModule>
`;
  fs.writeFileSync(htaccessDest, htaccess);
  console.log('  .htaccess created');
}

console.log('Done! Open http://localhost/' + PROJECT_NAME + '/');
console.log('Admin: http://localhost/' + PROJECT_NAME + '/admin/login (admin / password)');
