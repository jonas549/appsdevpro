import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
    ],
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  eslint: {
    dirs: ['app', 'lib'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    }
    return config
  },
}

export default nextConfig
