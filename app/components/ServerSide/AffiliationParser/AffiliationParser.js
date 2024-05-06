/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row } from "antd";

/**
 * AffiliationParser is a function component that maps over an array of affiliation objects and returns a Link component for each affiliation.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.affiliations - An array of affiliation objects. Each object should have a 'name', 'id', and 'types' property.
 * @returns {Array} An array of Row components. Each Row contains a Link component that links to the details of an affiliation.
 */
export default function AffilliationParser({ affiliations }) {
  return affiliations.map((affiliation, i) => (
    <Row className={styles.row} key={i}>
      <Link
        className={styles.link}
        href={`/affiliation/${
          affiliation?.types?.[0]?.type.toLowerCase() === "education"
            ? "institution"
            : affiliation?.types?.[0]?.type
        }/${affiliation.id}/affiliations`}
      >
        {affiliation.name}
      </Link>
    </Row>
  ));
}
