// apps/frontend/next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Create next-intl plugin with i18n config path
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // React Compiler (stable in Next.js 16) — auto-memoizes components
  reactCompiler: true,
  // TODO: Add your monorepo packages that need transpiling
  transpilePackages: [],
  output: 'standalone',
  images: {
    remotePatterns: [
      // TODO: Add your image CDN hostnames
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    externalDir: true,
  },
  // Skip TypeScript type checking during build (we do this separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // TODO: Add redirects for legacy routes as needed
  // async redirects() {
  //   return [];
  // },
};

// Wrap config with next-intl plugin
export default withNextIntl(nextConfig);
