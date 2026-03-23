/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@imgly/background-removal']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  }
}

module.exports = nextConfig