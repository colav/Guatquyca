/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CLIENT_API: "http://apis.impactu.colav.co:8010/",
  },
};

module.exports = nextConfig;
