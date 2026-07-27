/* Utils */
import { dig } from "./utils";

/* ─── scalar rows ───────────────────────────────────────────── */
export function scalarRows(defs, history, collKey) {
  return defs.map((def) => ({
    key: def.key,
    label: def.label,
    isTotal: def.isTotal,
    lowerIsBetter: def.lowerIsBetter,
    values: history.map((run, i) => {
      const col = run[collKey];
      const value = dig(col, def.key);
      const total = def.isTotal ? null : col?.total;
      const prevValue =
        i === 0 && history.length > 1
          ? dig(history[1][collKey], def.key)
          : null;
      return { value, total, prevValue };
    }),
  }));
}

/* ─── object breakdown rows ─────────────────────────────────── */
export function objectRows(history, collKey, subPath, getTotal, exclude = []) {
  // sort by most recent (history[0])
  const firstObj = dig(history[0]?.[collKey], subPath) ?? {};
  const keys = Object.keys(firstObj)
    .filter((k) => !exclude.includes(k))
    .sort((a, b) => (firstObj[b] || 0) - (firstObj[a] || 0));

  return keys.map((key) => ({
    key,
    label: key,
    values: history.map((run, i) => {
      const col = run[collKey];
      const obj = dig(col, subPath) ?? {};
      const value = obj[key] ?? null;
      const total = getTotal(col);
      const prevValue =
        i === 0 && history.length > 1
          ? (dig(history[1][collKey], subPath)?.[key] ?? null)
          : null;
      return { value, total, prevValue };
    }),
  }));
}

/* ─── provenance dual rows ──────────────────────────────────── */
export function dualProvRows(history, collKey) {
  const lastIntersection =
    history[0]?.[collKey]?.provenance_breakdown?.intersection ?? {};
  const keys = Object.keys(lastIntersection).sort(
    (a, b) => (lastIntersection[b] || 0) - (lastIntersection[a] || 0),
  );
  return keys.map((key) => ({
    key,
    label: key,
    values: history.map((run, i) => {
      const col = run[collKey];
      const prev = i === 0 && history.length > 1 ? history[1][collKey] : null;
      return {
        intersection: col?.provenance_breakdown?.intersection?.[key] ?? null,
        exclusive:
          col?.provenance_breakdown?.exclusive_intersection?.[key] ?? null,
        total: col?.total ?? null,
        prevIntersection:
          prev?.provenance_breakdown?.intersection?.[key] ?? null,
        prevExclusive:
          prev?.provenance_breakdown?.exclusive_intersection?.[key] ?? null,
      };
    }),
  }));
}

/* ─── impactu type rows ─────────────────────────────────────── */
export function impactuTypeRows(history) {
  // sort by most recent (history[0])
  const firstTypes =
    history[0]?.works_collection?.types_breakdown?.impactu ?? [];
  return firstTypes.map((t) => ({
    key: t.type,
    label: t.type,
    values: history.map((run, i) => {
      const col = run.works_collection;
      const types = col?.types_breakdown?.impactu ?? [];
      const found = types.find((x) => x.type === t.type);
      const value = found?.count ?? null;
      const total = col?.types_breakdown?.with_impactu_total ?? null;
      const prevTypes =
        i === 0 && history.length > 1
          ? (history[1].works_collection?.types_breakdown?.impactu ?? [])
          : [];
      const prevFound = prevTypes.find((x) => x.type === t.type);
      return { value, total, prevValue: prevFound?.count ?? null };
    }),
  }));
}

/* ─── metric definitions ────────────────────────────────────── */
export const SUMMARY_DEFS = [
  { key: "person_collection.total", label: "Autores" },
  {
    key: "affiliations_collection.types_breakdown.group",
    label: "Grupos de investigación",
  },
  {
    key: "affiliations_collection.types_breakdown.department",
    label: "Subunidades académicas",
  },
  {
    key: "affiliations_collection.types_breakdown.faculty",
    label: "Unidades académicas",
  },
  {
    key: "affiliations_collection.types_breakdown.education",
    label: "Instituciones",
  },
  { key: "sources_collection.total", label: "Fuentes" },
  { key: "news_count", label: "Noticias" },
  { key: "projects_count", label: "Proyectos" },
  { key: "patents_count", label: "Patentes" },
];

export const WORKS_SCALARS = [
  { key: "total", label: "Total productos", isTotal: true },
  { key: "with_doi", label: "Con DOI" },
  { key: "with_abstract", label: "Con resumen" },
  { key: "with_primary_topic", label: "Con tópico" },
  { key: "with_year_published", label: "Con año de publicación" },
  { key: "with_source", label: "Vinculados a fuente/revista" },
  { key: "open_access_status_known", label: "Estado OA conocido" },
  { key: "with_citations", label: "Con citas (OpenAlex)" },
  { key: "with_ranking_minciencias", label: "Con ranking Minciencias" },
  { key: "with_research_groups", label: "Vinculados a grupo de investigación" },
  { key: "with_apc_paid", label: "Con APC registrado" },
];

export const PERSON_SCALARS = [
  { key: "total", label: "Total autores", isTotal: true },
  { key: "with_citations", label: "Con citas (OpenAlex)" },
  { key: "with_hindex", label: "Con h-index > 0" },
  { key: "with_orcid", label: "Con ORCID" },
  { key: "with_staff", label: "Autores activos (staff)" },
  { key: "with_cedula.total", label: "Con cédula (total)" },
  { key: "with_cedula.scienti", label: "Con cédula — desde Scienti" },
  { key: "with_cedula.staff", label: "Con cédula — desde Staff" },
];

export const AFFILIATIONS_SCALARS = [
  { key: "total", label: "Total afiliaciones", isTotal: true },
  { key: "with_country", label: "Con país" },
  { key: "with_year_established", label: "Con año de fundación" },
  { key: "with_products", label: "Con productos vinculados" },
  { key: "with_citations", label: "Con citas" },
  { key: "with_hindex", label: "Con h-index > 0" },
  { key: "with_relations", label: "Con relaciones jerárquicas" },
  { key: "colombian", label: "Colombianas (CO)" },
  {
    key: "colombian_without_minciencias_id",
    label: "Colombianas sin ID Minciencias",
    lowerIsBetter: true,
  },
  { key: "research_groups", label: "Grupos de investigación" },
];

export const SOURCES_SCALARS = [
  { key: "total", label: "Total fuentes", isTotal: true },
  { key: "with_publisher", label: "Con editorial" },
  { key: "with_ranking", label: "Con ranking" },
  { key: "with_products", label: "Con productos vinculados" },
  { key: "with_topics", label: "Con temas asignados" },
  { key: "with_licenses", label: "Con licencia" },
  { key: "with_publindex", label: "En Publindex" },
  { key: "with_apc", label: "Con APC publicado" },
];
