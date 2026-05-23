import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ensure API routes that use Node.js fs module work correctly
  // (API routes with export const runtime = 'nodejs' handle this automatically)
}

export default nextConfig
