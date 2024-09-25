import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import PatentsList from "@/app/components/ServerSide/PatentsList/PatentsList";

export const metadata = {
  title: "Resultados de Búsqueda de Patentes - ImpactU",
};

/**
 * SearchPatentsPage is a function server component that displays a list of Patents based on provided search parameters.
 * It uses the Suspense component to lazy load the PatentsList component and display the Loading component while the WorkList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @returns {JSX.Element} A Suspense component that wraps the WorkList component.
 */
export default function SearchPatentsPage({ searchParams }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <PatentsList searchParams={searchParams} />
    </Suspense>
  );
}
