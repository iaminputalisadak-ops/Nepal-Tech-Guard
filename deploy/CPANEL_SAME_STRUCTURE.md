# Nepal TechGuard – cPanel (Same Structure as Your Other Site)

Use this so your cPanel looks like your other working site: **index.html**, **backend/**, **static** (or **assets/**), **.htaccess** in the document root.

---

## 1. Build for cPanel (on your PC)

From the **project root**:

```bash
npm run build:cpanel
```

This builds the frontend so it calls **/backend/** for the API (same as your other site).

Output is in **`frontend/dist/`**.

---

## 2. What to upload to cPanel `public_html` (or subdomain root)

Upload so the **document root** looks like this:

```
public_html/   (or your subdomain folder)
├── .htaccess
├── index.html
├── robots.txt
├── sitemap.xml
├── assets/              ← frontend build (Vite uses "assets"; same idea as "static")
├── backend/             ← PHP API (upload contents of backend/api/)
│   ├── auth/
│   ├── admin/
│   ├── products/
│   ├── categories/
│   ├── settings/
│   ├── orders/
│   ├── cors.php
│   └── ...
└── config/
    └── database.php
```

---

## 3. Upload step by step

### A) Frontend (like your other site)

| On your PC | Upload to |
|------------|------------|
| **Contents** of **`frontend/dist/`** | Document root |

So in root you get: **index.html**, **assets/** (folder), **robots.txt**, **sitemap.xml** (if present).

### B) Backend folder (like your other site)

| On your PC | Upload to |
|------------|------------|
| **Entire** folder **`backend/api/`** | As **`backend`** in document root |

So you have **backend/auth/**, **backend/admin/**, **backend/products/**, **backend/cors.php**, etc.  
You can zip **`backend/api`** as **backend.zip**, upload it, then in cPanel use **Extract** and rename the extracted folder to **backend** if needed.

### C) Config (database connection)

- In document root create folder **`config`**.
- Create **`config/database.php`** with your cPanel DB name, user, password (same as in DEPLOY_CPANEL.md).

### D) .htaccess

- Create **`.htaccess`** in document root.
- Paste the contents of **`deploy/htaccess-cpanel-subdomain.txt`** (same as before).

---

## 4. Database

- Create database and user in cPanel → **MySQL® Databases**.
- Add user to database with **ALL PRIVILEGES**.
- **phpMyAdmin** → select that database → **Import** → choose **`database/init.sql`**.

---

## 5. Result (same idea as your other site)

- **index.html** + **assets/** = frontend (like your **static** + asset-manifest).
- **backend/** = all API PHP (like your other **backend** folder).
- **config/database.php** = DB connection.
- **.htaccess** = routing + Authorization header.

Admin: **yoursite.com/admin** — login **admin** / **password** (or the password you set).
