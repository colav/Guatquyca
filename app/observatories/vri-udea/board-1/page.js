/* React */
import { Suspense } from "react";

/* Components */
import PageContainer from "../../components/PageContainer";
import BoardTabs from "../components/BoardTabs";
import Board1 from "./components/Board1";

export const metadata = { title: "Masa crítica temática | Observatorio VRI-UdeA | ImpactU" };

/**
 * Board 1 of the VRI-UdeA observatory. The Suspense boundary is required by the filters, which
 * read the URL (useSearchParams).
 */
export default function Board1Page() {
  return (
    <PageContainer
      compact
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "VRI-UdeA", href: "/observatories/vri-udea" },
        { title: "Masa crítica temática" },
      ]}
    >
      <BoardTabs active="board-1" />
      <Suspense fallback={null}>
        <Board1 />
      </Suspense>
    </PageContainer>
  );
}
