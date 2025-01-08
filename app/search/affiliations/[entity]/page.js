import { Suspense } from "react";

/* Components */
import EntityList from "@/app/components/ServerSide/EntityList/EntityList";
import Loading from "@/app/loading";

export const metadata = {
  title: "Resultados de Búsqueda - ImpactU",
};

/**
 * Search is an async "server-side" function page that fetches data based on search parameters
 * and returns a Card component with the search results.
 *
 * @param {Object} searchParams - The search parameters.
 * @returns {JSX.Element} A Card component with the search results.
 */
export default async function Search({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <EntityList searchParams={searchParams} entity={params.entity} />
    </Suspense>
  );
}
