/* Components */
import CommonTitleCard from "@/app/components/ServerSide/CommonTitleCard/CommonTitleCard";

/* Utilities */
import getData from "@/lib/api";

export const metadata = {
  title: `Perfil - ImpactU`,
};

/**
 * EntityPage is a server-side function component that fetches and displays data for a specific entity.
 *
 * @param {Object} params - The parameters for fetching the entity data. Should include 'entity' and 'ID'.
 * @param {JSX.Element} children - The child components to be rendered within this component.
 * @returns {JSX.Element} A div containing a CommonTitleCard component displaying the entity data and the child components.
 */
export default async function EntityPage({ params, children }) {
  const URL = `/app/affiliation/${params.entity}/${params.ID}`;
  const data = await getData(URL);

  return (
    <>
      <div>
        <CommonTitleCard data={data.data} entity={params.entity} />
      </div>
      {children}
    </>
  );
}
