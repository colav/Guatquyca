import { Suspense } from "react";

/* Components */
import FilterPanel from "@/app/components/ClientSide/FilterPanel/FilterPanel";
import Loading from "@/app/loading";
import WorkList from "@/app/components/ServerSide/WorkList/WorkList";

export const metadata = {
  title: "Resultados de Búsqueda - ImpactU",
};

/**
 * SearchWorksPage is a function server component that displays a list of works based on provided search parameters.
 * It uses the Suspense component to lazy load the WorkList component and display the Loading component while the WorkList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @returns {JSX.Element} A Suspense component that wraps the WorkList component.
 */
export default function SearchWorksPage({ searchParams }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <FilterPanel />
      <WorkList searchParams={searchParams} />
    </Suspense>
  );
}
