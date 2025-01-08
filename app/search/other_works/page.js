import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import OtherWorksList from "@/app/components/ServerSide/OtherWorksList/OtherWorksList";

export const metadata = {
  title: "Resultados de Búsqueda de Patentes - ImpactU",
};

/**
 * SearchOtherWorksPage is a server-side functional component that displays a list of OtherWorks based on provided search parameters.
 * It uses the Suspense component to lazy load the OtherWorksList component and display the Loading component while the WorkList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @param {Object} params - The parameters used to fetch the list of works.
 * @returns {JSX.Element} A Suspense component that wraps the WorkList component.
 */
export default function SearchOtherWorksPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <OtherWorksList
        searchParams={searchParams}
        params={params}
        entity="search"
      />
    </Suspense>
  );
}
