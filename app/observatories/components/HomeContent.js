"use client";

/* Components */
import PageContainer from "./PageContainer";
import { ObservatoryList } from "./ObservatoryCards";

/* UI Library Components */
import { Typography } from "antd";

/* Constants (provisional texts, pending approval of Luis) */
const OBSERVATORIES = [
  {
    key: "vri-udea",
    title: "VRI-UdeA",
    description: "Capacidades de investigación de la Universidad de Antioquia, con tres tableros construidos con datos de ImpactU.",
    href: "/observatories/vri-udea",
  },
];

/**
 * Content of the observatories home: list of the available ones (for now only VRI-UdeA).
 */
export default function HomeContent() {
  return (
    <PageContainer trail={[{ title: "Observatorios" }]}>
      <Typography.Title level={2}>Observatorios</Typography.Title>
      <Typography.Paragraph>
        Aquí estarán los observatorios construidos con datos de ImpactU, en coordinación con dependencias e instituciones.
      </Typography.Paragraph>
      <ObservatoryList observatories={OBSERVATORIES} />
    </PageContainer>
  );
}
