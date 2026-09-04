/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support custom domains or external images if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
