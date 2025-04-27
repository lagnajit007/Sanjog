/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set experimental features
  experimental: {
    // Configure Next.js experimental features here
  },
  // Allow loading from cdn.jsdelivr.net for MediaPipe resources
  images: {
    remotePatterns: [
      { hostname: 'cdn.jsdelivr.net' },
      { hostname: 'img.clerk.com' },
      { hostname: 'images.clerk.dev' },
    ],
  },
  // Add security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
      ],
    },
  ],
  // Configure styled-components
  compiler: {
    styledComponents: true,
  },
  // Handle WebAssembly and MediaPipe resources
  webpack: (config) => {
    // Allow importing wasm files
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    
    // Ensure MediaPipe can load properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
};

export default nextConfig; 