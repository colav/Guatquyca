/* Icons */
import { FieldTimeOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * PublicationTime is a server-side functional component that displays the average publication time in weeks for a source or work.
 *
 * @component
 * @param {number} publication_time_weeks - Average publication time in weeks.
 * @returns {JSX.Element} The rendered publication time information.
 */
export default function PublicationTime({ publication_time_weeks }) {
  return (
    <div className={styles.publisher_container}>
      <FieldTimeOutlined /> Tiempo promedio de publicación:{" "}
      <span className={styles.text}>{publication_time_weeks} semanas</span>
    </div>
  );
}
