/* Icons */
import { BookOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * Publisher is a server-side functional component that displays the name of the publisher for a given source or work.
 *
 * @param {Object} publisher - Publisher information object.
 * @param {string} publisher.name - Name of the publisher.
 * @returns {JSX.Element} The rendered publisher information.
 */
export default function Publisher({ publisher }) {
  return (
    <div className={styles.publisher_container}>
      <BookOutlined /> Publisher:{" "}
      <span className={styles.text}>{publisher.name}</span>
    </div>
  );
}
