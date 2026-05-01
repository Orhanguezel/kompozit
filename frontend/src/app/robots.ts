import type { MetadataRoute } from 'next';
import { siteUrlBase } from '@/seo/helpers';

const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'cohere-ai',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'DuckAssistBot',
  'YouBot',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteUrlBase();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/admin/'],
      })),
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'AhrefsBot', disallow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
