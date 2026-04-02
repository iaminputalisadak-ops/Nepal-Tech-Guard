/**
 * Initialize Nepal TechGuard database (creates DB, tables, admin user).
 * Requires MySQL in PATH or XAMPP MySQL. Run: npm run db:init
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('Not found:', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const xamppMysql = 'C:\\xampp\\mysql\\bin\\mysql.exe';
const mysqlPath = process.platform === 'win32' && fs.existsSync(xamppMysql)
  ? xamppMysql
  : 'mysql';

const result = spawnSync(mysqlPath, ['-u', 'root'], {
  input: sql,
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true,
  windowsHide: true,
});

if (result.status !== 0) {
  console.error('\nIf MySQL is not in XAMPP, run manually: mysql -u root -p < database/init.sql');
  process.exit(result.status || 1);
}
console.log('Database nepal_techguard initialized. Admin login: admin / password');
