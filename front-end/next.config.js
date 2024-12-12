/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/api/:path*'  // Using Docker service name
        //destination: 'http://34.35.68.156/api/:path*'
      },
      {
        // Add this new rule for non-api routes
        source: '/:path*',
        destination: 'http://backend:8080/:path*',
        //destination: 'http://34.35.68.156/:path*',
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
        destination: 'http://backend:8080/api/chatbot/:path*'  // Using Docker service name
        //destination: 'http://34.35.68.156/chatbot/:path*'
      }
      
    ]
  },
}

module.exports = nextConfig