"use client";

/* Hooks */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* Components */
import ChartCard from "@/app/observatories/components/ChartCard";
import AxisTopicsTable from "./AxisTopicsTable";
import LinkedText from "@/app/observatories/components/LinkedText";
import { sourceSentences } from "@/lib/observatories/cutDate";
import FillHeight from "@/app/observatories/components/FillHeight";
import CutoffNote from "@/app/observatories/components/CutoffNote";
import DonutChart from "@/app/observatories/components/DonutChart";
import FiltersBar from "./FiltersBar";
import TopicScatter from "./TopicScatter";
import {
  ActorsTable,
  KpiRow,
  OdsPlaceholders,
  OdsTiles,
  RulesTable,
  SubregionTiles,
  SummaryLine,
  UnitDetail,
} from "./BoardParts";
import { CalculatorBarsChart, RankingBarsChart } from "./BarsChart";

/* lib */
import {
  CATEGORY,
  CATEGORY_COLORS,
  CATEGORY_ORDER,
  CATEGORY_ORDER_LEGACY,
  CATEGORY_LABELS,
  MIN_TREND_VOLUME,
  ODS_MIN_SCORE,
  TREND_BAND,
  computeCapacity,
  rankActors,
  rankAxes,
  rankAxisTopics,
  axisTopicsOther,
  rankGoals,
  rankGroups,
  rankOds,
} from "@/lib/observatories/capacity";
import { MOCK_SOURCE, loadBoard1Dataset } from "@/lib/observatories/data/artifactAdapter";
import LoadError from "@/app/observatories/components/LoadError";
import { QUARTILE_COLORS, TYPE_COLORS, accessColor } from "@/lib/observatories/palette";

/* Texts */
import {
  BOARD_EYEBROW,
  BOARD_LEAD,
  BOARD_LEAD_REAL,
  BOARD_TITLE,
  DATA_WARNINGS,
  DIMENSION_NOUN,
  DONUT_LABELS,
  HELP_TEXT,
  HELP_TEXT_REAL,
  AXES_PANEL_NOTE,
  METHOD_NOTE,
  MOCK_TAG,
  REAL_TAG,
  REFERENCE_NAME,
  RULE_LINE,
  SIZE_NOTE,
  SIZE_NOTE_LEGACY,
  SNAPSHOT_NOTE,
  TYPES_FOOT,
  TYPES_HELP,
  AXIS_TOPICS_TITLE,
  AXIS_TOPICS_RECONCILE_NOTE,
  axisTopicsYears,
  goalRows,
  lowCapacityDefinition,
  PUNCTUAL_DEFINITION,
  categoryLine,
  categoryLineNoRatio,
  FIELD_RATIO_RULE,
  NO_RATIO_DEFINITION,
  NO_RATIO_TEXT,
  ratioTopicsText,
  withoutRatioNote,
  noProductionTooltip,
  undrawnNote,
  TREND_LABELS,
  realDataWarnings,
} from "./boardTexts";
import CategoryLegend from "./CategoryLegend";
import { useBoardFilters, useCategorySelection, useStableValue } from "./hooks";

/* UI Library Components */
import { Alert, Col, Collapse, Row, Skeleton, Tag, Typography } from "antd";

/* Colours of the access route donut, one per label (palette of lib/constants.js). */
const ACCESS_COLORS = DONUT_LABELS.access.map(accessColor);

const fmt = (n) => Number(n).toLocaleString("es-CO");
const fmtFwci = (v) => (Number.isFinite(v) ? v.toFixed(2) : "–");

/**
 * Board 1 · Masa crítica temática. Loads the dataset through the adapter and shows the content;
 * all the computation lives in lib/observatories/capacity (pure functions).
 */
export default function Board1() {
  const [state, setState] = useState({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  /* `?source=mock` reads the local test data instead of the API (not shown in the interface). */
  const source = useSearchParams().get("source") === MOCK_SOURCE ? MOCK_SOURCE : "api";

  useEffect(() => {
    const controller = new AbortController();
    loadBoard1Dataset({ signal: controller.signal, source })
      .then((loaded) => setState({ status: "ready", ...loaded }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", error });
      });
    return () => controller.abort();
  }, [source, attempt]);

  /* "Reintentar": asks for the bundle again without reloading the page. */
  const retry = () => {
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  };

  if (state.status === "loading") return <Skeleton active paragraph={{ rows: 12 }} />;
  if (state.status === "error") {
    return <LoadError error={state.error} onRetry={retry} />;
  }
  return <Board1Content dataset={state.dataset} source={state.source} />;
}

function Board1Content({ dataset, source }) {
  const isMock = source === MOCK_SOURCE;
  const { draft, applied, pending, update, reset } = useBoardFilters();
  const [selectedId, setSelectedId] = useState(null);

  const result = useMemo(() => computeCapacity(dataset, applied), [dataset, applied]);

  /* Each chart receives a value that keeps its reference while its content does not change. */
  const modern = result.model === "capacity";
  /* Which categories the scatter shows (F43c): a view of the panels 1 and 2, not a filter of the board. */
  const drawableCategories = useMemo(() => (modern ? CATEGORY_ORDER : CATEGORY_ORDER_LEGACY).filter((c) => c !== CATEGORY.NONE), [modern]);
  const { selected, toggle: toggleCategory, clear: clearCategories } = useCategorySelection(drawableCategories);
  const referent = REFERENCE_NAME[applied.ratioBasis];
  const fmtRatio = (v) => (Number.isFinite(v) ? v.toFixed(2).replace(".", ",") : "–");
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
        /* Lines of the tooltip (F34/F35). */
        fwciLine: modern ? `${fmtFwci(u.fwci).replace(".", ",")} (sobre ${fmt(u.recordProducts)} productos con registro)` : fmtFwci(u.fwci).replace(".", ","),
        productsLine: fmt(u.products),
        citationsLine: fmt(u.citations),
        trendLine: `${TREND_LABELS[u.trend]}${u.indicative ? ` * (indicativa: menos de ${MIN_TREND_VOLUME} productos)` : ""}`,
        yearsLine: u.yearCounts.join(", "),
        ratioText: !modern ? fmtRatio(u.ratio) : u.noRatio ? NO_RATIO_TEXT : `${fmtRatio(u.ratio)} (citas de la UdeA ${fmt(u.ratioCitations)} frente a ${fmt(u.leaderCitations)} de ${u.referent || "los referentes de sus tópicos"}${u.ratioTopics !== null ? `, ${ratioTopicsText(u.ratioTopics)}` : ""})`,
        subfield: u.subfield,
        field: u.field,
        category: u.category,
        categoryLabel: u.noRatio ? categoryLineNoRatio(CATEGORY_LABELS[u.category]) : categoryLine(u.category, CATEGORY_LABELS[u.category]),
      })),
  );
  const visiblePoints = useStableValue(selected.length ? points.filter((p) => selected.includes(p.category)) : points);
  const nounLower = DIMENSION_NOUN[applied.dimension].toLowerCase();
  /* The numbers of the buttons are the totals of the category and do not change when one is isolated. «Sin producción»
     is informative: it is not drawn (no production in 2021–2025), so it has no click (F43b, D-134). */
  const legendItems = useStableValue(
    result.categoryOrder.map((c) =>
      c === CATEGORY.NONE
        ? { category: c, label: CATEGORY_LABELS[c], count: result.categoryCounts[c], informative: true, hint: result.noProduction ? noProductionTooltip({ ...result.noProduction, noun: nounLower }) : "" }
        : { category: c, label: CATEGORY_LABELS[c], count: points.filter((p) => p.category === c).length, hint: !modern ? "" : c === CATEGORY.LOW_CAPACITY ? lowCapacityDefinition(applied.ratioBasis) : c === CATEGORY.PUNCTUAL ? (result.unitsWithoutRatio ? NO_RATIO_DEFINITION : PUNCTUAL_DEFINITION) : "" },
    ),
  );
  /* Units without production in 2021–2025: counted in the panel 2, not drawn in the panel 1. */
  const undrawn = result.categoryCounts[CATEGORY.NONE] || 0;
  const calcTotal = result.categoryOrder.reduce((n, c) => n + result.categoryCounts[c], 0);
  const withProduction = calcTotal - (result.categoryCounts[CATEGORY.NONE] || 0);
  const calculator = useStableValue(
    result.categoryOrder.map((c) => ({
      category: c,
      label: CATEGORY_LABELS[c],
      value: result.categoryCounts[c],
      color: CATEGORY_COLORS[c],
      pctText: c === CATEGORY.NONE || !withProduction ? "—" : `${((100 * result.categoryCounts[c]) / withProduction).toFixed(1).replace(".", ",")} %`,
      rule: RULE_LINE[c] || "",
    })),
  );
  const noun = DIMENSION_NOUN[applied.dimension].toLowerCase();
  /* Sources and dates (F47): the dates of OpenAlex come from meta.corte_openalex, in Bogotá time. */
  const sources = useMemo(() => sourceSentences(dataset.meta, dataset.obsCut), [dataset]);
  const fwciNote = result.fwciBasis
    ? `FWCI calculado sobre ${fmt(result.fwciBasis.withRecord)} productos con registro en OpenAlex; ${fmt(result.fwciBasis.withoutRecord)} productos (SCIENTI o Minciencias) no tienen datos de citas. ${sources.citations}`
    : "";
  const groups = useStableValue(rankGroups(dataset, result));
  const actors = useStableValue(rankActors(dataset, result));
  const ods = useStableValue(rankOds(dataset, result));
  const subregionCounts = useStableValue(result.subregionCounts);
  const axes = useStableValue(rankAxes(dataset, result));
  const goals = useStableValue(goalRows(rankGoals(dataset, result)));
  /* Table of the topics of the chosen axes (F49): all the filters apply, the years included. */
  const axisTopics = useStableValue(rankAxisTopics(dataset, result));
  const axisOther = useStableValue(axisTopicsOther(result, axisTopics));
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
    /* The detail takes the same trend as the tooltip (F48 3): the label was missing and it said «tendencia ;». */
    return { ...unit, categoryLabel: unit.noRatio ? categoryLineNoRatio(CATEGORY_LABELS[unit.category]) : categoryLine(unit.category, CATEGORY_LABELS[unit.category]), fwciText: fmtFwci(unit.fwci), trendLabel: TREND_LABELS[unit.trend] };
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
        <Typography.Paragraph>{isMock ? BOARD_LEAD : BOARD_LEAD_REAL}</Typography.Paragraph>
        <Tag color="gold">{isMock ? MOCK_TAG : REAL_TAG}</Tag>
        <Tag>{dataset.meta.n_sel.toLocaleString("es-CO")} productos en la base · {dataset.meta.n_topic.toLocaleString("es-CO")} con tópico</Tag>
        <Tag>Artículos, libros y capítulos · 2010–2026</Tag>
        <Collapse
          ghost
          items={[{ key: "help", label: "¿Cómo usar este tablero?", children: (isMock ? HELP_TEXT : [...HELP_TEXT_REAL, sources.full, TYPES_HELP]).map((t) => <Typography.Paragraph key={t.slice(0, 20)}><LinkedText text={t} /></Typography.Paragraph>) }]}
        />
      </header>

      <FiltersBar dataset={dataset} filters={draft} onChange={update} onReset={reset} />
      <SummaryLine summary={summary} noun={DIMENSION_NOUN[applied.dimension]} pending={pending} />
      <KpiRow kpis={kpis} fwciLabel={modern ? "FWCI del conjunto filtrado" : undefined} fwciNote={fwciNote} />

      {applied.axisIds.length ? (
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col span={24}>
            <ChartCard title={AXIS_TOPICS_TITLE} note={axisTopicsYears(applied.yearFrom, applied.yearTo)} empty={!axisTopics.length}>
              <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 6 }} data-testid="axis-topics-note">
                {axisTopicsYears(applied.yearFrom, applied.yearTo)}. {fmt(applied.axisIds.length)} {applied.axisIds.length === 1 ? "eje elegido" : "ejes elegidos"}; los tópicos sin productos con los filtros actuales aparecen con 0. {AXIS_TOPICS_RECONCILE_NOTE}
              </Typography.Text>
              <AxisTopicsTable rows={axisTopics} other={axisOther} severalAxes={applied.axisIds.length > 1} />
            </ChartCard>
          </Col>
        </Row>
      ) : null}

      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} lg={14}>
          <ChartCard
            title="1 · Dispersión de tópicos: producción vs. citas"
            note={`${visiblePoints.length.toLocaleString("es-CO")} puntos con producción${selected.length ? ` · solo ${selected.map((c) => CATEGORY_LABELS[c]).join(" y ")}` : ""}`}
            empty={!points.length}
          >
            {modern ? <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 6 }} data-testid="snapshot-note">{SNAPSHOT_NOTE}</Typography.Text> : null}
            <CategoryLegend items={legendItems} selected={selected} onToggle={toggleCategory} onClear={clearCategories} sizeNote={modern ? SIZE_NOTE : SIZE_NOTE_LEGACY} />
            <FillHeight min={400}>
              {(height) => <TopicScatter points={visiblePoints} selectedId={selectedId} onSelect={setSelectedId} dimension={applied.dimension} referent={referent} height={height} />}
            </FillHeight>
            <UnitDetail unit={selectedUnit} axes={selectedAxes} />
            {modern ? (
              <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6, marginBottom: 0 }} data-testid="source-note">
                {sources.full}
              </Typography.Paragraph>
            ) : null}
            {modern && applied.dimension !== "topic" ? (
              <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6, marginBottom: 0 }} data-testid="field-ratio-note">
                {FIELD_RATIO_RULE}
                {result.unitsWithoutRatio ? ` ${withoutRatioNote(result.unitsWithoutRatio, nounLower)}` : ""}
              </Typography.Paragraph>
            ) : null}
            {undrawn > 0 ? (
              <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6, marginBottom: 0 }} data-testid="undrawn-note">
                <LinkedText text={undrawnNote({ count: undrawn, noun: nounLower })} />
              </Typography.Paragraph>
            ) : null}
          </ChartCard>
        </Col>
        <Col xs={24} lg={10}>
          <ChartCard title="2 · Calculadora de capacidades" note={`${noun} por categoría`}>
            {modern ? <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginBottom: 6 }} data-testid="snapshot-note">{SNAPSHOT_NOTE}</Typography.Text> : null}
            <CalculatorBarsChart items={calculator} noun={noun} active={selected} onSelect={toggleCategory} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
              {modern
                ? <LinkedText text={`Sobre ${summary.units.toLocaleString("es-CO")} ${noun} de la dimensión elegida. Referente: ${referent} · ${fmt(result.indicativeUnits)} de ${fmt(result.unitsInWindow)} con tendencia indicativa (*). «Sin producción» = sin productos con ese tópico principal en 2021–2025.`} />
                : `Sobre ${summary.units.toLocaleString("es-CO")} unidades de la dimensión elegida; cálculo anterior (regla estricta, ventana 2021–2025). «Sin producción» = cero productos en la ventana.`}
            </Typography.Paragraph>
            {modern ? <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>{METHOD_NOTE}</Typography.Paragraph> : null}
            {modern ? (
              <Typography.Paragraph type="secondary" style={{ fontSize: 12 }} data-testid="source-note">
                {sources.full} {TYPES_FOOT}
              </Typography.Paragraph>
            ) : null}
            <RulesTable legacy={!modern} ratioBasis={applied.ratioBasis} caption={modern ? `Referente: ${referent}. Tendencia por la pendiente de la recta, banda estable ±${Math.round(TREND_BAND * 100)} %, ventana 2021–2025.` : "Regla estricta, ventana 2021–2025."} />
          </ChartCard>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <ChartCard title="3 · Grupos de investigación" note="productos asociados a los tópicos filtrados" empty={!groups.length}>
            <RankingBarsChart rows={groups} />
          </ChartCard>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ChartCard title="4 · Ejes Temáticos públicos" note={dataset.hasFactDetails ? AXES_PANEL_NOTE[applied.pairLevel] : AXES_PANEL_NOTE.topics} empty={!axes.length}>
            <RankingBarsChart rows={axes} />
          </ChartCard>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <ChartCard title="6 · Meta / reto / programa / estrategia" note="n.º de Ejes Temáticos asociados" empty={!goals.length}>
            <RankingBarsChart rows={goals} labelSize={40} startCut />
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

        {dataset.hasFactDetails && dataset.ods ? (
          <>
            <Col xs={24} lg={12}>
              <ChartCard title="5 · Ránking ODS" note="productos por objetivo de desarrollo sostenible" empty={!ods.some((o) => o.value)}>
                <RankingBarsChart rows={ods.filter((o) => o.value).map((o) => ({ id: o.number, label: `${o.number} · ${o.name}`, value: o.value }))} complete />
                <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                  Cobertura parcial: una obra sin ODS está sin clasificar, no «sin relación». Se cuentan las asignaciones con puntaje de {(ODS_MIN_SCORE / 100).toFixed(2).replace(".", ",")} o más; una obra puede tener varios ODS.
                </Typography.Paragraph>
              </ChartCard>
            </Col>
            <Col xs={24} lg={12}>
              <ChartCard title="8 · Producción por ODS" note="mosaico de los 17 objetivos" empty={!ods.some((o) => o.value)}>
                <OdsTiles items={ods} />
              </ChartCard>
            </Col>
          </>
        ) : (
          <Col xs={24}><OdsPlaceholders /></Col>
        )}

        <Col xs={24} lg={12}>
          <ChartCard title="Complemento · Mapa esquemático por subregión de Antioquia" note="proxy: subregión o municipio mencionado en el título">
            <SubregionTiles subregions={dataset.subregions} counts={dataset.hasFactDetails ? subregionCounts : undefined} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Las bases no traen ubicación geográfica de la investigación. El conteo usa menciones en títulos (artículos, libros y capítulos 2010–2026) y, entre paréntesis, productos con autores adscritos a los Programas de Regionalización. Disposición aproximada norte–sur. {dataset.hasFactDetails ? "El conteo por subregión responde a los filtros; la cifra entre paréntesis no." : "No responde a los filtros."}
            </Typography.Paragraph>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Complemento · Actores no académicos coautores" note={dataset.hasFactDetails ? "productos en coautoría, según los filtros" : "productos en coautoría, toda la base"}>
            <ActorsTable actors={dataset.actors} ranked={dataset.hasFactDetails ? actors : undefined} />
            <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Clasificación estimada del tipo de actor; requiere revisión manual. Se excluyen universidades e instituciones universitarias. {dataset.hasFactDetails ? "Responde a los filtros." : "No responde a los filtros."}
            </Typography.Paragraph>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <Alert
            type="info"
            showIcon
            message="Advertencias de datos y método"
            description={<ol style={{ margin: 0, paddingLeft: 18 }}>{(isMock ? DATA_WARNINGS : realDataWarnings(dataset.meta)).map((w) => <li key={w.slice(0, 24)}>{w}</li>)}</ol>}
          />
        </Col>
      </Row>
      <CutoffNote />
    </div>
  );
}
