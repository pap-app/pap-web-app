/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'assets.aceternity.com',
            port: '',
            
          },
          {
            protocol: 'https',
            hostname: 'pbs.twimg.com',
            port: '',
            
          },
        ],
      }
};

export default nextConfig;
