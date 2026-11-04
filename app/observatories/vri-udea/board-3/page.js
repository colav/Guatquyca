/* Components */
import PageContainer from "../../components/PageContainer";
import BoardTabs from "../components/BoardTabs";

export const metadata = { title: "Capacidades de base UdeA | Observatorio VRI-UdeA | ImpactU" };

/**
 * Third board of the VRI-UdeA observatory: placeholder until the board is mounted (F26).
 */
export default function Board3Page() {
  return (
    <PageContainer
      trail={[
        { title: "Observatorios", href: "/observatories" },
        { title: "VRI-UdeA", href: "/observatories/vri-udea" },
        { title: "Capacidades de base UdeA" },
      ]}
    >
      <BoardTabs active="board-3" />
      <p>Próximamente</p>
    </PageContainer>
  );
}
