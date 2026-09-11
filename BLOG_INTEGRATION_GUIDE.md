# Blog Integration Guide

The blog section is already fully integrated into this project. This guide documents the existing implementation and the steps to publish content.

## 1. Architecture Overview

The blog uses a database-backed CMS approach:

- **Database**: `blog_posts` table stores all articles (title, slug, description, cover image, HTML content, SEO fields, status, publish date)
- **Backend API**: PHP endpoints under `backend/api/blog/` serve public content
- **Admin API**: Authenticated endpoints under `backend/api/admin/blog/` manage content
- **Frontend**: React pages render the blog listing and individual articles
- **Admin UI**: CKEditor-based editor for writing formatted articles

## 2. Database Setup

Run the blog migration once:

```bash
mysql -u root nepal_techguard < database/migrate_blog_posts.sql
```

The `blog_posts` table includes:

| Field | Purpose |
|---|---|
| `slug` | Unique URL identifier |
| `title` | Visible article title |
| `description` | Excerpt shown on listing cards |
| `cover_image_url` | Featured image |
| `content_html` | Full article body (CKEditor output) |
| `seo_title` / `seo_description` | Search engine metadata |
| `status` | `draft` or `published` |
| `published_at` | Controls listing order |

## 3. Backend API Endpoints

### Public (no authentication)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/blog/index.php?limit=20&offset=0` | GET | List published posts |
| `/api/blog/single.php?slug={slug}` | GET | Fetch one published post |

Both endpoints filter to `status = 'published'` only.

### Admin (requires bearer token)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin/blog/index.php?status=draft|published` | GET | List all posts with optional status filter |
| `/api/admin/blog/single.php?id={id}` | GET | Fetch one post for editing |
| `/api/admin/blog/create.php` | POST | Create a post |
| `/api/admin/blog/update.php` | PUT | Update a post |
| `/api/admin/blog/delete.php?id={id}` | DELETE | Delete a post |

Authentication uses the same token system as the rest of the admin panel (`Authorization: Bearer <token>`).

## 4. Frontend Pages

### Blog listing

`frontend/src/pages/BlogIndex.jsx`

- Fetches published posts from `/api/blog/index.php`
- Falls back to static sample posts if the API is offline
- Renders cards with cover image, date, excerpt, and link
- Includes SEO metadata and canonical URL

### Article page

`frontend/src/pages/BlogPost.jsx`

- Fetches one post by slug from `/api/blog/single.php`
- Falls back to static sample content
- Renders CKEditor HTML content
- Injects Article JSON-LD structured data
- Sets Open Graph image and canonical URL

### Admin list

`frontend/src/admin/AdminBlog.jsx`

- Shows all posts with status, slug, and publish date
- Supports edit and delete actions

### Admin editor

`frontend/src/admin/AdminBlogEditor.jsx`

- Uses CKEditor Classic for rich text
- Fields: title, slug, excerpt, cover image (upload or URL), content, SEO title, SEO description, status, publish date
- Saves via the admin API

## 5. Routes

Registered in `frontend/src/App.jsx`:

```jsx
// Public
<Route path="blog" element={<BlogIndex />} />
<Route path="blog/:slug" element={<BlogPost />} />

// Admin (protected)
<Route path="blog" element={<AdminBlog />} />
<Route path="blog/new" element={<AdminBlogEditor />} />
<Route path="blog/edit/:id" element={<AdminBlogEditor />} />
```

## 6. Navigation

The blog is linked from the main navigation in `frontend/src/layouts/StoreLayout.jsx` (`/blog`).

## 7. Adding a New Post (Admin Workflow)

1. Log in to `/admin`
2. Go to **Blog**
3. Click **New post**
4. Fill in title, excerpt, and upload a cover image
5. Write the article with CKEditor (headings, lists, links, tables)
6. Set SEO title and meta description
7. Choose **Draft** or **Published**
8. Click **Save**

Published posts appear automatically on `/blog` and at `/blog/{slug}`.

## 8. SEO Best Practices for New Posts

- Keep `seo_title` under 60 characters
- Keep `seo_description` between 150–160 characters
- Use the primary keyword in the H1 and first paragraph
- Use descriptive slugs (e.g., `windows-11-pro-key-nepal-guide`)
- Add internal links to product/category pages
- Add one relevant external backlink per article where natural
- Compress cover images (WebP preferred, under 200 KB)
- Publish consistently (1–2 posts per week)

## 9. Verification Checklist

- [ ] `blog_posts` table exists in the database
- [ ] `GET /api/blog/index.php` returns published posts
- [ ] `GET /api/blog/single.php?slug=...` returns one post
- [ ] `/blog` renders without console errors
- [ ] `/blog/{slug}` renders article content and JSON-LD
- [ ] Admin can create, edit, publish, and delete posts
- [ ] Draft posts are not visible publicly
- [ ] Mobile layout is readable
