/* Components */
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import PatentItem from "../../ClientSide/PatentItem/PatentItem";
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
 * PatentsList is a server-side functional component that fetches and displays a list of patents related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the patents.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the patents are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function PatentsList({ searchParams, params, entity }) {
  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/patents", searchParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/patents`,
      searchParams
    );
  } else {
    URL = URLBuilder(`/app/person/${params.ID}/research/patents`, searchParams);
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Patentes disponibles para esta perfil." />;
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
        data.total_results === 1
          ? SINGULAR_TITLES["patents"]
          : TITLES["patents"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} type="patents" />}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <PatentItem key={item.id} item={item} />
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
