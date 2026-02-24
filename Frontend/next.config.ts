const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/images/**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development', 
  },
};

export default nextConfig;