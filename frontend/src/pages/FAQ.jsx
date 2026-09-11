import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

const sectionStyle = { padding: '2rem 1.5rem', maxWidth: 860, margin: '0 auto' };

const BASE_URL = typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') : '';

const FAQ_SECTIONS = [
  {
    title: 'Windows & Office Licensing',
    items: [
      {
        q: 'Is this a genuine Microsoft license key?',
        a: 'Yes, all keys sold by Nepal TechGuard are genuine and verified for online activation with Microsoft.',
      },
      {
        q: 'How do I receive my license key?',
        a: 'After purchase, your license key is delivered instantly via WhatsApp, SMS, and email within 60 seconds.',
      },
      {
        q: 'What is the difference between Retail, OEM, and Volume licenses?',
        a: 'Retail keys are transferable between PCs, OEM keys are permanently tied to the first device they activate on, and Volume licenses are intended for organizations. For personal use, Retail is recommended.',
      },
      {
        q: 'Can I upgrade from Windows 11 Home to Pro?',
        a: 'Yes, a Windows 11 Pro key upgrades Home to Pro without reinstalling. You need the standard (non-N) Pro edition key.',
      },
    ],
  },
  {
    title: 'Antivirus & Delivery',
    items: [
      {
        q: 'Do I get antivirus software for Mac or Android?',
        a: 'We offer antivirus licenses for Windows PC, Mac, and Android. Check each product page for device compatibility before purchase.',
      },
      {
        q: 'How long does delivery take?',
        a: 'License keys are delivered instantly — typically within 30 seconds to 2 minutes via WhatsApp, SMS, and email.',
      },
      {
        q: 'What information do you need at checkout?',
        a: 'We need your name, email address, and optionally your phone number for WhatsApp delivery. No personal documents are required.',
      },
    ],
  },
  {
    title: 'Activation & Support',
    items: [
      {
        q: 'Why am I getting activation error 0xC004F050?',
        a: 'This usually means the key edition does not match your installed Windows edition (e.g., Pro key on a Home install). Verify your edition and reinstall if needed, or contact support.',
      },
      {
        q: 'Can you help me activate my key?',
        a: 'Yes, our support team can walk you through activation via WhatsApp or email. We provide free installation and activation assistance.',
      },
      {
        q: 'Do I get a refund if the key does not work?',
        a: 'We offer a 7-day money-back guarantee if your key cannot be activated. Contact us with your order number and error details.',
      },
    ],
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

export default function FAQPage() {
  const s = useSettings();

  return (
    <section className="page-section" style={sectionStyle}>
      <SEO
        title="FAQ - Nepal TechGuard"
        description="Frequently asked questions about license keys, activation, delivery, and antivirus. Get help with Windows, Office, and software purchases in Nepal."
        canonicalPath="/faq"
        jsonLd={[FAQ_JSON_LD, {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${BASE_URL}/faq` },
          ],
        }]}
      />

      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        ← Back to home
      </Link>

      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Answers to common questions about genuine software licenses, instant digital delivery, and activation support. Serving customers across Nepal since 2024.
      </p>

      {FAQ_SECTIONS.map((section) => (
        <div key={section.title} className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>{section.title}</h2>
          {section.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: idx < section.items.length - 1 ? '1.25rem' : 0 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>{item.q}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>{item.a}</p>
            </div>
          ))}
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
        <p style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Still have a question?</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {s.contact_email && (
            <a href={`mailto:${s.contact_email}`} style={{ color: 'var(--accent)' }}>Email: {s.contact_email}</a>
          )}
          {s.contact_phone && (
            <a href={`tel:${s.contact_phone.replace(/\s/g, '')}`} style={{ color: 'var(--accent)' }}>{s.contact_phone}</a>
          )}
        </div>
      </div>
    </section>
  );
}
