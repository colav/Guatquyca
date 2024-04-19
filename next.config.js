/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    CLIENT_API: "https://apis.impactu.colav.co/",
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
