# Nepal TechGuard – Upload to cPanel (Step-by-Step)

Follow this order: first set up the database in cPanel, then upload files, then connect PHP to the database.

---

# PART 1: Create database and user in cPanel (PHP will connect to this)

## Step 1.1 – Create the database

1. Log in to **cPanel**.
2. Open **MySQL® Databases** (under "Databases").
3. Under **Create New Database**:
   - **Database name:** e.g. `nepaltech` (cPanel will add your username in front).
4. Click **Create Database**.
5. **Write down the full database name** (e.g. `myuser_nepaltech`).  
   This is your **DB_NAME** for PHP.

## Step 1.2 – Create the MySQL user

1. On the same page, under **MySQL Users**:
   - **Username:** e.g. `nepaltech_user`
   - **Password:** use **Generate** or type a strong password.
2. Click **Create User**.
3. **Write down** the full **username** (e.g. `myuser_nepaltech_user`) and the **password**.  
   These are your **DB_USER** and **DB_PASS** for PHP.

## Step 1.3 – Add user to database

1. Under **Add User To Database**:
   - User: select the user you just created.
   - Database: select the database you created.
2. Click **Add**.
3. On the next screen, tick **ALL PRIVILEGES**, then **Make Changes**.

You now have:
- **DB_NAME** = full database name (e.g. `myuser_nepaltech`)
- **DB_USER** = full username (e.g. `myuser_nepaltech_user`)
- **DB_PASS** = the password you set

---

# PART 2: Which folders and files to upload

Upload everything so that the **subdomain document root** looks exactly like the structure below.

## 2.1 – Frontend (store + admin UI)

**From your computer:**

| Local folder / file | Upload to (inside subdomain root) |
|---------------------|------------------------------------|
| `frontend/dist/index.html` | `index.html` (in root) |
| `frontend/dist/robots.txt` | `robots.txt` (in root) |
| `frontend/dist/sitemap.xml` | `sitemap.xml` (in root) |
| `frontend/dist/assets/` (entire folder) | `assets/` (in root) |

So: upload **all contents** of **`frontend/dist/`** into the **subdomain document root**.

---

## 2.2 – Backend API (PHP)

**From your computer:** upload the **entire** `backend/api/` folder so it becomes the **`api`** folder in the subdomain root.

| Local path | Upload to (inside subdomain root) |
|------------|------------------------------------|
| `backend/api/` (entire folder with all subfolders) | `api/` |

So inside **`api/`** on the server you must have (same as on your PC):

- `api/auth/` (with `login.php`)
- `api/admin/` (with `check_auth.php`, `products/`, `categories/`, `settings/`, `upload.php`, etc.)
- `api/products/` (with `index.php`, `single.php`)
- `api/categories/` (with `index.php`)
- `api/settings/` (with `index.php`)
- `api/orders/` (with `create.php`)
- `api/cors.php`

Upload **every file and folder** that is inside **`backend/api/`** into **`api/`** on the server.

---

## 2.3 – Config (for database connection)

**From your computer:** create a **`config`** folder in the subdomain root and put the database file in it.

**Option A – Use the cPanel example file (recommended):**

1. On the server, create folder: **`config`** (in subdomain root).
2. Upload the file: **`deploy/database.cpanel.example.php`** from your project.
3. **Rename** it on the server to: **`database.php`** (so the path is `config/database.php`).
4. **Edit** `config/database.php` on the server (cPanel File Manager → Edit) and replace:

   - `YOUR_CPANEL_DATABASE_NAME` → your **DB_NAME** (e.g. `myuser_nepaltech`)
   - `YOUR_CPANEL_DATABASE_USER` → your **DB_USER** (e.g. `myuser_nepaltech_user`)
   - `YOUR_CPANEL_DATABASE_PASSWORD` → your **DB_PASS**

**Option B – Use your existing config and edit it:**

1. Create folder **`config`** in subdomain root.
2. Upload **`backend/config/database.php`** into **`config/database.php`**.
3. Edit **`config/database.php`** on the server and set:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'myuser_nepaltech');        // your cPanel database name
define('DB_USER', 'myuser_nepaltech_user');   // your cPanel database user
define('DB_PASS', 'your_password_here');      // your cPanel database password
define('DB_CHARSET', 'utf8mb4');
```

This is the **only** place you configure the PHP → database connection. No other code changes are needed.

---

## 2.4 – .htaccess (routing + Authorization header)

1. Open **`deploy/htaccess-cpanel-subdomain.txt`** on your computer.
2. Copy its full content.
3. On the server, in the **subdomain document root**, create a new file named **`.htaccess`**.
4. Paste the content and save.

This makes:
- `/api/` work for PHP.
- The **Authorization** header pass to PHP (needed for admin login).
- All other URLs go to `index.html` (React app).

---

# PART 3: Import the database (tables + admin user)

1. In cPanel, open **phpMyAdmin**.
2. In the left sidebar, click your **database** (the one you created in Part 1).
3. Click the **Import** tab.
4. **Choose File** → select **`database/init.sql`** from your project (on your PC).
5. Click **Go** at the bottom.
6. When it says “Import has been successfully finished”, the tables and default admin user are created.

You do **not** upload `init.sql` to the public site; you only use it once in phpMyAdmin to create tables.

---

# PART 4: Final structure on the server (checklist)

Your **subdomain document root** should look like this:

```
document_root/
├── .htaccess
├── index.html
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── index-xxxxx.css
│   └── index-xxxxx.js
├── api/
│   ├── auth/
│   │   └── login.php
│   ├── admin/
│   │   ├── check_auth.php
│   │   ├── products/
│   │   ├── categories/
│   │   ├── settings/
│   │   └── upload.php
│   ├── products/
│   │   ├── index.php
│   │   └── single.php
│   ├── categories/
│   │   └── index.php
│   ├── settings/
│   │   └── index.php
│   ├── orders/
│   │   └── create.php
│   └── cors.php
└── config/
    └── database.php   ← with YOUR cPanel DB name, user, password
```

---

# PART 5: How PHP connects to the database

- Every API script (e.g. `api/auth/login.php`) does:  
  `require_once __DIR__ . '/../../config/database.php';`  
  then `$pdo = getConnection();`
- **Only** `config/database.php` defines the connection:
  - **DB_HOST** = `localhost` (always on cPanel)
  - **DB_NAME** = your cPanel database name
  - **DB_USER** = your cPanel MySQL user
  - **DB_PASS** = your cPanel MySQL password

So: **you only edit `config/database.php`** with the 3 values from Part 1. No other connection code is needed.

---

# PART 6: After upload – test

1. Visit: `https://your-subdomain.com`
2. Visit: `https://your-subdomain.com/admin`
3. Log in with: **admin** / **password** (change password after first login if you want).

If the site or admin doesn’t load, check:
- cPanel **Error Logs**
- That **`config/database.php`** has the correct DB name, user, and password
- That **`database/init.sql`** was imported into that same database
