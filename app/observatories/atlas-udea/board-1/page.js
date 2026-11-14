/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import PageContainer from "../../components/PageContainer";
import BoardTabs from "../components/BoardTabs";
import Board1 from "./components/Board1";

export const metadata = { title: "Masa crítica temática | Atlas UdeA | ImpactU" };

/**
 * Board 1 of the Atlas UdeA observatory. The Suspense boundary is required by the filters, which
 * read the URL (useSearchParams).
 */
export default function Board1Page() {
  return (
    <PageContainer
      compact
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "Atlas UdeA", href: "/observatories/atlas-udea" },
        { title: "Masa crítica temática" },
      ]}
    >
      <BoardTabs active="board-1" />
      <Suspense fallback={<Loading height="60vh" />}>
        <Board1 />
      </Suspense>
    </PageContainer>
  );
}
