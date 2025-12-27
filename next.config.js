/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'leaselog-files.s3.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
