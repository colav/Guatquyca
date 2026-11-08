"use client";

/* Hooks */
import { Profiler, useEffect, useMemo, useState } from "react";
import { profileRender, timed } from "@/lib/observatories/optionAvailability";
import { useSearchParams } from "next/navigation";

/* Components */
import CutoffNote from "@/app/observatories/components/CutoffNote";
import TagRow from "@/app/observatories/components/TagRow";
import ChartCard from "@/app/observatories/components/ChartCard";
import DonutChart from "@/app/observatories/components/DonutChart";
import CollabGraph from "./CollabGraph";
import FiltersBar from "./FiltersBar";
import DepartmentMap from "@/app/observatories/components/DepartmentMap";
import SubregionMap from "@/app/observatories/components/SubregionMap";
import { subregionRowsFromObject } from "@/lib/observatories/geoMap";
import Note from "@/app/observatories/components/Note";
import { funderRows } from "@/lib/observatories/funderRows";
import { CountriesTable, DomainTable, GoalsTable, KpiRow, StatTiles } from "./Board2Parts";
import CountryMap from "@/app/observatories/components/CountryMap";
import { SegmentedBarsChart, TrendLinesChart } from "./Charts";

/* lib */
import {
  COLLAB_FILTER_DEBOUNCE_MS,
  DEFAULT_COLLAB_FILTERS,
  LIMITS,
  NON_ACADEMIC_SECTORS,
  PATENT_SERIES_LABEL,
  SMALL_SAMPLE,
  SUBREGION_TABS,
  WORK_TYPE,
  computeCollaboration,
  parseCollabFilters,
  reconcileAxisDocument,
  workOptionAvailability,
  sameCollabFilters,
  serializeCollabFilters,
} from "@/lib/observatories/collaboration";
import { MOCK_SOURCE } from "@/lib/observatories/data/artifactAdapter";
import { groupRegistry, officialGroupsNote } from "@/lib/observatories/officialGroups";
import { loadBoard2Dataset } from "@/lib/observatories/data/collaborationAdapter";
import LoadError from "@/app/observatories/components/LoadError";
import { COLLAB_PATENT_COLOR, COLLAB_TYPE_COLORS, NORTH_SOUTH_COLORS, RANKING_COLOR, SECTOR_COLORS } from "@/lib/observatories/palette";
import { useStableValue } from "@/app/observatories/components/useStableValue";
import { useUrlFilters } from "@/app/observatories/components/useUrlFilters";

/* Texts */
import {
  BOARD_EYEBROW,
  BOARD_LEAD,
  BOARD_TITLE,
  AXIS_14_NOTE,
  FOOTER_TEXT,
  MOCK_TAG,
  NO_AXIS_RESPONSE,
  NOTES,
  NOTICE,
  realNotice,
  REAL_FOOTER_TEXT,
  REAL_TAG,
  SIDE_LABELS,
  smallSampleNote,
  smallProjectsNote,
  NO_SECTOR_DATA,
  NO_SECTOR_DATA_NOTE,
  appropriationYearNote,
  missionFociNote,
  patentsIgnoredNote,
} from "./boardTexts";
import { POLICY_DOCUMENTS } from "../../board-1/components/boardTexts";

/* UI Library Components */
import { Alert, Col, Collapse, Row, Segmented, Skeleton, Tag, Typography } from "antd";

/* Constants */
const fmt = (n) => Number(n).toLocaleString("es-CO");
const URL_FILTERS = {
  defaults: DEFAULT_COLLAB_FILTERS,
  parse: parseCollabFilters,
  serialize: serializeCollabFilters,
  same: sameCollabFilters,
  debounceMs: COLLAB_FILTER_DEBOUNCE_MS,
};
const SEGMENT = (series, value) => ({ series, value });
const TAB_OPTIONS = (labels) => labels.map((label, value) => ({ label, value }));

/**
 * Board 2 · Colaboración, redes y hélices. Loads the dataset through the adapter; all the
 * computation lives in lib/observatories/collaboration (pure functions).
 */
export default function Board2() {
  const [state, setState] = useState({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  /* `?source=mock` reads the local test data instead of the API (not shown in the interface). */
  const source = useSearchParams().get("source") === MOCK_SOURCE ? MOCK_SOURCE : "api";

  useEffect(() => {
    const controller = new AbortController();
    loadBoard2Dataset({ signal: controller.signal, source })
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
  return <Board2Content dataset={state.dataset} source={state.source} />;
}

function Board2Content({ dataset, source }) {
  const { raw } = dataset;
  const isMock = source === MOCK_SOURCE;
  const { draft, applied, pending, update, reset } = useUrlFilters(URL_FILTERS);
  /* Axis and document that do not go together (from the URL): the axis wins and the document is dropped (F61, D-163). */
  useEffect(() => {
    const fix = reconcileAxisDocument(dataset, draft);
    if (fix) update(fix);
  }, [dataset, draft, update]);
  const [domainTab, setDomainTab] = useState(0);
  /* Q-13 (D-202): the tabs carry the names of the bundle (in Spanish) and only the domains that have at least one group; «Sin dominio» has none. */
  const domainTabs = useMemo(() => raw.doms.map((label, value) => ({ label, value })).filter((o) => raw.groups.some((g) => g.d === o.value)), [raw]);
  const [axisTab, setAxisTab] = useState(dataset.axisTabs.length - 1);
  const [subregionTab, setSubregionTab] = useState(0);

  const result = useMemo(() => computeCollaboration(dataset, applied), [dataset, applied]);
  /* Lists of options with products (F75, D-178), from the works that pass the filters. */
  const available = useMemo(() => timed("options", () => workOptionAvailability(dataset, applied)), [dataset, applied]);
  /* Note of the groups (F60, D-160): the figures come from `registro_grupos` of the bundle, as in Board 3 (F54). */
  const registry = useMemo(() => groupRegistry(raw, isMock), [raw, isMock]);
  /* Figures of the notes from the bundle (F69): appropriation without year and foci of the Misión de sabios. */
  const appropriationRecords = useMemo(() => {
    const list = raw.works.filter((w) => w[1] === WORK_TYPE.APPROPRIATION);
    return { total: list.length, withoutYear: list.filter((w) => !w[0]).length };
  }, [raw]);
  const missionFoci = useMemo(() => raw.thesaurus.ejes.filter((e) => e.agenda === "Misión de sabios 2019").length, [raw]);

  /* Colours by series label (from palette.js). */
  const typeColors = useMemo(() => Object.fromEntries(raw.tipos.map((t, i) => [t, COLLAB_TYPE_COLORS[i]])), [raw]);
  const trendColors = useMemo(() => ({ ...typeColors, [PATENT_SERIES_LABEL]: COLLAB_PATENT_COLOR, "Proyectos (inicio)": COLLAB_TYPE_COLORS[4] }), [typeColors]);
  const sectorColors = useMemo(() => Object.fromEntries(raw.sectors.map((s, i) => [raw.sectorsEs[i], SECTOR_COLORS[s]])), [raw]);
  const nonAcademicColors = useMemo(() => Object.fromEntries(NON_ACADEMIC_SECTORS.map((s) => [raw.sectorsEs[dataset.sectorIndex[s]], SECTOR_COLORS[s]])), [raw, dataset]);
  const sideColors = useMemo(() => ({ [SIDE_LABELS.north]: NORTH_SOUTH_COLORS.north, [SIDE_LABELS.south]: NORTH_SOUTH_COLORS.south }), []);
  const rankingColors = useMemo(() => ({ Subcampos: RANKING_COLOR }), []);

  /* Each chart receives a value that keeps its reference while its content does not change. */
  const transdisciplinary = useStableValue(
    result.transdisciplinary.map((r) => ({ label: r.label, detail: `${r.value} subcampos · ${r.fields} campos · ${r.articles} artículos`, segments: [SEGMENT("Subcampos", r.value)] })),
  );
  const organizations = useStableValue(
    result.organizations.map((r) => ({ label: r.label + (r.verify ? " (verificar)" : ""), segments: raw.tipos.map((t, i) => SEGMENT(t, r.byType[i])) })),
  );
  const sectorValues = useStableValue(result.sectors.map((s) => s.value));
  const sectorLabels = useStableValue(result.sectors.map((s) => s.label));
  const sectorDonutColors = useStableValue(result.sectors.map((s) => SECTOR_COLORS[s.sector]));
  const years = useStableValue(result.years);
  const trendArticles = useStableValue(result.trendArticles);
  const trendOthers = useStableValue(result.trendOthers);
  const regions = useStableValue(result.regions.map((r) => ({ label: r.label, segments: [SEGMENT(r.north ? SIDE_LABELS.north : SIDE_LABELS.south, r.value)] })));
  /* Countries of the panel 10 (F79): the choropleth and the table read the same list. */
  const world = useStableValue(result.countries.map((c) => ({ c: c.c, n: c.n, r: c.r, value: c.value })));
  const worldTable = useStableValue(result.countries.slice(0, LIMITS.countriesTable).map((c) => ({ name: c.n, region: c.r, value: c.value })));
  const axisRows = useMemo(() => result.axisRows(axisTab).map((r) => ({ label: r.label, segments: NON_ACADEMIC_SECTORS.map((s) => SEGMENT(raw.sectorsEs[dataset.sectorIndex[s]], r.counts[s])) })), [result, axisTab, raw, dataset]);
  const axisRowsStable = useStableValue(axisRows);
  const domainRows = useStableValue(useMemo(() => result.domainRows(domainTab), [result, domainTab]));
  const subregionCounts = useStableValue(useMemo(() => result.subregionCounts(subregionTab), [result, subregionTab]));
  const departments = useStableValue(result.departments);
  const subregionRows = useStableValue(subregionRowsFromObject(subregionCounts));
  /* Notice of the board: with the data of the API every figure is calculated (Q57, provisional). */
  const notice = useMemo(() => {
    if (isMock) return NOTICE;
    const appropriation = raw.works.filter((w) => w[1] === WORK_TYPE.APPROPRIATION);
    return realNotice({
      documentsWithTerms: raw.thesaurus.agendas.length,
      documents: POLICY_DOCUMENTS.length,
      appropriationWithoutYear: appropriation.filter((w) => !w[0]).length,
      appropriation: appropriation.length,
    });
  }, [isMock, raw]);
  /* Q-15 (F90, B144): the normalised name is shown; the original name of the source goes in the tooltip. */
  const funders = useMemo(
    () => funderRows(result.funders, raw.ext && raw.ext.nombres_originales, (f) => raw.sectorsEs[dataset.sectorIndex[f.fsector]]),
    [raw, dataset, result],
  );

  /* Centres of the graph in colour order (first appearance among the nodes). */
  const graphCenters = useStableValue([...new Set(result.graph.nodes.map((n) => n.center))].filter((c) => c >= 0));
  const graph = useStableValue(result.graph);
  const kpis = useStableValue(result.kpis);
  const h = result.helices;
  /* Axis chosen (F59): the cards of projects do not answer to it and say so. */
  const axis = result.axis;
  /* The projects answer to the axis through the pairs of B121 (F59b); a bundle without them says so. */
  const noProj = !!axis && !axis.projectsRespond;
  const smallProjects = !!axis && axis.projectsRespond && result.sample.projects < SMALL_SAMPLE;
  const helices = useStableValue([
    { label: "artículos UdeA + empresa + gobierno", value: h.triple, detail: dataset.flaggedInstitution >= 0 ? `${fmt(h.tripleWithoutFlagged)} sin contar Alcaldía de Medellín` : undefined },
    { label: "proyectos con empresa y fondos públicos", value: h.tripleProjects, detail: noProj ? NO_AXIS_RESPONSE : undefined },
    result.hasPatents
      ? { label: "patentes con empresa como cotitular", value: h.patentsWithCompany, detail: axis ? NO_AXIS_RESPONSE : `${fmt(h.patents)} patentes en la selección` }
      : { label: "patentes con empresas", value: "s. d.", detail: "sin patentes en la base" },
    { label: "artículos con empresa", value: h.withCompany },
    { label: "artículos con gobierno", value: h.withGovernment },
    { label: "artículos con hospitales/clínicas", value: h.withHealthcare },
  ]);
  const quadruple = useStableValue([
    { label: "artículos UdeA + empresa + ONG + gobierno", value: h.quadruple },
    { label: "proyectos con empresa, ONG y fondos públicos", value: h.quadrupleProjects, detail: noProj ? NO_AXIS_RESPONSE : undefined },
    h.appropriationSectorData || !h.appropriationTotal
      ? { label: "apropiación social con empresa u ONG", value: h.appropriationWithCompanyOrNonprofit, detail: `${fmt(h.appropriationTotal)} productos de apropiación en el filtro` }
      : { label: "apropiación social con empresa u ONG", value: "s. d.", detail: `${NO_SECTOR_DATA} · ${fmt(h.appropriationTotal)} productos de apropiación en el filtro` },
    { label: "artículos con sin ánimo de lucro", value: h.withNonprofit },
    { label: "artículos gobierno + ONG", value: h.governmentNonprofit },
    { label: "artículos empresa + ONG", value: h.companyNonprofit },
  ]);
  const iap = result.iap;
  const iapStats = useStableValue([
    { label: "productos que mencionan IAP en el título", value: iap.works, detail: `${fmt(iap.articles)} artículos · ${fmt(iap.chapters)} capítulos` },
    { label: "proyectos que mencionan IAP", value: iap.projects, detail: noProj ? NO_AXIS_RESPONSE : undefined },
  ]);
  const northSouth = useStableValue([
    { label: "productos Sur–Norte", value: result.northSouth.north },
    { label: "productos Sur–Sur", value: result.northSouth.south },
  ]);

  const departmentCounts = departments;

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">{BOARD_EYEBROW}</Typography.Text>
        <Typography.Title level={2} style={{ marginTop: 4 }}>{BOARD_TITLE}</Typography.Title>
        <Typography.Paragraph>{BOARD_LEAD}</Typography.Paragraph>
        <TagRow>
          <Tag color="gold">{isMock ? MOCK_TAG : REAL_TAG}</Tag>
          {POLICY_DOCUMENTS.map((d) => <Tag key={d}>{d}</Tag>)}
        </TagRow>
        <Alert type="info" showIcon message="Ensayo con limitaciones de datos" description={notice} style={{ marginBottom: 8 }} />
        <Collapse ghost items={[{ key: "goals", label: `Ver las ${raw.metas.length} metas de colaboración que los documentos de política asignan a este tablero`, children: <GoalsTable goals={raw.metas} /> }]} />
      </header>

      <Profiler id="filters" onRender={profileRender}>
        <FiltersBar dataset={dataset} filters={draft} onChange={update} onReset={reset} available={available} />
      </Profiler>
      {pending ? <Typography.Text type="secondary">Actualizando…</Typography.Text> : null}
      <KpiRow kpis={kpis} projectDetail={noProj ? NO_AXIS_RESPONSE : ""} />

      {registry ? (
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 6 }} data-testid="official-groups-note">
          {officialGroupsNote(raw.groups.length, registry)}
        </Typography.Text>
      ) : null}
      <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
        <Col xs={24} xl={12}>
          <ChartCard title="1 · Transdisciplinariedad grupal" empty={!transdisciplinary.length}>
            <SegmentedBarsChart rows={transdisciplinary} colors={rankingColors} labelSize={40} />
            <Note>{NOTES.v1}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="2 · Grafo de colaboración entre grupos" empty={!graph.nodes.length}>
            <CollabGraph graph={graph} centers={graphCenters} centerNames={raw.centros} />
            <Note>{NOTES.v2}</Note>
            {axis && result.sample.graph < SMALL_SAMPLE ? <Note>{smallSampleNote(result.sample.graph)}</Note> : null}
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard title="3 · Organizaciones no académicas con las que coopera la UdeA" empty={!organizations.length}>
            <SegmentedBarsChart rows={organizations} colors={typeColors} labelSize={40} legend unit="productos" />
            <Note>{NOTES.v3}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="4 · Productos por sector no académico" empty={!sectorValues.length}>
            <DonutChart labels={sectorLabels} values={sectorValues} colors={sectorDonutColors} />
            <Note>{NOTES.v4}</Note>
          </ChartCard>
        </Col>

        <Col xs={24} xl={12}>
          <ChartCard title="5a · Tendencia de artículos">
            <TrendLinesChart years={years} series={trendArticles} colors={trendColors} />
            <Note>{NOTES.v5}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="5b · Tendencia de libros, capítulos, apropiación social y proyectos">
            <TrendLinesChart years={years} series={trendOthers} colors={trendColors} />
            <Note>{`${NOTES.v5b} ${appropriationYearNote(appropriationRecords.withoutYear, appropriationRecords.total)}`}</Note>
            {result.hasPatents ? <Note data-testid="patents-last-year-note">{NOTES.v5bPatents(result.patentsLastYear)}</Note> : null}
            {result.hasPatents && result.patentsIgnored.length ? <Note data-testid="patents-ignored-note">{patentsIgnoredNote(result.patentsIgnored)}</Note> : null}
            {noProj ? <Note>La línea de proyectos {NO_AXIS_RESPONSE}.</Note> : null}
            {smallProjects ? <Note>{smallProjectsNote(result.sample.projects)}</Note> : null}
          </ChartCard>
        </Col>

        <Col xs={24} xl={8}>
          <ChartCard title="6 · Colaboraciones de triple hélice">
            <StatTiles stats={helices} />
            <Note>{result.hasPatents ? NOTES.v6Patents : NOTES.v6}</Note>
            {result.hasPatents && result.patentsIgnored.length ? <Note data-testid="patents-ignored-note-06">{patentsIgnoredNote(result.patentsIgnored)}</Note> : null}
            {axis && result.sample.helices < SMALL_SAMPLE ? <Note>{smallSampleNote(result.sample.helices)}</Note> : null}
          </ChartCard>
        </Col>
        <Col xs={24} xl={8}>
          <ChartCard title="7 · Colaboraciones de cuádruple hélice">
            <StatTiles stats={quadruple} />
            <Note>{NOTES.v7}</Note>
            {h.appropriationTotal && !h.appropriationSectorData ? <Note data-testid="no-sector-data-note">{NO_SECTOR_DATA_NOTE}</Note> : null}
            {axis && result.sample.helices < SMALL_SAMPLE ? <Note>{smallSampleNote(result.sample.helices)}</Note> : null}
          </ChartCard>
        </Col>
        <Col xs={24} xl={8}>
          <ChartCard title="8 · Investigación acción participativa">
            <StatTiles stats={iapStats} />
            <Note>{NOTES.v8}</Note>
            {noProj ? <Note>Los proyectos {NO_AXIS_RESPONSE}.</Note> : null}
            {smallProjects ? <Note>{smallProjectsNote(result.sample.projects)}</Note> : null}
          </ChartCard>
        </Col>

        <Col xs={24} lg={12} xl={12}>
          <ChartCard title="9 · Colaboración interdepartamental">
            <DepartmentMap departments={departmentCounts} />
            <Note>{NOTES.v9}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12} xl={12}>
          <ChartCard title="9b · Capacidades por subregión de Antioquia">
            <Segmented size="small" block options={TAB_OPTIONS(SUBREGION_TABS)} value={subregionTab} onChange={setSubregionTab} style={{ marginBottom: 8 }} />
            <SubregionMap rows={subregionRows} unit={subregionTab < 2 ? "Proyectos" : "Productos"} />
            <Note>{NOTES.v15}{noProj && subregionTab < 2 ? ` Los proyectos ${NO_AXIS_RESPONSE}.` : ""}</Note>
            {smallProjects && subregionTab < 2 ? <Note>{smallProjectsNote(result.sample.projects)}</Note> : null}
          </ChartCard>
        </Col>
        {/* F69 (T2-01): panel 10 next to 11·12, as in the artifact. */}
        <Col xs={24} xl={16}>
          <ChartCard title="10 · Colaboración internacional" empty={!world.length}>
            <Row gutter={[12, 12]}>
              <Col xs={24} xl={14}><CountryMap countries={world} /></Col>
              <Col xs={24} xl={10}><CountriesTable rows={worldTable} /></Col>
            </Row>
            <Note>{NOTES.v10}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={8}>
          <ChartCard title="11 · 12 · Sur–Norte y Sur–Sur">
            <StatTiles stats={northSouth} />
            <SegmentedBarsChart rows={regions} colors={sideColors} labelSize={30} legend unit="productos" />
            <Note>{NOTES.v11}</Note>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <ChartCard title="13 · Grupos de investigación con actores no académicos, por dominio de conocimiento">
            <Segmented size="small" options={domainTabs} value={domainTab} onChange={setDomainTab} style={{ marginBottom: 8 }} />
            <DomainTable rows={domainRows} />
            <Note>{NOTES.v13}</Note>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <ChartCard title="14 · Ejes Temáticos públicos por tipo de organización" empty={!axisRowsStable.length}>
            <Segmented size="small" options={TAB_OPTIONS(dataset.axisTabs.map((t) => t.label))} value={axisTab} onChange={setAxisTab} style={{ marginBottom: 8 }} />
            <SegmentedBarsChart rows={axisRowsStable} colors={nonAcademicColors} labelSize={70} legend unit="productos" />
            <Note>{`${NOTES.v14} ${missionFociNote(missionFoci)}`}</Note>
            {axis ? <Note data-testid="axis-14-note">{AXIS_14_NOTE}</Note> : null}
          </ChartCard>
        </Col>

        <Col xs={24}>
          <ChartCard title="15 · Entidades que financian o cofinancian proyectos (no académicas)">
            <SegmentedBarsChart rows={funders} colors={sectorColors} labelSize={70} legend unit="proyectos" />
            <Note>{result.fundersByProject ? NOTES.v16Filtered : `${NOTES.v16}${axis ? ` ${NO_AXIS_RESPONSE[0].toUpperCase()}${NO_AXIS_RESPONSE.slice(1)}.` : ""}`}</Note>
          </ChartCard>
        </Col>

        <Col xs={24}>
          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>{isMock ? FOOTER_TEXT : REAL_FOOTER_TEXT}</Typography.Paragraph>
        </Col>
      </Row>
      <CutoffNote />
    </div>
  );
}
