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

// Helper function to extract source name (prefer Spanish)
const getSourceName = (names = []) => {
  const spanishName = names.find((n) => n.lang === "es")?.name;
  const englishName = names.find((n) => n.lang === "en")?.name;
  return spanishName || englishName || "Sin nombre";
};

// Helper function to map source type to display name
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

// Helper function to transform API source to featured card format
const transformSourceData = (apiSource) => ({
  name: getSourceName(apiSource.names),
  publisher: apiSource.publisher?.name || "Sin editor",
  q: apiSource.scimago_best_quartile,
  products: (apiSource.products_count || 0).toLocaleString("es-CO"),
  type: mapSourceType(apiSource.type),
  oaStatus: apiSource.open_access_status,
  id: apiSource.id,
});

export default function TopJournalsSection({ data }) {
  const Q_COLORS = {
    Q1: "#16a34a",
    Q2: "#2563eb",
    Q3: "#d97706",
    Q4: "#dc2626",
  };

  // Transform API data to featured sources format
  const FEATURED_SOURCES = (data?.data || []).map(transformSourceData);

  // Don't render if no data
  if (!FEATURED_SOURCES || FEATURED_SOURCES.length === 0) return null;

  return (
    <section className={`${styles.section} ${styles.section_alt}`}>
      <div className={styles.section_inner}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>Fuentes destacadas</h2>
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
