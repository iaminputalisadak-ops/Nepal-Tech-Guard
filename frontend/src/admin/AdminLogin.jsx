import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, go to dashboard
  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const userValue = (fd.get('username') ?? '').toString().trim();
    const passValue = (fd.get('password') ?? '').toString().trim();
    if (!userValue || !passValue) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await auth.login(userValue, passValue);
      if (res && res.token) {
        localStorage.setItem('admin_token', res.token);
        // Full page navigation so dashboard loads with token
        window.location.href = (window.location.origin || '') + '/admin/dashboard';
        return;
      }
      setError('Login failed');
    } catch (err) {
      const msg = err.message || 'Login failed';
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        setError('Cannot connect to backend. Run "npm run start" from project root.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: 8 }}>Nepal TechGuard Admin</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '1.5rem' }}>Sign in to manage products</p>
        {error && <div className="admin-login-error" style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: 13, lineHeight: 1.5 }}>{error}</div>}
        <form onSubmit={handleSubmit} action="#" method="post">
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="admin" autoComplete="username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: 13, color: 'var(--text-muted)' }}>Default: admin / password (or run npm run admin:password for a new password)</p>
      </div>
    </div>
  );
}
