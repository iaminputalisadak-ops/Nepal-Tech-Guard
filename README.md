# Nepal TechGuard E-commerce

E-commerce site for software license keys (Windows, MS Office, Antivirus, etc.) with a React.js frontend, PHP backend, and admin panel to upload and manage products. The database is **nepal_techguard** (company name).

## Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** PHP 7.4+ (PDO, MySQL)
- **Database:** MySQL – database name: `nepal_techguard`

## Database setup

1. Create the database and tables (MySQL):

```bash
mysql -u root -p < database/schema.sql
```

Or open `database/schema.sql` in phpMyAdmin and run it. This creates:

- Database: `nepal_techguard`
- Tables: `admin_users`, `categories`, `products`, `product_variants`, `orders`, `order_items`
- Default admin: **admin** / **password** (change in production)

2. Configure the backend to use your MySQL user/password in `backend/config/database.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nepal_techguard');
define('DB_USER', 'root');      // your user
define('DB_PASS', '');          // your password
```

## Quick start

**Requirements:** PHP 7.4+ (e.g. from [XAMPP](https://www.apachefriends.org/)) and Node.js.

**From project root:**
```bash
npm install
npm run dev
```
This starts both the PHP backend (port 8000) and React frontend (port 5173).  
Or on Windows: double-click `start-all.bat`.

**If you see "PHP is not recognized":** Install XAMPP, add PHP to your PATH (e.g. `C:\xampp\php`), or copy the project to `C:\xampp\htdocs\Nepal-TechGuard` and use XAMPP's Apache.

Then open **http://localhost:5173** and **http://localhost:5173/admin** (login: admin / password).

## Backend (PHP)

**Option A – PHP built-in server (automatic with `npm run dev`):**
`frontend/.env` already has `VITE_API_URL=http://localhost:8000/api`.  
Or run separately: `start-backend.bat` then `cd frontend && npm run dev`.

**Option B – XAMPP (recommended for local deployment):**
1. Ensure **XAMPP** (Apache + MySQL) is running.
2. From project root, run:
   ```bash
   npm run deploy:xampp
   ```
   This builds the frontend for XAMPP and copies everything to `C:\xampp\htdocs\Nepal-TechGuard\`.
3. Set up the database (if not already done):
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or import `database/schema.sql` in phpMyAdmin.
4. Open **http://localhost/Nepal-TechGuard/** and **http://localhost/Nepal-TechGuard/admin/login** (admin / password).

To use a different XAMPP htdocs path: `set XAMPP_HTDOCS=D:\xampp\htdocs && npm run deploy:xampp`

## Frontend (React)

1. **If using `npm run dev` from root:** Backend and frontend start together.

2. **If running frontend only:** `cd frontend && npm install && npm run dev`  
   Open **http://localhost:5173** (or 5174 if 5173 is in use).

3. **If admin login shows "Cannot connect to server":** Start the backend first: run `start-backend.bat` or `npm run backend` from root. Ensure `frontend/.env` has:
   - `VITE_API_URL=http://localhost:8000/api` (when using PHP built-in server)
   - Or `VITE_API_URL=http://localhost/Nepal%20TechGuard/backend/api` (when using XAMPP)
   - Or `VITE_PROXY_PATH=/Nepal%20TechGuard/backend/api` (to fix proxy path)

3. Build for production:

```bash
npm run build
```

Serve the `frontend/dist` folder from your web server, or point the document root to it. Ensure requests to `/api` are proxied to your PHP backend, or set `VITE_API_URL` to the full backend URL before building.

## Features

- **Storefront:** Home, categories, product list, product detail, cart, checkout (order creation).
- **Admin panel:** `/admin` (login: **admin** / **password**)
  - Dashboard
  - Products: list, add, edit, delete (with variants and categories)
  - Categories: list, add, edit, delete
- **Database:** All data is stored in **nepal_techguard** (products, categories, orders, admin users).

## API overview

- **Public:** `GET .../products/index.php`, `.../products/single.php?id=`, `.../categories/index.php`, `POST .../orders/create.php`
- **Auth:** `POST .../auth/login.php` (returns token)
- **Admin (header `Authorization: Bearer <token>`):**
  - Products: `GET/POST .../admin/products/index.php`, `GET .../admin/products/single.php?id=`, `POST .../admin/products/create.php`, `PUT .../admin/products/update.php`, `DELETE .../admin/products/delete.php?id=`
  - Categories: `GET .../admin/categories/index.php`, `POST .../admin/categories/create.php`, `PUT .../admin/categories/update.php`, `DELETE .../admin/categories/delete.php?id=`

## Security note

- Change the default admin password in production.
- Prefer HTTPS and consider using JWT or sessions for admin auth (the current token is a placeholder).
