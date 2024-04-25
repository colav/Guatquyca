/**
 * RenderedExternalURLs is a function that takes an array of external_urls and returns an array of objects.
 * Each object contains a key, label, and children property. The children property is a JSX element.
 *
 * @param {Array} external_urls - The array of external_urls. Each element in the array is an object with a source and url property.
 *
 * @returns {Array} An array of objects. Each object contains a key, label, and children property.
 * The key property is a string that uniquely identifies the object.
 * The label property is a string that starts with the source property of the external_url object, with the first letter capitalized, followed by " URL".
 * The children property is a JSX element that is a link to the url property of the external_url object.
 */
export default function RenderedExternalURLs(external_urls = []) {
  return external_urls.map((item, index) => ({
    key: `ext-url-${index}`,
    label: `${item.source.charAt(0).toUpperCase() + item.source.slice(1)} URL`,
    children: (
      <a href={item.url} target="_blank" rel="noreferrer">
        {item.url}
      </a>
    ),
  }));
}
