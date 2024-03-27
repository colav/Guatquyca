/* UI Library Components */
import { Descriptions, Typography } from "antd";

/* UI Library Sub-components */
const { Text } = Typography;

/**
 * RenderedExternalIDs is a function component that takes an array of external_ids
 * and maps over it to return a list of Descriptions.Item components.
 *
 * @param {Object[]} external_ids - The array of external IDs to be rendered.
 * @param {string} external_ids[].source - The source of the external ID.
 * @param {string} external_ids[].url - The URL associated with the external ID.
 * @param {string} external_ids[].id - The ID itself.
 */
export default function RenderedExternalIDs(external_ids) {
  return external_ids.map(({ source, url, id }) => (
    <Descriptions.Item key={source} label={`${source}:`}>
      {url && (
        <>
          URL:{" "}
          <a href={url} target="_blank" rel="noreferrer">
            Abrir en nueva pestaña
          </a>
          <br />
        </>
      )}
      ID: <Text copyable>{id}</Text>
    </Descriptions.Item>
  ));
}
