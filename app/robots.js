/**
 * Generates the robots.txt configuration based on the environment.
 *
 * This function checks if the application is running in the development environment
 * by comparing the API_URL environment variable. If it is in the development environment,
 * it blocks all crawlers. Otherwise, it allows all crawlers.
 *
 * @returns {Object} The robots.txt configuration object.
 */
export default function robots() {
  const isDevEnvironment =
    process.env.API_URL === "https://api.dev.impactu.colav.co";
  return {
    rules: isDevEnvironment
      ? {
          userAgent: "*",
          disallow: "/",
        }
      : {
          userAgent: "*",
          allow: "/",
        },
  };
}
