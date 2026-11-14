/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import PageContainer from "../../components/PageContainer";
import BoardTabs from "../components/BoardTabs";
import Board3 from "./components/Board3";

export const metadata = { title: "Capacidades de base UdeA | Atlas UdeA | ImpactU" };

/**
 * Board 3 of the Atlas UdeA observatory. The Suspense boundary is required by the filters, which
 * read the URL (useSearchParams).
 */
export default function Board3Page() {
  return (
    <PageContainer
      compact
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "Atlas UdeA", href: "/observatories/atlas-udea" },
        { title: "Capacidades de base UdeA" },
      ]}
    >
      <BoardTabs active="board-3" />
      <Suspense fallback={<Loading height="60vh" />}>
        <Board3 />
      </Suspense>
    </PageContainer>
  );
}
