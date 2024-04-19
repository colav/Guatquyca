/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CLIENT_API: "https://apis.impactu.colav.co/",
  },
};

module.exports = nextConfig;
