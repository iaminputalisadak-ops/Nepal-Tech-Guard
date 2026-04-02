# Upload to https://tech.betalinternational.com.np/

**Subdomain document root** = the folder cPanel uses for this subdomain (e.g. `tech.betalinternational.com.np` or `public_html/tech`). Upload everything **into that folder**.

---

## 1. Build (already done)

You ran: `npm run build:cpanel`  
Output is in **`frontend/dist/`** (index.html, assets/).

*(Use `npm start` only for local testing; for cPanel you only need the build.)*

---

## 2. Files to upload

### A) Frontend → document root

Upload the **contents** of this folder from your PC:

| Local folder | Upload to |
|--------------|-----------|
| **`frontend/dist/`** (all files inside it) | **Document root** of tech.betalinternational.com.np |

So in the root you get:
- **index.html**
- **assets/** (folder with .js and .css files)

### B) Backend → as `backend` folder

Upload so the API lives at **/backend/**:

| Local folder | On server |
|--------------|-----------|
| **`backend/api/`** (entire folder) | Upload and place as **`backend`** in document root |

So on server: **backend/auth/**, **backend/admin/**, **backend/products/**, **backend/categories/**, **backend/settings/**, **backend/orders/**, **backend/cors.php**, etc.

**Tip:** Zip the **contents** of `backend/api/` (not the "api" folder itself) into **backend.zip**, upload, then in cPanel File Manager **Extract** and rename the extracted folder to **backend** if needed.

### C) Config (create on server)

1. In document root create folder **`config`**.
2. Create file **`config/database.php`**.
3. Use the contents of **`deploy/database.cpanel.example.php`** and set:
   - `DB_NAME` = your cPanel database name (e.g. betal_nepaltech)
   - `DB_USER` = your cPanel MySQL user
   - `DB_PASS` = your cPanel MySQL password

### D) .htaccess (create in document root)

1. In document root create file **`.htaccess`**.
2. Paste the full contents of **`deploy/htaccess-cpanel-subdomain.txt`**.

---

## 3. Database

- In cPanel → **MySQL® Databases**: create DB and user, add user to DB with **ALL PRIVILEGES**.
- In **phpMyAdmin**: select that database → **Import** → choose **`database/init.sql`** from your project.

---

## 4. Final structure on server

```
document root (tech.betalinternational.com.np)
├── .htaccess
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── backend/
│   ├── auth/
│   ├── admin/
│   ├── products/
│   ├── categories/
│   ├── settings/
│   ├── orders/
│   └── cors.php
└── config/
    └── database.php
```

---

## 5. URLs

- **Site:** https://tech.betalinternational.com.np/
- **Admin:** https://tech.betalinternational.com.np/admin  
- **Login:** username **admin**, password **password** (or what you set with `npm run admin:password`)
