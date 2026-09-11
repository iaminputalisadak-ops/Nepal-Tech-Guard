import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Nepal TechGuard';
const DEFAULT_DESC = 'Buy genuine Windows, MS Office, Antivirus & Adobe license keys in Nepal. Instant delivery via WhatsApp, SMS & Email. Trusted since 2024.';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '') : '';

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image,
  canonicalPath,
  type = 'website',
  jsonLd,
  noindex = false,
  robots,
  keywords,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Genuine Software & License Keys in Nepal`;
  const url = canonicalPath ? `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}` : BASE_URL;
  const ogImage = image || `${BASE_URL}/og-image.png`;
  const robotContent = robots || (noindex ? 'noindex, nofollow' : 'index, follow');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotContent} />
      <meta name="geo.region" content="NP" />
      <meta name="geo.placename" content="Kathmandu" />
      <meta name="theme-color" content="#1e3a5f" />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en-np" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NP" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <>
          {Array.isArray(jsonLd)
            ? jsonLd.map((ld, i) => (
              <script type="application/ld+json" key={i}>
                {JSON.stringify(ld)}
              </script>
            ))
            : (
              <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
              </script>
            )}
        </>
      )}
    </Helmet>
  );
}
