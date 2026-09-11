import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orders } from '../api';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 600, margin: '0 auto' };

export default function SecurePayment() {
  const { orderNumber } = useParams();
  const settings = useSettings();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    orders.get(orderNumber)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
      const url = `${base}/orders/upload_payment_proof.php`;
      const fd = new FormData();
      fd.append('order_number', orderNumber);
      fd.append('image', file);
      const res = await fetch(url, { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || res.statusText || 'Upload failed');
      setUploadedUrl(json.url || '');
    } catch (e) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <section className="page-section" style={sectionStyle}>
        <div className="loading-pulse">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-section" style={sectionStyle}>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '0.75rem' }}>Secure Payment</h1>
        <p style={{ color: 'var(--danger)' }}>{error}</p>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: 12 }}>Back to shop</Link>
      </section>
    );
  }

  const order = data?.order;
  const items = data?.items || [];
  const primaryProductId = items?.[0]?.product_id;

  const orderDate = (() => {
    const raw = order?.created_at;
    if (!raw) return '';
    const d = new Date(raw.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleString();
  })();

  if (uploadedUrl) {
    return (
      <section className="page-section" style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', marginBottom: 6 }}>Thank You For Your Purchase!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            We have received your order and payment proof. Our team will verify your purchase, and your product/access will be activated within the next <strong>30 minutes</strong>.
          </p>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 800, marginBottom: 10, textAlign: 'center' }}>Order Details</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <Row label="Order ID" value={order?.id ? `#${order.id}` : order?.order_number} />
            <Row label="Product" value={items?.[0]?.product_name || '—'} />
            <Row label="Quantity" value={String(items?.reduce((s, i) => s + Number(i.quantity || 0), 0) || 1)} />
            <Row label="Total Amount" value={<span style={{ fontWeight: 900, color: 'var(--success)' }}>₹{Number(order?.total_amount || order?.total || 0).toFixed(2)}</span>} />
            <Row
              label="Purchase Status"
              value={<span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 800 }}>Pending Verification (Will Be Approved Within 30 Minutes)</span>}
            />
            <Row label="Order Date" value={orderDate || '—'} />
            <Row label="Email" value={order?.customer_email || '—'} />
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, whiteSpace: 'pre-line', textAlign: 'center' }}>
            {settings.payment_thankyou_message || 'Your request has been successfully registered. A secure, time-limited access link is being generated and will be delivered to your registered email within a few minutes.\nMeanwhile, your transaction is under verification. Once confirmed (typically within 30 minutes), you will receive your access credentials along with complete instructions.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          <Link to="/" className="btn btn-primary" style={{ flex: '1 1 220px', justifyContent: 'center' }}>Back to Home</Link>
          {primaryProductId ? (
            <Link to={primaryProductId ? `/product/${primaryProductId}` : '/'} className="btn btn-secondary" style={{ flex: '1 1 220px', justifyContent: 'center' }}>
              View Product
            </Link>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="page-section" style={sectionStyle}>
      <SEO title="Secure Payment" description="Secure payment page - Nepal TechGuard" canonicalPath={`/payment/${orderNumber}`} noindex />
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Secure Payment</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem' }}>Complete your purchase securely</h1>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Order Summary</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>Order</span>
            <span style={{ fontWeight: 700 }}>{order?.order_number}</span>
          </div>
          {items.slice(0, 3).map((i, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i.product_name}{i.variant_name ? ` (${i.variant_name})` : ''} × {i.quantity}
              </span>
              <span style={{ fontWeight: 700 }}>₹{Number(i.total_price).toFixed(2)}</span>
            </div>
          ))}
          {items.length > 3 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>+ {items.length - 3} more items…</div>}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800 }}>Total Amount</span>
            <span style={{ fontWeight: 900, color: 'var(--accent)' }}>₹{Number(order?.total_amount || order?.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>{settings.payment_qr_title || 'Scan & Pay'}</div>
        <div style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: '1rem', background: 'var(--surface)' }}>
          {settings.payment_qr_image_url ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <img src={settings.payment_qr_image_url} alt="Payment QR" style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 12, background: '#fff' }} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0' }}>
              Admin has not set a QR image yet.
            </div>
          )}
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
            {settings.payment_qr_instructions || 'Scan this QR and complete the payment.'}
          </p>
          <p style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', marginTop: 10, color: 'var(--text)' }}>
            After paying, upload the payment screenshot below.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Upload Payment Screenshot</div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: 8 }}>{error}</p>}
        {uploadedUrl ? (
          <p style={{ color: 'var(--success)', marginBottom: 8 }}>Payment proof uploaded. We’ll verify it in admin.</p>
        ) : null}
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {previewUrl ? (
          <div style={{ marginTop: 10 }}>
            <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)' }} />
          </div>
        ) : null}
        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!file || uploading} onClick={handleUpload}>
          {uploading ? 'Uploading…' : 'Submit Payment Proof'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>← Back to shop</Link>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
      <span style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </span>
    </div>
  );
}

