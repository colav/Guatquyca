"use client";

/* Hooks */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* Components */
import ChartCard from "@/app/observatories/components/ChartCard";
import { groupRegistry, officialActiveGroupsNote, officialGroupsNote } from "@/lib/observatories/officialGroups";
import CompactTable from "@/app/observatories/components/CompactTable";
import KpiCard from "@/app/observatories/components/KpiCard";
import DonutChart from "@/app/observatories/components/DonutChart";
import CutoffNote from "@/app/observatories/components/CutoffNote";
import FiltersBar from "./FiltersBar";
import PropertyCard from "./PropertyCard";
import { Note } from "../../board-2/components/Board2Parts";
import { AreasTreemapChart, ArtsScatterChart, BubbleGridChart, HBarsChart, LinesChart, StackedBarsChart } from "./Charts";

/* lib */
import {
  AGE_GROUPS,
  CONTRACTS,
  DEFAULT_FOUNDATIONS_FILTERS,
  FOUNDATIONS_FILTER_DEBOUNCE_MS,
  GROUP_CATEGORIES,
  OECD_AREAS,
  PRODUCT,
  STUDENT_LEVELS,
  TYPE,
  computeFoundations,
  computePropertyAssets,
  parseFoundationsFilters,
  sameFoundationsFilters,
  serializeFoundationsFilters,
} from "@/lib/observatories/foundations";
import { MOCK_SOURCE } from "@/lib/observatories/data/artifactAdapter";
import { loadBoard3Dataset } from "@/lib/observatories/data/capacidadesAdapter";
import LoadError from "@/app/observatories/components/LoadError";
import { BRAND, FOUNDATIONS_COLORS } from "@/lib/observatories/palette";
import { useStableValue } from "@/app/observatories/components/useStableValue";
import { useUrlFilters } from "@/app/observatories/components/useUrlFilters";

/* Texts */
import {
  ACCESS_LABELS,
  BOARD_EYEBROW,
  BOARD_LEAD,
  BOARD_TITLE,
  FOOTER_TEXT,
  MOCK_TAG,
  linkageNote,
  AREAS_NOTE,
  AREAS_NOTE_MOCK,
  ARTS_LEVEL_NOTE,
  ARTS_TITLE_CONTRACT,
  ARTS_TITLE_LEVEL,
  ACCESS_PIE_TITLE,
  PIE_CLASSES_LABELS,
  PIE_CLASSES_TITLE,
  PID_NOTE,
  pieNote,
  PROXY_LABEL,
  REAL_FOOTER_TEXT,
  REAL_STAFF_LABEL,
  REAL_TAG,
  SECTIONS,
  SEX_SERIES,
  STAFF_LABEL,
  TALENT_LEVEL_LABELS,
  TALENT_LEVEL_TITLE,
  TALENT_MINCIENCIAS_TITLE,
  TALENT_VIEWS,
  TILE_LABELS,
  talentLevelNote,
  talentMincienciasNote,
} from "./boardTexts";
import { POLICY_DOCUMENTS } from "../../board-1/components/boardTexts";

/* UI Library Components */
import { Col, Collapse, Divider, Row, Segmented, Skeleton, Statistic, Tag, Typography } from "antd";

/* Constants */
const fmt = (n) => Number(n).toLocaleString("es-CO");
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1).replace(".", ",")} %` : "–");
const dens = (v, population) => ((100000 * v) / population).toFixed(1).replace(".", ",");
const URL_FILTERS = {
  defaults: DEFAULT_FOUNDATIONS_FILTERS,
  parse: parseFoundationsFilters,
  serialize: serializeFoundationsFilters,
  same: sameFoundationsFilters,
  debounceMs: FOUNDATIONS_FILTER_DEBOUNCE_MS,
};
const { series: SERIES, sex: SEX_COLORS, contracts: CONTRACT_COLORS, bars: BAR_COLORS } = FOUNDATIONS_COLORS;
const colorMap = (names, colors) => Object.fromEntries(names.map((n, i) => [n, colors[i % colors.length]]));
const STUDENT_COLORS = colorMap(STUDENT_LEVELS, SERIES);
const AGE_COLORS = colorMap(AGE_GROUPS, SERIES);
const AREA_COLORS = colorMap(OECD_AREAS, SERIES);
const CONTRACT_COLOR_MAP = colorMap(CONTRACTS, CONTRACT_COLORS);
const SEX_COLOR_MAP = { [SEX_SERIES[1]]: SEX_COLORS.male, [SEX_SERIES[2]]: SEX_COLORS.female, [SEX_SERIES[0]]: SEX_COLORS.noData };
const ID_SERIES = ["Con identificador", "Sin identificador"];
const ID_COLORS = { "Con identificador": FOUNDATIONS_COLORS.identifiers.with, "Sin identificador": FOUNDATIONS_COLORS.identifiers.without };
const REPO_SERIES = ["Productos (artículos, libros, capítulos)", "Con texto completo en repositorio"];
const REPO_COLORS = { [REPO_SERIES[0]]: FOUNDATIONS_COLORS.repository.total, [REPO_SERIES[1]]: FOUNDATIONS_COLORS.repository.inRepository };

/**
 * Board 3 · Capacidades de base del sistema. Loads the dataset through the adapter; all the
 * computation lives in lib/observatories/foundations (pure functions).
 */
export default function Board3() {
  const [state, setState] = useState({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  /* `?source=mock` reads the local test data instead of the API (not shown in the interface). */
  const source = useSearchParams().get("source") === MOCK_SOURCE ? MOCK_SOURCE : "api";

  useEffect(() => {
    const controller = new AbortController();
    loadBoard3Dataset({ signal: controller.signal, source })
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
  return <Board3Content dataset={state.dataset} source={state.source} />;
}

/** Row of summary tiles. */
function Tiles({ tiles, staffLabel }) {
  return (
    <Row gutter={[12, 12]}>
      {TILE_LABELS.map(([key, label]) => [key, key === "staff" ? `profesores (${staffLabel})` : label]).map(([key, label]) => (
        <Col key={key} xs={12} md={8} lg={6} xl={3}>
          <KpiCard label={label} value={fmt(tiles[key])} />
        </Col>
      ))}
    </Row>
  );
}

function Board3Content({ dataset, source }) {
  const { raw } = dataset;
  const isMock = source === MOCK_SOURCE;
  /* Totals of the registry of groups: from the bundle (B105); with the test data, the constant; without them, no note. */
  const registry = useMemo(() => groupRegistry(raw, isMock), [raw, isMock]);
  const staffLabel = isMock ? STAFF_LABEL : REAL_STAFF_LABEL;
  const { draft, applied, pending, update, reset } = useUrlFilters(URL_FILTERS);
  const result = useMemo(() => computeFoundations(dataset, applied), [dataset, applied]);

  /* Card 11b (F58): the key `pi` of the bundle; without it (test data) the card is not drawn. */
  const [piView, setPiView] = useState("unit");
  const piResult = useMemo(() => computePropertyAssets(dataset, applied), [dataset, applied]);
  const pi = useStableValue(piResult);
  const tiles = useStableValue(result.tiles);
  const status = result.status;
  const talent = result.talent;
  const students = useStableValue(result.students);
  /* Institutions with a name and those that the name rules classify as companies (from the data, F36). */
  const instStats = useMemo(() => ({ institutions: raw.inst.filter((i) => i[0]).length, companies: raw.inst.filter((i) => i[2] === "empresa").length }), [raw]);
  const datasets = useStableValue(result.datasets);
  const areas = useStableValue(result.areas);
  const groupGrid = useStableValue(result.groupGrid);
  const appropriation = useStableValue(result.appropriation);
  /* Records of social appropriation and the ones without year, from the bundle (F69: no fixed figures in the texts). */
  const appropriationRecords = useMemo(() => {
    const list = raw.P.filter((p) => p[PRODUCT.TYPE] === TYPE.APPROPRIATION);
    return { total: list.length, withoutYear: list.filter((p) => !p[PRODUCT.YEAR]).length };
  }, [raw]);
  const company = useStableValue(result.company);
  const repository = useStableValue(result.repository);
  const openAccess = useStableValue(result.openAccess);
  const staffByType = useStableValue(result.staffByType);
  const ageByYear = useStableValue(result.ageByYear);
  const sexByYear = useStableValue(result.sexByYear);
  const ageByTopic = useStableValue(result.ageByTopic);
  const pid = useStableValue(result.pid);
  const theses = useStableValue(result.theses);
  const arts = useStableValue(result.arts);
  const creation = result.creation;

  /* Rows for the bar charts. */
  /* Panel 01 by level of education (F71): the bundle carries it in talent.ext.por_nivel_academico; without it, the Minciencias category. */
  const levels = talent.ext && talent.ext.por_nivel_academico ? talent.ext.por_nivel_academico : null;
  const [talentView, setTalentView] = useState("level");
  const levelRows = useMemo(() => {
    if (!levels) return [];
    const L = TALENT_LEVEL_LABELS;
    const medical = levels["especialización médico-quirúrgica"] || 0;
    const other = levels["especialización"] || 0;
    const rows = [
      [L.doctorado, levels["doctorado"] || 0, ""],
      [L.maestria, levels["maestría"] || 0, ""],
      [L.especializacion, medical + other, ` · ${fmt(medical)} médico-quirúrgica y ${fmt(other)} otra especialización`],
      [L.profesional, levels["profesional"] || 0, ""],
      [L.sinDato, levels["Sin dato"] || 0, ""],
    ];
    return rows.map(([label, value, extra]) => ({
      label,
      value,
      text: `${fmt(value)} · ${dens(value, talent.poblacion_ajustada)}/100k`,
      detail: `${dens(value, talent.poblacion_ajustada)} por 100.000 hab. (ajustada) · ${dens(value, talent.poblacion_censada)} (censada)${extra}`,
    }));
  }, [levels, talent]);
  const talentRows = useMemo(() => {
    const mc = talent.por_minciencias;
    const groups = [
      ["Investigador Emérito", mc["Investigador Emérito"] || 0],
      ["Investigador Sénior", mc["Investigador Sénior"] || 0],
      ["Investigador Asociado", mc["Investigador Asociado"] || 0],
      ["Investigador Junior", mc["Investigador Junior"] || 0],
      ["Otras siglas (IVM, ED, IVD…)", Object.entries(mc).filter(([k]) => !/Investigador|Sin/.test(k)).reduce((a, [, v]) => a + v, 0)],
      ["Sin categoría", mc["Sin categoría"] || 0],
    ];
    return groups.map(([label, value]) => ({
      label,
      value,
      text: `${fmt(value)} · ${dens(value, talent.poblacion_ajustada)}/100k`,
      detail: `${dens(value, talent.poblacion_ajustada)} por 100.000 hab. (ajustada) · ${dens(value, talent.poblacion_censada)} (censada)`,
    }));
  }, [talent]);
  const datasetRows = useMemo(() => datasets.rows.map((r) => ({ label: r.label, value: r.value, text: `${r.value} · ${r.staff} prof. · ${r.faculties} und.`, detail: `${r.staff} profesores · ${r.faculties} unidades` })), [datasets]);
  const facultyRows = (rows) => rows.map((r) => ({ label: r.label, value: r.value, text: `${r.value} · ${pct(r.value, r.total)}`, detail: `${r.value} de ${r.total} (${pct(r.value, r.total)})` }));
  const appropriationRows = useMemo(() => facultyRows(appropriation.rows), [appropriation]);
  const companyRows = useMemo(() => facultyRows(company.rows), [company]);
  const staffTypeRows = useMemo(() => staffByType.map((r) => ({ label: r.label, values: r.values })), [staffByType]);
  const ageTopicRows = useMemo(() => ageByTopic.map((r) => ({ label: r.label, values: r.values })), [ageByTopic]);
  const pidRows = useMemo(() => pid.map((r) => ({ label: r.label, values: [r.withId, r.withoutId] })), [pid]);
  const projectsGroupRows = useMemo(() => arts.projectsByGroup.map((r) => ({ label: r.label, value: r.value })), [arts]);
  /* The column of projects is hidden while it is 0 in every unit (the bundle does not carry the name of the project yet; M4, F50). */
  const creationHasProjects = arts.creationByFaculty.some((r) => r.projects > 0);
  const creationRows = useMemo(
    () => arts.creationByFaculty.map((r) => (creationHasProjects
      ? { label: r.label, value: r.works, text: `${r.projects} proy. · ${r.works} obras · ${r.people} pers.`, detail: `${r.projects} proyectos · ${r.people} personas` }
      : { label: r.label, value: r.works, text: `${r.works} obras · ${r.people} pers.`, detail: `${r.people} personas` })),
    [arts, creationHasProjects],
  );
  const sexSeries = useMemo(() => sexByYear.series.map((s) => ({ label: SEX_SERIES[s.sex], values: s.values })), [sexByYear]);

  const withBirthPct = pct(ageByYear.withBirthYear, ageByYear.authors);
  const goals = raw.metas;

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <Typography.Text type="secondary">{BOARD_EYEBROW}</Typography.Text>
        <Typography.Title level={2} style={{ marginTop: 4 }}>{BOARD_TITLE}</Typography.Title>
        <Typography.Paragraph>{BOARD_LEAD}</Typography.Paragraph>
        <div style={{ marginBottom: 8 }}>
          <Tag color="gold">{isMock ? MOCK_TAG : REAL_TAG}</Tag>
          {POLICY_DOCUMENTS.map((d) => <Tag key={d}>{d}</Tag>)}
        </div>
        <Collapse
          ghost
          items={[
            {
              key: "goals",
              label: `Ver las ${goals.length} metas sobre capacidades de base que los documentos de política asignan a este tablero`,
              children: (
                <CompactTable
                  
                  scroll={{ y: 360 }}
                  rowKey={(r) => `${r.agenda}|${r.cod}`}
                  dataSource={goals}
                  columns={[
                    { title: "Documento", dataIndex: "agenda" },
                    { title: "Código", dataIndex: "cod", width: 90 },
                    { title: "Meta, reto o programa", dataIndex: "titulo" },
                  ]}
                />
              ),
            },
          ]}
        />
      </header>

      <FiltersBar raw={raw} centerCoverage={dataset.centerCoverage} filters={draft} onChange={update} onReset={reset} />
      <Typography.Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
        {`${fmt(status.products)} productos · ${fmt(status.authors)} autores UdeA · ${fmt(status.staff)} profesores (${staffLabel}) · ${fmt(status.groups)} grupos · ${status.yearFrom}–${status.yearTo}`}
        {pending ? " · Actualizando…" : ""}
      </Typography.Text>
      <Tiles tiles={tiles} staffLabel={staffLabel} />
      {registry ? (
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 12, marginTop: 6 }} data-testid="official-groups-note">
          {officialGroupsNote(raw.groups.length, registry)}
        </Typography.Text>
      ) : null}

      <Divider orientation="left">{SECTIONS.researchers}</Divider>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={12}>
          <ChartCard title={isMock ? "01 · Talento investigador por nivel (proxy)" : levels && talentView === "level" ? TALENT_LEVEL_TITLE : TALENT_MINCIENCIAS_TITLE}>
            {isMock ? <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{PROXY_LABEL}</Tag> : null}
            <Row gutter={[8, 8]} style={{ marginBottom: 8 }}>
              {[
                [fmt(talent.staff_total), "profesores con contrato · agregado UdeA"],
                [dens(talent.staff_total, talent.poblacion_ajustada), `por 100.000 hab. (población ajustada ${fmt(talent.poblacion_ajustada)})`],
                [dens(talent.staff_total, talent.poblacion_censada), `por 100.000 hab. (población censada ${fmt(talent.poblacion_censada)})`],
                ...(talent.inv_sheet.personas > 0
                  ? [[fmt(talent.inv_sheet.personas), `investigadores en grupos (conv. 894) · ${dens(talent.inv_sheet.personas, talent.poblacion_ajustada)} por 100.000 hab.`]]
                  : []),
              ].map(([value, label]) => (
                <Col key={label} xs={12}>
                  <KpiCard label={label} value={value} valueFontSize={18} />
                </Col>
              ))}
            </Row>
            {!isMock && levels ? <Segmented size="small" options={TALENT_VIEWS} value={talentView} onChange={setTalentView} data-testid="talent-view" style={{ marginBottom: 8 }} /> : null}
            <HBarsChart rows={!isMock && levels && talentView === "level" ? levelRows : talentRows} color={SERIES[0]} unit="Profesores" />
            <Note>
              {isMock
                ? `No existe campo de nivel de formación en las bases; abajo, la categoría Minciencias de los profesores con contrato y su densidad por 100.000 habitantes (población ajustada). Pendiente: incorporar nivel de formación desde la base de talento humano. Planta 2021-2: ${fmt(talent.planta_2021.total)} docentes, edad media ${talent.planta_2021.edad_media.toFixed(1).replace(".", ",")} años; ${fmt(talent.planta_2021.por_edad["65+"])} de 65 años o más. Este panel no responde a los filtros.`
                : (levels && talentView === "level" ? talentLevelNote : (staff, planta) => talentMincienciasNote(planta))(fmt(talent.staff_total), `Planta vigente: ${fmt(talent.planta_2021.total)} docentes, edad media ${talent.planta_2021.edad_media.toFixed(1).replace(".", ",")} años; ${fmt(talent.planta_2021.por_edad["65+"])} de 65 años o más.`)}
            </Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="02 · Investigadores activos vinculados a grupos, por gran área OCDE" empty={!areas.items.some((i) => i.value > 0)}>
            <AreasTreemapChart items={areas.items} colors={AREA_COLORS} />
            <Note>{(isMock ? AREAS_NOTE_MOCK : AREAS_NOTE)(fmt(areas.active), areas.from, linkageNote(talent.inv_sheet))}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="03 · Grupos activos por área OCDE y categoría Minciencias" empty={!groupGrid.cells.length}>
            <BubbleGridChart cells={groupGrid.cells} areas={OECD_AREAS} categories={GROUP_CATEGORIES} colors={AREA_COLORS} />
            <Note>{`${fmt(groupGrid.total)} grupos activos${applied.centerIndex >= 0 ? ` del centro ${raw.centros[applied.centerIndex]}` : ""}. Con otros filtros se muestran solo los grupos con producción en la selección.${registry && sameFoundationsFilters(applied, DEFAULT_FOUNDATIONS_FILTERS) ? ` ${officialActiveGroupsNote(groupGrid.total, registry)}.` : ""}`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="04 · Autores únicos por grupo etario">
            <LinesChart years={ageByYear.years} series={ageByYear.series} colors={AGE_COLORS} unit="Autores" />
            <Note>{`Cobertura parcial: ${fmt(ageByYear.withBirthYear)} de ${fmt(ageByYear.authors)} autores con fecha de nacimiento (${withBirthPct}); la caída de 2026 es por año incompleto.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="05 · Autores únicos por sexo">
            <LinesChart years={sexByYear.years} series={sexSeries} colors={SEX_COLOR_MAP} unit="Autores" />
            <Note>{`${fmt(sexByYear.withSex)} de ${fmt(sexByYear.authors)} autores con sexo registrado (${pct(sexByYear.withSex, sexByYear.authors)}). Entre los profesores con contrato la cobertura es casi completa.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="06 · Investigadores por grupo etario y tópico (15 tópicos con más investigadores)" empty={!ageTopicRows.length}>
            <StackedBarsChart rows={ageTopicRows} series={AGE_GROUPS} colors={AGE_COLORS} unit="Autores" />
            <Note>Misma cobertura parcial de edad que el panel 4.</Note>
          </ChartCard>
        </Col>
      </Row>

      <Divider orientation="left">{SECTIONS.students}</Divider>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={12}>
          <ChartCard title="07 · Estudiantes en proyectos por nivel">
            <LinesChart years={students.years} series={students.series} colors={STUDENT_COLORS} unit="Personas" />
            <Note>{`${fmt(students.uniqueStudents)} estudiantes únicos en ${fmt(students.projects)} proyectos (SIIU, 2014–2025). ${students.byCenter ? `Filtrado por centro gestor «${raw.centros[applied.centerIndex]}».` : "Responde solo al filtro de centro y temporalidad."} ${isMock ? " 2025 es parcial (corte 3 jul 2025)." : ""}`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="08 · Tesis de maestría, doctorado y especialidad por año">
            <LinesChart years={theses.years} series={theses.series} colors={colorMap(theses.series.map((s) => s.label), SERIES)} unit="Tesis" />
            <Note>{`${fmt(theses.totals[0])} tesis de doctorado, ${fmt(theses.totals[1])} de maestría o especialidad clínica y ${fmt(theses.totals[2])} monografías de especialización en la selección. SCIENTI no separa maestría de especialidad clínica; la serie de Minciencias («Tesis de maestria») termina en 2020 y la de SCIENTI crece desde 2021, por lo que la curva combina dos fuentes. Las tesis registran como autor al director.`}</Note>
          </ChartCard>
        </Col>
      </Row>

      <Divider orientation="left">{SECTIONS.appropriation}</Divider>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={12}>
          <ChartCard title="10 · Profesores con productos de apropiación social, por unidad académica" empty={!appropriationRows.length}>
            <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{staffLabel}</Tag>
            <HBarsChart rows={appropriationRows} color={BAR_COLORS.appropriation} unit="Profesores" />
            <Note>{`${fmt(appropriation.staff)} profesores con apropiación social, sobre los profesores de la unidad con producción en la selección. ${fmt(appropriationRecords.withoutYear)} de los ${fmt(appropriationRecords.total)} registros de apropiación no tienen año; la unidad se infiere de la unidad más frecuente del autor.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="11 · Profesores con productos compartidos con empresas, por unidad académica" empty={!companyRows.length}>
            <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{staffLabel}</Tag>
            <HBarsChart rows={companyRows} color={BAR_COLORS.company} unit="Profesores" />
            <Note>{`${fmt(company.products)} productos con empresa (${fmt(company.staff)} profesores). La base no tiene tipo de organización: la clasificación por nombre identifica ${fmt(instStats.companies)} empresas entre ${fmt(instStats.institutions)} instituciones coautoras y requiere revisión manual.`}</Note>
          </ChartCard>
        </Col>
      </Row>

      {pi ? <PropertyCard pi={pi} view={piView} onView={setPiView} /> : null}

      <Divider orientation="left">{SECTIONS.arts}</Divider>
      <Row gutter={[12, 12]}>
        <Col xs={24} xl={12}>
          <ChartCard title={arts.byLevel ? ARTS_TITLE_LEVEL : ARTS_TITLE_CONTRACT} empty={!arts.points.length}>
            {arts.byLevel ? null : <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{PROXY_LABEL}</Tag>}
            <ArtsScatterChart points={arts.points} groups={arts.groups} colors={FOUNDATIONS_COLORS.arts} />
            <Note>{`${fmt(arts.professors)} profesores con al menos un producto artístico (${fmt(arts.linked)} vinculados, ${fmt(arts.occasional)} ocasionales). ${arts.byLevel ? ARTS_LEVEL_NOTE : "No hay nivel educativo en las bases; se usa el tipo de contrato."}${isMock ? " Parte de las personas de Productos de creación.xlsx se cruzó con la planta." : ""} No responde a los filtros.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="13 · Proyectos de los grupos del Centro de Investigación de Artes" empty={!projectsGroupRows.length}>
            <HBarsChart rows={projectsGroupRows} color={BAR_COLORS.artsProjects} unit="Proyectos" />
            <Note>{`${fmt(arts.projectsTotal)} proyectos de ${arts.projectsByGroup.length} grupos ${arts.uniqueProjects > 0 ? ` (${fmt(arts.uniqueProjects)} proyectos únicos; algunos tienen varios grupos)` : ""}. No responde a los filtros.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24}>
          <ChartCard title="14 · Unidades académicas en proyectos de investigación-creación, creación y obra" empty={!creationRows.length}>
            <HBarsChart rows={creationRows} color={BAR_COLORS.artsCreation} unit="Obras" />
            <Note>{`${arts.uniqueProjects > 0 ? `${fmt(arts.uniqueProjects)} proyectos de investigación distintos declarados en la base de creación ` : "Base de creación "}(${fmt(creation.registros)} registros, ${fmt(creation.obras)} obras, ${fmt(creation.personas)} personas)${isMock ? "; hay registros sin código de grupo en BD_Grupos" : ""}. No responde a los filtros.`}</Note>
          </ChartCard>
        </Col>
      </Row>

      <Divider orientation="left">{SECTIONS.openScience}</Divider>
      <Row gutter={[12, 12]}>
        <Col xs={24}>
          <ChartCard title="15 · Productos en repositorio frente al total, por año y dominio">
            <div style={{ marginBottom: 8 }}>
              {REPO_SERIES.map((s) => <Tag key={s} color={REPO_COLORS[s]} style={{ color: BRAND.text }}>{s}</Tag>)}
            </div>
            <Row gutter={[12, 12]}>
              {repository.domains.map((d) => (
                <Col key={d.domain} xs={24} md={12} xl={6}>
                  <Typography.Text strong>{d.domain}</Typography.Text>
                  <Typography.Text type="secondary">{` · ${fmt(d.repositorySum)} de ${fmt(d.totalSum)} en repositorio (${pct(d.repositorySum, d.totalSum)})`}</Typography.Text>
                  <LinesChart
                    years={repository.years}
                    series={[{ label: REPO_SERIES[0], values: d.total }, { label: REPO_SERIES[1], values: d.inRepository }]}
                    colors={REPO_COLORS}
                    unit="Productos"
                    height={200}
                    legend={false}
                  />
                </Col>
              ))}
            </Row>
            <Note>{`${fmt(repository.inRepository)} de ${fmt(repository.publications)} publicaciones en repositorio (${pct(repository.inRepository, repository.publications)}); el dato existe solo para los ${fmt(repository.known)} registros de OpenAlex. Los registros solo-SCIENTI (sin tópico) no tienen el campo.`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="16 · Conjuntos de datos abiertos por tópico" empty={!datasetRows.length}>
            <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{staffLabel}</Tag>
            <HBarsChart rows={datasetRows} color={BAR_COLORS.datasets} unit="Conjuntos de datos" />
            <Note>{`${fmt(datasets.total)} conjuntos (${pct(datasets.open, datasets.total)} abiertos) · ${datasets.staff} profesores · ${datasets.faculties} unidades. ${isMock ? " Sin tipos «dataset» en SCIENTI; parte de los registros tiene año 2026 (fecha de carga, no de creación)." : ""}`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="17 · Acceso abierto">
            <Row gutter={[12, 12]} align="top">
              <Col xs={24} md={12}>
                <Typography.Text strong>{ACCESS_PIE_TITLE}</Typography.Text>
                <DonutChart
                  labels={[ACCESS_LABELS.open, ACCESS_LABELS.closed, ACCESS_LABELS.noData]}
                  values={[openAccess.open, openAccess.closed, openAccess.noData]}
                  colors={[FOUNDATIONS_COLORS.openAccess.open, FOUNDATIONS_COLORS.openAccess.closed, FOUNDATIONS_COLORS.openAccess.noData]}
                />
              </Col>
              {openAccess.classes.preprints > 0 ? (
                <Col xs={24} md={12}>
                  <Typography.Text strong>{PIE_CLASSES_TITLE}</Typography.Text>
                  <DonutChart
                    labels={Object.values(PIE_CLASSES_LABELS)}
                    values={Object.keys(PIE_CLASSES_LABELS).map((k) => openAccess.classes[k])}
                    colors={Object.keys(PIE_CLASSES_LABELS).map((k) => FOUNDATIONS_COLORS.classes[k])}
                  />
                </Col>
              ) : null}
              <Col xs={24}>
                {[
                  [fmt(openAccess.open), `publicaciones en abierto (${pct(openAccess.open, openAccess.open + openAccess.closed)} de las que tienen dato)`],
                  [fmt(openAccess.datasetsOpen), `conjuntos de datos abiertos de ${fmt(openAccess.datasets)}`],
                  ...(openAccess.preprints > 0 ? [[fmt(openAccess.preprints), `preprints (marca de OpenAlex; ${fmt(openAccess.preprints - openAccess.preprintsFromPublications)} de otros tipos)`]] : []),
                  [fmt(openAccess.software), "software / código fuente registrado"],
                ].map(([value, label]) => (
                  <Statistic key={label} title={label} value={value} valueStyle={{ fontSize: 18 }} style={{ marginBottom: 8 }} />
                ))}
              </Col>
            </Row>
            <Note>{`Sin dato de acceso para ${fmt(openAccess.noData)} publicaciones que solo están en SCIENTI. Los repositorios de software de GitHub asociados a la UdeA no están en las bases entregadas y no se verificaron. Las patentes y demás propiedad intelectual están en la tarjeta 11b.${openAccess.classes.preprints > 0 ? ` ${pieNote(openAccess.preprintsFromPublications)}` : ""}`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="18 · Cobertura de identificadores persistentes (PID)">
            <StackedBarsChart rows={pidRows} series={ID_SERIES} colors={ID_COLORS} unit="Registros" />
            <CompactTable
              
              rowKey="label"
              dataSource={pid}
              columns={[
                { title: "Entidad", dataIndex: "label" },
                { title: "Con PID", dataIndex: "withId", render: fmt, align: "right" },
                { title: "Total", dataIndex: "total", render: fmt, align: "right" },
                { title: "%", render: (_, r) => pct(r.withId, r.total), align: "right" },
              ]}
            />
            <Note>{`${pid.some((r) => r.label.includes("Handle")) ? PID_NOTE : "No hay Handle en este conjunto de datos. Las organizaciones se identifican con ROR (9 caracteres) o con ids SCIENTI/SNIES sin ROR."} ${isMock ? "Hay DOI duplicados en works.csv." : "Los registros repetidos entre fuentes se pliegan en una sola obra."}`}</Note>
          </ChartCard>
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard title="c · Profesores por tipo de producto (sin artículos, libros ni capítulos)" empty={!staffTypeRows.length}>
            <Tag color="gold" style={{ marginBottom: 8, whiteSpace: "normal" }}>{staffLabel}</Tag>
            <StackedBarsChart rows={staffTypeRows} series={CONTRACTS} colors={CONTRACT_COLOR_MAP} unit="Profesores" />
            <Note>{`Productos de creación (Productos de creación.xlsx, no cruzables con la base): ${fmt(creation.obras)} obras únicas de ${fmt(creation.personas)} personas en ${creation.grupos} grupos, 2010–2024.`}</Note>
          </ChartCard>
        </Col>
      </Row>

      <CutoffNote />
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 12 }}>{isMock ? FOOTER_TEXT : REAL_FOOTER_TEXT}</Typography.Paragraph>
    </div>
  );
}
