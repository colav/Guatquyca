"use client";

/* Components */
import PageContainer from "./PageContainer";
import { ObservatoryList } from "./ObservatoryCards";

/* UI Library Components */
import { Typography } from "antd";

/* Texts approved by Luis (D-263, F121). No figure is written by hand: the dates and sources are at the foot of each board. */
const INTRO = "Espacios de consulta construidos con datos de ImpactU, en coordinación con dependencias e instituciones. Cada observatorio reúne tableros para explorar, filtrar y comparar.";

const OBSERVATORIES = [
  {
    key: "atlas-udea",
    title: "Atlas de las ciencias, las tecnologías, las humanidades y las artes de la Universidad de Antioquia",
    tag: "Atlas UdeA",
    description: "Dónde tiene la Universidad de Antioquia masa crítica, con quién colabora y qué bases sostienen su investigación. Producción 2010–2026 de ImpactU, con citas y referentes de OpenAlex.",
    href: "/observatories/atlas-udea",
    boards: [
      { key: "board-1", title: "Masa crítica temática", href: "/observatories/atlas-udea/board-1", description: "Capacidad de la UdeA en cada tópico frente a una institución de referencia, y su relación con ODS, territorios y actores no académicos." },
      { key: "board-2", title: "Colaboración, redes y hélices", href: "/observatories/atlas-udea/board-2", description: "Con quién colabora: grupos, organizaciones no académicas, hélices, territorios y países." },
      { key: "board-3", title: "Capacidades de base UdeA", href: "/observatories/atlas-udea/board-3", description: "Talento, producción e infraestructura abierta." },
    ],
    footnote: "Las fuentes y las fechas de corte están al pie de cada tablero.",
  },
];

/**
 * Content of the observatories home: list of the available ones (for now only Atlas UdeA).
 */
export default function HomeContent() {
  return (
    <PageContainer trail={[{ title: "Observatorios" }]}>
      <Typography.Title level={2}>Observatorios</Typography.Title>
      <Typography.Paragraph>{INTRO}</Typography.Paragraph>
      <ObservatoryList observatories={OBSERVATORIES} />
    </PageContainer>
  );
}
