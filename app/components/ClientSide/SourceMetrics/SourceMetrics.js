import { CopyOutlined } from "@ant-design/icons";
import GlassCard from "../../ServerSide/GlassCard/GlassCard";
import CitationsIcon from "@/public/media/citations";
import { formatNumber } from "@/lib/utils/formatNumber";
import OpenAlexBadge from "../OpenAlexBadge/OpenAlexBadge";
import styles from "./styles.module.css";

function displayMetric(value) {
  if (value == null || (typeof value === "number" && Number.isNaN(value))) {
    return "No disponible";
  }

  return formatNumber(value);
}

function CitationMetric({ count }) {
  if (count == null || (typeof count === "number" && Number.isNaN(count))) {
    return "No disponible";
  }

  return <OpenAlexBadge number={formatNumber(count)} />;
}

function ContextMetrics({ title, productsCount, citationsCount }) {
  return (
    <div className={styles.contextColumn}>
      <h3 className={styles.contextTitle}>{title}</h3>
      <dl className={styles.metricsList}>
        <div className={styles.metricRow}>
          <dt>
            <CopyOutlined /> Productos:
          </dt>
          <dd>{displayMetric(productsCount)}</dd>
        </div>
        <div className={styles.metricRow}>
          <dt>
            <CitationsIcon aria-label="Citations Icon" /> Citaciones:
          </dt>
          <dd>
            <CitationMetric count={citationsCount} />
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * SourceMetrics displays production and citation counts for a source in Colombian and global contexts.
 * Colombian citations are read exclusively from the OpenAlex entry in citationsCount, while global citations
 * are received directly through globalCitationsCount and displayed with the OpenAlex badge.
 *
 * @param {number} [productsCount] - Number of products associated with the source in Colombia.
 * @param {Array<Object>} [citationsCount] - Citation counts by source for the Colombian context.
 * @param {number} [globalProductsCount] - Number of products associated with the source worldwide.
 * @param {number} [globalCitationsCount] - Number of citations for the source worldwide.
 * @returns {JSX.Element} A glass card comparing Colombian and global production and impact metrics.
 */
export default function SourceMetrics({
  productsCount,
  citationsCount,
  globalProductsCount,
  globalCitationsCount,
}) {
  const openAlexCount = Array.isArray(citationsCount)
    ? citationsCount.find(({ source }) => source === "openalex")?.count
    : undefined;

  return (
    <section className={styles.container} aria-label="Producción e impacto">
      <GlassCard className={styles.metricsCard}>
        <h2 className={styles.title}>Producción e impacto</h2>
        <div className={styles.contextGrid}>
          <ContextMetrics
            title="Colombia"
            productsCount={productsCount}
            citationsCount={openAlexCount}
          />
          <ContextMetrics
            title="Total global"
            productsCount={globalProductsCount}
            citationsCount={globalCitationsCount}
          />
        </div>
      </GlassCard>
    </section>
  );
}
