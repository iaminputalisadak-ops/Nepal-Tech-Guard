import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

// Icons as small SVGs
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
);
const KeyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m2.5 5 3 3L22 12l-1.5-1.5"/></svg>
);

// Footer icons
const LocationIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const EnvelopeIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const FacebookIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const PinterestIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>;
const YoutubeIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
const ChevronUpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>;
const LinkIcon = () => <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

const QUICK_LINKS = [
  { label: 'Office 2024', slug: 'ms-office' },
  { label: 'Office 365', slug: 'ms-office' },
  { label: 'Office 2024 Mac', slug: 'ms-office' },
  { label: 'Windows 11 Pro', slug: 'windows' },
  { label: 'Windows 10 Pro', slug: 'windows' },
  { label: 'Visio 2024', slug: 'ms-office' },
  { label: 'Project 2024', slug: 'ms-office' },
  { label: 'Office 2021', slug: 'ms-office' },
];

const CATEGORY_LINKS = [
  { label: 'Windows', slug: 'windows' },
  { label: 'MS Office', slug: 'ms-office' },
  { label: 'Design & Editing Tools', slug: 'design-editing' },
  { label: 'All Antivirus', slug: 'antivirus' },
];

export default function StoreLayout() {
  const { totalItems } = useCart();
  const s = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [navOpen, setNavOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleQuickLinkSelect = (slug) => {
    navigate('/category/' + slug);
    setQuickLinksOpen(false);
  };
  const quickLinksRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (quickLinksOpen && quickLinksRef.current && !quickLinksRef.current.contains(e.target)) {
        setQuickLinksOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [quickLinksOpen]);

  const categoriesRef = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (categoriesOpen && categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setCategoriesOpen(false);
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onEsc);
    };
  }, [categoriesOpen]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate('/?search=' + encodeURIComponent(q));
  };

  return (
    <div className="store-layout">
      {/* Top bar - white */}
      <header className="store-header">
        <div className="header-top">
          <div className="header-container header-top-inner">
            <Link to="/" className="header-logo" onClick={() => setNavOpen(false)}>
              <span className="header-logo-icon"><KeyIcon /></span>
              <span className="header-logo-text">
                <span className="header-logo-line">NEPAL</span>
                <span className="header-logo-accent">TECH</span>
                <span className="header-logo-line">GUARD</span>
              </span>
            </Link>
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-btn" aria-label="Search">
                <SearchIcon />
              </button>
            </form>
            <div className="header-contact header-contact-desktop">
              <span className="header-contact-icon"><PhoneIcon /></span>
              <span>Need help? Call or WhatsApp</span>
              <a href={`tel:${(s.contact_phone || '+977 9800000000').replace(/\s/g, '')}`} className="header-contact-phone">{s.contact_phone || '+977 9800000000'}</a>
            </div>
            <Link to="/category/windows" className="header-top-offers header-top-offers-desktop">
              <MenuIcon />
              <span>TOP OFFERS!</span>
            </Link>
            <a href={`tel:${(s.contact_phone || '+977 9800000000').replace(/\s/g, '')}`} className="header-contact-mobile" aria-label="Call">
              <span className="header-contact-mobile-icon"><PhoneIcon /></span>
              <span className="header-contact-mobile-number">{s.contact_phone || '+977 9800000000'}</span>
            </a>
          </div>
        </div>

        {/* Main nav - dark blue */}
        <div className="header-nav">
          <div className="header-container">
            <button
              type="button"
              className="header-mobile-menu-btn"
              onClick={() => { setNavOpen((o) => !o); setQuickLinksOpen(false); setCategoriesOpen(false); }}
              aria-label="Toggle menu"
              aria-expanded={navOpen}
            >
              <MenuIcon />
              <span>Menu</span>
            </button>
            <div className="header-nav-categories-wrap header-nav-categories-desktop" ref={categoriesRef}>
              <button
                type="button"
                className="header-nav-categories"
                onClick={(e) => { e.stopPropagation(); setCategoriesOpen((o) => !o); setQuickLinksOpen(false); setNavOpen(false); }}
                aria-expanded={categoriesOpen}
                aria-haspopup="menu"
              >
                <MenuIcon />
                <span>Products Categories</span>
              </button>
              {categoriesOpen && (
                <div className="header-categories-dropdown" role="menu">
                  {CATEGORY_LINKS.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/category/${c.slug}`}
                      role="menuitem"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <nav className={`header-nav-links ${navOpen ? 'mobile-open' : ''}`}>
              <Link to="/category/windows">Windows</Link>
              <span className="header-nav-divider" />
              <Link to="/category/ms-office">MS Office</Link>
              <span className="header-nav-divider" />
              <Link to="/category/design-editing">Design & Editing Tools</Link>
              <span className="header-nav-divider" />
              <Link to="/category/antivirus">All Antivirus</Link>
              <span className="header-nav-divider" />
              <Link to="/blog">Blogs</Link>
              <span className="header-nav-divider" />
              <a href="/#contact">Contact</a>
            </nav>
            <div className="header-nav-right">
              <Link to="/admin" className="header-icon-btn" title="Account / Admin">
                <UserIcon />
              </Link>
              <Link to="/cart" className="header-icon-btn header-cart-btn">
                <CartIcon />
                {totalItems > 0 && <span className="header-cart-badge">{totalItems}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick links bar - white (desktop: inline, mobile: dropdown) */}
        <div className="header-quicklinks">
          <div className="header-container">
            <span className="header-quicklinks-label">Go Quickly To:</span>
            <div className="header-quicklinks-list header-quicklinks-desktop">
              {QUICK_LINKS.map((link, i) => (
                <React.Fragment key={link.label + link.slug}>
                  {i > 0 && <span className="header-quicklinks-divider" />}
                  <Link to={`/category/${link.slug}`}>{link.label}</Link>
                </React.Fragment>
              ))}
            </div>
            <div className="header-quicklinks-mobile-wrap" ref={quickLinksRef}>
              <button
                type="button"
                className="header-quicklinks-dropdown-btn"
                onClick={() => setQuickLinksOpen((o) => !o)}
                aria-expanded={quickLinksOpen}
                aria-haspopup="listbox"
              >
                Quick links
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: quickLinksOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {quickLinksOpen && (
                <div className="header-quicklinks-dropdown" role="listbox">
                  {QUICK_LINKS.map((link) => (
                    <button key={link.label + link.slug} type="button" role="option" onClick={() => handleQuickLinkSelect(link.slug)}>
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="store-main">
        <Outlet />
      </main>

      <footer className="store-footer">
        <div className="footer-top">
          <div className="footer-container">
            <div className="footer-col">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="footer-contact-item">
                <LocationIcon />
                <span>{s.contact_address || 'Nepal TechGuard, Kathmandu, Nepal'}</span>
              </div>
              <div className="footer-contact-item">
                <PhoneIcon />
                <a href={`tel:${(s.contact_phone || '').replace(/\s/g, '')}`}>{s.contact_phone || '+977 9800000000'}</a>
              </div>
              <div className="footer-contact-item">
                <EnvelopeIcon />
                <a href={`mailto:${s.contact_email || 'support@nepaltechguard.com'}`}>{s.contact_email || 'support@nepaltechguard.com'}</a>
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Policy</h4>
              {(s.policy_links || []).map((link, i) => (
                link.url ? (
                  link.url.startsWith('http') ? (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.label || 'Link'}</a>
                  ) : (
                    <Link key={i} to={link.url}>{link.label || 'Link'}</Link>
                  )
                ) : null
              ))}
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Info</h4>
              {(s.info_links || []).map((link, i) => (
                link.url ? (
                  link.url.startsWith('http') ? (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.label || 'Link'}</a>
                  ) : (
                    <Link key={i} to={link.url}>{link.label || 'Link'}</Link>
                  )
                ) : null
              ))}
            </div>
            <div className="footer-col footer-col-social">
              {(s.social_links || []).map((link, i) => {
                const Icon = { facebook: FacebookIcon, instagram: InstagramIcon, pinterest: PinterestIcon, youtube: YoutubeIcon }[link.platform];
                return (
                  <a key={i} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="footer-social-item">
                    {Icon ? <Icon /> : <LinkIcon />}
                    <span>{link.label || link.platform || 'Link'}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-container">
            <p className="footer-copyright">
              © {new Date().getFullYear()} <span className="footer-brand">{s.company_name || 'Nepal TechGuard'}</span>
              {s.copyright_slogan ? ` – ${s.copyright_slogan}` : ' – Trusted Source for Genuine Keys'}
              {s.copyright_tagline ? ` | ${s.copyright_tagline} ` : ' | Designed & Secured by '}
              <span className="footer-credit">{s.company_name || 'Nepal TechGuard'}</span>
            </p>
            <button type="button" className="footer-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
              <ChevronUpIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
