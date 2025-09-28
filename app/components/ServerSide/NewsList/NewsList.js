/* Components */
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import NewItem from "../../ClientSide/NewItem/NewItem";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";

/* lib */
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";
import ClientLogger from "@/lib/Utils/clientLogger";

/**
 * NewsList is a server-side functional component that fetches and displays a list of news articles related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the news articles.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the news articles are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function NewsList({ searchParams, params, entity }) {
  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/news", searchParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/news`,
      searchParams
    );
  } else {
    URL = URLBuilder(`/app/person/${params.ID}/research/news`, searchParams);
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Noticias disponibles para esta perfil." />;
  }
  return (
    <Card
      id="list"
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 5px 0" },
      }}
      title={`${data.total_results} ${
        data.total_results === 1 ? SINGULAR_TITLES["news"] : TITLES["news"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} type="news" />}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <NewItem key={item.id} item={item} />
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
