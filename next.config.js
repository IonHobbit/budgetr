/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "nigerianbanks.xyz",
      "nigerialogos.com",
    ],
  },
}

module.exports = nextConfig
