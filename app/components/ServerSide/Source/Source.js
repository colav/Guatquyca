/* Icons */
import { ReadOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * Source is a "server-side" function component that displays the source of a work.
 *
 * @param {string} sourceName - The name of the source.
 * @returns {JSX.Element} A div containing the source name.
 */
export default function Source({ sourceName }) {
  return (
    <div className={styles.source_container}>
      <ReadOutlined /> Revista: {sourceName}
    </div>
  );
}
