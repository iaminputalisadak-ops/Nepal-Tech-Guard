# Deploy Nepal TechGuard to cPanel Subdomain

Follow these steps to put your site on a cPanel subdomain (e.g. `store.yourdomain.com`).

**Want the same layout as your other cPanel site?** (e.g. `index.html` + `backend/` + `assets/` in root)  
→ Use **`deploy/CPANEL_SAME_STRUCTURE.md`** and run **`npm run build:cpanel`** instead of `npm run build`.

---

## 1. Create the subdomain in cPanel

1. Log in to **cPanel**.
2. Go to **Domains** → **Subdomains** (or **Create a New Domain** / **Subdomain**).
3. Create a subdomain, e.g. `store` → `store.yourdomain.com`.
4. Note the **Document Root** (e.g. `public_html/store` or `store.yourdomain.com`). You will upload files here.

---

## 2. Create MySQL database and user

1. In cPanel, open **MySQL® Databases**.
2. **Create a database** (e.g. `youruser_nepaltech`). Note the full name (often `cpaneluser_dbname`).
3. **Create a MySQL user** and a strong password. Note username and password.
4. **Add the user to the database** with **ALL PRIVILEGES**.

---

## 3. Build the frontend for production

On your computer, in the project folder:

```bash
cd frontend
npm install
npm run build
```

This creates the `frontend/dist` folder (e.g. `index.html`, `assets/`).

---

## 4. Prepare backend for cPanel

- The backend runs under the **same domain** as the frontend, so the API will be at `https://store.yourdomain.com/api/`.
- You will upload:
  - **Frontend:** contents of `frontend/dist/` → into the **subdomain document root**.
  - **Backend:** `backend/api/` and `backend/config/` → into the same document root so that:
    - `api/` exists (all PHP from `backend/api/`).
    - `config/` exists (from `backend/config/`).

---

## 5. Upload files to the subdomain document root

Using **File Manager** or **FTP**, upload so the **document root** of the subdomain looks like this:

```
document_root/
├── index.html          (from frontend/dist/)
├── assets/             (from frontend/dist/assets/)
├── api/                (entire contents of backend/api/)
│   ├── auth/
│   ├── admin/
│   ├── products/
│   ├── categories/
│   ├── settings/
│   ├── orders/
│   ├── cors.php
│   └── ...
└── config/
    └── database.php    (from backend/config/; edit in step 6)
```

So:

- Copy everything from **frontend/dist/** into the document root.
- Copy the **backend/api** folder (with all subfolders and files) into the document root as **api**.
- Copy **backend/config** into the document root as **config**.

---

## 6. Set database credentials

1. In the document root, open **config/database.php** (edit in cPanel File Manager or after upload).
2. Set your cPanel MySQL details:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_full_database_name');   // e.g. youruser_nepaltech
define('DB_USER', 'your_db_username');          // e.g. youruser_dbuser
define('DB_PASS', 'your_db_password');
define('DB_CHARSET', 'utf8mb4');
```

Save the file.

---

## 7. Import the database

1. In cPanel, open **phpMyAdmin**.
2. Select the database you created.
3. Go to **Import** → Choose file: **database/init.sql** from your project.
4. Run the import. This creates tables and the default admin user.

---

## 8. Add .htaccess in the document root

Create (or upload) a file named **.htaccess** in the **document root** with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Pass Authorization header to PHP (needed for admin API)
  RewriteCond %{HTTP:Authorization} .
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

  # Existing files and folders (real files, API, assets)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # SPA: send all other requests to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

This keeps `/api/` and real files working and sends all other URLs to your React app.

---

## 9. Set admin password (recommended)

After import, change the default admin password:

- Either run **scripts/set-admin-password.php** once on the server (via cPanel **PHP Script** or SSH),  
- Or in phpMyAdmin run (replace `NEW_PASSWORD` with your chosen password; use a strong one):

```sql
UPDATE admin_users
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE username = 'admin';
```

(That hash is for the word `password`. For a custom password you need a PHP script or online bcrypt tool to generate the hash.)

---

## 10. Open your site

- **Store:** `https://store.yourdomain.com` (or your subdomain URL)
- **Admin:** `https://store.yourdomain.com/admin`  
  - Username: **admin**  
  - Password: **password** (or the one you set in step 9)

---

## Quick checklist

- [ ] Subdomain created in cPanel
- [ ] MySQL database and user created, user added to database
- [ ] Frontend built (`npm run build` in `frontend/`)
- [ ] Files uploaded: `dist/` → root, `backend/api/` → `api/`, `backend/config/` → `config/`
- [ ] `config/database.php` updated with cPanel DB name, user, password
- [ ] `database/init.sql` imported in phpMyAdmin
- [ ] `.htaccess` placed in document root
- [ ] Admin password changed from default

If something doesn’t work, check cPanel **Error Logs** and the browser **Network** tab for failed requests (e.g. 404 for `/api/` or 500 from PHP).
