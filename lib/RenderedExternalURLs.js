/* UI Library Components */
import { Descriptions, Typography } from "antd";

/* UI Library Sub-components */
const { Link } = Typography;

/**
 * RenderedExternalURLs is a function component that takes an array of external_urls
 * and maps over it to return a list of Descriptions.Item components.
 *
 * @param {Object[]} external_urls - The array of external URLs to be rendered.
 * @param {string} external_urls[].source - The source of the external URL.
 * @param {string} external_urls[].url - The URL itself.
 */
export default function RenderedExternalURLs(external_urls) {
  return external_urls.map(({ source, url }) => {
    const formattedUrl =
      source === "scholar citations" ? `https://scholar.google.com${url}` : url;

    return (
      <Descriptions.Item key={source} label="Link externo:">
        <Link href={formattedUrl} target="_blank" rel="noreferrer">
          {formattedUrl}
        </Link>
      </Descriptions.Item>
    );
  });
}
