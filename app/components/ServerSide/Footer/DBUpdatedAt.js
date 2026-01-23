"use client";

/* APIs */
import { APIRequest } from "@/lib/apis/client.api";

/* Utilities */
import dateBuilder from "@/lib/utils/dateBuilder";

/**
 * Server component that fetches and returns the last database update date.
 *
 * Fetches info from `/app/info` endpoint and formats the `db_update` field.
 *
 * @returns {Promise<string>} Formatted last database update date
 */
export default function DBUpdatedAt() {
  const [state] = APIRequest("/app/info");

  return dateBuilder(state.data.db_update);
}
