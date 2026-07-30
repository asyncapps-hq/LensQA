import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lensqa/shared'],
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
}

export default nextConfig
