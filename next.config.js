/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://modulith.herokuapp.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
