/**
 * RenderedExternalIDs is a function that takes an array of external_ids and returns an array of objects.
 * Each object contains a key, label, and children property. The children property is either a string or a JSX element.
 *
 * @param {Array} external_ids - The array of external_ids. Each element in the array is an object with a source, id, and url property.
 *
 * @returns {Array} An array of objects. Each object contains a key, label, and children property.
 * The key property is a string that uniquely identifies the object.
 * The label property is a string that starts with the source property of the external_id object, with the first letter capitalized, followed by " ID" or " URL".
 * The children property is either a string containing the id property of the external_id object, or a JSX element that is a link to the url property of the external_id object.
 * If the source property of the external_id object is "minciencias", the children property is a string. Otherwise, it is a JSX element.
 */
export default function RenderedExternalIDs(external_ids = []) {
  return external_ids.flatMap((item, index) => {
    if (item.source !== "minciencias" && item.source !== "scienti") {
      return [
        {
          key: `ext-id-${index}-2`,
          label: `${
            item.source.charAt(0).toUpperCase() + item.source.slice(1)
          } URL`,
          children: (
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.url}
            </a>
          ),
        },
      ];
    } else if (item.source === "minciencias" || item.source === "scienti") {
      return [
        {
          key: `ext-id-${index}-1`,
          label: `${
            item.source.charAt(0).toUpperCase() + item.source.slice(1)
          } ID`,
          children: item.id,
        },
      ];
    } else {
      return [];
    }
  });
}
