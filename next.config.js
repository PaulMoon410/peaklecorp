/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enterprise production optimization
  experimental: {
    appDir: true,
  },
  
  // Corporate compliance requirements
  typescript: {
    ignoreBuildErrors: false, // Strict typing for enterprise reliability
  },
  eslint: {
    ignoreDuringBuilds: false, // Code quality enforcement
  },
  
  // Corporate security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // Enterprise logging and monitoring
  logging: {
    fetches: {
      fullUrl: true, // Full audit trails for corporate compliance
    },
  },
  
  // Corporate environment variables
  env: {
    CORPORATE_MODE: process.env.NEXT_PUBLIC_CORPORATE_MODE,
    COMPLIANCE_LEVEL: process.env.NEXT_PUBLIC_SECURITY_COMPLIANCE_LEVEL,
    AUDIT_ENABLED: process.env.NEXT_PUBLIC_AUDIT_MODE,
  },
  
  // Enterprise build optimization
  webpack: (config, { isServer }) => {
    // Corporate blockchain dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    };
    
    // Corporate asset optimization
    config.optimization.minimize = true;
    
    return config;
  },
  
  // Enterprise deployment settings
  output: 'standalone', // Corporate containerization support
  poweredByHeader: false, // Security through obscurity
  compress: true, // Performance optimization for corporate networks
  
  // Corporate image optimization
  images: {
    domains: ['corporate.assets.peakecorp.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
