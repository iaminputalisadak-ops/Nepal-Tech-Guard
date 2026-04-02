import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminBlog } from '../api';

export default function AdminBlog() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminBlog.list()
      .then((r) => setList(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await adminBlog.delete(id);
      load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>Blog</h1>
        <Link to="/admin/blog/new" className="btn btn-primary">New post</Link>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.slug}</td>
                    <td>{p.status}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.published_at || '—'}</td>
                    <td>
                      <Link to={`/admin/blog/edit/${p.id}`} className="btn btn-secondary btn-sm" style={{ marginRight: 8 }}>Edit</Link>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.title)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet.</p>}
        </div>
      )}
    </>
  );
}

