import { CONNECTORS } from "../constants";

/**
 * Formats a name by capitalizing the first letter of each word,
 * while keeping specific connectors in lowercase.
 *
 * @param {string} name - The full name to format.
 * @returns {string} The formatted name.
 */
export function formatName(name) {
  return name
    ?.split(" ")
    .map((word) =>
      CONNECTORS.includes(word.toUpperCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
