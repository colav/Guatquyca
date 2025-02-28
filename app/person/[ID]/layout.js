/* Components */
import ClientLogger from "@/lib/Utils/clientLogger";
import CommonTitleCard from "@/app/components/ServerSide/CommonTitleCard/CommonTitleCard";

/* Utilities */
import getData from "@/lib/APIS/api";

export const metadata = {
  title: "Perfil de Autor",
  description:
    "Explora el perfil de investigadores en ImpactU. Consulta su producción científica, colaboraciones y métricas de impacto en la investigación académica.",
};

/**
 * PersonLayout is a server-side function component that fetches data for a person and displays a CommonTitleCard with that data.
 *
 * @param {Object} params - The parameters for the page. Should include an 'ID' property for the person.
 * @param {JSX.Element} children - The child components to be rendered within this component.
 *
 * @returns {JSX.Element} A fragment containing a div with the CommonTitleCard component and the child components.
 */
export default async function PersonLayout({ params, children }) {
  const URL = `/app/person/${params.ID}`;
  const { data, fullUrl } = await getData(URL);

  return (
    <>
      <ClientLogger url={fullUrl} />
      <div>
        <CommonTitleCard data={data.data} entity="person" />
      </div>
      {children}
    </>
  );
}
