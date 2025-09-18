/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // Add only domains actually used in this project
    remotePatterns: [
      { protocol: "https", hostname: "www.sketchupplaystore.com" },
      { protocol: "https", hostname: "s3.us-central-1.wasabisys.com" },
      { protocol: "https", hostname: "*.wasabisys.com" },
    ],
  },

  // Keep existing build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https://s3.us-central-1.wasabisys.com https://*.wasabisys.com https://www.sketchupplaystore.com; media-src 'self' https://s3.us-central-1.wasabisys.com https://*.wasabisys.com https://www.sketchupplaystore.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline';"
          },
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
}

export default nextConfig
