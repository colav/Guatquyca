/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import SourceItem from "../../ClientSide/SourceItem/SourceItem";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import ClientLogger from "@/lib/utils/clientLogger";
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

/**
 * SourcesList is a server-side functional component that fetches and displays a list of sources related to a specific entity.
 *
 * @component
 * @param {Object} searchParams - The search parameters used to fetch the sources.
 * @returns {JSX.Element} The rendered component.
 */
export default async function SourcesList({ searchParams }) {
  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "sources",
    "/search/sources",
  );
  let URL = URLBuilder("/search/sources", correctedParams);

  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Fuentes disponibles." />;
  }
  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.meta.count}
      type="sources"
      csv={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <SourceItem key={item.id} item={item} onList={true} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.meta.count}
        searchParams={correctedParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
