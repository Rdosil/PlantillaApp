/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.gstatic.com', 'firebasestorage.googleapis.com'],
  },
}

module.exports = nextConfig