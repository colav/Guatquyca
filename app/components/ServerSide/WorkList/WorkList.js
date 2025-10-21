/* Components */
import APIButton from "../../ClientSide/APIButton/APIButton";
import ClientLogger from "@/lib/Utils/clientLogger";
import CSVButton from "../../ClientSide/CSVButton/CSVButton";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";
import WorkItem from "../../ClientSide/WorkItem/WorkItem";

/* Hooks */
import UseCleanupAltmetric from "@/lib/Hooks/useCleanupAltmetric";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";
import getData from "@/lib/APIS/api";
import MathJax from "@/lib/Utils/mathjax";
import Script from "next/script";
import URLBuilder from "@/lib/Utils/URLBuilder";

/**
 * WorkList is a server-side functional component that fetches and displays a list of works related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the works are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function WorkList({ searchParams, params, entity }) {
  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/works", searchParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/products`,
      searchParams
    );
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/products`,
      searchParams
    );
  }
  const { data, fullUrl } = await getData(URL);

  return (
    <Card
      id="list"
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 5px 0" },
      }}
      title={`${data.total_results} ${
        data.total_results === 1 ? SINGULAR_TITLES["works"] : TITLES["works"]
      }`}
      extra={
        <div style={{ display: "flex" }}>
          <SortSearchResults searchParams={searchParams} type="works" />
          {entity !== "search" && <CSVButton searchParams={searchParams} />}
          <APIButton searchParams={searchParams} />
        </div>
      }
    >
      <UseCleanupAltmetric />
      <MathJax />
      <Script src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js" />
      <Script src="https://badge.dimensions.ai/badge.js" />
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <WorkItem key={item.id} item={item} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={searchParams}
      />
      <ClientLogger url={fullUrl} />
    </Card>
  );
}
