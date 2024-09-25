import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import ProjectsList from "@/app/components/ServerSide/ProjectsList/ProjectsList";

export const metadata = {
  title: "Resultados de Búsqueda de Patentes - ImpactU",
};

/**
 * SearchProjectsPage is a function server component that displays a list of Projects based on provided search parameters.
 * It uses the Suspense component to lazy load the ProjectsList component and display the Loading component while the WorkList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @returns {JSX.Element} A Suspense component that wraps the WorkList component.
 */
export default function SearchProjectsPage({ searchParams }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <ProjectsList searchParams={searchParams} />
    </Suspense>
  );
}
