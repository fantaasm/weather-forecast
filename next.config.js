const withBundleAnalyzer = require('@next/bundle-analyzer')({enabled: process.env.ANALYZE === 'true'})

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src example.com;
  style-src 'self' example.com;
  font-src 'self';  
`

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options', value: 'SAMEORIGIN'
  },
  // {
  //   key: 'Content-Security-Policy',
  //   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  // }
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  devIndicators: {
    autoPrerender: false
  },
  removeConsole: process.env.NODE_ENV === "production",
  experimental: {
    outputStandalone: true
  },
  images: {
    domains: ["openweathermap.org", "lh3.googleusercontent.com"]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  async headers() {
    return [{
      source: '/:path*', headers: securityHeaders
    }]
  }
};

module.exports = withBundleAnalyzer(nextConfig);