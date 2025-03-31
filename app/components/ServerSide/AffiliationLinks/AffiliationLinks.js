/* Icons */
import { BankOutlined } from "@ant-design/icons";

/* lib */
import dateBuilder from "@/lib/Utils/dateBuilder";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Tooltip } from "antd";

/**
 * `AffiliationLinks` is a server-side functional component that renders a list of affiliation links.
 *
 * @param {Object[]} affList - The list of affiliations to be displayed. Each object in the array represents an affiliation and should have the following properties: `id`, `start_date`, `end_date`, `types`, and `name`.
 * @param {boolean} person - A flag indicating whether the affiliations are for a person. If `true`, additional information (start and end dates) will be displayed in a tooltip for each affiliation.
 *
 * @returns {JSX.Element} A list of affiliation links. If `person` is `true`, each link is wrapped in a tooltip displaying the start and end dates of the affiliation. If `affList` is not provided or is an empty array, the component returns a paragraph with the text "No disponible".
 */
export default function AffiliationLinks({ affList, person = false }) {
  const ENTITIES = ["group", "department", "faculty"];

  console.log(affList);

  return (
    <>
      <h2 style={{ margin: 0, color: "gray" }}>
        <BankOutlined /> Afiliaciones:
      </h2>
      {affList && affList.length > 0 ? (
        affList.map(({ id, start_date, end_date, types, name }) => {
          const entityType = ENTITIES.includes(types[0]?.type)
            ? types[0]?.type
            : "institution";
          const linkHref = `/affiliation/${entityType}/${id}/affiliations`;

          if (person) {
            return (
              <div key={id}>
                <Tooltip
                  title={
                    <>
                      <div>Fecha de inicio: {dateBuilder(start_date)}</div>
                      <div>Fecha de finalización: {dateBuilder(end_date)}</div>
                    </>
                  }
                >
                  <Link href={linkHref}>{name}</Link>
                </Tooltip>
              </div>
            );
          } else {
            return (
              <div key={id}>
                <Link href={linkHref}>{name}</Link>
              </div>
            );
          }
        })
      ) : (
        <p className={styles.noData}>No disponible</p>
      )}
    </>
  );
}
