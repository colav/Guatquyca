/* UI Library Components */
import { Col } from "antd";

/* icons */
import CitationsIcon from "@/public/media/citations";

/* Utilities */
import RenderedCitations from "@/lib/RenderedCitations";

/* Styles */
import styles from "./styles.module.css";

/**
 * CitationsCount is a function component that displays the count of citations in a column.
 *
 * @param {Object} props - The component props.
 * @param {number} props.citations_count - The count of citations to display.
 * @returns {JSX.Element} A Col component that displays the count of citations.
 */
export default function CitationsCount({ citations_count }) {
  return (
    <Col xs={24} md={6}>
      <h2 className={styles.title}>
        <CitationsIcon fill="gray" /> Citaciones:
      </h2>
      <div className={styles.text}>
        {citations_count?.length
          ? RenderedCitations(citations_count)
          : "No disponible"}
      </div>
    </Col>
  );
}
