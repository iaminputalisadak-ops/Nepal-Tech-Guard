const API = "/backend";
const FALLBACK = "/uploads/product-default.jpg";
const CAT_IMG = {
  windows: "/uploads/cat-windows.jpg",
  "windows-enterprise": "/uploads/cat-windows-enterprise.jpg",
  "bundle-keys": "/uploads/cat-windows.jpg",
  "server-sql": "/uploads/cat-windows-enterprise.jpg",
  "ms-office": "/uploads/cat-office.jpg",
  "microsoft-365-office-365": "/uploads/cat-office-365.jpg",
  "office-2024": "/uploads/cat-office-2024.jpg",
  "office-2021": "/uploads/cat-office-2021.jpg",
  "office-2019": "/uploads/cat-office-2019.jpg",
  "office-2016-2013-2010": "/uploads/cat-office-2019.jpg",
  project: "/uploads/cat-project.jpg",
  visio: "/uploads/cat-visio.jpg",
  access: "/uploads/cat-access.jpg",
  antivirus: "/uploads/cat-antivirus.jpg",
  "antivirus-security": "/uploads/cat-antivirus.jpg",
  "design-editing": "/uploads/cat-creative.jpg",
  "design-architecture-software": "/uploads/cat-creative.jpg",
  "adobe-products": "/uploads/cat-adobe.jpg",
  coreldraw: "/uploads/cat-creative.jpg",
  "creative-video-tools": "/uploads/cat-creative.jpg",
  canva: "/uploads/cat-creative.jpg",
  lumion: "/uploads/cat-creative.jpg",
  invideo: "/uploads/cat-creative.jpg",
  "vmware-virtualization": "/uploads/cat-vmware.jpg",
  "parallel-desktop": "/uploads/cat-vmware.jpg",
};
const SITE = "Nepal TechGuard";
const DEFAULT_DESC = "Buy genuine Windows, MS Office, Antivirus and Adobe license keys in Nepal. Instant delivery, secure payment.";

function money(n) {
  return "Rs. " + Number(n || 0).toLocaleString("en-NP");
}
function qs(name) {
  return new URLSearchParams(location.search).get(name);
}
function route() {
  const parts = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] === "category") return { page: "category", slug: decodeURIComponent(parts[1] || qs("slug") || "") };
  if (parts[0] === "product") return { page: "product", id: parts[1] || qs("id"), slug: decodeURIComponent(parts[1] || qs("slug") || "") };
  if (parts[0] === "search") return { page: "search", q: qs("q") || "" };
  if (parts[0] === "blog") return { page: "blog", slug: decodeURIComponent(parts[1] || "") };
  if (["cart", "checkout", "admin"].includes(parts[0])) return { page: parts[0] };
  return { page: qs("page") || "home", slug: qs("slug"), id: qs("id"), q: qs("q") };
}
function go(path) {
  location.href = path;
}
function isGeneric(url) {
  return !url || /localhost|127\.0\.0\.1|default-category|cat-office\.jpg$|cat-windows\.jpg$|cat-antivirus\.jpg$|cat-creative\.jpg$|product-default/i.test(url);
}
function cover(name, slug) {
  return "/backend/cover.php?title=" + encodeURIComponent(name || slug || "Software") + "&slug=" + encodeURIComponent(slug || "");
}
function imgSrc(url, slug, name) {
  if (url && /\/uploads\/img_/i.test(url)) {
    try {
      const u = new URL(url, location.origin);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return location.origin + u.pathname;
      return url;
    } catch (e) { return url; }
  }
  if (name) return cover(name, slug);
  if (!isGeneric(url)) {
    try {
      const u = new URL(url, location.origin);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return location.origin + u.pathname;
      return url;
    } catch (e) { return url; }
  }
  return (slug && CAT_IMG[slug]) || cover(slug || "Software", slug || "");
}
function setSeo({ title, description, url, image, jsonLd, noindex }) {
  const full = title ? title + " | " + SITE : SITE + " | Genuine Software & License Keys in Nepal";
  const desc = description || DEFAULT_DESC;
  const canon = url || location.origin + location.pathname;
  document.title = full;
  const set = (sel, attr, val) => {
    let el = document.querySelector(sel);
    if (!el) {
      el = document.createElement(sel.startsWith("meta") ? "meta" : "link");
      if (sel.includes("property=")) el.setAttribute("property", sel.match(/property="([^"]+)"/)[1]);
      else if (sel.includes("name=")) el.setAttribute("name", sel.match(/name="([^"]+)"/)[1]);
      else if (sel.includes("rel=")) el.setAttribute("rel", sel.match(/rel="([^"]+)"/)[1]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, val);
  };
  set('meta[name="description"]', "content", desc);
  set('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  set('link[rel="canonical"]', "href", canon);
  set('meta[property="og:title"]', "content", full);
  set('meta[property="og:description"]', "content", desc);
  set('meta[property="og:url"]', "content", canon);
  set('meta[property="og:image"]', "content", image || location.origin + "/uploads/cat-windows.jpg");
  set('meta[property="og:type"]', "content", jsonLd && jsonLd["@type"] === "Product" ? "product" : "website");
  set('meta[name="twitter:card"]', "content", "summary_large_image");
  set('meta[name="twitter:title"]', "content", full);
  set('meta[name="twitter:description"]', "content", desc);
  document.querySelectorAll("script[data-seo-json]").forEach((n) => n.remove());
  if (jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.dataset.seoJson = "1";
    s.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(s);
  }
  const seo = document.getElementById("seo");
  if (seo) seo.hidden = true;
}
function cart() {
  try { return JSON.parse(localStorage.getItem("ntg_cart") || "[]"); } catch (e) { return []; }
}
function saveCart(items) {
  localStorage.setItem("ntg_cart", JSON.stringify(items));
  const el = document.getElementById("cartCount");
  if (el) el.textContent = items.reduce((n, i) => n + i.quantity, 0);
}
function addToCart(p, buyNow) {
  const items = cart();
  const variant = (p.variants && p.variants[0]) || {};
  const existing = items.find((i) => i.productId === p.id);
  if (existing) existing.quantity += 1;
  else items.push({
    productId: p.id, variantId: variant.id || null, productName: p.name, variantName: variant.name || "",
    imageUrl: imgSrc(p.image_url, p.category_slug, p.name),
    unitPrice: Number(variant.price || p.price_min || 0), quantity: 1,
  });
  saveCart(items);
  go(buyNow ? "/checkout" : "/cart");
}
async function api(path, opts) {
  const res = await fetch(API + path, opts);
  return res.json().catch(() => ({}));
}
function toggleNav(btn) {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  const open = nav.classList.toggle("is-open");
  if (btn) {
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
}
function header() {
  const n = cart().reduce((s, i) => s + i.quantity, 0);
  return `
  <div class="topbar"><div class="wrap topbar-inner">
    <a class="brand" href="/" title="Nepal TechGuard home"><span><b>NEPAL</b><b class="blue">TECH</b><b>GUARD</b></span></a>
    <div class="topbar-actions">
      <a class="btn btn-ghost admin-link" href="/admin">Admin</a>
      <a class="btn btn-blue cart-btn" href="/cart">Cart <span id="cartCount">${n}</span></a>
      <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav" onclick="toggleNav(this)">
        <span></span><span></span><span></span>
      </button>
    </div>
    <form class="search" role="search" onsubmit="event.preventDefault(); go('/search?q='+encodeURIComponent(document.getElementById('q').value))">
      <input id="q" name="q" placeholder="Search Windows, Office, Adobe..." value="${(route().q || "").replace(/"/g, "&quot;")}">
      <button type="submit">Search</button>
    </form>
  </div></div>
  <nav class="navbar" id="mainNav" aria-label="Main"><div class="wrap">
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/category/windows">Windows</a>
      <a href="/category/ms-office">MS Office</a>
      <a href="/category/antivirus">Antivirus</a>
      <a href="/category/adobe-products">Adobe</a>
      <a href="/blog">Blog</a>
      <a class="admin-in-nav" href="/admin">Admin</a>
    </div>
  </div></nav>`;
}
function footer() {
  return `<footer><div class="wrap">
    <p>© ${new Date().getFullYear()} Nepal TechGuard · Genuine Windows, Office and antivirus keys in Nepal</p>
    <p class="muted"><a href="/blog">Blog</a> · Kathmandu, Nepal · Instant license delivery</p>
  </div></footer>`;
}
window.__products = window.__products || {};
function productCard(p) {
  window.__products[p.id] = p;
  const price = p.variants && p.variants[0] ? p.variants[0].price : p.price_min;
  const orig = p.original_price || (p.variants && p.variants[0] && p.variants[0].original_price);
  const safe = String(p.name || "").replace(/</g, "");
  const src = imgSrc(p.image_url, p.category_slug, p.name);
  return `<article class="card">
    <a href="/product/${p.slug || p.id}" class="rel">
      ${orig && orig > price ? `<span class="badge">Sale</span>` : ""}
      <img src="${src}" alt="${safe} license key" width="400" height="300" onerror="this.src='${FALLBACK}'">
    </a>
    <div class="card-body">
      <h3><a href="/product/${p.slug || p.id}">${safe}</a></h3>
      <div class="price">${money(price)}${orig && orig > price ? `<span class="old">${money(orig)}</span>` : ""}</div>
      <button class="btn btn-blue" style="width:100%" onclick="addToCart(window.__products[${p.id}], true)">Buy now</button>
    </div>
  </article>`;
}

async function pageHome() {
  setSeo({
    title: "Genuine Software & License Keys in Nepal",
    description: DEFAULT_DESC,
    url: location.origin + "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Store",
      name: SITE,
      url: location.origin,
      description: DEFAULT_DESC,
      address: { "@type": "PostalAddress", addressCountry: "NP", addressLocality: "Kathmandu" },
      areaServed: "Nepal",
    },
  });
  const [cats, prods] = await Promise.all([api("/categories/index.php"), api("/products/index.php?featured=1&limit=12")]);
  const categories = (cats.data || []).filter((c) => c.slug !== "assasassas" && c.name !== "saasa");
  const products = prods.data || [];
  document.getElementById("app").innerHTML = header() + `
    <section class="hero"><div class="hero-inner">
      <h1>Genuine software & license keys in Nepal</h1>
      <p>Windows, Microsoft Office, Antivirus and Adobe — instant delivery, secure payment.</p>
      <a class="btn btn-primary" href="#cats">Shop categories</a>
    </div></section>
    <section class="section wrap" id="cats"><h2>Shop by category</h2>
      <div class="grid">${categories.map((c) => `
        <a class="card" href="/category/${c.slug}">
          <img src="${imgSrc(c.image_url, c.slug, c.name)}" alt="${c.name} keys" width="400" height="300" onerror="this.src='${FALLBACK}'">
          <div class="card-body"><h3>${c.name}</h3><p class="muted">${c.description || "View products"}</p></div>
        </a>`).join("")}</div>
    </section>
    <section class="section wrap"><h2>Featured products</h2>
      <div class="grid">${products.map(productCard).join("") || "<p>No products yet.</p>"}</div>
    </section>` + footer();
}

async function pageCategory() {
  const slug = route().slug;
  const cats = await api("/categories/index.php");
  const cat = (cats.data || []).find((c) => c.slug === slug);
  const prods = await api("/products/index.php?limit=50" + (cat ? "&category_id=" + cat.id : ""));
  const list = cat ? (prods.data || []).filter((p) => p.category_id === cat.id || p.category_slug === slug) : (prods.data || []);
  setSeo({
    title: (cat ? cat.name : slug) + " Keys in Nepal",
    description: (cat && cat.description ? cat.description + ". " : "") + "Buy genuine " + (cat ? cat.name : slug) + " license keys in Nepal with instant delivery.",
    url: location.origin + "/category/" + slug,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: (cat ? cat.name : slug) + " license keys in Nepal",
      url: location.origin + "/category/" + slug,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: list.slice(0, 40).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: location.origin + "/product/" + (p.slug || p.id),
          name: p.name,
        })),
      },
    },
  });
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <p class="muted"><a href="/">Home</a> / ${cat ? cat.name : slug}</p>
      <h1 style="margin: .6rem 0 1rem;font-family:Outfit,sans-serif">${cat ? cat.name + " license keys" : "Products"}</h1>
      <div class="grid">${list.map(productCard).join("") || "<p>No products in this category yet.</p>"}</div>
    </section>` + footer();
}

async function pageSearch() {
  const q = route().q || qs("q") || "";
  setSeo({ title: "Search " + q, description: "Search results for " + q + " at Nepal TechGuard.", url: location.origin + "/search?q=" + encodeURIComponent(q), noindex: true });
  const prods = await api("/products/index.php?search=" + encodeURIComponent(q) + "&limit=50");
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <h1>Search: ${q.replace(/</g, "")}</h1>
      <div class="grid">${(prods.data || []).map(productCard).join("") || "<p>No matching products.</p>"}</div>
    </section>` + footer();
}

async function pageProduct() {
  const key = route().slug || route().id || "";
  const q = /^\d+$/.test(String(key)) ? "id=" + encodeURIComponent(key) : "slug=" + encodeURIComponent(key);
  const data = await api("/products/single.php?" + q);
  const p = data.data;
  if (!p) {
    setSeo({ title: "Product not found", noindex: true });
    document.getElementById("app").innerHTML = header() + "<section class='section wrap'><h1>Product not found</h1></section>" + footer();
    return;
  }
  const price = p.variants && p.variants[0] ? p.variants[0].price : p.price_min;
  const img = imgSrc(p.image_url, p.category_slug, p.name);
  const path = "/product/" + (p.slug || p.id);
  if (p.slug && /^\d+$/.test(String(key))) {
    history.replaceState({}, "", path);
  }
  window.__p = p;
  setSeo({
    title: p.name + " | Buy in Nepal",
    description: (p.short_description || p.description || "Genuine " + p.name + " license key").replace(/\?{2,}/g, "-") + " Instant delivery in Nepal.",
    url: location.origin + path,
    image: img.startsWith("http") ? img : location.origin + img,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: [img.startsWith("http") ? img : location.origin + img],
      description: (p.short_description || p.description || p.name).replace(/\?{2,}/g, "-"),
      brand: { "@type": "Brand", name: p.brand_name || p.category_name || "Nepal TechGuard" },
      offers: { "@type": "Offer", priceCurrency: "NPR", price: String(price), availability: "https://schema.org/InStock", url: location.origin + path },
    },
  });
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <p class="muted"><a href="/">Home</a> / <a href="/category/${p.category_slug}">${p.category_name || ""}</a></p>
      <div class="product">
        <img src="${img}" alt="${String(p.name).replace(/</g, "")} license key" onerror="this.src='${FALLBACK}'">
        <div>
          <p class="muted">${p.category_name || ""}</p>
          <h1>${p.name}</h1>
          <div class="price" style="font-size:1.4rem">${money(price)}</div>
          <p class="muted" style="margin:1rem 0">${(p.short_description || p.description || "Genuine license key with instant delivery in Nepal.").replace(/\?{2,}/g, "-")}</p>
          <div class="product-actions">
            <button class="btn btn-blue" onclick="addToCart(window.__p, false)">Add to cart</button>
            <button class="btn btn-ghost" onclick="addToCart(window.__p, true)">Buy now</button>
          </div>
        </div>
      </div>
    </section>` + footer();
}

function pageCart() {
  setSeo({ title: "Cart", noindex: true, url: location.origin + "/cart" });
  const items = cart();
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <h1>Your cart</h1>
      ${items.length ? items.map((i) => `<div class="cart-row">
        <img src="${i.imageUrl || FALLBACK}" alt="${i.productName}">
        <div style="flex:1"><strong>${i.productName}</strong><div class="muted">${money(i.unitPrice)} × ${i.quantity}</div></div>
        <strong>${money(i.unitPrice * i.quantity)}</strong>
      </div>`).join("") + `<p style="margin:1rem 0 1.2rem"><strong>Total: ${money(total)}</strong></p>
      <a class="btn btn-blue" href="/checkout">Checkout</a>` : "<p>Your cart is empty.</p>"}
    </section>` + footer();
}

function pageCheckout() {
  const items = cart();
  if (!items.length) return go("/cart");
  setSeo({ title: "Checkout", noindex: true, url: location.origin + "/checkout" });
  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  window.__place = async function () {
    const body = {
      customer_name: document.getElementById("name").value.trim(),
      customer_email: document.getElementById("email").value.trim(),
      customer_phone: document.getElementById("phone").value.trim(),
      notes: document.getElementById("notes").value.trim(),
      items: items.map((i) => ({ product_id: i.productId, variant_id: i.variantId, product_name: i.productName, variant_name: i.variantName, quantity: i.quantity, unit_price: i.unitPrice })),
    };
    const res = await api("/orders/create.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const box = document.getElementById("msg");
    if (res.success) { saveCart([]); box.className = "ok"; box.textContent = "Order placed: " + res.data.order_number; }
    else { box.className = "err"; box.textContent = res.message || "Could not place order."; }
  };
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <h1>Checkout</h1>
      <p class="muted" style="margin-bottom:1rem">Total ${money(total)}</p>
      <div id="msg"></div>
      <div class="form">
        <input id="name" placeholder="Full name" required>
        <input id="email" type="email" placeholder="Email" required>
        <input id="phone" placeholder="Phone / WhatsApp">
        <textarea id="notes" rows="3" placeholder="Notes"></textarea>
        <button class="btn btn-blue" onclick="window.__place()">Place order</button>
      </div>
    </section>` + footer();
}

let BLOG_CACHE = null;
async function loadBlog() {
  if (BLOG_CACHE) return BLOG_CACHE;
  const res = await fetch("/assets/blog-posts.json?v=md2");
  BLOG_CACHE = (await res.json()).sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
  return BLOG_CACHE;
}
function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
async function pageBlog() {
  const posts = await loadBlog();
  const slug = route().slug;
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      setSeo({ title: "Article not found", noindex: true });
      document.getElementById("app").innerHTML = header() + "<section class='section wrap'><h1>Article not found</h1><p><a href='/blog'>Back to blog</a></p></section>" + footer();
      return;
    }
    const img = post.cover && post.cover.startsWith("http") ? post.cover : location.origin + (post.cover || "/uploads/cat-windows.jpg");
    setSeo({
      title: post.title,
      description: post.description,
      url: location.origin + "/blog/" + post.slug,
      image: img,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        image: [img],
        datePublished: post.publishedAt,
        author: { "@type": "Organization", name: "Nepal TechGuard" },
        mainEntityOfPage: location.origin + "/blog/" + post.slug,
      },
    });
    document.getElementById("app").innerHTML = header() + `
      <article class="section wrap article">
        <p class="muted"><a href="/">Home</a> / <a href="/blog">Blog</a></p>
        <img class="article-cover" src="${esc(post.cover)}" alt="${esc(post.title)}">
        <p class="muted" style="margin:.8rem 0">${esc(post.publishedAt)} · ${(post.tags || []).map(esc).join(" · ")}</p>
        <h1 style="font-family:Outfit,sans-serif;font-size:clamp(1.6rem,3vw,2.2rem);line-height:1.2;margin:0 0 1rem">${esc(post.title)}</h1>
        <p class="muted" style="margin-bottom:1.2rem">${esc(post.description)}</p>
        <div class="article-body">${post.html}</div>
      </article>` + footer();
    return;
  }
  setSeo({
    title: "Blog | Software Licensing Guides in Nepal",
    description: "Guides on Windows 11 Pro keys, Office 2024 vs Microsoft 365, antivirus, and buying genuine software in Nepal.",
    url: location.origin + "/blog",
  });
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <h1 style="font-family:Outfit,sans-serif;margin-bottom:.4rem">Blog</h1>
      <p class="muted" style="margin-bottom:1.2rem">Windows, Office, antivirus, and safe buying guides for Nepal.</p>
      <div class="blog-grid">${posts.map((p) => `
        <a class="card" href="/blog/${esc(p.slug)}">
          <img src="${esc(p.cover)}" alt="${esc(p.title)}" width="400" height="220">
          <div class="card-body">
            <p class="muted" style="font-size:.8rem;margin-bottom:.4rem">${esc(p.publishedAt)} · ${esc((p.tags || [])[0] || "Guide")}</p>
            <h3>${esc(p.title)}</h3>
            <p class="muted" style="margin-top:.4rem">${esc(p.description)}</p>
          </div>
        </a>`).join("")}</div>
    </section>` + footer();
}

async function pageAdmin() {
  setSeo({ title: "Admin", noindex: true, url: location.origin + "/admin" });
  const token = localStorage.getItem("admin_token");
  if (!token) {
    window.__login = async function () {
      const body = new URLSearchParams({ username: document.getElementById("u").value, password: document.getElementById("p").value });
      const res = await fetch(API + "/auth/login.php", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      const data = await res.json();
      if (data.token) { localStorage.setItem("admin_token", data.token); location.reload(); }
      else document.getElementById("msg").innerHTML = `<div class="err">${data.message || "Login failed"}</div>`;
    };
    document.getElementById("app").innerHTML = header() + `
      <section class="section wrap">
        <h1>Admin login</h1>
        <div id="msg"></div>
        <div class="form">
          <input id="u" placeholder="Username">
          <input id="p" type="password" placeholder="Password">
          <button class="btn btn-blue" onclick="window.__login()">Sign in</button>
        </div>
      </section>` + footer();
    return;
  }
  const [prodRes, catRes] = await Promise.all([
    fetch(API + "/admin/products/index.php?limit=80", { headers: { Authorization: "Bearer " + token } }).then((r) => r.json()),
    api("/categories/index.php"),
  ]);
  const products = prodRes.data || [];
  const categories = catRes.data || [];
  window.__upload = async function (kind, id, input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append("image", file);
    const up = await fetch(API + "/admin/upload.php", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd }).then((r) => r.json());
    if (!up.url) { alert(up.message || "Upload failed"); return; }
    const endpoint = kind === "product" ? "/admin/products/update.php" : "/admin/categories/update.php";
    const res = await fetch(API + endpoint, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ id, image_url: up.url }) }).then((r) => r.json());
    if (res.success) location.reload(); else alert(res.message || "Could not save image");
  };
  document.getElementById("app").innerHTML = header() + `
    <section class="section wrap">
      <h1>Admin · upload images</h1>
      <p class="muted" style="margin-bottom:1rem">Upload a unique photo for any product. Until you upload one, each product shows a generated cover with its name.</p>
      <h2 style="margin:1rem 0 .6rem">Categories</h2>
      <div class="table-scroll"><table class="admin-table"><thead><tr><th>Image</th><th>Name</th><th>Upload</th></tr></thead><tbody>
        ${categories.map((c) => `<tr>
          <td><img src="${imgSrc(c.image_url, c.slug, c.name)}" alt="${c.name}" onerror="this.src='${FALLBACK}'"></td>
          <td>${c.name}</td>
          <td><input type="file" accept="image/*" onchange="window.__upload('category', ${c.id}, this)"></td>
        </tr>`).join("")}
      </tbody></table></div>
      <h2 style="margin:1.4rem 0 .6rem">Products</h2>
      <div class="table-scroll"><table class="admin-table"><thead><tr><th>Image</th><th>Product</th><th>Upload</th></tr></thead><tbody>
        ${products.map((p) => `<tr>
          <td><img src="${imgSrc(p.image_url, p.category_slug, p.name)}" alt="${p.name}" onerror="this.src='${FALLBACK}'"></td>
          <td>${p.name}<div class="muted">${money(p.price_min)}</div></td>
          <td><input type="file" accept="image/*" onchange="window.__upload('product', ${p.id}, this)"></td>
        </tr>`).join("")}
      </tbody></table></div>
    </section>` + footer();
}

const r = route();
const routes = { home: pageHome, category: pageCategory, search: pageSearch, product: pageProduct, cart: pageCart, checkout: pageCheckout, admin: pageAdmin, blog: pageBlog };
(routes[r.page] || pageHome)();
