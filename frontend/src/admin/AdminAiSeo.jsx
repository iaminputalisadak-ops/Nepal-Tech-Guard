import React, { useState, useEffect } from 'react';
import { adminProducts, adminCategories } from '../api';

// Detailed SEO evaluation logic (0-100)
export function evaluateSeo(p) {
  let score = 0;
  const issues = [];
  const recommendations = [];

  // Title checks
  if (p.name && p.name.length >= 20 && p.name.length <= 70) {
    score += 15;
  } else if (!p.name) {
    issues.push('Missing product title');
  } else {
    score += 8;
    recommendations.push('Optimize title length (ideal: 20-70 characters)');
  }

  // Description checks
  const desc = p.description || '';
  const wordCount = desc.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 200) {
    score += 25;
  } else if (wordCount >= 50) {
    score += 15;
    recommendations.push('Expand product description to 200+ words for better ranking');
  } else if (wordCount > 0) {
    score += 5;
    issues.push('Thin content: Description is under 50 words');
  } else {
    issues.push('Missing detailed description');
  }

  // Short description
  if (p.short_description && p.short_description.length >= 40) {
    score += 10;
  } else {
    recommendations.push('Add a concise short description (40-160 chars) for meta snippets');
  }

  // Slug check
  if (p.slug && /^[a-z0-9-]+$/.test(p.slug) && p.slug.length >= 5) {
    score += 10;
  } else {
    issues.push('Unfriendly or missing URL slug');
  }

  // Image check
  if (p.image_url) {
    score += 15;
    if (p.image_url.includes('cover.php') || p.image_url.includes('uploads/')) {
      score += 5;
    }
  } else {
    issues.push('Missing product cover image');
  }

  // Metadata / Pricing / Schema Readiness
  if (p.price_min > 0 && p.availability) {
    score += 10;
  } else {
    recommendations.push('Ensure price and availability are set for Schema.org eligibility');
  }

  // Brand Name
  if (p.brand_name) {
    score += 10;
  } else {
    recommendations.push('Specify brand name to enhance Google Product Knowledge Graph');
  }

  return {
    score: Math.min(100, score),
    issues,
    recommendations
  };
}

export default function AdminAiSeo() {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Bulk processing state
  const [processingQueue, setProcessingQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLog, setProcessingLog] = useState([]);

  // Preview Modal state
  const [previewProduct, setPreviewProduct] = useState(null);
  const [aiDraft, setAiDraft] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminProducts.list(),
        adminCategories.list()
      ]);
      setProductsList(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      alert('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const evaluated = productsList.map(p => ({
    ...p,
    seo: evaluateSeo(p)
  }));

  const totalProducts = evaluated.length;
  const poorSeoCount = evaluated.filter(p => p.seo.score < 60).length;
  const missingImages = evaluated.filter(p => !p.image_url).length;
  const missingDesc = evaluated.filter(p => !p.description || p.description.length < 50).length;
  const avgScore = totalProducts ? Math.round(evaluated.reduce((acc, p) => acc + p.seo.score, 0) / totalProducts) : 0;

  // Filter products
  const filtered = evaluated.filter(p => {
    if (filterCat && String(p.category_id) !== String(filterCat)) return false;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterStatus === 'poor' && p.seo.score >= 60) return false;
    if (filterStatus === 'good' && p.seo.score < 80) return false;
    if (filterStatus === 'no-image' && p.image_url) return false;
    if (filterStatus === 'no-desc' && p.description && p.description.length >= 50) return false;
    return true;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(p => p.id));
    }
  };

  // AI Content Generator helper
  const generateAiContent = (prod) => {
    const price = prod.price_min ? `Rs. ${prod.price_min}` : 'best price';
    const name = prod.name;

    const newShortDesc = `Buy genuine ${name} in Nepal with instant WhatsApp, SMS & Email delivery. Verified activation warranty.`;
    const newDesc = `${name} provides authentic, certified digital licensing for users and businesses across Nepal.

Key Features & Benefits:
- 100% Genuine and authentic activation.
- Instant digital delivery directly via Email, WhatsApp, and SMS.
- Lifetime validity or full-term subscription guarantee.
- Dedicated customer support from Kathmandu for effortless installation.

Technical Requirements:
- High-speed internet for digital license activation.
- Compatible with official installers directly from Microsoft or vendor portals.

Why choose Nepal TechGuard?
We ensure safe, affordable, and certified license keys across Kathmandu, Pokhara, and all major cities in Nepal.`;

    const newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newImage = prod.image_url || `https://shop.hedztech.com/backend/cover.php?title=${encodeURIComponent(name)}&slug=${encodeURIComponent(newSlug)}`;

    return {
      name,
      slug: newSlug,
      short_description: newShortDesc,
      description: newDesc,
      image_url: newImage,
      meta_title: `${name} Price in Nepal | Nepal TechGuard`,
      meta_desc: `Buy genuine ${name} in Nepal at ${price}. Instant email and WhatsApp delivery with full activation support.`,
      faq: [
        { q: `Is this ${name} genuine?`, a: `Yes, all keys sold by Nepal TechGuard are verified and genuine.` },
        { q: `How fast is delivery?`, a: `Digital licenses are delivered within 60 seconds after payment confirmation.` }
      ]
    };
  };

  // Single Item Preview
  const handleOpenPreview = (prod) => {
    setPreviewProduct(prod);
    setAiDraft(generateAiContent(prod));
  };

  // Save changes from Preview Modal
  const handleApplyPreview = async () => {
    if (!previewProduct || !aiDraft) return;
    try {
      const payload = {
        ...previewProduct,
        name: aiDraft.name,
        slug: aiDraft.slug,
        short_description: aiDraft.short_description,
        description: aiDraft.description,
        image_url: aiDraft.image_url,
      };
      await adminProducts.update(payload);
      alert('Product updated successfully!');
      setPreviewProduct(null);
      setAiDraft(null);
      loadData();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  // Bulk Processing Queue Runner
  const runBulkQueue = async (actionType) => {
    if (selectedIds.length === 0) {
      alert('Please select at least one product.');
      return;
    }

    const queue = selectedIds.map(id => {
      const p = productsList.find(x => x.id === id);
      return { id, name: p ? p.name : `Product #${id}`, status: 'waiting' };
    });

    setProcessingQueue(queue);
    setIsProcessing(true);
    setProcessingLog([`Starting bulk operation: ${actionType} for ${queue.length} items.`]);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      setProcessingQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'processing' } : q));

      try {
        const prod = productsList.find(x => x.id === item.id);
        if (prod) {
          const ai = generateAiContent(prod);
          const payload = { id: prod.id, ...prod };

          if (actionType === 'all' || actionType === 'seo') {
            payload.short_description = ai.short_description;
            payload.description = ai.description;
            payload.slug = ai.slug;
          }
          if (actionType === 'all' || actionType === 'images') {
            payload.image_url = ai.image_url;
          }

          await adminProducts.update(payload);
          setProcessingQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'success' } : q));
          setProcessingLog(prev => [...prev, `✔ Successfully processed ${item.name}`]);
        }
      } catch (err) {
        setProcessingQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'failed', error: err.message } : q));
        setProcessingLog(prev => [...prev, `❌ Error on ${item.name}: ${err.message}`]);
      }

      // Small pause to prevent overloading
      await new Promise(r => setTimeout(r, 600));
    }

    setIsProcessing(false);
    setProcessingLog(prev => [...prev, 'Bulk operation completed.']);
    loadData();
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', margin: 0 }}>AI Product Image & SEO Extension</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Automated professional box-art generation, schema analysis, and high-impact SEO scoring.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Avg SEO Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: avgScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>{avgScore}/100</div>
        </div>
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Needs SEO Optimization</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{poorSeoCount}</div>
        </div>
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Missing Images</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{missingImages}</div>
        </div>
        <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Thin Content (&lt;50 words)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{missingDesc}</div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
            />
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="poor">Low SEO Score (&lt;60)</option>
              <option value="good">Good SEO (&gt;=80)</option>
              <option value="no-image">Missing Images</option>
              <option value="no-desc">Thin/Missing Descriptions</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              disabled={selectedIds.length === 0 || isProcessing}
              onClick={() => runBulkQueue('all')}
            >
              Auto-Generate All ({selectedIds.length})
            </button>
            <button
              className="btn btn-secondary"
              disabled={selectedIds.length === 0 || isProcessing}
              onClick={() => runBulkQueue('seo')}
            >
              SEO Only
            </button>
            <button
              className="btn btn-secondary"
              disabled={selectedIds.length === 0 || isProcessing}
              onClick={() => runBulkQueue('images')}
            >
              Images Only
            </button>
          </div>
        </div>
      </div>

      {/* Queue Progress Section */}
      {processingQueue.length > 0 && (
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>
            Queue Status: {isProcessing ? 'Processing...' : 'Finished'}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {processingQueue.map((q, idx) => (
              <span
                key={idx}
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  background: q.status === 'success' ? '#dcfce7' : q.status === 'processing' ? '#fef08a' : q.status === 'failed' ? '#fee2e2' : '#e2e8f0',
                  color: q.status === 'success' ? '#166534' : q.status === 'processing' ? '#854d0e' : q.status === 'failed' ? '#991b1b' : '#475569'
                }}
              >
                {q.name} ({q.status})
              </span>
            ))}
          </div>
          <div style={{ maxHeight: 100, overflowY: 'auto', background: '#0f172a', color: '#f8fafc', padding: 8, borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>
            {processingLog.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
              <th style={{ padding: '0.75rem', width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={selectAll}
                />
              </th>
              <th style={{ padding: '0.75rem' }}>Image</th>
              <th style={{ padding: '0.75rem' }}>Product Name</th>
              <th style={{ padding: '0.75rem' }}>SEO Score</th>
              <th style={{ padding: '0.75rem' }}>Key Issues / Recommendations</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {p.image_url ? (
                    <img src={p.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'contain', background: '#fff', border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: 4, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#64748b' }}>No Img</div>
                  )}
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                  {p.name}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>/{p.slug}</div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: p.seo.score >= 80 ? 'var(--success)' : p.seo.score >= 50 ? '#d97706' : 'var(--danger)'
                    }}>
                      {p.seo.score}/100
                    </span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {p.seo.issues.length > 0 ? (
                    <div style={{ color: 'var(--danger)', fontSize: 12 }}>
                      Issue: {p.seo.issues.join(', ')}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--success)', fontSize: 12 }}>
                      Good technical base
                    </div>
                  )}
                  {p.seo.recommendations.length > 0 && (
                    <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>
                      Tip: {p.seo.recommendations[0]}
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenPreview(p)}
                  >
                    Preview AI Update
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No products matched the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Current vs AI Preview Modal */}
      {previewProduct && aiDraft && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem' }}>Review & Approve AI Suggestions: {previewProduct.name}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* CURRENT */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', background: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#64748b' }}>Current Values</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>Cover Image</label>
                  <div>
                    {previewProduct.image_url ? (
                      <img src={previewProduct.image_url} alt="" style={{ maxWidth: 120, height: 'auto', borderRadius: 4 }} />
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No image set</span>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>Short Description</label>
                  <p style={{ fontSize: 13, margin: '2px 0' }}>{previewProduct.short_description || '—'}</p>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>Description Length</label>
                  <p style={{ fontSize: 13, margin: '2px 0' }}>{previewProduct.description ? `${previewProduct.description.length} chars` : 'Empty'}</p>
                </div>
              </div>

              {/* AI GENERATED */}
              <div style={{ border: '1px solid var(--primary)', borderRadius: 8, padding: '1rem', background: '#eff6ff' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary)' }}>AI Generated Updates</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>Generated Image URL</label>
                  <div>
                    <img src={aiDraft.image_url} alt="" style={{ maxWidth: 120, height: 'auto', borderRadius: 4, border: '1px solid var(--primary)' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>SEO Short Description</label>
                  <textarea
                    rows={2}
                    value={aiDraft.short_description}
                    onChange={(e) => setAiDraft({ ...aiDraft, short_description: e.target.value })}
                    style={{ width: '100%', fontSize: 13 }}
                  />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: 12, fontWeight: 'bold' }}>Comprehensive Long Description</label>
                  <textarea
                    rows={5}
                    value={aiDraft.description}
                    onChange={(e) => setAiDraft({ ...aiDraft, description: e.target.value })}
                    style={{ width: '100%', fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewProduct(null)}>
                Reject & Close
              </button>
              <button className="btn btn-primary" onClick={handleApplyPreview}>
                Approve & Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}