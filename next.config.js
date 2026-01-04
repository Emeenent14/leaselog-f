/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'leaselog-files.s3.amazonaws.com',
      'images.unsplash.com',
    ],
  },
}

module.exports = nextConfig
