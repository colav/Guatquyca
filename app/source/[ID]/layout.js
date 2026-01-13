/* Components */
import ClientLogger from "@/lib/Utils/clientLogger";

/* Utilities */
import getData from "@/lib/APIS/api";
import SourceItem from "@/app/components/ClientSide/SourceItem/SourceItem";

export async function generateMetadata() {
  return {
    title: "Perfil de Fuente",
    description:
      "Explora el perfil de fuentes académicas en ImpactU. Consulta revistas, repositorios, series de libros y más, junto con sus métricas de impacto y producción científica.",
  };
}

export default async function SourceLayout({ params, children }) {
  const URL = `/app/source/${params.ID}`;
  const { data, fullUrl } = await getData(URL);

  return (
    <>
      <ClientLogger url={fullUrl} />
      <SourceItem item={data.data} onList={false} />
      {children}
    </>
  );
}
