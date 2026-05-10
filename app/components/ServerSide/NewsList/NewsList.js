/* Components */
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import NewItem from "../../ClientSide/NewItem/NewItem";

/* lib */
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import ClientLogger from "@/lib/utils/clientLogger";
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/**
 * NewsList is a server-side functional component that fetches and displays a list of news articles related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the news articles.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the news articles are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function NewsList({ searchParams, params, entity }) {
  let pathname = "";
  if (entity === "search") {
    pathname = "/search/news";
  } else if (entity === "affiliation") {
    pathname = `/affiliation/${params.entity}/${params.ID}/research/news`;
  } else {
    pathname = `/person/${params.ID}/research/news`;
  }

  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "news",
    pathname,
  );

  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/news", correctedParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/news`,
      correctedParams,
    );
  } else {
    URL = URLBuilder(`/app/person/${params.ID}/research/news`, correctedParams);
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Noticias disponibles para esta perfil." />;
  }
  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.total_results}
      type="news"
      csv={false}
      apiExpert={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <NewItem key={item.id} item={item} />
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
