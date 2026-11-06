"use client";

/* Hooks */
import { memo } from "react";

/* Components */
import CompactTable from "@/app/observatories/components/CompactTable";
import KpiCard from "@/app/observatories/components/KpiCard";

/* UI Library Components */
import { Col, Row, Typography } from "antd";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/** Cards of the KPI row. */
export const KpiRow = memo(function KpiRow({ kpis, projectDetail = "" }) {
  const items = [
    [kpis.works, "productos en el universo filtrado"],
    [kpis.withExternal, "con al menos un coautor externo"],
    [kpis.withNonAcademic, "con actor no académico (empresa, gobierno, ONG, salud)"],
    [kpis.withInternational, "con coautoría internacional"],
    [kpis.projects, "proyectos SIIU", projectDetail],
    [kpis.projectsExternal, "proyectos con aportante externo", projectDetail],
  ];
  return (
    <Row gutter={[12, 12]}>
      {items.map(([value, label, detail]) => (
        <Col key={label} xs={12} md={8} lg={4}>
          <KpiCard label={label} value={fmt(value)} detail={detail} withDetail={!!projectDetail} />
        </Col>
      ))}
    </Row>
  );
});

/**
 * Tiles of numbers (helices and IAP).
 *
 * @param {{ value: string|number, label: string, detail?: string }[]} stats
 */
export const StatTiles = memo(function StatTiles({ stats }) {
  return (
    <Row gutter={[8, 8]}>
      {stats.map((s) => (
        <Col key={s.label} xs={12} md={8}>
          <KpiCard label={s.label} value={typeof s.value === "number" ? fmt(s.value) : s.value} detail={s.detail} withDetail={stats.some((x) => x.detail)} valueFontSize={20} />
        </Col>
      ))}
    </Row>
  );
});

/** Note under a panel. */
export function Note({ children, ...rest }) {
  return <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, marginBottom: 0 }} {...rest}>{children}</Typography.Paragraph>;
}

/** Table of the groups with non-academic actors (indicator 13). */
export const DomainTable = memo(function DomainTable({ rows }) {
  if (!rows.length) return <Typography.Text type="secondary">Sin productos en este dominio con el filtro actual.</Typography.Text>;
  const num = { align: "right", render: fmt };
  return (
    <CompactTable
      rowKey="id"
      dataSource={rows}
      columns={[
        { title: "Grupo", dataIndex: "group" },
        { title: "Centro", dataIndex: "center" },
        { title: "Libros", dataIndex: "books", ...num },
        { title: "Capítulos", dataIndex: "chapters", ...num },
        { title: "Apropiación social", dataIndex: "appropriation", ...num },
        { title: "Total con actor no académico", dataIndex: "total", align: "right", render: (v) => <b>{fmt(v)}</b> },
        { title: "Con cualquier coautor externo", dataIndex: "external", ...num },
      ]}
    />
  );
});

/** Top countries table next to the bubbles. */
export const CountriesTable = memo(function CountriesTable({ rows }) {
  return (
    <CompactTable
      rowKey="name"
      dataSource={rows}
      columns={[
        { title: "País", dataIndex: "name" },
        { title: "Región", dataIndex: "region" },
        { title: "Productos", dataIndex: "value", align: "right", render: fmt },
      ]}
    />
  );
});

/** The 55 collaboration goals that the policy documents assign to this board. */
export const GoalsTable = memo(function GoalsTable({ goals }) {
  return (
    <CompactTable
      scroll={{ y: 360 }}
      rowKey={(r) => `${r.Agenda}|${r["Código del desafío"]}`}
      dataSource={goals}
      columns={[
        { title: "Documento", dataIndex: "Agenda" },
        { title: "Código", dataIndex: "Código del desafío", width: 90 },
        { title: "Meta, reto o programa", dataIndex: "Título del desafío" },
        { title: "Tipo de colaboración", dataIndex: "Tipo de colaboración" },
      ]}
    />
  );
});
