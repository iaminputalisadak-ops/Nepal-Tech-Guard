import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api, adminProducts, adminCategories, adminOrders } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_products: 0, total_orders: 0, pending_orders: 0, completed_orders: 0, total_customers: 0, total_sales: 0, low_stock: 0, out_of_stock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('admin/dashboard/index.php?action=stats'),
      api.get('admin/dashboard/index.php?action=recent_orders'),
      api.get('admin/dashboard/index.php?action=recent_customers'),
    ])
      .then(([r1, r2, r3]) => {
        setStats(r1.data || {});
        setRecentOrders(r2.data || []);
        setRecentCustomers(r3.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (n) => {
    const num = Number(n || 0);
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) return <p>Loading dashboard…</p>;

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Products" value={stats.total_products} to="/admin/products" accent />
        <StatCard label="Total Orders" value={stats.total_orders} to="/admin/orders" />
        <StatCard label="Pending Orders" value={stats.pending_orders} to="/admin/orders" warn={stats.pending_orders > 0} />
        <StatCard label="Completed Orders" value={stats.completed_orders} to="/admin/orders" />
        <StatCard label="Total Customers" value={stats.total_customers} to="/admin/customers" />
        <StatCard label="Total Sales" value={formatCurrency(stats.total_sales)} to="/admin/orders" accent />
        <StatCard label="Low Stock" value={stats.low_stock} to="/admin/inventory" warn={stats.low_stock > 0} />
        <StatCard label="Out of Stock" value={stats.out_of_stock} to="/admin/inventory" warn={stats.out_of_stock > 0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Orders</h2>
          <div className="table-wrap">
            <table style={{ minWidth: 360 }}>
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.length === 0 && <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet.</td></tr>}
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><Link to={`/admin/orders/${o.id}`} style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 600 }}>{o.order_number}</Link></td>
                    <td>{o.customer_name}</td>
                    <td>{formatCurrency(o.total_amount)}</td>
                    <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'right', marginTop: '0.75rem' }}><Link to="/admin/orders" className="btn btn-secondary btn-sm">View all</Link></div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Customers</h2>
          <div className="table-wrap">
            <table style={{ minWidth: 360 }}>
              <thead><tr><th>Name</th><th>Email</th><th>Orders</th></tr></thead>
              <tbody>
                {recentCustomers.length === 0 && <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No customers yet.</td></tr>}
                {recentCustomers.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.email}</td>
                    <td>{c.total_orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'right', marginTop: '0.75rem' }}><Link to="/admin/customers" className="btn btn-secondary btn-sm">View all</Link></div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
          <Link to="/admin/categories" className="btn btn-secondary">Manage Categories</Link>
          <Link to="/admin/banners" className="btn btn-secondary">Edit Banners</Link>
          <Link to="/admin/coupons" className="btn btn-secondary">Create Coupon</Link>
          <Link to="/admin/pages" className="btn btn-secondary">Edit Pages</Link>
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Sales Overview (Last 30 Days)</h2>
        <SalesChart />
      </div>
    </>
  );
}

function StatCard({ label, value, to, accent, warn }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={{ padding: '1.25rem', borderLeft: warn ? '4px solid var(--danger)' : accent ? '4px solid var(--accent)' : '4px solid var(--border)' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: warn ? 'var(--danger)' : 'var(--text)' }}>{value}</div>
      </div>
    </Link>
  );
}

function SalesChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    api.get('admin/dashboard/index.php?action=sales_chart&days=30')
      .then(j => setData(j.data || []))
      .catch(() => {});
  }, []);

  if (!data.length) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No sales data available yet.</p>;

  const max = Math.max(...data.map(d => Number(d.total || 0)), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingTop: 16 }}>
      {data.map((d, i) => {
        const val = Number(d.total || 0);
        const h = Math.max(4, (val / max) * 160);
        return (
          <div key={i} title={`${d.date}: ₹${val}`} style={{ flex: '1 1 0', textAlign: 'center' }}>
            <div style={{ height: h, background: 'var(--accent)', borderRadius: 4, opacity: 0.85, minWidth: 8 }} />
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>{d.date?.slice(5) || ''}</div>
          </div>
        );
      })}
    </div>
  );
}
