/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, ConfigProvider, Space } from "antd";

/**
 * Renders a list of external URLs related to a source, such as official websites, OpenAlex profiles, and more.
 *
 * @component
 * @param {Array<{source: string, id: string}>} external_ids - List of external IDs (e.g., OpenAlex) for the source.
 * @param {Array<{source: string, url: string}>} external_urls - List of external URLs with their source type.
 *
 * @returns {JSX.Element} The rendered list of external links as buttons.
 */
export default function SourcesExternalUrls({ external_ids, external_urls }) {
  const sourceTranslations = {
    openalex: "Perfil en OpenAlex",
    site: "Sitio Web oficial",
    aims_scope: "Alcance y Objetivos",
    journal: "Revista",
    oa_statement: "Declaración de Acceso Abierto",
    author_instructions: "Instrucciones para Autores",
    license_terms: "Términos de Licencia",
  };

  /**
   * Processes and deduplicates external URLs, prioritizing certain sources and including OpenAlex if available.
   * @returns {Array<{source: string, url: string}>} Array of unique external links.
   */
  const processExternalData = () => {
    // Extract the item with source "openalex" from external_ids
    const openalexItem = external_ids.find(
      (item) => item.source === "openalex"
    );
    const openalexUrl = openalexItem
      ? { source: openalexItem.source, url: openalexItem.id }
      : null;

    // Create a map to prioritize "journal" for duplicate URLs
    const urlMap = new Map();

    external_urls.forEach((item) => {
      // If the URL is not in the map, add it
      if (!urlMap.has(item.url)) {
        urlMap.set(item.url, item);
      } else {
        // If the URL already exists, prioritize "journal"
        if (item.source === "journal") {
          urlMap.set(item.url, item);
        }
      }
    });

    // Convert the map back to an array
    const uniqueUrls = Array.from(urlMap.values());

    // Map the data to keep only source and url
    const urls = uniqueUrls.map((item) => ({
      source: item.source,
      url: item.url,
    }));

    // Combine the "openalex" item (if it exists) with the unique URLs
    return openalexUrl ? [...urls, openalexUrl] : urls;
  };

  const links = processExternalData();

  return (
    <div className={styles.external_urls_container}>
      <Space wrap size={[8, 8]}>
        {links.map((link, index) => (
          <ConfigProvider
            key={index}
            theme={{
              components: {
                Button: {
                  textTextColor: "#1a8dc7ff !important",
                  textTextHoverColor: "#0961b4ff !important",
                },
              },
            }}
          >
            <Button
              color="default"
              variant="text"
              size="small"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {sourceTranslations[link.source] || link.source}
            </Button>
          </ConfigProvider>
        ))}
      </Space>
    </div>
  );
}
