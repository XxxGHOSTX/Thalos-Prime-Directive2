/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
}

module.exports = nextConfig
