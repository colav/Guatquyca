"use client";

/* Hooks */
import { useEffect, useMemo, useState } from "react";

/* Components */
import ChartCard from "@/app/observatories/components/ChartCard";
import DonutChart from "@/app/observatories/components/DonutChart";
import FiltersBar from "./FiltersBar";
import TopicScatter from "./TopicScatter";
import {
  ActorsTable,
  KpiRow,
  OdsPlaceholders,
  RulesTable,
  ScatterLegend,
  SubregionTiles,
  SummaryLine,
  UnitDetail,
} from "./BoardParts";
import { CalculatorColumnsChart, RankingBarsChart } from "./BarsChart";

/* lib */
import {
  CATEGORY,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  computeCapacity,
  rankAxes,
  rankGoals,
  rankGroups,
} from "@/lib/observatories/capacity";
import { loadBoard1Dataset } from "@/lib/observatories/data/artifactAdapter";
import { QUARTILE_COLORS, TYPE_COLORS, accessColor } from "@/lib/observatories/palette";

/* Texts */
import {
  BOARD_EYEBROW,
  BOARD_LEAD,
  BOARD_TITLE,
  DATA_WARNINGS,
  DIMENSION_NOUN,
  DONUT_LABELS,
  HELP_TEXT,
  MOCK_TAG,
} from "./boardTexts";
import { useBoardFilters, useStableValue } from "./hooks";

/* UI Library Components */
import { Alert, Col, Collapse, Result, Row, Skeleton, Tag, Typography } from "antd";

/* Colours of the access route donut, one per label (palette of lib/constants.js). */
const ACCESS_COLORS = DONUT_LABELS.access.map(accessColor);

const fmtFwci = (v) => (Number.isFinite(v) ? v.toFixed(2) : "–");

/**
 * Board 1 · Masa crítica temática. Loads the dataset through the adapter and shows the content;
 * all the computation lives in lib/observatories/capacity (pure functions).
 */
export default function Board1() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    loadBoard1Dataset({ signal: controller.signal })
      .then((dataset) => setState({ status: "ready", dataset }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", error });
      });
    return () => controller.abort();
  }, []);

  if (state.status === "loading") return <Skeleton active paragraph={{ rows: 12 }} />;
  if (state.status === "error") {
    return (
      <Result
        status="warning"
        title="No se pudieron cargar los datos del tablero."
        subTitle={state.error.status === 404 ? "Los datos de prueba no están disponibles en este equipo." : "Intente de nuevo en unos minutos."}
      />
    );
  }
  return <Board1Content dataset={state.dataset} />;
}

function Board1Content({ dataset }) {
  const { draft, applied, pending, update, reset } = useBoardFilters();
  const [selectedId, setSelectedId] = useState(null);

  const result = useMemo(() => computeCapacity(dataset, applied), [dataset, applied]);

  /* Each chart receives a value that keeps its reference while its content does not change. */
  const points = useStableValue(
    result.units
      .filter((u) => u.products > 0)
      .map((u) => ({
        id: u.id,
        label: u.label,
        products: u.products,
        citations: u.citations,
        fwci: Number.isFinite(u.fwci) ? Math.round(u.fwci * 1000) / 1000 : null,
        fwciText: fmtFwci(u.fwci),
        category: u.category,
        categoryLabel: CATEGORY_LABELS[u.category],
      })),
  );
  const calculator = useStableValue(
    CATEGORY_ORDER.map((c) => ({ category: c, label: CATEGORY_LABELS[c], value: result.categoryCounts[c], color: CATEGORY_COLORS[c] })),
  );
  const groups = useStableValue(rankGroups(dataset, result));
  const axes = useStableValue(rankAxes(dataset, result));
  const goals = useStableValue(rankGoals(dataset, result));
  const typeValues = useStableValue(result.pies.type);
  const quartileValues = useStableValue(result.pies.quartile);
  const accessValues = useStableValue(result.pies.access);
  const kpis = useStableValue({
    products: result.products,
    citations: result.citations,
    fwci: result.setFwci,
    leaders: result.categoryCounts[CATEGORY.LEADER] + result.categoryCounts[CATEGORY.CONSOLIDATED],
    emerging: result.categoryCounts[CATEGORY.EMERGING] + result.categoryCounts[CATEGORY.CONSOLIDATING],
    atRisk: result.categoryCounts[CATEGORY.AT_RISK],
  });
  const summary = useStableValue({
    products: result.products,
    citations: result.citations,
    withProduction: result.unitsWithProduction,
    units: result.units.length,
    axes: result.axisFilter ? result.axisFilter.size : dataset.axes.length,
  });

  const selectedUnit = useMemo(() => {
    const unit = result.units.find((u) => u.id === selectedId);
    if (!unit) return null;
    return { ...unit, categoryLabel: CATEGORY_LABELS[unit.category], fwciText: fmtFwci(unit.fwci) };
  }, [result, selectedId]);
  const selectedAxes = useMemo(() => {
    if (!selectedUnit || selectedUnit.topicIndex < 0) return null;
    return dataset.topics[selectedUnit.topicIndex].link
      .slice()
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, count]) => ({ id, count, label: dataset.axes[id].eje, agenda: dataset.axes[id].agenda }));
  }, [dataset, selectedUnit]);

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">{BOARD_EYEBROW}</Typography.Text>
        <Typography.Title level={2} style={{ marginTop: 4 }}>{BOARD_TITLE}</Typography.Title>
        <Typography.Paragraph>{BOARD_LEAD}</Typography.Paragraph>
        <Tag color="gold">{MOCK_TAG}</Tag>
        <Tag>{dataset.meta.n_sel.toLocaleString("es-CO")} productos en la base · {dataset.meta.n_topic.toLocaleString("es-CO")} con tópico</Tag>
        <Tag>Artículos, libros y capítulos · 2010–2026</Tag>
        <Collapse
          ghost
          items={[{ key: "help", label: "¿Cómo usar este tablero?", children: HELP_TEXT.map((t) => <Typography.Paragraph key={t.slice(0, 20)}>{t}</Typography.Paragraph>) }]}
        />
      </header>

      <FiltersBar dataset={dataset} filters={draft} onChange={update} onReset={reset} />
      <SummaryLine summary={summary} noun={DIMENSION_NOUN[applied.dimension]} pending={pending} />
      <KpiRow kpis={kpis} />

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={16}>
          <ChartCard title="1 · Dispersión de tópicos: producción vs. citas" note={`${summary.withProduction.toLocaleString("es-CO")} puntos con producción`} empty={!points.length}>
            <ScatterLegend />
            <TopicScatter points={points} selectedId={selectedId} onSelect={setSelectedId} />
            <UnitDetail unit={selectedUnit} axes={selectedAxes} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={8}>
          <ChartCard title="2 · Calculadora de capacidades" note="unidades por categoría">
            <CalculatorColumnsChart items={calculator} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
              Sobre {summary.units.toLocaleString("es-CO")} unidades de la dimensión elegida. Regla {applied.trendRule === "strict" ? "estricta" : "por pendiente"}, ventana 2021–2025. «Sin producción» = cero productos en la ventana.
            </Typography.Paragraph>
            <RulesTable trendRule={applied.trendRule} />
          </ChartCard>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <ChartCard title="3 · Grupos de investigación" note="productos asociados a los tópicos filtrados" empty={!groups.length}>
            <RankingBarsChart rows={groups} />
          </ChartCard>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ChartCard title="4 · Ejes Temáticos públicos" note="n.º de tópicos con producción UdeA" empty={!axes.length}>
            <RankingBarsChart rows={axes} />
          </ChartCard>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ChartCard title="6 · Meta / reto / programa / estrategia" note="n.º de Ejes Temáticos asociados" empty={!goals.length}>
            <RankingBarsChart rows={goals} labelSize={40} />
          </ChartCard>
        </Col>

        <Col xs={24}>
          <ChartCard title="7 · Distribución de productos" note="tipo · cuartil Scimago · ruta de acceso" empty={!result.products}>
            <Row gutter={[12, 12]}>
              <Col xs={24} md={8}><Typography.Text strong>Tipo de producto</Typography.Text><DonutChart labels={DONUT_LABELS.type} values={typeValues} colors={TYPE_COLORS} /></Col>
              <Col xs={24} md={8}><Typography.Text strong>Cuartil Scimago</Typography.Text><DonutChart labels={DONUT_LABELS.quartile} values={quartileValues} colors={QUARTILE_COLORS} /></Col>
              <Col xs={24} md={8}><Typography.Text strong>Ruta de acceso</Typography.Text><DonutChart labels={DONUT_LABELS.access} values={accessValues} colors={ACCESS_COLORS} /></Col>
            </Row>
          </ChartCard>
        </Col>

        <Col xs={24}><OdsPlaceholders /></Col>

        <Col xs={24} lg={12}>
          <ChartCard title="Complemento · Mapa esquemático por subregión de Antioquia" note="proxy: subregión o municipio mencionado en el título">
            <SubregionTiles subregions={dataset.subregions} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Las bases no traen ubicación geográfica de la investigación. El conteo usa menciones en títulos (artículos, libros y capítulos 2010–2026) y, entre paréntesis, productos con autores adscritos a los Programas de Regionalización. Disposición aproximada norte–sur. No responde a los filtros.
            </Typography.Paragraph>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Complemento · Actores no académicos coautores" note="productos en coautoría, toda la base">
            <ActorsTable actors={dataset.actors} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Clasificación por palabras clave del nombre (hospital, ministerio, S.A., fundación…); requiere revisión manual. Se excluyen universidades e instituciones universitarias. No responde a los filtros.
            </Typography.Paragraph>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <Alert
            type="info"
            showIcon
            message="Advertencias de datos y método"
            description={<ol style={{ margin: 0, paddingLeft: 18 }}>{DATA_WARNINGS.map((w) => <li key={w.slice(0, 24)}>{w}</li>)}</ol>}
          />
        </Col>
      </Row>
    </div>
  );
}
