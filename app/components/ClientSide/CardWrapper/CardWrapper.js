/* Components */
import APIButton from "../APIButton/APIButton";
import CSVButton from "../CSVButton/CSVButton";
import SortSearchResults from "../SortSearchResults/SortSearchResults";

/* UI Library Components */
import { Card } from "antd";

/* Utils */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/**
 * CardWrapper is a reusable UI component that wraps result lists with a styled Ant Design Card.
 * It displays the total number of results, provides export (CSV/API) and sorting controls, and renders children content.
 *
 * @component
 * @param {React.ReactNode} children - The content to display inside the card (typically a list of results).
 * @param {Object} searchParams - The current search/filter parameters for the results.
 * @param {number} total_results - The total number of results to display in the card title.
 * @param {string} type - The type of entity being listed (used for title pluralization).
 * @param {boolean} [csv] - If true, shows the CSV export button.
 * @param {boolean} [apiExpert] - If true, links the /apiExpert endpoint instead /app.
 * @returns {JSX.Element} The wrapped card component with controls and children.
 */
export default function CardWrapper({
  children,
  searchParams,
  total_results,
  type,
  csv,
  apiExpert,
}) {
  return (
    <Card
      id="list"
      size="small"
      styles={{
        header: {
          backgroundColor: "#003e65",
          color: "white",
          padding: "0 7px 0 14px",
        },
        body: { padding: "10px 0 5px 0" },
      }}
      title={`${total_results} ${
        total_results === 1 ? SINGULAR_TITLES[type] : TITLES[type]
      }`}
      extra={
        <div style={{ display: "flex" }}>
          <SortSearchResults searchParams={searchParams} type={type} />
          {csv && <CSVButton searchParams={searchParams} />}
          <APIButton searchParams={searchParams} apiExpert={apiExpert} />
        </div>
      }
    >
      {children}
    </Card>
  );
}
