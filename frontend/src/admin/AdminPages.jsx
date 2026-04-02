import React, { useEffect, useState } from 'react';
import { settings as settingsApi, adminSettings } from '../api';

const PAGES = [
  { slug: 'refund-policy', label: 'Refund Policy' },
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Use' },
  { slug: 'disclaimer', label: 'Disclaimer' },
  { slug: 'about', label: 'About us' },
  { slug: 'contact', label: 'Contact us' },
  { slug: 'blog', label: 'Blog' },
];

export default function AdminPages() {
  const [pageContents, setPageContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState('');
  const [activeSlug, setActiveSlug] = useState('refund-policy');

  useEffect(() => {
    settingsApi.get()
      .then((r) => {
        if (r.success && r.data?.page_contents) {
          setPageContents(r.data.page_contents);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const current = pageContents[activeSlug] || { title: '', content: '' };

  const updateCurrent = (field, value) => {
    setPageContents((prev) => ({
      ...prev,
      [activeSlug]: { ...(prev[activeSlug] || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(activeSlug);
    setMessage('');
    try {
      await adminSettings.update({
        page_contents: { [activeSlug]: pageContents[activeSlug] || {} },
      });
      setMessage('Page saved successfully.');
      window.dispatchEvent(new Event('settings-saved'));
    } catch (err) {
      setMessage(err.message || 'Failed to save.');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving('all');
    setMessage('');
    try {
      await adminSettings.update({ page_contents: pageContents });
      setMessage('All pages saved successfully.');
      window.dispatchEvent(new Event('settings-saved'));
    } catch (err) {
      setMessage(err.message || 'Failed to save.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="loading-pulse">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>Page Content</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!!saving}>
            {saving === activeSlug ? 'Saving…' : 'Save this page'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSaveAll} disabled={!!saving}>
            {saving === 'all' ? 'Saving…' : 'Save all'}
          </button>
        </div>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)' }}>
          {message}
        </p>
      )}

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', minHeight: 400 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {PAGES.map((p) => (
            <button
              key={p.slug}
              type="button"
              className={`btn btn-sm ${activeSlug === p.slug ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveSlug(p.slug)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label>Page title</label>
          <input
            type="text"
            value={current.title || ''}
            onChange={(e) => updateCurrent('title', e.target.value)}
            placeholder={PAGES.find((p) => p.slug === activeSlug)?.label || ''}
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={current.content || ''}
            onChange={(e) => updateCurrent('content', e.target.value)}
            placeholder="Enter the page content..."
            style={{ minHeight: 280 }}
          />
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          This content appears at <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>/{activeSlug}</code>
        </p>
      </div>
    </>
  );
}
