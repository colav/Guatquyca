/* Icons */
import { BankOutlined } from "@ant-design/icons";

/* lib */
import dateBuilder from "@/lib/dateBuilder";

/* Next */
import Link from "next/link";

/* UI Library Components */
import { Tooltip } from "antd";

/**
 * AffiliationLinks is a function component that displays a list of affiliations.
 * It maps over the affList and creates a Tooltip component for each affiliation.
 * The Tooltip component displays the start and end dates of the affiliation.
 * Each affiliation is a link that navigates to the affiliations section of the corresponding type and ID.
 *
 * @param {Array} affList - The list of affiliations to display.
 * @returns {JSX.Element} A list of Tooltip components for each affiliation.
 */
export default function AffiliationLinks({ affList }) {
  const ENTITIES = ["group", "department", "faculty"];
  return (
    <>
      <h2 style={{ margin: 0, color: "gray" }}>
        <BankOutlined /> Afiliaciones:
      </h2>
      {affList.length > 0
        ? affList.map((item) => {
            return (
              <div key={item.id}>
                <Tooltip
                  title={
                    <>
                      <div>Fecha de inicio: {dateBuilder(item.start_date)}</div>
                      <div>
                        Fecha de finalización: {dateBuilder(item.end_date)}
                      </div>
                    </>
                  }
                >
                  <Link
                    href={`/app/affiliation/${
                      ENTITIES.includes(item.types[0]?.type)
                        ? item.types[0]?.type
                        : "institution"
                    }/${item.id}/affiliations`}
                  >
                    {item.name}
                  </Link>
                </Tooltip>
              </div>
            );
          })
        : "No disponible"}
    </>
  );
}
