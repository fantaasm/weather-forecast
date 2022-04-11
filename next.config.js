const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPreact = require("next-plugin-preact");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: "/weather-forecast",
  swcMinify: true,
  poweredByHeader: false,
  compress: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    outputStandalone: true,
    concurrentFeatures: true,
  },
  images: {
    domains: ["openweathermap.org", "lh3.googleusercontent.com", "avatars.githubusercontent.com"],
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = withPreact(nextConfig);
