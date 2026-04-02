import React, { useEffect, useState } from 'react';
import { settings as settingsApi, adminSettings } from '../api';
import { uploadImage } from '../api';

const DEFAULT = {
  contact_address: '',
  contact_phone: '',
  contact_email: '',
  policy_links: [],
  info_links: [],
  social_links: [],
  company_name: '',
  copyright_slogan: '',
  copyright_tagline: '',
  payment_methods: [],
  payment_qr_image_url: '',
  payment_qr_title: '',
  payment_qr_instructions: '',
  payment_thankyou_message: '',
};

const PLATFORMS = ['facebook', 'instagram', 'pinterest', 'youtube', 'twitter', 'linkedin'];

export default function AdminSettings() {
  const [form, setForm] = useState({ ...DEFAULT });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    settingsApi.get()
      .then((r) => {
        if (r.success && r.data) {
          const merged = { ...DEFAULT, ...r.data };
          const pms = Array.isArray(merged.payment_methods) ? merged.payment_methods : [];
          merged.payment_methods = pms.map((m) => {
            if (!m) return { label: '', image_url: '' };
            if (typeof m === 'string') return { label: m, image_url: '' };
            if (typeof m === 'object') return { label: m.label || m.name || '', image_url: m.image_url || '' };
            return { label: '', image_url: '' };
          });
          setForm(merged);
        }
      })
      .catch(() => setForm({ ...DEFAULT }))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateLink = (arrKey, index, field, val) => {
    setForm((f) => {
      const arr = [...(f[arrKey] || [])];
      if (!arr[index]) arr[index] = {};
      arr[index] = { ...arr[index], [field]: val };
      return { ...f, [arrKey]: arr };
    });
  };

  const addLink = (arrKey, template = { label: '', url: '' }) => {
    setForm((f) => ({ ...f, [arrKey]: [...(f[arrKey] || []), template] }));
  };

  const removeLink = (arrKey, index) => {
    setForm((f) => {
      const arr = [...(f[arrKey] || [])];
      arr.splice(index, 1);
      return { ...f, [arrKey]: arr };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await adminSettings.update(form);
      setMessage('Settings saved successfully.');
      window.dispatchEvent(new Event('settings-saved'));
    } catch (err) {
      setMessage(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
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
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>Footer & Site Settings</h1>
      </div>

      {message && (
        <p style={{ marginBottom: '1rem', color: message.includes('Failed') ? 'var(--danger)' : 'var(--success)' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSave} className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Contact Info</h3>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={form.contact_address}
            onChange={(e) => update('contact_address', e.target.value)}
            placeholder="Nepal TechGuard, Kathmandu, Nepal"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={form.contact_phone}
            onChange={(e) => update('contact_phone', e.target.value)}
            placeholder="+977 9800000000"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => update('contact_email', e.target.value)}
            placeholder="support@nepaltechguard.com"
          />
        </div>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Policy Links</h3>
        {(form.policy_links || []).map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              placeholder="Label"
              value={link.label || ''}
              onChange={(e) => updateLink('policy_links', i, 'label', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              placeholder="URL"
              value={link.url || ''}
              onChange={(e) => updateLink('policy_links', i, 'url', e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLink('policy_links', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addLink('policy_links')}>+ Add policy link</button>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Info Links</h3>
        {(form.info_links || []).map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              placeholder="Label"
              value={link.label || ''}
              onChange={(e) => updateLink('info_links', i, 'label', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              placeholder="URL"
              value={link.url || ''}
              onChange={(e) => updateLink('info_links', i, 'url', e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLink('info_links', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addLink('info_links')}>+ Add info link</button>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Social Media Links</h3>
        {(form.social_links || []).map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <select
              value={link.platform || 'facebook'}
              onChange={(e) => updateLink('social_links', i, 'platform', e.target.value)}
              style={{ width: 140 }}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            <input
              placeholder="Label"
              value={link.label || ''}
              onChange={(e) => updateLink('social_links', i, 'label', e.target.value)}
              style={{ width: 120 }}
            />
            <input
              placeholder="URL"
              value={link.url || ''}
              onChange={(e) => updateLink('social_links', i, 'url', e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLink('social_links', i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addLink('social_links', { platform: 'facebook', label: '', url: '' })}>+ Add social link</button>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Copyright & Branding</h3>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={form.company_name}
            onChange={(e) => update('company_name', e.target.value)}
            placeholder="Nepal TechGuard"
          />
        </div>
        <div className="form-group">
          <label>Copyright Slogan</label>
          <input
            type="text"
            value={form.copyright_slogan}
            onChange={(e) => update('copyright_slogan', e.target.value)}
            placeholder="Trusted Source for Genuine Keys"
          />
        </div>
        <div className="form-group">
          <label>Tagline (before company name)</label>
          <input
            type="text"
            value={form.copyright_tagline}
            onChange={(e) => update('copyright_tagline', e.target.value)}
            placeholder="Designed & Secured by"
          />
        </div>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Secure Payment (QR)</h3>
        <div className="form-group">
          <label>QR title</label>
          <input
            type="text"
            value={form.payment_qr_title || ''}
            onChange={(e) => update('payment_qr_title', e.target.value)}
            placeholder="Scan & Pay"
          />
        </div>
        <div className="form-group">
          <label>QR instructions</label>
          <textarea
            value={form.payment_qr_instructions || ''}
            onChange={(e) => update('payment_qr_instructions', e.target.value)}
            placeholder="Scan this QR with your banking/eSewa/Khalti app and complete the payment."
            style={{ minHeight: 90 }}
          />
        </div>
        <div className="form-group">
          <label>QR image</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={form.payment_qr_image_url || ''}
              onChange={(e) => update('payment_qr_image_url', e.target.value)}
              placeholder="QR image URL"
              style={{ flex: 1, minWidth: 220 }}
            />
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadImage(file);
                  update('payment_qr_image_url', url);
                } catch (err) {
                  alert(err.message || 'Upload failed');
                } finally {
                  e.target.value = '';
                }
              }}
            />
            {form.payment_qr_image_url ? (
              <img
                src={form.payment_qr_image_url}
                alt=""
                style={{ width: 'min(240px, 100%)', height: 'auto', maxHeight: 240, objectFit: 'contain', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)' }}
              />
            ) : null}
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', marginTop: '2rem', marginBottom: '1rem' }}>Payment Thank-You Message</h3>
        <div className="form-group">
          <label>Message shown after proof submission</label>
          <textarea
            value={form.payment_thankyou_message || ''}
            onChange={(e) => update('payment_thankyou_message', e.target.value)}
            placeholder="Enter the thank-you / verification message..."
            style={{ minHeight: 140 }}
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </>
  );
}
