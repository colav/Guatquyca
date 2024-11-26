/* Components */
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import OtherWorkItem from "../../ClientSide/OtherWorkItem/OtherWorkItem";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import ClientLogger from "@/lib/Utils/clientLogger";
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/**
 * OtherWorksList is a serverside functional component fetches and displays a list of other works related to a specific entity.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the works are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function OtherWorksList({ searchParams, params, entity }) {
  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/other_works", searchParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/other_works`,
      searchParams
    );
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/other_works`,
      searchParams
    );
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return (
      <EmptyCard text="No hay Otros Productos disponibles para esta perfil." />
    );
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
        data.total_results === 1 ? SINGULAR_TITLES["work"] : TITLES["works"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} type="patents" />}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <OtherWorkItem key={item.id} item={item} />
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
