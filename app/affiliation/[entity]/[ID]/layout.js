/* Components */
import ClientLogger from "@/lib/Utils/clientLogger";
import CommonTitleCard from "@/app/components/ServerSide/CommonTitleCard/CommonTitleCard";

/* Constants */
import { SINGULAR_TITLES } from "@/lib/constants";

/* Utilities */
import getData from "@/lib/APIS/api";

/**
 * Generates metadata for the page dynamically based on the params.
 *
 * @param {Object} params - The parameters for fetching the entity data. Should include 'entity' and 'ID'.
 * @returns {Object} The metadata object with the dynamic title and description.
 */
export async function generateMetadata({ params }) {
  const entity = params.entity;
  const title = `Perfil de ${SINGULAR_TITLES[entity]}`;

  const DESCRIPTIONS = {
    institution:
      "Consulta el perfil de Instituciones académicas en ImpactU. Descubre su producción científica, colaboraciones y métricas de investigación.",
    faculty:
      "Explora información sobre Unidades académicas, su impacto en la investigación y su producción intelectual en ImpactU.",
    department:
      "Descubre Subunidades académicos y su contribución a la investigación en la plataforma CRIS de ImpactU.",
    group:
      "Accede a datos sobre grupos de investigación, sus proyectos y publicaciones en ImpactU.",
  };

  return {
    title,
    description: DESCRIPTIONS[entity],
  };
}

/**
 * EntityPage is a server-side function component that fetches and displays data for a specific entity.
 *
 * @param {Object} params - The parameters for fetching the entity data. Should include 'entity' and 'ID'.
 * @param {JSX.Element} children - The child components to be rendered within this component.
 * @returns {JSX.Element} A div containing a CommonTitleCard component displaying the entity data and the child components.
 */
export default async function EntityPage({ params, children }) {
  const URL = `/app/affiliation/${params.entity}/${params.ID}`;
  const { data, fullUrl } = await getData(URL);

  return (
    <>
      <ClientLogger url={fullUrl} />
      <div>
        <CommonTitleCard data={data.data} entity={params.entity} />
      </div>
      {children}
    </>
  );
}
