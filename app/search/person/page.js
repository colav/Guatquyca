import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import PersonList from "@/app/components/ServerSide/PersonList/PersonList";

export const metadata = {
  title: "Resultados de búsqueda de Autores",
  description:
    "Encuentra autores y perfiles de investigadores en ImpactU. Explora su producción académica, colaboraciones y métricas en nuestra plataforma CRIS.",
};

/**
 * SearchPerson is a function server component that displays a list of persons based on provided search parameters.
 * It uses the Suspense component to lazy load the PersonList component and display the Loading component while the PersonList is loading.
 *
 * @param {Object} searchParams - The search parameters used to fetch the list of persons.
 * @returns {JSX.Element} A Suspense component that wraps the PersonList component.
 */
export default function SearchPerson({ searchParams }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <PersonList searchParams={searchParams} />
    </Suspense>
  );
}
