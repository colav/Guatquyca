"use client";

/* Hooks */
import { memo, useMemo, useState } from "react";

/* Components */
import CompactTable from "@/app/observatories/components/CompactTable";

/* Texts */
import {
  AXIS_LINK_BY_PRODUCTS,
  AXIS_LINK_BY_PRODUCTS_HELP,
  AXIS_LINK_HELP,
  AXIS_LINK_STATES,
  AXIS_LINK_TITLE,
  AXIS_TOPICS_OTHER_LABEL,
  shortAxisName,
} from "./boardTexts";

/* UI Library Components */
import { Table, Tag, Tooltip } from "antd";

const LINK_TAG_WIDTH = 102;

const fmt = (n) => Number(n).toLocaleString("es-CO");
/* Value of the header filter for the row «Otros productos asignados al eje». */
const BY_PRODUCTS = "products";
/* Same width for every tag of the column: the one the text «Por productos» takes (measured, F51b). */
const TAG_STYLE = { margin: 0, display: "inline-block", width: LINK_TAG_WIDTH, textAlign: "center" };

/**
 * Table «Tópicos del Eje Temático» (F49): topic (name and code), products, citations, link with the axis (F51b,
 * D-148: «Incluido» green, «Frontera» orange, «—» when the bundle does not carry the state) and, with several
 * axes, the axes of each topic. Sortable by column, highest products first by default, with a row «Otros
 * productos asignados al eje» (F50) tagged «Por productos» (F51c) and a row of totals. The header filter of the
 * link has the two states and «Por productos»; the row of the others is always last and only disappears when
 * the filter leaves «Por productos» out.
 *
 * @param {{ index: number, id: string, label: string, state: number|null, products: number, citations: number, axes: string[] }[]} rows
 * @param {{ products: number, citations: number }} other - Row «Otros productos asignados al eje» (F50): the total adds up to the cards.
 * @param {boolean} severalAxes - Shows the column «Ejes».
 */
function AxisTopicsTable({ rows, other, severalAxes }) {
  const [linkFilter, setLinkFilter] = useState(null);
  const shown = useMemo(() => (linkFilter && linkFilter.length ? rows.filter((r) => linkFilter.includes(String(r.state))) : rows), [rows, linkFilter]);
  const showOther = !linkFilter || !linkFilter.length || linkFilter.includes(BY_PRODUCTS);
  const total = useMemo(
    () => ({
      products: shown.reduce((a, r) => a + r.products, 0) + (showOther ? other.products : 0),
      citations: shown.reduce((a, r) => a + r.citations, 0) + (showOther ? other.citations : 0),
    }),
    [shown, other, showOther],
  );
  const linkTag = (state) => {
    const s = AXIS_LINK_STATES[state];
    return s ? <Tag color={s.color} style={TAG_STYLE}>{s.label}</Tag> : "—";
  };
  const columns = [
    { title: "Tópico", dataIndex: "label", sorter: (a, b) => a.label.localeCompare(b.label), render: (label, row) => <span title={`${label} (${row.id})`}>{label} <small style={{ color: "rgba(0,0,0,.45)" }}>{row.id}</small></span>, width: severalAxes ? "34%" : "50%" },
    { title: "Productos", dataIndex: "products", align: "right", sorter: (a, b) => a.products - b.products, defaultSortOrder: "descend", render: fmt, width: 110 },
    { title: "Citas", dataIndex: "citations", align: "right", sorter: (a, b) => a.citations - b.citations, render: fmt, width: 110 },
    {
      title: <Tooltip title={AXIS_LINK_HELP}><span>{AXIS_LINK_TITLE}</span></Tooltip>,
      dataIndex: "state",
      key: "state",
      align: "center",
      width: 150,
      /* Included before frontier; without state at the end. */
      sorter: (a, b) => (a.state ?? 9) - (b.state ?? 9),
      render: linkTag,
      filters: [
        { text: "Incluido", value: "0" },
        { text: "Frontera", value: "1" },
        { text: AXIS_LINK_BY_PRODUCTS, value: BY_PRODUCTS },
      ],
      filteredValue: linkFilter,
    },
    ...(severalAxes ? [{ title: "Ejes", dataIndex: "axes", render: (axes) => <span title={axes.join("; ")}>{axes.map((a) => shortAxisName(a)).join("; ")}</span> }] : []),
  ];
  const empty = severalAxes ? <Table.Summary.Cell index={4} /> : null;
  return (
    <CompactTable
      rowKey="index"
      size="small"
      scroll={{ y: 360 }}
      dataSource={shown}
      columns={columns}
      aria-label="Tópicos del Eje Temático"
      onChange={(_, filters) => setLinkFilter(filters.state || null)}
      summary={() => (
        <Table.Summary fixed>
          {showOther ? (
            <Table.Summary.Row data-testid="axis-topics-other">
              <Table.Summary.Cell index={0}><span title={AXIS_TOPICS_OTHER_LABEL}>{AXIS_TOPICS_OTHER_LABEL}</span></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><span data-testid="axis-topics-other-products">{fmt(other.products)}</span></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right"><span data-testid="axis-topics-other-citations">{fmt(other.citations)}</span></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center">
                <Tooltip title={AXIS_LINK_BY_PRODUCTS_HELP} overlayStyle={{ maxWidth: 480 }}>
                  <Tag color="geekblue" style={TAG_STYLE} data-testid="axis-topics-other-link">{AXIS_LINK_BY_PRODUCTS}</Tag>
                </Tooltip>
              </Table.Summary.Cell>
              {empty}
            </Table.Summary.Row>
          ) : null}
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}><b>Total ({fmt(shown.length)} tópicos)</b></Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right"><b data-testid="axis-topics-total-products">{fmt(total.products)}</b></Table.Summary.Cell>
            <Table.Summary.Cell index={2} align="right"><b data-testid="axis-topics-total-citations">{fmt(total.citations)}</b></Table.Summary.Cell>
            <Table.Summary.Cell index={3} />
            {empty}
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
}

export default memo(AxisTopicsTable);
