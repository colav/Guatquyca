"use client";

/* Hooks */
import { useState } from "react";

/* Icons */
import { ArrowRightOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/**
 * SourceTypesSection Component
 *
 * Client component displaying a grid of source type cards (journals, conferences, repositories, etc.).
 * Each card shows the source type name, count, description, and links to filtered search results.
 * Supports hover interactions with visual feedback when hovering over cards.
 *
 * @component
 * @param {Object} data - Filter data containing source_types array with counts
 * @param {Array} [data.source_types] - Array of source type objects with value and count
 * @returns {JSX.Element|null} Grid of source type cards or null if no data available
 */
export default function SourceTypesSection({ data }) {
  const [activeType, setActiveType] = useState(null);
  const sourceTypes = data?.source_types || [];

  if (!sourceTypes.length) return null;

  const getCount = (key) => {
    const count = sourceTypes.find((item) => item.value === key)?.count || 0;
    return Number(count).toLocaleString("es-CO");
  };

  const SOURCE_TYPES = [
    {
      key: "journal",
      label: "Revistas",
      count: getCount("journal"),
      description:
        "Publicaciones científicas periódicas con revisión por pares, ideales para evaluar impacto y visibilidad académica.",
      color: "#1a6ef5",
      bg: "#eef4ff",
    },
    {
      key: "ebook platform",
      label: "Libros electrónicos",
      count: getCount("ebook platform"),
      description:
        "Plataformas de libros y monografías académicas digitales, útiles para consultar producción editorial especializada.",
      color: "#7c3aed",
      bg: "#f5f0ff",
    },
    {
      key: "conference",
      label: "Conferencias",
      count: getCount("conference"),
      description:
        "Actas y proceedings de eventos científicos, donde se difunden resultados recientes de investigación.",
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      key: "book series",
      label: "Series de libros",
      count: getCount("book series"),
      description:
        "Colecciones temáticas de volúmenes académicos, enfocadas en áreas específicas del conocimiento.",
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      key: "repository",
      label: "Repositorios",
      count: getCount("repository"),
      description:
        "Plataformas institucionales y de acceso abierto que almacenan y difunden producción científica.",
      color: "#dc2626",
      bg: "#fff1f1",
    },
    {
      key: "other",
      label: "Otras fuentes",
      count: getCount("other"),
      description:
        "Fuentes no clasificadas, incluyendo metadatos y otros tipos de registros académicos.",
      color: "#64748b",
      bg: "#f1f5f9",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.section_inner}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>Tipos de fuentes</h2>
          <p className={styles.section_sub}>
            Navega por categoría o refina con los filtros avanzados.
          </p>
        </div>

        <div className={styles.types_grid}>
          {SOURCE_TYPES.map((type) => (
            <Link
              key={type.key}
              href={`/search/sources?source_types=${type.key}&max=10&page=1&sort=products_desc`}
              className={`${styles.type_card} ${activeType === type.key ? styles.type_card_active : ""}`}
              style={{ "--card-color": type.color, "--card-bg": type.bg }}
              onMouseEnter={() => setActiveType(type.key)}
              onMouseLeave={() => setActiveType(null)}
            >
              <div className={styles.type_count}>{type.count}</div>
              <div className={styles.type_label}>{type.label}</div>
              <p className={styles.type_desc}>{type.description}</p>
              <span className={styles.type_arrow}>
                <ArrowRightOutlined />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
