import { redirect } from "next/navigation";
import URLBuilder from "./URLBuilder";

const DEFAULT_SORT_BY_TYPE = {
  patents: "alphabetical_asc",
  projects: "alphabetical_asc",
  works: "citations_desc",
  institution: "citations_desc",
  faculty: "citations_desc",
  department: "citations_desc",
  person: "citations_desc",
  group: "citations_desc",
  news: "year_desc",
  sources: "products_desc",
};

const DEFAULT_PAGE = "1";
const DEFAULT_MAX = "10";

/**
 * Get the default sort for a given entity type.
 * @param {string} type - The entity type.
 * @returns {string} The default sort value.
 */
export function getDefaultSortForType(type) {
  return DEFAULT_SORT_BY_TYPE[type] ?? "citations_desc";
}

/**
 * Check if searchParams need correction (missing sort, page, or max).
 * If correction is needed, performs a redirect. Otherwise returns corrected searchParams.
 * @param {Object} searchParams - The current search parameters.
 * @param {string} type - The entity type.
 * @param {string} pathname - The current pathname for redirect.
 * @returns {Object} The corrected searchParams (only returns if no redirect is needed).
 */
export function ensureSearchParamsOrRedirect(searchParams, type, pathname) {
  const max = searchParams?.max || DEFAULT_MAX;
  const page = searchParams?.page || DEFAULT_PAGE;
  const sort = searchParams?.sort || getDefaultSortForType(type);

  // Check if any parameter was missing
  const needsRedirect =
    !searchParams?.max || !searchParams?.page || !searchParams?.sort;

  if (needsRedirect) {
    const correctedParams = {
      ...(searchParams ?? {}),
      max,
      page,
      sort,
    };
    const redirectUrl = URLBuilder(pathname, correctedParams);
    redirect(redirectUrl);
  }

  // If no redirect, return the original searchParams (which now has all required params)
  return {
    ...(searchParams ?? {}),
    max: searchParams.max || max,
    page: searchParams.page || page,
    sort: searchParams.sort || sort,
  };
}
