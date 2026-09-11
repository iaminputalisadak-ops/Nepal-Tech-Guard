import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orders } from '../api';
import SEO from '../components/SEO';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 600, margin: '0 auto' };

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        notes: notes.trim(),
        items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId,
          product_name: i.productName,
          variant_name: i.variantName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
        })),
      };
      const res = await orders.create(payload);
      setOrderDone(res.data);
      clearCart();
      if (res?.data?.order_number) navigate(`/payment/${res.data.order_number}`);
    } catch (err) {
      setError(err.message || 'Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderDone) {
    return (
      <section className="page-section" style={sectionStyle}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: '0.5rem', color: 'var(--success)' }}>Order placed</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Order number: <strong>{orderDone.order_number}</strong></p>
          <p style={{ color: 'var(--text-muted)' }}>Total: ₹{orderDone.total}</p>
          <p style={{ marginTop: '1rem', fontSize: 14, color: 'var(--text-muted)' }}>We will deliver your license key via email or WhatsApp.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to shop</Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="page-section" style={sectionStyle}>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '1rem' }}>Checkout</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your cart is empty.</p>
        <Link to="/cart" className="btn btn-primary" style={{ marginTop: '1rem' }}>View cart</Link>
      </section>
    );
  }

  return (
    <section className="page-section" style={sectionStyle}>
      <SEO title="Checkout" description="Checkout - Nepal TechGuard" canonicalPath="/checkout" noindex />
      <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '1.5rem' }}>Checkout</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Total: ₹{totalAmount.toFixed(2)}</p>
      {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}

      <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Your items</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((i) => (
            <div key={`${i.productId}-${i.variantId ?? 'x'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {i.imageUrl ? (
                  <img
                    src={i.imageUrl}
                    alt=""
                    style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', flexShrink: 0 }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px dashed var(--border)', background: 'var(--surface2)', color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}
                  >
                    —
                  </span>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i.productName}</div>
                  {i.variantName && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{i.variantName}</div>}
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    ₹{i.unitPrice} × {i.quantity}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>₹{(i.unitPrice * i.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
        <div className="form-group">
          <label>Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label>Phone / WhatsApp</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 ..." />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </section>
  );
}
