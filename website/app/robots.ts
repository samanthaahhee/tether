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
        // Keep the admin dashboard out of search engines (the data is also
        // password-protected, but no need to advertise the URL).
        disallow: ['/admin', '/admin/', '/pitch', '/pitch/'],
      },
    ],
    sitemap: 'https://heyotis.app/sitemap.xml',
    host: 'https://heyotis.app',
  };
}
