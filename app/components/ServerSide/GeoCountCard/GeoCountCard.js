/* Components */
import GlassCard from "../GlassCard/GlassCard";

/* Styles */
import styles from "./styles.module.css";

/* Utils */
import { formatNumber } from "@/lib/utils/formatNumber";

/**
 * GeoCountCard is a metric card with an icon, a label and a formatted count.
 * It is used in the list and in the profile of cities and states.
 *
 * @param {React.ReactNode} icon - Icon shown before the label.
 * @param {string} label - Label of the metric.
 * @param {number} value - Count to show.
 * @returns {JSX.Element} A glass card with the metric.
 */
export default function GeoCountCard({ icon, label, value }) {
  return (
    <div className={styles.metricCell}>
      <GlassCard className={styles.metricCard}>
        <div>
          <h2 className={styles.metricTitle}>
            {icon} {label}:
          </h2>
          <div className={styles.metricText}>
            {value != null ? formatNumber(value) : "No disponible"}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
