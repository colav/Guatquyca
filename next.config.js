const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

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
