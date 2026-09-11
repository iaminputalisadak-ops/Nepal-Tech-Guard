import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { getBlogPost } from '../blog/posts';
import { blog as blogApi } from '../api';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 860, margin: '0 auto' };

export default function BlogPost() {
  const { slug } = useParams();
  const [remote, setRemote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    blogApi.get(slug)
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const local = getBlogPost(slug);
  const post = remote
    ? {
        slug: remote.slug,
        title: remote.seo_title || remote.title,
        rawTitle: remote.title,
        description: remote.seo_description || remote.description || '',
        coverImage: remote.cover_image_url || '',
        publishedAt: remote.published_at ? String(remote.published_at).slice(0, 10) : '',
        content_html: remote.content_html || '',
      }
    : local
      ? {
          slug: local.slug,
          title: local.title,
          rawTitle: local.title,
          description: local.description,
          coverImage: local.coverImage,
          publishedAt: local.publishedAt,
          content_html: '',
          sections: local.sections,
        }
      : null;

  if (loading) {
    return (
      <section className="page-section" style={sectionStyle}>
        <div className="loading-pulse">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page-section" style={sectionStyle}>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Article not found</h1>
        <Link to="/blog">← Back to blog</Link>
      </section>
    );
  }

  const canonicalPath = `/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.rawTitle || post.title,
    description: post.description,
    image: post.coverImage ? [post.coverImage] : undefined,
    author: { '@type': 'Organization', name: post.author || 'Nepal TechGuard' },
    publisher: { '@type': 'Organization', name: 'Nepal TechGuard' },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalPath },
  };

  return (
    <section className="page-section" style={sectionStyle}>
      <SEO
        title={post.title}
        description={post.description}
        image={post.coverImage}
        canonicalPath={canonicalPath}
        type="article"
        jsonLd={[jsonLd, {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/' : '' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/blog' : '' },
            { '@type': 'ListItem', position: 3, name: post.rawTitle || post.title, item: typeof window !== 'undefined' ? window.location.href : '' },
          ],
        }]}
      />

      <Link to="/blog" style={{ display: 'inline-block', marginBottom: 14, fontSize: 14, color: 'var(--text-muted)' }}>
        ← Back to blog
      </Link>

      <article className="card" style={{ overflow: 'hidden' }}>
        {post.coverImage ? (
          <div style={{ aspectRatio: '16 / 9', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
            <img src={post.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : null}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            {post.publishedAt} • {post.tags?.join(' • ') || 'Article'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', lineHeight: 1.15, marginBottom: 10 }}>
            {post.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 18 }}>
            {post.description}
          </p>

          {post.content_html ? (
            <div
              className="content-page-body"
              style={{ color: 'var(--text)', lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: post.content_html }}
            />
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {(post.sections || []).map((s, idx) => (
                <section key={idx}>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: 6 }}>{s.heading}</h2>
                  <div style={{ color: 'var(--text)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

