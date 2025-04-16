/* Components */
import CitationsBadges from "../../ClientSide/CitationsBadges/CitationsBadges";

/* icons */
import CitationsIcon from "@/public/media/citations";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col } from "antd";

/**
 * CitationsCount component displays the citation count for a given entity.
 * It renders a list of citations using the CitationsBadges component or a default message if no citations are available.
 *
 * @param {Array} citations_count - An array of citation counts. Each item in the array should represent a citation source and its corresponding count.
 * @returns {JSX.Element} The CitationsCount component.
 */
export default function CitationsCount({ citations_count }) {
  return (
    <Col xs={24} md={6} lg={7} xl={5}>
      <h2 className={styles.title}>
        <CitationsIcon fill="gray" /> Citaciones:
      </h2>
      <div className={styles.text}>
        {citations_count?.length ? (
          <CitationsBadges citationsCount={citations_count} />
        ) : (
          "No disponible"
        )}
      </div>
    </Col>
  );
}
