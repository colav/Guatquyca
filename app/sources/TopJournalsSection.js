/* Icons */
import {
  ArrowRightOutlined,
  ReadOutlined,
  CopyOutlined,
} from "@ant-design/icons";

/* Next */
import Link from "next/link";

/* Components */
import OpenAccessStatus from "@/app/components/ClientSide/OpenAccessStatus/OpenAccessStatus";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tag } from "antd";

/**
 * Extracts the source name from a multilingual names array, preferring Spanish
 *
 * @param {Array<Object>} [names=[]] - Array of name objects with lang and name properties
 * @returns {string} Spanish name, English name, or 'Sin nombre' if none found
 */
const getSourceName = (names = []) => {
  const spanishName = names.find((n) => n.lang === "es")?.name;
  const englishName = names.find((n) => n.lang === "en")?.name;
  return spanishName || englishName || "Sin nombre";
};

/**
 * Maps internal source type identifiers to human-readable Spanish labels
 *
 * @param {string} type - Source type identifier (e.g., 'journal', 'conference', 'repository')
 * @returns {string} Spanish display name for the source type
 */
const mapSourceType = (type) => {
  const typeMap = {
    journal: "Revista",
    conference: "Conferencia",
    repository: "Repositorio",
    "ebook platform": "Plataforma de libros",
    "book series": "Serie de libros",
    other: "Otra fuente",
  };
  return typeMap[type] || type;
};

/**
 * Transforms raw API source data into a format suitable for featured source cards
 *
 * @param {Object} apiSource - Raw source data from the API
 * @param {Array<Object>} [apiSource.names] - Multilingual source names
 * @param {Object} [apiSource.publisher] - Publisher information
 * @param {string} [apiSource.scimago_best_quartile] - Best SCImago quartile (Q1-Q4)
 * @param {number} [apiSource.products_count] - Number of Colombian products associated
 * @param {string} apiSource.type - Source type identifier
 * @param {string} apiSource.open_access_status - Open access status
 * @param {string} apiSource.id - Unique source identifier
 * @returns {Object} Formatted source data for display
 */
const transformSourceData = (apiSource) => ({
  name: getSourceName(apiSource.names),
  publisher: apiSource.publisher?.name || "Sin editor",
  q: apiSource.scimago_best_quartile,
  products: (apiSource.products_count || 0).toLocaleString("es-CO"),
  type: mapSourceType(apiSource.type),
  oaStatus: apiSource.open_access_status,
  id: apiSource.id,
});

/**
 * TopJournalsSection Component
 *
 * Displays featured journals and sources with the highest Colombian research output.
 * Each source card shows the name, publisher, SCImago quartile, open access status,
 * and number of associated Colombian products with a link to view full source details.
 *
 * @component
 * @param {Object} data - API response data containing array of sources
 * @param {Array} [data.data] - Array of source objects from the API
 * @returns {JSX.Element|null} Section with featured source cards or null if no data
 */
export default function TopJournalsSection({ data }) {
  const Q_COLORS = {
    Q1: "#16a34a",
    Q2: "#2563eb",
    Q3: "#d97706",
    Q4: "#dc2626",
  };

  // Transform API data to featured sources format
  const FEATURED_SOURCES = (data || []).map(transformSourceData);

  // Don't render if no data
  if (!FEATURED_SOURCES || FEATURED_SOURCES.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.section_alt}`}>
      <div className={styles.section_inner}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>Revistas destacadas</h2>
          <p className={styles.section_sub}>
            Las revistas con mayor producción de investigadores colombianos.
          </p>
        </div>

        <div className={styles.featured_grid}>
          {FEATURED_SOURCES.map((src) => (
            <div key={src.name} className={styles.featured_card}>
              <div className={styles.featured_top}>
                <div className={styles.featured_icon}>
                  <ReadOutlined />
                </div>
                <div className={styles.featured_tags}>
                  {src.q && (
                    <Tag
                      style={{
                        color: Q_COLORS[src.q],
                        borderColor: Q_COLORS[src.q],
                        background: "transparent",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      SCImago {src.q}
                    </Tag>
                  )}
                  <OpenAccessStatus status={src.oaStatus} />
                </div>
              </div>
              <h3 className={styles.featured_name}>{src.name}</h3>
              <p className={styles.featured_publisher}>{src.publisher}</p>
              <div className={styles.featured_footer}>
                <span className={styles.featured_products}>
                  <CopyOutlined /> {src.products} productos colombianos
                </span>
                <Link
                  href={`/source/${encodeURIComponent(src.id)}/products?max=10&page=1&sort=citations_desc`}
                  className={styles.featured_link}
                >
                  Ver fuente <ArrowRightOutlined />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.section_cta}>
          <Link
            href="/search/sources?source_types=journal&max=10&page=1&sort=products_desc"
            className={styles.cta_btn}
          >
            Ver todas las revistas <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </section>
  );
}
