import type { MetadataRoute } from 'next';

const BASE_URL = 'https://cattosoftwaresolutions.com';

// Served at /robots.txt — allows all crawlers and points them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Don't index auth/account areas — no SEO value, keeps the index clean.
      disallow: ['/en/signin', '/es/signin', '/en/profile', '/es/profile'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
