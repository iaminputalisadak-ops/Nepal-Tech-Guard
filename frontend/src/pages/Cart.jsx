import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' };

export default function Cart() {
  const { items, totalItems, totalAmount, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="page-section" style={sectionStyle}>
        <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '1rem' }}>Your cart</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="page-section" style={sectionStyle}>
      <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: '1.5rem' }}>Your cart ({totalItems} items)</h1>
      <div className="card cart-table-wrap" style={{ marginBottom: '1.5rem' }}>
        <div className="table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={`${i.productId}-${i.variantId ?? 'x'}`}>
                  <td data-label="Product">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                      <div>
                        <strong>{i.productName}</strong>
                        {i.variantName && <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)' }}>{i.variantName}</span>}
                      </div>
                    </div>
                  </td>
                  <td data-label="Price">₹{i.unitPrice}</td>
                  <td data-label="Qty">
                    <input type="number" min={1} value={i.quantity} onChange={(e) => updateQty(i.productId, i.variantId, Math.max(1, parseInt(e.target.value, 10) || 1))} style={{ width: 56, padding: '0.35rem', textAlign: 'center' }} />
                  </td>
                  <td data-label="Total">₹{(i.unitPrice * i.quantity).toFixed(2)}</td>
                  <td data-label="">
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(i.productId, i.variantId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="cart-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Link to="/" className="btn btn-secondary">Continue shopping</Link>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total: ₹{totalAmount.toFixed(2)}</div>
        <Link to="/checkout" className="btn btn-primary">Proceed to checkout</Link>
      </div>
    </section>
  );
}
