/* Components */
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";

/* lib */
import getData from "@/lib/api";
import URLBuilder from "@/lib/URLBuilder";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";
import MathJax from "@/lib/mathjax";
import Script from "next/script";
import UseCleanupAltmetric from "@/lib/UseCleanupAltmetric";

/* Styles */
import styles from "./styles.module.css";
import WorkItem from "../../ClientSide/WorkItem/WorkItem";

/**
 * WorkList is an asynchronous function server component that fetches a list of works based
 * on provided search parameters and displays them in a Card component.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @returns {JSX.Element} A Card component that displays the list of works.
 */
export default async function WorkList({ searchParams }) {
  const URL = URLBuilder("/app/search/works", searchParams);
  const data = await getData(URL);

  return (
    <Card
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 10px 10px" },
      }}
      title={`${data.total_results} ${
        data.total_results === 1 ? SINGULAR_TITLES["works"] : TITLES["works"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} works={true} />}
    >
      <UseCleanupAltmetric />
      <MathJax />
      <Script src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js" />
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <WorkItem key={item.id} item={item} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={searchParams}
      />
    </Card>
  );
}
