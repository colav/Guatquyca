/* APIs */
import getData from "@/lib/apis/server.api";

/* Utilities */
import dateBuilder from "@/lib/utils/dateBuilder";

/**
 * Server component that fetches and returns the last database update date.
 *
 * Fetches info from `/app/info` endpoint and formats the `db_update` field.
 *
 * @returns {Promise<string>} Formatted last database update date
 */
export default async function DBUpdatedAt() {
  const { data } = await getData("/app/info");

  return dateBuilder(data.db_update);
}
