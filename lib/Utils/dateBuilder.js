/**
 * dateBuilder formats a given date input into the format DD/MM/YYYY.
 *
 * It accepts either a Unix timestamp (in seconds) or an ISO 8601 date string,
 * and returns a human-readable date in the format DD/MM/YYYY, preserving
 * the date in UTC to avoid discrepancies due to local timezone shifts.
 *
 * @param {number|string} input - The Unix timestamp (in seconds) or ISO 8601 string.
 * @param {"unix"|"iso"} type - The type of date format being passed ("unix" or "iso").
 * @returns {string} - The formatted date in DD/MM/YYYY or "No disponible" if invalid.
 */
export default function dateBuilder(input, type = "unix") {
  if (
    input === -1 ||
    input === null ||
    input === undefined ||
    input === "" ||
    (type !== "unix" && type !== "iso")
  ) {
    return "No disponible";
  }

  let date;

  try {
    if (type === "unix") {
      date = new Date(parseInt(input) * 1000);
    } else if (type === "iso") {
      date = new Date(input);
    }
  } catch {
    return "No disponible";
  }

  if (isNaN(date)) return "No disponible";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
