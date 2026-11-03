/* React */
import { Suspense } from "react";

/* Components */
import PageContainer from "../../components/PageContainer";
import Board2 from "./components/Board2";

export const metadata = { title: "Tablero 2 · Colaboración, redes y hélices | Observatorio VRI-UdeA | ImpactU" };

/**
 * Board 2 of the VRI-UdeA observatory. The Suspense boundary is required by the filters, which
 * read the URL (useSearchParams).
 */
export default function Board2Page() {
  return (
    <PageContainer
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "VRI-UdeA", href: "/observatories/vri-udea" },
        { title: "Tablero 2" },
      ]}
    >
      <Suspense fallback={null}>
        <Board2 />
      </Suspense>
    </PageContainer>
  );
}
