import type { MetadataRoute } from 'next';

const BASE_URL = 'https://cattosoftwaresolutions.com';

// Public, indexable routes. The marketing home is the priority page; legal pages
// are included so they can be found but rank lower. Each entry lists its en/es
// alternates for hreflang (matches the canonical/languages config in the layout).
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/support', priority: 0.5, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    (['en', 'es'] as const).map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${path}`,
          es: `${BASE_URL}/es${path}`,
        },
      },
    })),
  );
}
