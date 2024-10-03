/* Components */
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
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
import PatentItem from "../../ClientSide/PatentItem/PatentItem";

export default async function PatentsList({ searchParams }) {
  const URL = URLBuilder("/app/search/patents", searchParams);
  const { data, fullUrl } = await getData(URL);

  return (
    <Card
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
