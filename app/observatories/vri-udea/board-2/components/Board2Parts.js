"use client";

/* Hooks */
import { memo } from "react";

/* Components */
import CompactTable from "@/app/observatories/components/CompactTable";
import KpiCard from "@/app/observatories/components/KpiCard";
import PanelTile from "@/app/observatories/components/PanelTile";

/* UI Library Components */
import { Col, Row, Table, Typography } from "antd";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/** Cards of the KPI row. */
export const KpiRow = memo(function KpiRow({ kpis, projectDetail = "" }) {
  const items = [
    [kpis.works, "productos (artículos, libros, capítulos y apropiación social)"],
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
  /* Q-30 (F94): five tiles go 2 + 3 (two wide ones, then three), not 3 + 2 with a hole; the columns of a row stretch, so the tiles of a row are equally tall. */
  const spanOf = (index) => (stats.length === 5 ? (index < 2 ? { xs: 12, md: 12 } : { xs: 12, md: 8 }) : { xs: 12, md: 8 });
  return (
    <Row gutter={[8, 8]} style={{ flex: "1 1 auto", alignContent: "stretch" }}>
      {stats.map((s, index) => (
        <Col key={s.label} {...spanOf(index)}>
          <PanelTile label={s.label} value={typeof s.value === "number" ? fmt(s.value) : s.value} detail={s.detail} valueFontSize={20} />
        </Col>
      ))}
    </Row>
  );
});

/** Height of the body of the table of the indicator 13: with all the groups of a domain it scrolls inside the card (F118). */
export const DOMAIN_TABLE_HEIGHT = 480;

/** Table of the groups with non-academic actors (indicator 13). */
export const DomainTable = memo(function DomainTable({ rows }) {
  if (!rows.length) return <Typography.Text type="secondary">Sin productos en este dominio con el filtro actual.</Typography.Text>;
  /* Q-13 (D-202): the name of the group is never cut (two lines if it does not fit); the numeric columns are narrow. */
  const num = { align: "right", render: fmt, width: 104 };
  return (
    <Table
      size="small"
      pagination={false}
      tableLayout="fixed"
      scroll={{ y: DOMAIN_TABLE_HEIGHT }}
      rowKey="id"
      dataSource={rows}
      columns={[
        { title: "Grupo", dataIndex: "group", width: "34%" },
        { title: "Centro", dataIndex: "center", width: "16%" },
        { title: "Libros", dataIndex: "books", ...num },
        { title: "Capítulos", dataIndex: "chapters", ...num },
        { title: "Total con actor no académico", dataIndex: "total", align: "right", width: 120, render: (v) => <b>{fmt(v)}</b> },
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
