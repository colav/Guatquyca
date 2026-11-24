/* UI Library Components */
import { Tooltip } from "antd";

const EXTERNAL_URL_LABELS = {
  open_access: "Acceso abierto",
  "scholar citations": "Google Scholar (citas)",
  dspace: "DSpace",
  doi: "DOI",
  openalex: "OpenAlex",
  scholar: "Google Scholar",
  uri: "URI",
  pdf: "PDF",
  oaipmh: "OAI-PMH",
};

const EXTERNAL_URL_PRIORITY = [
  "dspace",
  "doi",
  "open_access",
  "pdf",
  "oaipmh",
  "openalex",
  "scholar citations",
  "scholar",
  "uri",
];

const getSourceLabel = (source = "") =>
  EXTERNAL_URL_LABELS[source] ||
  source.charAt(0).toUpperCase() + source.slice(1);

/**
 * RenderedExternalURLs is a function that takes an array of external_urls and returns an array of objects.
 * Each object contains a key, label, and children property. The children property is a JSX element.
 *
 * @param {Array} external_urls - The array of external_urls. Each element in the array is an object with a source and url property.
 *
 * Duplicate URLs are kept only once, prioritizing the most specific source
 * label. For example, a DSpace handle is kept instead of the same URL labeled
 * as a generic URI.
 *
 * @returns {Array} An array of objects. Each object contains a key, label, and children property.
 * The key property is a string that uniquely identifies the object.
 * The label property is a string that starts with the source property of the external_url object, with the first letter capitalized, followed by " URL".
 * The children property is a JSX element that is a link to the url property of the external_url object.
 */
export default function RenderedExternalURLs(external_urls = []) {
  if (!Array.isArray(external_urls)) return [];

  const uniqueURLs = new Map();
  external_urls
    .filter((item) => item.url)
    .forEach((item) => {
      const currentItem = uniqueURLs.get(item.url);
      const currentPriority = currentItem
        ? EXTERNAL_URL_PRIORITY.indexOf(currentItem.source)
        : -1;
      const itemPriority = EXTERNAL_URL_PRIORITY.indexOf(item.source);

      if (
        !currentItem ||
        (itemPriority !== -1 &&
          (currentPriority === -1 || itemPriority < currentPriority))
      ) {
        uniqueURLs.set(item.url, item);
      }
    });

  return Array.from(uniqueURLs.values()).map((item, index) => ({
    key: `ext-url-${index}`,
    label: `${getSourceLabel(item.source)} URL`,
    children: item.provenance ? (
      <Tooltip title={`Fuente: ${item.provenance}`}>
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.url}
        </a>
      </Tooltip>
    ) : (
      <a href={item.url} target="_blank" rel="noreferrer">
        {item.url}
      </a>
    ),
  }));
}
