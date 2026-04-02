import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminBlog, uploadImage } from '../api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const DEFAULT = {
  title: '',
  slug: '',
  description: '',
  cover_image_url: '',
  content_html: '',
  seo_title: '',
  seo_description: '',
  status: 'draft',
  published_at: '',
};

export default function AdminBlogEditor() {
  const { id } = useParams();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...DEFAULT });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    adminBlog.get(id)
      .then((r) => {
        const d = r.data || {};
        setForm({
          ...DEFAULT,
          ...d,
          published_at: d.published_at || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const editorConfig = useMemo(() => ({
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'blockQuote', 'insertTable', '|',
      'undo', 'redo',
    ],
  }), []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        id: isNew ? undefined : Number(id),
      };
      if (isNew) {
        const r = await adminBlog.create(payload);
        navigate(`/admin/blog/edit/${r.data.id}`);
      } else {
        await adminBlog.update(payload);
      }
      alert('Saved');
    } catch (e) {
      alert(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: 4 }}>{isNew ? 'New blog post' : 'Edit blog post'}</h1>
          <Link to="/admin/blog" style={{ color: 'var(--text-muted)', fontSize: 14 }}>← Back to blog list</Link>
        </div>
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <div className="form-group">
          <label>Title *</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Slug</label>
          <input value={form.slug || ''} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto from title if empty" />
        </div>
        <div className="form-group">
          <label>Description (excerpt)</label>
          <textarea value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Cover image</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              value={form.cover_image_url || ''}
              onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
              placeholder="Image URL"
              style={{ flex: 1, minWidth: 240 }}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadImage(file);
                  setForm((f) => ({ ...f, cover_image_url: url }));
                } catch (err) {
                  alert(err.message || 'Upload failed');
                } finally {
                  e.target.value = '';
                }
              }}
            />
            {form.cover_image_url ? (
              <img src={form.cover_image_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
            ) : null}
          </div>
        </div>

        <div className="form-group">
          <label>Content</label>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              data={form.content_html || ''}
              onChange={(_, editor) => {
                const data = editor.getData();
                setForm((f) => ({ ...f, content_html: data }));
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="admin-grid-2">
          <div className="form-group">
            <label>SEO title (optional)</label>
            <input value={form.seo_title || ''} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>SEO description (optional)</label>
          <textarea value={form.seo_description || ''} onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Published at (optional)</label>
          <input value={form.published_at || ''} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} placeholder="YYYY-MM-DD HH:MM:SS (auto when publish if empty)" />
        </div>
      </div>
    </>
  );
}

