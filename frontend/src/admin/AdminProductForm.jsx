import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminProducts, adminCategories, uploadImage } from '../api';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    slug: '',
    short_description: '',
    description: '',
    image_url: '',
    price_min: 0,
    price_max: 0,
    original_price: '',
    discount_percent: 0,
    rating: 0,
    review_count: 0,
    brand_name: '',
    region: 'Nepal',
    sold_count: 0,
    availability: 'In Stock',
    version_info: 'Latest',
    is_featured: false,
    is_active: true,
    variants: [{ name: 'Default', price: 0, original_price: '', stock: 0, sku: '' }],
  });

  useEffect(() => {
    adminCategories.list().then((r) => setCategories(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminProducts.get(id).then((r) => {
      const p = r.data;
      setForm({
        category_id: p.category_id,
        name: p.name,
        slug: p.slug,
        short_description: p.short_description || '',
        description: p.description || '',
        image_url: p.image_url || '',
        price_min: p.price_min,
        price_max: p.price_max,
        original_price: p.original_price ?? '',
        discount_percent: p.discount_percent || 0,
        rating: p.rating || 0,
        review_count: p.review_count || 0,
        brand_name: p.brand_name || '',
        region: p.region || 'Nepal',
        sold_count: p.sold_count || 0,
        availability: p.availability || 'In Stock',
        version_info: p.version_info || 'Latest',
        is_featured: !!p.is_featured,
        is_active: !!p.is_active,
        variants: (p.variants?.length ? p.variants : [{ name: 'Default', price: p.price_min, original_price: p.original_price, stock: 0, sku: '' }]).map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          original_price: v.original_price ?? '',
          stock: v.stock ?? 0,
          sku: v.sku || '',
        })),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateVariant = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [key]: value } : v)),
    }));
  };
  const addVariant = () => setForm((prev) => ({ ...prev, variants: [...prev.variants, { name: '', price: 0, original_price: '', stock: 0, sku: '' }] }));
  const removeVariant = (index) => {
    if (form.variants.length <= 1) return;
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id || !form.name) {
      alert('Category and product name are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      category_id: parseInt(form.category_id, 10),
      price_min: parseFloat(form.price_min) || 0,
      price_max: parseFloat(form.price_max) || 0,
      original_price: form.original_price === '' ? null : parseFloat(form.original_price),
      sold_count: parseInt(form.sold_count, 10) || 0,
      variants: form.variants.map((v) => ({
        name: v.name,
        price: parseFloat(v.price) || 0,
        original_price: v.original_price === '' ? null : parseFloat(v.original_price),
        stock: parseInt(v.stock, 10) || 0,
        sku: v.sku,
      })),
    };
    if (isEdit) payload.id = parseInt(id, 10);
    try {
      if (isEdit) await adminProducts.update(payload);
      else await adminProducts.create(payload);
      navigate('/admin/products');
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', margin: 0 }}>{isEdit ? 'Edit product' : 'Add product'}</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            if (!form.name) {
              alert('Please enter a product name first.');
              return;
            }
            const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const autoImg = `https://shop.hedztech.com/backend/cover.php?title=${encodeURIComponent(form.name)}&slug=${encodeURIComponent(slug)}`;
            const autoShort = `Buy genuine ${form.name} in Nepal with instant WhatsApp, SMS & Email delivery. Verified activation warranty.`;
            const autoDesc = `${form.name} provides authentic, certified digital licensing for users and businesses across Nepal.\n\nKey Features & Benefits:\n- 100% Genuine and authentic activation.\n- Instant digital delivery directly via Email, WhatsApp, and SMS.\n- Lifetime validity or full-term subscription guarantee.\n- Dedicated customer support from Kathmandu for effortless installation.`;

            setForm(prev => ({
              ...prev,
              slug,
              image_url: prev.image_url || autoImg,
              short_description: prev.short_description || autoShort,
              description: prev.description || autoDesc,
            }));
            alert('AI SEO Content & Image path generated successfully!');
          }}
        >
          ✨ Auto-Fill AI Image & SEO
        </button>
      </div>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', maxWidth: 720 }}>
        <div className="form-group">
          <label>Category *</label>
          <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Product name *</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="e.g. Windows 11 Pro Retail Key" />
        </div>
        <div className="form-group">
          <label>Slug (URL)</label>
          <input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="Auto-generated if empty" />
        </div>
        <div className="form-group">
          <label>Short description</label>
          <textarea value={form.short_description} onChange={(e) => update('short_description', e.target.value)} rows={2} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Product image</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUploading(true);
              try {
                const url = await uploadImage(f);
                update('image_url', url);
              } catch (err) {
                alert(err.message || 'Upload failed');
              } finally {
                setUploading(false);
                e.target.value = '';
              }
            }} disabled={uploading} />
            {uploading && <span style={{ color: 'var(--text-muted)' }}>Uploading…</span>}
          </div>
          {form.image_url && (
            <div style={{ marginTop: 8 }}>
              <img src={form.image_url} alt="" style={{ maxWidth: 180, maxHeight: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => update('image_url', '')} style={{ marginTop: 6 }}>Remove image</button>
            </div>
          )}
        </div>
        <div className="admin-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price min</label>
            <input type="number" step="0.01" value={form.price_min} onChange={(e) => update('price_min', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Price max</label>
            <input type="number" step="0.01" value={form.price_max} onChange={(e) => update('price_max', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Original price (strikethrough)</label>
            <input type="number" step="0.01" value={form.original_price} onChange={(e) => update('original_price', e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Discount %</label>
            <input type="number" min={0} max={100} value={form.discount_percent} onChange={(e) => update('discount_percent', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Rating (0–5)</label>
            <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => update('rating', e.target.value)} />
          </div>
        </div>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Product specs (for detail page)</h3>
        <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Brand name</label>
            <input value={form.brand_name} onChange={(e) => update('brand_name', e.target.value)} placeholder="e.g. Quick Heal" />
          </div>
          <div className="form-group">
            <label>Region</label>
            <input value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="Nepal" />
          </div>
          <div className="form-group">
            <label>Sold count (e.g. 555+)</label>
            <input type="number" min={0} value={form.sold_count} onChange={(e) => update('sold_count', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Availability</label>
            <input value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="In Stock" />
          </div>
          <div className="form-group">
            <label>Version</label>
            <input value={form.version_info} onChange={(e) => update('version_info', e.target.value)} placeholder="Latest" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
            Featured
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} />
            Active
          </label>
        </div>

        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Variants (e.g. 1 Year, 3 Years)</h3>
        {form.variants.map((v, i) => (
          <div key={i} className="admin-grid-variants" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 8, alignItems: 'end', marginBottom: 8 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Variant name</label>
              <input value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)} placeholder="e.g. 1 Year" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Price</label>
              <input type="number" step="0.01" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Original price</label>
              <input type="number" step="0.01" value={v.original_price} onChange={(e) => updateVariant(i, 'original_price', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Stock</label>
              <input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} />
            </div>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVariant(i)} disabled={form.variants.length <= 1}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant} style={{ marginBottom: '1rem' }}>+ Add variant</button>

        <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : (isEdit ? 'Update' : 'Create')}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </>
  );
}
