import type { MetadataRoute } from 'next';

// Required for `output: 'export'` static export mode.
export const dynamic = 'force-static';

// Next.js auto-serves this at /sitemap.xml. Submit the URL to
// Google Search Console to start indexing.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://heyotis.app';
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
