import styles from "./styles.module.css";

/**
 * GlassCard is a reusable visual container with the glass effect used by metric and information cards.
 * It is presentation-only and does not interpret the content rendered inside it.
 *
 * @param {React.ReactNode} children - The content rendered inside the card.
 * @param {string} [className] - Optional additional class name for layout-specific styles.
 * @returns {JSX.Element} A div containing the provided content with the shared glass card styling.
 */
export default function GlassCard({ children, className = "" }) {
  return <div className={`${styles.card} ${className}`.trim()}>{children}</div>;
}
