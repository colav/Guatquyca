import { Suspense } from "react";

/* Components */
import FilterPanel from "@/app/components/ClientSide/Filters/FilterPanel";
import Loading from "@/app/loading";
import SourcesList from "@/app/components/ServerSide/SourcesList/SourcesList";

export const metadata = {
  title: "Resultados de búsqueda de Fuentes",
  description:
    "Explora nuestras fuentes académicas y descubre revistas, repositorios y más en nuestra plataforma de búsqueda.",
};

/**
 * SearchSourcesPage is a server-side functional component that displays a list of sources based on provided search parameters.
 * It uses the Suspense component to lazy load the SourcesList component and display the Loading component while the SourcesList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of sources.
 * @param {Object} params - The parameters used to fetch the list of sources.
 * @returns {JSX.Element} A Suspense component that wraps the SourcesList component.
 */
export default function SearchSourcesPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <FilterPanel />
      <SourcesList
        searchParams={searchParams}
        params={params}
        entity="search"
      />
    </Suspense>
  );
}
