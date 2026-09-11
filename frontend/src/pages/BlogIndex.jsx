import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BLOG_POSTS } from '../blog/posts';
import { blog as blogApi } from '../api';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 1000, margin: '0 auto' };

export default function BlogIndex() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    blogApi.list({ limit: 50 })
      .then((r) => setPosts((r.data || []).map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.seo_description || p.description || '',
        coverImage: p.cover_image_url || '',
        publishedAt: p.published_at ? String(p.published_at).slice(0, 10) : '',
        tags: ['Article'],
      }))))
      .catch(() => {
        const fallback = [...BLOG_POSTS].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
        setPosts(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section" style={sectionStyle}>
      <SEO
        title="Blog"
        description="Guides and updates about software licensing, Windows, MS Office, antivirus, and buying tips in Nepal."
        canonicalPath="/blog"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/' : '' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/blog' : '' },
          ],
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem' }}>Blog</h1>
        <Link to="/" style={{ fontSize: 14, color: 'var(--text-muted)' }}>← Back to home</Link>
      </div>

      <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
        {loading ? (
          <div className="loading-pulse" style={{ gridColumn: '1 / -1' }}>
            <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
          </div>
        ) : posts.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="card blog-card"
            style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}
          >
            <div style={{ aspectRatio: '16 / 9', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
              {p.coverImage ? (
                <img src={p.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : null}
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                {p.publishedAt} • {p.tags?.[0] || 'Article'}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.25, marginBottom: 8 }}>
                {p.title}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.55 }}>
                {p.description}
              </div>
              <div style={{ marginTop: 12, fontWeight: 700, color: 'var(--accent)', fontSize: 14 }}>
                Read article →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

