"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* Components */
import CompactTable from "@/app/observatories/components/CompactTable";

/* Texts */
import { shortAxisName } from "./boardTexts";

/* UI Library Components */
import { Table } from "antd";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Table «Tópicos del Eje Temático» (F49): topic (name and code), products, citations and, with several axes,
 * the axes of each topic. Sortable by column, highest products first by default, with a row of totals. The
 * topics of the axis without products with the current filters show 0.
 *
 * @param {{ index: number, id: string, label: string, products: number, citations: number, axes: string[] }[]} rows
 * @param {boolean} severalAxes - Shows the column «Ejes».
 */
function AxisTopicsTable({ rows, severalAxes }) {
  const total = useMemo(() => ({ products: rows.reduce((a, r) => a + r.products, 0), citations: rows.reduce((a, r) => a + r.citations, 0) }), [rows]);
  const columns = [
    { title: "Tópico", dataIndex: "label", sorter: (a, b) => a.label.localeCompare(b.label), render: (label, row) => <span title={`${label} (${row.id})`}>{label} <small style={{ color: "rgba(0,0,0,.45)" }}>{row.id}</small></span>, width: severalAxes ? "38%" : "58%" },
    { title: "Productos", dataIndex: "products", align: "right", sorter: (a, b) => a.products - b.products, defaultSortOrder: "descend", render: fmt, width: 110 },
    { title: "Citas", dataIndex: "citations", align: "right", sorter: (a, b) => a.citations - b.citations, render: fmt, width: 110 },
    ...(severalAxes ? [{ title: "Ejes", dataIndex: "axes", render: (axes) => <span title={axes.join("; ")}>{axes.map((a) => shortAxisName(a)).join("; ")}</span> }] : []),
  ];
  return (
    <CompactTable
      rowKey="index"
      size="small"
      scroll={{ y: 360 }}
      dataSource={rows}
      columns={columns}
      aria-label="Tópicos del Eje Temático"
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><b>Total ({fmt(rows.length)} tópicos)</b></Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right"><b data-testid="axis-topics-total-products">{fmt(total.products)}</b></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="right"><b data-testid="axis-topics-total-citations">{fmt(total.citations)}</b></Table.Summary.Cell>
            {severalAxes ? <Table.Summary.Cell index={3} /> : null}
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
}

export default memo(AxisTopicsTable);
