import { Suspense } from "react";

/* Components */
import EntityList from "@/app/components/ServerSide/EntityList/EntityList";
import Loading from "@/app/loading";

/* Constants */
import { TITLES } from "@/lib/constants";

/**
 * Generates metadata for the search results page dynamically based on the entity type.
 *
 * @param {Object} params - The parameters for fetching the entity data. Should include 'entity'.
 * @returns {Object} The metadata object with the dynamic title and description.
 */
export async function generateMetadata({ params }) {
  const entity = params.entity;
  const title = `Resultados de búsqueda de ${TITLES[entity]}`;

  const DESCRIPTIONS = {
    institution:
      "Explora Instituciones académicas en ImpactU, organizadas por producción científica o citaciones. Descubre su impacto en la investigación.",
    faculty:
      "Consulta Unidades académicas en ImpactU, ordenadas por cantidad de productos o citaciones. Analiza su contribución a la investigación.",
    department:
      "Descubre Subunidades académicos en ImpactU, clasificados según su producción científica o número de citaciones.",
    group:
      "Explora grupos de investigación en ImpactU, clasificados según su producción científica o número de citaciones.",
  };

  return {
    title,
    description: DESCRIPTIONS[entity],
  };
}

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
