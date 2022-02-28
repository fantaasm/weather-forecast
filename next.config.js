const nextConfig = {
  // swcMinify: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // experimental: {
  //   granularChunks: true
  // },
  images: {
    domains: ["openweathermap.org","lh3.googleusercontent.com"]
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig