/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import PatentItem from "../../ClientSide/PatentItem/PatentItem";

/* lib */
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import ClientLogger from "@/lib/utils/clientLogger";

/**
 * PatentsList is a server-side functional component that fetches and displays a list of patents related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the patents.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the patents are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function PatentsList({ searchParams, params, entity }) {
  let pathname = "";
  if (entity === "search") {
    pathname = "/search/patents";
  } else if (entity === "affiliation") {
    pathname = `/affiliation/${params.entity}/${params.ID}/research/patents`;
  } else {
    pathname = `/person/${params.ID}/research/patents`;
  }

  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "patents",
    pathname,
  );

  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/patents", correctedParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/patents`,
      correctedParams,
    );
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/patents`,
      correctedParams,
    );
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Patentes disponibles para esta perfil." />;
  }
  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.total_results}
      type="patents"
      csv={false}
      apiExpert={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <PatentItem key={item.id} item={item} />
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
