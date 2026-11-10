/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import PageContainer from "../../components/PageContainer";
import BoardTabs from "../components/BoardTabs";
import Board2 from "./components/Board2";

export const metadata = { title: "Colaboración, redes y hélices | Observatorio VRI-UdeA | ImpactU" };

/**
 * Board 2 of the VRI-UdeA observatory. The Suspense boundary is required by the filters, which
 * read the URL (useSearchParams).
 */
export default function Board2Page() {
  return (
    <PageContainer
      compact
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "VRI-UdeA", href: "/observatories/vri-udea" },
        { title: "Colaboración, redes y hélices" },
      ]}
    >
      <BoardTabs active="board-2" />
      <Suspense fallback={<Loading height="60vh" />}>
        <Board2 />
      </Suspense>
    </PageContainer>
  );
}
