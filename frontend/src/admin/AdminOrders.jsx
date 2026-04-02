import React, { useEffect, useState } from 'react';
import { adminOrders } from '../api';

export default function AdminOrders() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminOrders.list()
      .then((r) => setList(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>Orders</h1>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Proof</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.order_number}</strong></td>
                    <td>
                      {o.customer_name}
                      {o.customer_email ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customer_email}</div> : null}
                      {o.customer_phone ? <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.customer_phone}</div> : null}
                    </td>
                    <td>₹{Number(o.total_amount || 0).toFixed(2)}</td>
                    <td>{o.status}</td>
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.payment_method || '—'}</div>
                      <div style={{ fontWeight: 700 }}>{o.payment_status || '—'}</div>
                    </td>
                    <td>
                      {o.payment_proof_url ? (
                        <a href={o.payment_proof_url} target="_blank" rel="noopener noreferrer">View</a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet.</p>}
        </div>
      )}
    </>
  );
}

