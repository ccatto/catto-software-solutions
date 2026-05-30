// apps/frontend/middleware.ts
// next-intl middleware: detects the locale from the URL prefix and propagates
// it to getRequestConfig so server components can call getMessages() etc.
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

export default createMiddleware(routing);

export const config = {
  // Match every path EXCEPT api/auth (Better Auth's own routes), Next internals,
  // and static assets. Otherwise the middleware would intercept those.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
