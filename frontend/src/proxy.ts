import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - …/_next (Next.js internals)
  // - …/api (Next.js API routes)
  // - …/*.* (files with an extension, e.g. favicon.ico)
  // - Next.js metadata routes (apple-icon, icon, manifest, robots, sitemap, opengraph-image, twitter-image)
  matcher: ['/((?!api|_next|apple-icon|icon|manifest|robots|sitemap|opengraph-image|twitter-image|llms\\.txt|.*\\..*).*)'],
};
