/**
 * Decodes a URL segment, returning it unchanged if it is not valid
 * percent-encoding (e.g. a lone "%").
 *
 * @param {string} s - A single URL segment.
 * @returns {string} The decoded segment, or the original one if decoding fails.
 */
const safeDecode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/**
 * Rebuilds a work id from the catch-all route param `[...ID]`.
 * DOI-based ids contain "/", so Next.js splits them into several segments;
 * each one is decoded and they are joined back with "/".
 *
 * @example
 * workIdFromParams(["10.1136", "bmj.d5928"]); // "10.1136/bmj.d5928"
 * workIdFromParams("W2594075087"); // "W2594075087"
 *
 * @param {string[]|string} p - `params.ID` (array of segments, or a single string).
 * @returns {string} The work id, e.g. "10.1136/bmj.d5928".
 */
export const workIdFromParams = (p) =>
  (Array.isArray(p) ? p : [p]).map(safeDecode).join("/");

/**
 * Builds the API path of a work. Each segment is encoded with
 * `encodeURIComponent` but the "/" separators are kept literal, since the API
 * does not accept "%2F".
 *
 * @example
 * workPath("10.1136/bmj.d5928"); // "/work/10.1136/bmj.d5928"
 *
 * @param {string} id - The work id (may contain "/").
 * @returns {string} The path, e.g. "/work/10.1136/bmj.d5928".
 */
export const workPath = (id) =>
  `/work/${String(id).split("/").map(encodeURIComponent).join("/")}`;
