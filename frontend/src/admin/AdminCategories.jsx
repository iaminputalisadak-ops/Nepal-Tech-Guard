import React, { useEffect, useState, useRef } from 'react';
import { adminCategories, uploadImage, bulkUpdateCategoryImage } from '../api';

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bulkImageFile, setBulkImageFile] = useState(null);
  const [bulkImagePreview, setBulkImagePreview] = useState(null);
  const [bulkApplying, setBulkApplying] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);
  const menuRef = useRef(null);

  const load = () => adminCategories.list().then((r) => setList(r.data || [])).catch(() => {});

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!openMenuId) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [openMenuId]);

  const openCreate = () => {
    setEditing('new');
    setForm({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });
  };
  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image_url: c.image_url || '', sort_order: c.sort_order ?? 0 });
  };
  const close = () => setEditing(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        const { sort_order, ...createData } = form;
        await adminCategories.create(createData);
      } else {
        await adminCategories.update({ id: editing, ...form });
      }
      close();
      load();
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category may be affected.`)) return;
    adminCategories.delete(id).then(load).catch((e) => alert(e.message));
  };

  const handleBulkImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setBulkImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setBulkImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBulkImageApply = async () => {
    if (!bulkImageFile) {
      alert('Please select an image first.');
      return;
    }
    if (!window.confirm('This will replace the image for ALL categories. Continue?')) return;
    setBulkApplying(true);
    try {
      const r = await bulkUpdateCategoryImage(bulkImageFile);
      alert(r.message || `Updated ${r.count} categories.`);
      setBulkImageFile(null);
      setBulkImagePreview(null);
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
      load();
    } catch (err) {
      alert(err.message || 'Failed');
    } finally {
      setBulkApplying(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>Categories</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>Add category</button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Set image for all categories</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Upload an image to replace the category image for every category. Use this to see how your site looks with a default category tile (e.g. Windows, Office, Antivirus).
        </p>
        <div className="admin-bulk-image-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            ref={bulkFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleBulkImageSelect}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => bulkFileInputRef.current?.click()}
          >
            Choose image
          </button>
          {bulkImagePreview && (
            <>
              <img src={bulkImagePreview} alt="Preview" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)' }} />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleBulkImageApply}
                disabled={bulkApplying}
              >
                {bulkApplying ? 'Applying…' : 'Apply to all categories'}
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', maxWidth: 520 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{editing === 'new' ? 'New category' : 'Edit category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="Auto from name if empty" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const url = await uploadImage(file);
                    setForm((f) => ({ ...f, image_url: url }));
                  } catch (err) {
                    alert(err.message || 'Upload failed');
                  } finally {
                    setUploading(false);
                    e.target.value = '';
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Choose image'}
              </button>
              {form.image_url && (
                <div style={{ marginTop: 8 }}>
                  <img src={form.image_url} alt="" style={{ maxWidth: 180, maxHeight: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setForm((f) => ({ ...f, image_url: '' }))} style={{ marginTop: 6 }}>Remove image</button>
                </div>
              )}
            </div>
            {editing !== 'new' && (
              <div className="form-group">
                <label>Sort order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Sort</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.slug}</td>
                    <td>{c.sort_order}</td>
                    <td style={{ position: 'relative' }}>
                      <div ref={openMenuId === c.id ? menuRef : null} style={{ display: 'inline-block' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          aria-label="Actions"
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === c.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((cur) => (cur === c.id ? null : c.id));
                          }}
                          style={{ width: 36, padding: 0, justifyContent: 'center' }}
                        >
                          ⋮
                        </button>
                        {openMenuId === c.id && (
                          <div
                            role="menu"
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: 'calc(100% + 6px)',
                              minWidth: 160,
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: 10,
                              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                              padding: 6,
                              zIndex: 50,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              role="menuitem"
                              className="btn btn-secondary btn-sm"
                              style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6 }}
                              onClick={() => {
                                setOpenMenuId(null);
                                openEdit(c);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              className="btn btn-danger btn-sm"
                              style={{ width: '100%', justifyContent: 'flex-start' }}
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDelete(c.id, c.name);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No categories. Add one to organize products.</p>}
        </div>
      )}
    </>
  );
}
