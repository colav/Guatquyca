import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import ProjectsList from "@/app/components/ServerSide/ProjectsList/ProjectsList";

export const metadata = {
  title: "Resultados de búsqueda de Proyectos",
  description:
    "Explora proyectos de investigación con ImpactU. Encuentra información detallada sobre iniciativas académicas",
};

/**
 * SearchProjectsPage is a server-side functional component that displays a list of Projects based on provided search parameters.
 * It uses the Suspense component to lazy load the ProjectsList component and display the Loading component while the ProjectsList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of works.
 * @param {Object} params - The parameters used to fetch the list of works.
 * @returns {JSX.Element} A Suspense component that wraps the ProjectsList component.
 */
export default function SearchProjectsPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <ProjectsList
        searchParams={searchParams}
        params={params}
        entity="search"
      />
    </Suspense>
  );
}
