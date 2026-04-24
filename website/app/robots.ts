import type { MetadataRoute } from 'next';

// Required for `output: 'export'` static export mode.
export const dynamic = 'force-static';

// Next.js auto-serves this at /robots.txt.
// Points crawlers to our sitemap and allows all indexable pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block the Vercel preview URLs from being indexed — only the
        // canonical domain should show up in search results.
        disallow: [],
      },
    ],
    sitemap: 'https://heyotis.app/sitemap.xml',
    host: 'https://heyotis.app',
  };
}
