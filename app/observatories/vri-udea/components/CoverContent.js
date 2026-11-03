"use client";

/* Components */
import PageContainer from "../../components/PageContainer";
import { BoardList } from "../../components/ObservatoryCards";

/* UI Library Components */
import { Typography } from "antd";

/* Constants (provisional texts, pending approval of Luis) */
const BOARDS = [
  {
    key: "board-1",
    title: "Tablero 1 · Masa crítica temática",
    description: "Capacidad de la UdeA para generar impacto con su producción en cada tópico de OpenAlex, medida en seis categorías y asociada a los Ejes Temáticos de las agendas públicas.",
    href: "/observatories/vri-udea/board-1",
  },
  {
    key: "board-2",
    title: "Tablero 2 · Colaboración, redes y hélices",
    description: "Colaboración entre grupos, con organizaciones no académicas y entre países.",
    href: "/observatories/vri-udea/board-2",
  },
  {
    key: "board-3",
    title: "Tablero 3 · Capacidades de base UdeA",
    description: "Talento investigador, grupos, tesis, apropiación social y ciencia abierta.",
  },
];

/**
 * Cover of the VRI-UdeA observatory: Board 1 active; Boards 2 and 3 "próximamente".
 */
export default function CoverContent() {
  return (
    <PageContainer trail={[{ title: "Observatorios", href: "/observatories" }, { title: "VRI-UdeA" }]}>
      <Typography.Title level={2}>Observatorio VRI-UdeA</Typography.Title>
      <Typography.Paragraph>Universidad de Antioquia · Capacidades VRI 2026.</Typography.Paragraph>
      <BoardList boards={BOARDS} />
    </PageContainer>
  );
}
