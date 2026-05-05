/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import ClientLogger from "@/lib/utils/clientLogger";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import WorkItem from "../../ClientSide/WorkItem/WorkItem";

/* Hooks */
import UseCleanupAltmetric from "@/lib/hooks/useCleanupAltmetric";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import getData from "@/lib/apis/server.api";
import MathJax from "@/lib/utils/mathjax";
import Script from "next/script";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/**
 * WorkList is a server-side functional component that fetches and displays a list of works related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the works are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function WorkList({ searchParams, params, entity }) {
  let pathname = "";
  if (entity === "search") {
    pathname = "/search/works";
  } else if (entity === "affiliation") {
    pathname = `/affiliation/${params.entity}/${params.ID}/research/products`;
  } else if (entity === "source") {
    pathname = `/source/${params.ID}/products`;
  } else {
    pathname = `/person/${params.ID}/research/products`;
  }

  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "works",
    pathname,
  );

  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/works", correctedParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/products`,
      correctedParams,
    );
  } else if (entity === "source") {
    URL = URLBuilder(`/app/source/${params.ID}/products`, correctedParams);
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/products`,
      correctedParams,
    );
  }
  const { data, fullUrl } = await getData(URL);

  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.total_results}
      type="works"
      csv={entity !== "search"}
      apiExpert={true}
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
        searchParams={correctedParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
