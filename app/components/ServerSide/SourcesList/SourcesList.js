/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import SourceItem from "../../ClientSide/SourceItem/SourceItem";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import ClientLogger from "@/lib/Utils/clientLogger";
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";

/**
 * SourcesList is a server-side functional component that fetches and displays a list of sources related to a specific entity.
 *
 * @component
 * @param {Object} searchParams - The search parameters used to fetch the sources.
 * @returns {JSX.Element} The rendered component.
 */
export default async function SourcesList({ searchParams }) {
  let URL = URLBuilder("/app/search/sources", searchParams);

  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Fuentes disponibles." />;
  }
  return (
    <CardWrapper
      searchParams={searchParams}
      total_results={data.total_results}
      type="sources"
      csv={false}
      apiExpert={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <SourceItem key={item.id} item={item} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={searchParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
