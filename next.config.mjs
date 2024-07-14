/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },{
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/io-filepreviews-sandbox-uploads/**',
      }
    ],
  },
};

export default nextConfig;
