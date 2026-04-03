import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - …/_next (Next.js internals)
  // - …/api (Next.js API routes)
  // - …/*. (all files with an extension, e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
