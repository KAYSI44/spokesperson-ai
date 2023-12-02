/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'spokesperson-s3.s3.us-east-1.amazonaws.com',
        protocol: 'https',
      },
    ],
  },
};

module.exports = nextConfig;
