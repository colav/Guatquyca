const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",

  async redirects() {
    return [
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
      // The Atlas UdeA used to live at /observatories/vri-udea: old links keep working.
      {
        source: "/observatories/vri-udea",
        destination: "/observatories/atlas-udea",
        permanent: false,
      },
      {
        source: "/observatories/vri-udea/:path*",
        destination: "/observatories/atlas-udea/:path*",
        permanent: false,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: "grupocolav",
  project: "guatquyca-dev",
  sentryUrl: "https://sentry.impactu.colav.co/",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
