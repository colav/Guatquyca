/* Next */
import Link from "next/link";

/* lib */
import dateBuilder from "@/lib/Utils/dateBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row, Tooltip } from "antd";

/**
 * AffiliationParser is a function component that maps over an array of affiliation objects and returns a Link component for each affiliation.
 *
 * @param {Array} affiliations - An array of affiliation objects. Each object should have a 'name', 'id', and 'types' property.
 * @returns {Array} An array of Row components. Each Row contains a Link component that links to the details of an affiliation.
 */
export default function AffilliationParser({ affiliations }) {
  // Mapping of affiliation types to their paths
  const affiliationPaths = {
    group: "group",
    department: "department",
    faculty: "faculty",
    institution: "institution", // Default case
  };

  const affiliation_checker = (affiliation) => {
    const { type } = affiliation.types[0];
    return affiliationPaths[type] || affiliationPaths.institution;
  };

  return affiliations.map((affiliation, i) => (
    <Row className={styles.row} key={i}>
      <Tooltip
        title={
          <>
            <div>Fecha de inicio: {dateBuilder(affiliation.start_date)}</div>
            <div>
              Fecha de finalización: {dateBuilder(affiliation.end_date)}
            </div>
          </>
        }
      >
        <Link
          className={styles.link}
          href={`/affiliation/${affiliation_checker(affiliation)}/${
            affiliation.id
          }/affiliations`}
        >
          {affiliation.name}
        </Link>
      </Tooltip>
    </Row>
  ));
}
