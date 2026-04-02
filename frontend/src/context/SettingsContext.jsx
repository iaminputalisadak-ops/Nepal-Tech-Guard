import React, { createContext, useContext, useEffect, useState } from 'react';
import { settings as settingsApi } from '../api';

const DEFAULT_SETTINGS = {
  contact_address: 'Nepal TechGuard, Kathmandu, Nepal',
  contact_phone: '+977 9800000000',
  contact_email: 'support@nepaltechguard.com',
  policy_links: [
    { label: 'Refund Policy', url: '/refund-policy' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Use', url: '/terms' },
    { label: 'Disclaimer', url: '/disclaimer' },
  ],
  info_links: [
    { label: 'About us', url: '/about' },
    { label: 'Contact us', url: '/contact' },
    { label: 'My Account', url: '/admin' },
    { label: 'Shop Page', url: '/' },
    { label: 'Blog', url: '/blog' },
  ],
  social_links: [
    { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
    { platform: 'pinterest', label: 'Pinterest', url: 'https://pinterest.com' },
    { platform: 'youtube', label: 'Youtube', url: 'https://youtube.com' },
  ],
  company_name: 'Nepal TechGuard',
  copyright_slogan: 'Trusted Source for Genuine Keys',
  copyright_tagline: 'Designed & Secured by',
  payment_methods: ['UPI', 'Visa', 'MC', 'RuPay'],
  payment_qr_image_url: '',
  payment_qr_title: 'Scan & Pay',
  payment_qr_instructions: 'Scan this QR with your banking/eSewa/Khalti app and complete the payment.',
  payment_thankyou_message: 'Your request has been successfully registered. A secure, time-limited access link is being generated and will be delivered to your registered email within a few minutes.\nMeanwhile, your transaction is under verification. Once confirmed (typically within 30 minutes), you will receive your access credentials along with complete instructions.',
  page_contents: {},
};

const SettingsContext = createContext(DEFAULT_SETTINGS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const load = () => {
    settingsApi.get()
      .then((r) => {
        if (r.success && r.data) setSettings({ ...DEFAULT_SETTINGS, ...r.data });
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const onSaved = () => load();
    window.addEventListener('settings-saved', onSaved);
    return () => window.removeEventListener('settings-saved', onSaved);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
