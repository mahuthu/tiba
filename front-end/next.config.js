/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/api/:path*'  // Using Docker service name
      },
      {
        // Add this new rule for non-api routes
        source: '/:path*',
        destination: 'http://backend:8080/:path*',
        has: [
          {
            type: 'header',
            key: 'x-handle-backend',
            value: 'true',
          },
        ],
      },

      {
        source: '/chatbot/:path*',
        destination: 'http://backend:8080/chatbot/:path*'  // Using Docker service name
      }
    ]
  },
}

module.exports = nextConfig