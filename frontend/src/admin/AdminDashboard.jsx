import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminProducts, adminCategories } from '../api';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, categories: 0 });

  useEffect(() => {
    Promise.all([adminProducts.list({ limit: 500 }), adminCategories.list()])
      .then(([pRes, cRes]) => {
        setCounts({
          products: pRes.data?.length ?? 0,
          categories: cRes.data?.length ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link to="/admin/products" className="card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{counts.products}</div>
          <div style={{ color: 'var(--text-muted)' }}>Products</div>
        </Link>
        <Link to="/admin/categories" className="card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{counts.categories}</div>
          <div style={{ color: 'var(--text-muted)' }}>Categories</div>
        </Link>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/admin/products/new" className="btn btn-primary">Add new product</Link>
      </div>
    </>
  );
}
