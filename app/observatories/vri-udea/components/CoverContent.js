"use client";

/* React */
import { Suspense } from "react";

/* Components */
import PageContainer from "../../components/PageContainer";
import BoardTabs from "./BoardTabs";
import Board1 from "../board-1/components/Board1";

/* UI Library Components */
import { Typography } from "antd";

/**
 * Cover of the VRI-UdeA observatory (F27, D-106 Q5): three tabs, the first board loaded by
 * default. The other tabs go to their own routes, so their data loads only when they are opened.
 */
export default function CoverContent() {
  return (
    <PageContainer trail={[{ title: "Observatorios", href: "/observatories" }, { title: "VRI-UdeA" }]}>
      <Typography.Title level={2}>Observatorio VRI-UdeA</Typography.Title>
      <Typography.Paragraph>Universidad de Antioquia · Capacidades VRI 2026.</Typography.Paragraph>
      <BoardTabs active="board-1" />
      <Suspense fallback={null}>
        <Board1 />
      </Suspense>
    </PageContainer>
  );
}
