import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const CONTENT_SLUGS = ['refund-policy', 'privacy-policy', 'terms', 'disclaimer', 'about', 'contact', 'blog'];

export default function ContentPage({ slug }) {
  const s = useSettings();
  const pageContents = s.page_contents || {};
  const page = pageContents[slug];

  if (!CONTENT_SLUGS.includes(slug)) {
    return (
      <section className="page-section" style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '1rem' }}>Page not found</h1>
        <Link to="/">← Back to home</Link>
      </section>
    );
  }

  const pageTitle = page?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const pageDescription = (page?.content || '').replace(/\s+/g, ' ').trim().slice(0, 160) || `${pageTitle} - Nepal TechGuard`;

  const BASE_URL = typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') : '';

  return (
    <section className="page-section" style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalPath={`/${slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: pageTitle, item: `${BASE_URL}/${slug}` },
          ],
        }}
      />
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ← Back to home
      </Link>
      <article className="content-page">
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', marginBottom: '1rem' }}>
          {pageTitle}
        </h1>
        <div
          className="content-page-body"
          style={{ color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
        >
          {page?.content || 'Content will appear here. Edit this page in Admin → Pages.'}
        </div>
      </article>
    </section>
  );
}
