"use client";

/* Hooks */
import { memo } from "react";

/* Texts */
import { RULES_TABLE } from "./boardTexts";

/* UI Library Components */
import { Card, Col, Descriptions, Row, Statistic, Table, Typography } from "antd";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Six KPI cards of the top row.
 *
 * @param {{ products: number, citations: number, fwci: number, leaders: number, emerging: number, atRisk: number }} kpis
 */
export const KpiRow = memo(function KpiRow({ kpis }) {
  const items = [
    [fmt(kpis.products), "productos (artículos, libros, capítulos)"],
    [fmt(kpis.citations), "citas acumuladas (OpenAlex)"],
    [kpis.fwci.toFixed(2), "FWCI del conjunto filtrado (proxy)"],
    [fmt(kpis.leaders), "unidades líder + consolidado"],
    [fmt(kpis.emerging), "unidades emergentes + en consolidación"],
    [fmt(kpis.atRisk), "unidades en riesgo de desaparecer"],
  ];
  return (
    <Row gutter={[12, 12]}>
      {items.map(([value, label]) => (
        <Col key={label} xs={12} md={8} lg={4}>
          <Card size="small">
            <Statistic title={label} value={value} valueStyle={{ fontSize: 22 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
});

/** Line under the filters: counts of the current selection. */
export const SummaryLine = memo(function SummaryLine({ summary, noun, pending }) {
  return (
    <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
      Productos filtrados <b>{fmt(summary.products)}</b> · Citas OpenAlex <b>{fmt(summary.citations)}</b> · {noun} con producción{" "}
      <b>{fmt(summary.withProduction)}</b> de {fmt(summary.units)} · Ejes Temáticos en el filtro <b>{fmt(summary.axes)}</b>
      {pending ? " · actualizando…" : ""}
    </Typography.Paragraph>
  );
});

/** Detail of the pinned point of the scatter. */
export const UnitDetail = memo(function UnitDetail({ unit, axes }) {
  if (!unit) {
    return (
      <Typography.Text type="secondary">
        Pase el cursor por un punto para ver campo, subcampo, FWCI y categoría; haga clic para fijarlo y ver sus Ejes Temáticos asociados.
      </Typography.Text>
    );
  }
  return (
    <div>
      <b>{unit.label}</b>
      {unit.field ? ` · ${unit.field}${unit.subfield ? ` › ${unit.subfield}` : ""}` : ""} · categoría <b>{unit.categoryLabel}</b> (FWCI {unit.fwciText};{" "}
      {unit.yearCounts.join(", ")} productos en la ventana).
      {axes ? (
        <>
          {" "}Ejes Temáticos asociados por términos Núcleo (n.º de productos que enlazan):
          <ul style={{ margin: "4px 0 0 18px" }}>
            {axes.length ? (
              axes.map((a) => (
                <li key={a.id}>
                  {a.label} <small>· {a.agenda} · {a.count}</small>
                </li>
              ))
            ) : (
              <li>Ningún Eje Temático asociado con los términos Núcleo.</li>
            )}
          </ul>
        </>
      ) : (
        <> {fmt(unit.topicsWithProduction)} tópicos con producción.</>
      )}
    </div>
  );
});

/** Legend of the colours of the scatter. */
export function ScatterLegend() {
  const dot = (color, border) => (
    <i style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: color, border: `1px solid ${border}`, marginRight: 6 }} />
  );
  return (
    <div style={{ fontSize: 12, display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 6 }}>
      <span>{dot("#eb6834", "#eb6834")}Consolidado / líder (benchmark global · proxy FWCI)</span>
      <span>{dot("#2a78d6", "#2a78d6")}En consolidación (provisional: benchmark nacional)</span>
      <span>{dot("#fff", "#9aa193")}Otros tópicos</span>
      <span>Tamaño = FWCI</span>
    </div>
  );
}

/** Rules of the categories, next to the calculator. */
export const RulesTable = memo(function RulesTable({ trendRule }) {
  return (
    <Table
      size="small"
      pagination={false}
      dataSource={RULES_TABLE}
      aria-label="Reglas de clasificación"
      columns={[
        { title: "Categoría", dataIndex: "category" },
        { title: "Cociente (proxy FWCI ≤ 1)", dataIndex: "ratio" },
        { title: "Producción 5 años", dataIndex: "trend" },
      ]}
      caption={`Regla ${trendRule === "strict" ? "estricta" : "por pendiente"}, ventana 2021–2025.`}
    />
  );
});

/** Subregion tiles (complement): approximate north-south layout. */
const SUBREGION_ORDER = ["Urabá", "Norte", "Bajo Cauca", "Occidente", "Valle de Aburrá", "Nordeste", "Suroeste", "Oriente", "Magdalena Medio"];

export const SubregionTiles = memo(function SubregionTiles({ subregions }) {
  const bySub = new Map(subregions.map((s) => [s.sub, s]));
  const max = Math.max(...subregions.filter((s) => s.sub !== "Valle de Aburrá").map((s) => s.n_title));
  return (
    <Row gutter={[8, 8]}>
      {SUBREGION_ORDER.map((name) => {
        const s = bySub.get(name);
        if (!s) return null;
        const intensity = name === "Valle de Aburrá" ? 1 : 0.15 + (0.85 * s.n_title) / max;
        return (
          <Col key={name} span={8}>
            <div style={{ background: `color-mix(in srgb, #1f7a3f ${Math.round(intensity * 55)}%, #fff)`, padding: 8, minHeight: 86, borderRadius: 6 }}>
              <div style={{ fontSize: 12 }}>{name}</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                {fmt(s.n_title)}
                {s.n_regprog ? <span style={{ fontSize: 12, fontWeight: 400 }}> ({s.n_regprog})</span> : null}
              </div>
              <div style={{ fontSize: 11 }}>{s.topics.slice(0, 2).map((t) => t[0]).join(" · ")}</div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
});

/** Non-academic co-authoring actors table (complement, current proxy). */
export const ActorsTable = memo(function ActorsTable({ actors }) {
  const rows = actors
    .filter((a) => a.t !== "Sin clasificar")
    .slice(0, 22)
    .map((a, i) => ({
      key: i,
      name: a.n,
      country: a.c,
      type: a.t.replace(" (públicos y privados)", "").replace(" (no universitarios)", ""),
      products: a.p,
    }));
  return (
    <Table
      size="small"
      pagination={false}
      scroll={{ y: 360 }}
      dataSource={rows}
      columns={[
        { title: "Institución", dataIndex: "name" },
        { title: "País", dataIndex: "country", width: 70 },
        { title: "Tipo", dataIndex: "type" },
        { title: "Productos", dataIndex: "products", align: "right", render: fmt, width: 100 },
      ]}
    />
  );
});

/** Mock-ups of the ODS panels, as in the artifact (no data yet). */
export function OdsPlaceholders() {
  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={12}>
        <Descriptions size="small" column={1} bordered title="5 · Ránking ODS">
          <Descriptions.Item label="Sin datos en la base entregada">
            Los CSV no incluyen el campo <code>sustainable_development_goals</code> de OpenAlex. Cuando se agregue (work_id → ODS, score), este panel listará los ODS por número de productos y quedará enlazado a los tópicos del gráfico 1.
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col xs={24} md={12}>
        <Descriptions size="small" column={1} bordered title="8 · Tree map ODS">
          <Descriptions.Item label="Pendiente del mismo campo">
            Mostrará la producción de la UdeA asociable a cada uno de los 17 objetivos; el área de cada rectángulo será el conteo de productos.
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
}
