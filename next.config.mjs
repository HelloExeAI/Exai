/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3002'],
      },
    },
    webpack: (config) => {
      config.externals = [...(config.externals || []), { canvas: 'canvas' }];
      return config;
    },
  };
  
  module.exports = nextConfig;