/* Constants */
import { OPTIONS } from "../constants";

const ROUTE_BY_ENTITY = Object.fromEntries(
  OPTIONS.map(({ value, route }) => [value, route])
);

/**
 * Builds the autocomplete URL based on the selected entity. Default behavior is direct routing.
 *
 * @param {string} entity - The selected entity type (e.g., "person", "source", "affiliations").
 * @param {string} encodedInput - The URL-encoded user input for autocomplete.
 *
 * @returns {string} The constructed autocomplete URL.
 */
export default function autocompleteURLBuilder(entity, encodedInput) {
  return ROUTE_BY_ENTITY[entity] === "affiliation"
    ? `/app/completer/affiliations/${entity}/${encodedInput}`
    : `/app/completer/${entity}/${encodedInput}`;
}
