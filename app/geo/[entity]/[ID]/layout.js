import { notFound } from "next/navigation";

/* Components */
import ClientLogger from "@/lib/utils/clientLogger";
import GeoProfileCard from "@/app/components/ServerSide/GeoProfileCard/GeoProfileCard";

/* Constants */
import { SINGULAR_TITLES } from "@/lib/constants";

/* Utilities */
import getData from "@/lib/apis/server.api";

const GEO_TYPES = ["city", "state"];

export async function generateMetadata({ params }) {
  if (!GEO_TYPES.includes(params.entity)) return {};
  return {
    title: `Perfil de ${SINGULAR_TITLES[params.entity]}`,
    description:
      "Consulta el perfil de ciudades y departamentos de Colombia en ImpactU: producción científica, citaciones, autores, grupos e instituciones.",
  };
}

/**
 * GeoLayout is a server-side layout that fetches and displays the title card of the profile
 * of a city or a state, with the profile tabs (children) below it.
 *
 * @param {Object} params - Should include 'entity' ("city" or "state") and 'ID'.
 * @param {JSX.Element} children - The profile tab to render below the card.
 * @returns {JSX.Element} The profile card of the geographic entity and its tab.
 */
export default async function GeoLayout({ params, children }) {
  if (!GEO_TYPES.includes(params.entity)) notFound();
  const URL = `/geo/${params.entity}/${params.ID}`;
  const { data, fullUrl } = await getData(URL);

  return (
    <>
      <ClientLogger url={fullUrl} />
      <GeoProfileCard data={data.data} />
      {children}
    </>
  );
}
