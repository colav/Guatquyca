/**
 * Retrieves the value of a cookie by name from the browser's document.cookie.
 * Returns null if not running in a browser environment or if the cookie is not found.
 *
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The cookie value, or null if not found or not in browser
 *
 * @example
 * const token = getCookie('csrf_access_token');
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}
