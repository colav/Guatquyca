/* Constants & utils */
import {
  AXIS_CONFIDENCE_MAX,
  AXIS_PROJECT_CONFIDENCE_MAX,
  axisTabsFor,
  FLAGGED_INSTITUTION,
  GRAPH_MIN_EDGE,
  FUNDERS_SHOWN,
  LIMITS,
  NON_ACADEMIC_SECTORS,
  PATENT_SERIES_LABEL,
  SCOPE,
  TRANSDISCIPLINARY_MIN_SUBFIELDS,
  WORK_TYPE,
} from "./constants";
import { DEFAULT_COLLAB_FILTERS } from "./filters";
import { policyRank } from "../policyDocuments";
import { memoByFilters } from "../optionAvailability";

/**
 * Pure computation of Board 2 (no React, no DOM): a port of filterWorks, filterProjects and of
 * the aggregation of each indicator of the published artifact (report sections 3, 4 and 7).
 *
 * Vectors of the artifact (positions):
 *   works:    [year, type, subfield, sectorMask, countries[], departments[], faculties[], units[],
 *              groups[], institutions[], subregionMask, iap, topic]
 *   projects: [year, funderSectorMask, subregionMask, groups[], iap, external, centerText]
 * Known artifact behaviours kept as they are (report section 11): a work without year always
 * passes the year filter; the centre filter of projects compares the first word of the centre
 * name with the free text; the "Internacional" scope does not filter projects; a work counts in
 * every sector, department, country or axis present (the bars are not additive).
 */

/**
 * Builds the indexes that do not depend on the filters.
 *
 * @param {Object} raw - JSON in the shape of window.T2 of the artifact (plus `funders`). Countries
 *   with `ll: null` (no coordinates) count in the tables and are left out of the map by the board.
 * @returns {Object} dataset
 */
export function createCollaborationDataset(raw) {
  const sectorIndex = Object.fromEntries(raw.sectors.map((s, i) => [s, i]));
  const nonAcademicMask = NON_ACADEMIC_SECTORS.reduce((m, s) => m | (1 << sectorIndex[s]), 0);
  const agendaIndexByName = Object.fromEntries(raw.thesaurus.agendas.map((a, i) => [a.name, i]));
  /* Institutions with the same name get their country in parentheses (B112 M3, F50). */
  const countryName = Object.fromEntries((raw.countries || []).map((c) => [c.c, c.n]));
  const nameCount = new Map();
  for (const x of raw.insts) nameCount.set(x.n, (nameCount.get(x.n) || 0) + 1);
  const instLabels = raw.insts.map((x) => (nameCount.get(x.n) > 1 && x.c ? `${x.n} (${countryName[x.c] || x.c})` : x.n));
  /* Units (subunits) with at least one work: the others are not offered in the filter (B112 B3, F50). */
  const unitsWithWorks = new Set();
  for (const w of raw.works) for (const u of w[7]) unitsWithWorks.add(u);
  /* Filter of axis (F59, D-159): pairs axis–product of the bundle (`direct` = indexes of works, `direct_conf` = their confidence, B120). Without those arrays (test data) the filter is not offered. */
  const ejes = raw.thesaurus.ejes || [];
  const hasAxisPairs = ejes.length > 0 && ejes.every((e) => Number.isInteger(e.id) && Array.isArray(e.direct_conf) && e.direct_conf.length === e.direct.length);
  /* Pairs axis–project (`direct_proj` = indexes of projects, `direct_proj_conf` = their confidence, B121, F59b). Without them the projects do not answer to the axis. */
  const hasProjectPairs = hasAxisPairs && ejes.every((e) => Array.isArray(e.direct_proj) && Array.isArray(e.direct_proj_conf) && e.direct_proj_conf.length === e.direct_proj.length);
  const axisProjectSets = new Map();
  const axisProjects = (id) => {
    if (!axisProjectSets.has(id)) {
      const e = axisById.get(id);
      axisProjectSets.set(id, new Set(e.direct_proj.filter((_, k) => e.direct_proj_conf[k] <= AXIS_PROJECT_CONFIDENCE_MAX).map((i) => raw.projects[i]).filter(Boolean)));
    }
    return axisProjectSets.get(id);
  };
  /* Document of policy on the projects (F66, D-168): a project passes with a pair of high or medium confidence with an axis of the document. */
  const docProjectSets = new Map();
  const docProjects = (name) => {
    if (!docProjectSets.has(name)) {
      const set = new Set();
      for (const e of ejes) if (e.agenda === name) e.direct_proj.forEach((p, k) => { if (e.direct_proj_conf[k] <= AXIS_PROJECT_CONFIDENCE_MAX && raw.projects[p]) set.add(raw.projects[p]); });
      docProjectSets.set(name, set);
    }
    return docProjectSets.get(name);
  };
  /* Patents (F66): rows [year of the first concession, company 0/1, groups[], units[]] (B123). Without them (test data) there is no series. */
  const patentRows = Array.isArray(raw.patentes) && raw.patentes.every((r) => Array.isArray(r) && r.length >= 4) ? raw.patentes : null;
  /* Funders per project (F66): indexes of `funders` for each project, in the order of `projects` (B123). */
  const projectFunders = raw.ext && Array.isArray(raw.ext.project_funders) && raw.ext.project_funders.length === raw.projects.length && Array.isArray(raw.funders) ? raw.ext.project_funders : null;
  const projectIndex = new Map(raw.projects.map((p, i) => [p, i]));
  /* Document of policy on the works (F74, D-177): the union of the pairs work–axis (high or medium confidence) of the axes of the document. */
  const docWorkSets = new Map();
  const docWorks = (name) => {
    if (!docWorkSets.has(name)) {
      const set = new Set();
      for (const e of ejes) if (e.agenda === name) e.direct.forEach((wi, k) => { if (e.direct_conf[k] <= AXIS_CONFIDENCE_MAX && raw.works[wi]) set.add(raw.works[wi]); });
      docWorkSets.set(name, set);
    }
    return docWorkSets.get(name);
  };
  const axisById = new Map(hasAxisPairs ? ejes.map((e) => [e.id, e]) : []);
  const axisWorkSets = new Map();
  /* Set of the works with a pair of high or medium confidence with the axis (built once per axis). */
  const axisWorks = (id) => {
    if (!axisWorkSets.has(id)) {
      const e = axisById.get(id);
      axisWorkSets.set(id, new Set(e.direct.filter((_, k) => e.direct_conf[k] <= AXIS_CONFIDENCE_MAX).map((i) => raw.works[i]).filter(Boolean)));
    }
    return axisWorkSets.get(id);
  };
  /* Axes grouped by document of policy, in the order of Gabriel (F69; the bundle lists them alphabetically). */
  const axisGroups = [...raw.thesaurus.agendas]
    .sort((a, b) => policyRank(a.name) - policyRank(b.name))
    .map((a) => ({ agenda: a.name, axes: [...axisById.values()].filter((e) => e.agenda === a.name).map((e) => ({ id: e.id, label: e.eje, clave: e.clave })) }))
    .filter((g) => g.axes.length);
  return {
    axisTabs: axisTabsFor(raw.thesaurus.agendas.map((a) => a.name)),
    hasAxisPairs,
    hasProjectPairs,
    axisProjects,
    docProjects,
    patentRows,
    projectFunders,
    projectIndex,
    axisById,
    axisWorks,
    axisGroups,
    instLabels,
    unitsWithWorks,
    raw,
    works: raw.works,
    projects: raw.projects,
    sectorIndex,
    nonAcademicMask,
    agendaIndexByName,
    agendaTopicSets: raw.thesaurus.agendas.map((a) => new Set(a.topics)),
    docWorks,
    groupCenter: raw.groups.map((g) => g.c),
    /* Works with at least one group that belongs to a research centre, over all the works (D-126). */
    centerCoverage: {
      withCenter: raw.works.filter((w) => w[8].some((g) => raw.groups[g].c >= 0)).length,
      total: raw.works.length,
    },
    centerKeys: raw.centros.map((c) => c.toLowerCase().replace(/^ci |^cic |^corp\. |\(.*\)/g, "").split(" ")[0]),
    antioquia: raw.depts.indexOf("Antioquia"),
    flaggedInstitution: raw.insts.findIndex((x) => x.n === FLAGGED_INSTITUTION),
    policyDocs: raw.thesaurus.agendas.map((a) => a.name),
  };
}

/** A work is of a scope (the single definition: filterWorks and the lists of options use it, F75). */
export function inScope(ds, scope, w) {
  if (scope === SCOPE.LOCAL) return w[5].includes(ds.antioquia);
  if (scope === SCOPE.DEPARTMENTAL) return !!(w[10] & ~1);
  if (scope === SCOPE.NATIONAL) return w[5].some((d) => d !== ds.antioquia);
  if (scope === SCOPE.INTERNATIONAL) return w[4].length > 0;
  return true;
}

/** Works that pass all the filters (the single definition of «this work passes»; F75). */
function filterWorksRaw(ds, f) {
  const { works, agendaTopicSets, agendaIndexByName, groupCenter } = ds;
  /* A known axis commands (F61, D-163): the document no longer restricts the products, it only limits the list of axes. */
  const axisChosen = f.axisId >= 0 && ds.axisById.has(f.axisId);
  const doc = !axisChosen && f.policyDoc in agendaIndexByName ? agendaIndexByName[f.policyDoc] : -1;
  const { centerIndex: c, facultyIndex: fa, departmentIndex: dp, subfieldIndex: sf, scope } = f;
  const y1 = f.yearFrom;
  const y2 = f.yearTo;
  /* A pair of high or medium confidence with the chosen axis; an id the bundle does not know is ignored. */
  const axisSet = axisChosen ? ds.axisWorks(f.axisId) : null;
  /* The document delimits by pairs when the bundle has them (F74); otherwise by the primary topic, as before. */
  const docSet = doc >= 0 && ds.hasAxisPairs ? ds.docWorks(f.policyDoc) : null;
  return works.filter((w) => {
    if (axisSet && !axisSet.has(w)) return false;
    const y = w[0];
    if (y && (y < y1 || y > y2)) return false;
    if (docSet ? !docSet.has(w) : doc >= 0 && !agendaTopicSets[doc].has(w[12])) return false;
    if (sf >= 0 && w[2] !== sf) return false;
    if (fa >= 0 && !w[6].includes(fa)) return false;
    if (dp >= 0 && !w[7].includes(dp)) return false;
    if (c >= 0 && !w[8].some((g) => groupCenter[g] === c)) return false;
    if (scope && !inScope(ds, scope, w)) return false;
    return true;
  });
}

/** Works that pass all the filters; the last results are kept, as the lists of options read the same works (F75). */
export const filterWorks = memoByFilters(filterWorksRaw);

/** Patents that pass years, centre and unit (the only filters that answer; F66). */
function filterPatents(ds, f) {
  if (!ds.patentRows) return [];
  const { groupCenter } = ds;
  return ds.patentRows.filter((r) => {
    if (r[0] && (r[0] < f.yearFrom || r[0] > f.yearTo)) return false;
    if (f.facultyIndex >= 0 && !r[3].includes(f.facultyIndex)) return false;
    if (f.centerIndex >= 0 && !r[2].some((g) => groupCenter[g] === f.centerIndex)) return false;
    return true;
  });
}

function filterProjects(ds, f) {
  const c = f.centerIndex;
  const key = c >= 0 ? ds.centerKeys[c] : null;
  /* A known axis with pairs of projects: the project needs a pair of high or medium confidence; the document does not restrict (F59b, D-163). */
  const axisKnown = f.axisId >= 0 && ds.axisById.has(f.axisId);
  const axisSet = axisKnown && ds.hasProjectPairs ? ds.axisProjects(f.axisId) : null;
  /* Without an axis, a document of the bundle restricts the projects through the pairs of its axes (F66, D-168); with an axis it does not (D-163). */
  const docSet = !axisKnown && ds.hasProjectPairs && f.policyDoc in ds.agendaIndexByName ? ds.docProjects(f.policyDoc) : null;
  return ds.projects.filter((p) => {
    if (axisSet && !axisSet.has(p)) return false;
    if (docSet && !docSet.has(p)) return false;
    if (p[0] && (p[0] < f.yearFrom || p[0] > f.yearTo)) return false;
    if (key !== null && !p[6].toLowerCase().includes(key)) return false;
    if (f.scope === SCOPE.DEPARTMENTAL && !(p[2] & ~1)) return false;
    return true;
  });
}

const sum = (arr, fn) => arr.reduce((s, x) => s + fn(x), 0);

/**
 * Computes everything Board 2 draws for a filter state. The tab-dependent views (indicators 13
 * and 14, subregion cartogram) are functions with a cache, so only the tab on screen is computed.
 *
 * @param {Object} dataset - From createCollaborationDataset().
 * @param {Object} [filters] - Overrides of DEFAULT_COLLAB_FILTERS.
 * @returns {Object} result
 */
export function computeCollaboration(dataset, filters = {}) {
  const f = { ...DEFAULT_COLLAB_FILTERS, ...filters };
  const { raw, sectorIndex, nonAcademicMask: naMask } = dataset;
  const W = filterWorks(dataset, f);
  const P = filterProjects(dataset, f);
  const PT = filterPatents(dataset, f);

  const has = (w, ...ks) => ks.every((k) => w[3] & (1 << sectorIndex[k]));
  const hasP = (p, ...ks) => ks.every((k) => p[1] & (1 << sectorIndex[k]));
  const articles = W.filter((w) => w[1] === WORK_TYPE.ARTICLE);
  const flagged = dataset.flaggedInstitution;
  const triple = articles.filter((w) => has(w, "company", "government"));
  const tripleNoFlagged = triple.filter(
    (w) => !(w[9].includes(flagged) && !w[9].some((i) => i !== flagged && raw.sectors[raw.insts[i].s] === "government")),
  );
  const appropriation = W.filter((w) => w[1] === WORK_TYPE.APPROPRIATION);
  const iapWorks = W.filter((w) => w[11]);

  const axisEntry = f.axisId >= 0 ? dataset.axisById.get(f.axisId) : null;
  const result = {
    filters: f,
    /* Axis chosen (F59): the filter keeps the works with a pair of high or medium confidence; appropriation has no pair; the projects have pairs from B121 (F59b). */
    axis: axisEntry ? { id: axisEntry.id, label: axisEntry.eje, agenda: axisEntry.agenda, projectsRespond: dataset.hasProjectPairs } : null,
    /* Products of the cards that need a sample (small-sample notice, F59). */
    sample: { graph: W.filter((w) => w[1] !== WORK_TYPE.APPROPRIATION).length, helices: articles.length, projects: P.length },
    works: W.length,
    projects: P.length,
    /* Patents (F66): only years, centre and unit answer; the active filters that do not are named in the card. */
    hasPatents: !!dataset.patentRows,
    patentsIgnored: [
      f.scope && "ámbito",
      f.policyDoc && "documento de política",
      axisEntry && "eje",
      f.departmentIndex >= 0 && "subunidad",
      f.subfieldIndex >= 0 && "subcampo",
    ].filter(Boolean),
    /* Funders (F66): counted over the projects that pass the filters of projects; without the list per project, the fixed ranking of the bundle. */
    funders: (() => {
      const list = dataset.raw.funders || [];
      if (!dataset.projectFunders) return list.slice(0, FUNDERS_SHOWN).map((x) => ({ nm: x.nm, fsector: x.fsector, proyectos: x.proyectos }));
      const counts = new Array(list.length).fill(0);
      for (const p of P) for (const k of dataset.projectFunders[dataset.projectIndex.get(p)] || []) counts[k]++;
      return list.map((x, i) => ({ nm: x.nm, fsector: x.fsector, proyectos: counts[i], i })).filter((x) => x.proyectos > 0).sort((a, b) => b.proyectos - a.proyectos || a.i - b.i).slice(0, FUNDERS_SHOWN);
    })(),
    fundersByProject: !!dataset.projectFunders,
    kpis: {
      works: W.length,
      withExternal: W.filter((w) => w[9].length).length,
      withNonAcademic: W.filter((w) => w[3] & naMask).length,
      withInternational: W.filter((w) => w[4].length).length,
      projects: P.length,
      projectsExternal: P.filter((p) => p[5]).length,
    },
    helices: {
      triple: triple.length,
      tripleWithoutFlagged: tripleNoFlagged.length,
      tripleProjects: P.filter((p) => hasP(p, "company", "government")).length,
      withCompany: articles.filter((w) => has(w, "company")).length,
      withGovernment: articles.filter((w) => has(w, "government")).length,
      withHealthcare: articles.filter((w) => has(w, "healthcare")).length,
      quadruple: articles.filter((w) => has(w, "company", "government", "nonprofit")).length,
      patents: PT.length,
      patentsWithCompany: PT.filter((r) => r[1] === 1).length,
      quadrupleProjects: P.filter((p) => hasP(p, "company", "government", "nonprofit")).length,
      /* False when no work of social appropriation carries a non-academic sector: the source has no datum, the 0 is not a measure (F72). */
      appropriationSectorData: appropriation.some((w) => w[3] & naMask),
      appropriationWithCompanyOrNonprofit: appropriation.filter((w) => has(w, "company") || has(w, "nonprofit")).length,
      appropriationTotal: appropriation.length,
      withNonprofit: articles.filter((w) => has(w, "nonprofit")).length,
      governmentNonprofit: articles.filter((w) => has(w, "government", "nonprofit")).length,
      companyNonprofit: articles.filter((w) => has(w, "company", "nonprofit")).length,
    },
    iap: {
      works: iapWorks.length,
      articles: iapWorks.filter((w) => w[1] === WORK_TYPE.ARTICLE).length,
      chapters: iapWorks.filter((w) => w[1] === WORK_TYPE.CHAPTER).length,
      projects: P.filter((p) => p[4]).length,
    },
  };

  // 01 · transdisciplinarity of the groups (articles only)
  {
    const subfields = new Map();
    const fields = new Map();
    const counts = new Map();
    for (const w of W) {
      if (w[1] !== WORK_TYPE.ARTICLE || w[2] < 0) continue;
      for (const g of w[8]) {
        if (!subfields.has(g)) { subfields.set(g, new Set()); fields.set(g, new Set()); counts.set(g, 0); }
        subfields.get(g).add(w[2]);
        fields.get(g).add(raw.sfField[w[2]]);
        counts.set(g, counts.get(g) + 1);
      }
    }
    result.transdisciplinary = [...subfields.keys()]
      .map((g) => ({ id: raw.groups[g].id, label: raw.groups[g].n, value: subfields.get(g).size, fields: fields.get(g).size, articles: counts.get(g) }))
      .filter((r) => r.value >= TRANSDISCIPLINARY_MIN_SUBFIELDS)
      .sort((a, b) => b.value - a.value || b.fields - a.fields)
      .slice(0, LIMITS.transdisciplinary);
  }

  // 03 · non-academic organizations by product type
  {
    const m = new Map();
    for (const w of W) {
      for (const i of w[9]) {
        if (!NON_ACADEMIC_SECTORS.includes(raw.sectors[raw.insts[i].s])) continue;
        if (!m.has(i)) m.set(i, { index: i, label: dataset.instLabels[i], verify: i === flagged, byType: [0, 0, 0, 0] });
        m.get(i).byType[w[1]]++;
      }
    }
    result.organizations = [...m.values()]
      .map((r) => ({ ...r, total: sum(r.byType, (x) => x) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, LIMITS.organizations);
  }

  // 04 · products by non-academic sector
  result.sectors = NON_ACADEMIC_SECTORS.map((s) => ({
    sector: s,
    label: raw.sectorsEs[sectorIndex[s]],
    value: W.filter((w) => w[3] & (1 << sectorIndex[s])).length,
  })).filter((d) => d.value > 0);

  // 05 · products and projects per year
  {
    const years = [];
    for (let y = f.yearFrom; y <= f.yearTo; y++) years.push(y);
    const per = (list, pick) => {
      const m = new Map();
      for (const x of list) { const k = pick(x); m.set(k, (m.get(k) || 0) + 1); }
      return years.map((y) => m.get(y) || 0);
    };
    const byTypeYear = (type) => per(W.filter((w) => w[1] === type), (w) => w[0]);
    result.years = years;
    result.trendArticles = [{ label: raw.tipos[WORK_TYPE.ARTICLE], values: byTypeYear(WORK_TYPE.ARTICLE) }];
    /* Order of Gabriel: articles (05), books, chapters, social appropriation, patents, projects (F66). */
    result.trendOthers = [
      { label: raw.tipos[WORK_TYPE.BOOK], values: byTypeYear(WORK_TYPE.BOOK) },
      { label: raw.tipos[WORK_TYPE.CHAPTER], values: byTypeYear(WORK_TYPE.CHAPTER) },
      { label: raw.tipos[WORK_TYPE.APPROPRIATION], values: byTypeYear(WORK_TYPE.APPROPRIATION) },
      ...(dataset.patentRows ? [{ label: PATENT_SERIES_LABEL, values: per(PT, (r) => r[0]) }] : []),
      { label: "Proyectos (inicio)", values: per(P, (p) => p[0]) },
    ];
  }

  // 09 · departments (Colombian co-authoring institutions) and the unassigned count
  {
    const counts = {};
    for (const w of W) for (const d of w[5]) { const name = raw.depts[d]; counts[name] = (counts[name] || 0) + 1; }
    result.departments = counts;
  }

  // 10 · countries and 11·12 · regions (North / South)
  {
    const cnt = {};
    for (const w of W) for (const c of w[4]) cnt[c] = (cnt[c] || 0) + 1;
    result.countries = raw.countries
      .map((c, i) => ({ ...c, value: cnt[i] || 0 }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
    const regionIndex = Object.fromEntries(raw.regions.map((r, i) => [r, i]));
    const regions = raw.regions.map((r) => ({ label: r, value: 0, north: regionIndex[r] < 4 }));
    let north = 0;
    let south = 0;
    for (const w of W) {
      if (!w[4].length) continue;
      const rs = new Set(w[4].map((c) => raw.countries[c].r));
      rs.forEach((r) => regions[regionIndex[r]].value++);
      const hasN = [...rs].some((r) => regionIndex[r] < 4);
      const hasS = [...rs].some((r) => regionIndex[r] >= 4);
      if (hasN) north++;
      if (hasS) south++;
    }
    result.regions = regions;
    result.northSouth = { north, south };
  }

  // 02 · collaboration graph between groups (top 60 by weighted degree, edges with >= 2 shared products)
  {
    const pairs = new Map();
    const wdeg = new Map();
    for (const w of W) {
      if (w[1] === WORK_TYPE.APPROPRIATION) continue;
      const gl = [...new Set(w[8])].sort((a, b) => a - b);
      for (let i = 0; i < gl.length; i++) for (let j = i + 1; j < gl.length; j++) {
        const k = `${gl[i]}-${gl[j]}`;
        pairs.set(k, (pairs.get(k) || 0) + 1);
      }
    }
    const deg = new Map();
    pairs.forEach((n, k) => {
      const [a, b] = k.split("-").map(Number);
      deg.set(a, (deg.get(a) || 0) + 1);
      deg.set(b, (deg.get(b) || 0) + 1);
      wdeg.set(a, (wdeg.get(a) || 0) + n);
      wdeg.set(b, (wdeg.get(b) || 0) + n);
    });
    const top = [...wdeg.entries()].sort((a, b) => b[1] - a[1]).slice(0, LIMITS.graphNodes).map((d) => d[0]);
    const topSet = new Set(top);
    const links = [];
    pairs.forEach((n, k) => {
      const [a, b] = k.split("-").map(Number);
      if (n >= GRAPH_MIN_EDGE && topSet.has(a) && topSet.has(b)) links.push({ source: a, target: b, weight: n });
    });
    result.graph = {
      nodes: top.map((g) => ({ id: g, name: raw.groups[g].n, degree: deg.get(g) || 0, weight: wdeg.get(g) || 0, center: raw.groups[g].c })),
      links,
      groupsWithCollaboration: deg.size,
      pairs: pairs.size,
    };
  }

  /* Tab-dependent views, with a cache */
  const cache = {};
  const memo = (key, fn) => (key in cache ? cache[key] : (cache[key] = fn()));

  /** 13 · groups with non-academic actors for a domain tab (no articles). */
  result.domainRows = (tab) =>
    memo(`d${tab}`, () => {
      const m = new Map();
      for (const w of W) {
        if (w[1] === WORK_TYPE.ARTICLE) continue;
        const na = !!(w[3] & naMask);
        const ext = w[9].length > 0;
        if (!na && !ext) continue;
        for (const g of w[8]) {
          if (raw.groups[g].d !== tab) continue;
          if (!m.has(g)) m.set(g, { g, na: [0, 0, 0, 0], ext: 0, naTotal: 0 });
          const r = m.get(g);
          if (na) { r.na[w[1]]++; r.naTotal++; }
          if (ext) r.ext++;
        }
      }
      return [...m.values()]
        .sort((a, b) => b.naTotal - a.naTotal || b.ext - a.ext)
        .slice(0, LIMITS.domainGroups)
        .map((r) => ({
          id: raw.groups[r.g].id,
          group: raw.groups[r.g].n,
          center: raw.groups[r.g].c >= 0 ? raw.centros[raw.groups[r.g].c] : "",
          books: r.na[WORK_TYPE.BOOK],
          chapters: r.na[WORK_TYPE.CHAPTER],
          appropriation: r.na[WORK_TYPE.APPROPRIATION],
          total: r.naTotal,
          external: r.ext,
        }));
    });

  /** 14 · Eje Temático by type of organization for a tab (articles, books and chapters with a non-academic actor). */
  result.axisRows = (tab) =>
    memo(`a${tab}`, () => {
      /* With an axis chosen only that axis is shown, with the definition of the filter (pair of high or medium confidence), not by primary topic (F59). */
      if (axisEntry) {
        const counts = Object.fromEntries(NON_ACADEMIC_SECTORS.map((s) => [s, 0]));
        for (const w of W) {
          if (w[1] === WORK_TYPE.APPROPRIATION || !(w[3] & naMask)) continue;
          for (const s of NON_ACADEMIC_SECTORS) if (w[3] & (1 << sectorIndex[s])) counts[s]++;
        }
        const total = sum(NON_ACADEMIC_SECTORS, (s) => counts[s]);
        return total > 0 ? [{ label: axisEntry.eje, key: axisEntry.clave, counts, total }] : [];
      }
      const byTopic = memo("byTopic", () => {
        const m = new Map();
        for (const w of W) {
          if (w[1] === WORK_TYPE.APPROPRIATION || w[12] < 0 || !(w[3] & naMask)) continue;
          if (!m.has(w[12])) m.set(w[12], []);
          m.get(w[12]).push(w);
        }
        return m;
      });
      const spec = dataset.axisTabs[tab] || dataset.axisTabs[dataset.axisTabs.length - 1];
      const axes = raw.thesaurus.ejes.filter((e) => (spec.agenda ? e.agenda === spec.agenda : e.agenda !== "Misión de sabios 2019"));
      return axes
        .map((e) => {
          const counts = Object.fromEntries(NON_ACADEMIC_SECTORS.map((s) => [s, 0]));
          for (const tp of e.topics) for (const w of byTopic.get(tp) || []) for (const s of NON_ACADEMIC_SECTORS) if (w[3] & (1 << sectorIndex[s])) counts[s]++;
          return { label: (spec.agenda ? "" : `${e.clave.split("|")[0]} · `) + e.eje, key: e.clave, counts, total: sum(NON_ACADEMIC_SECTORS, (s) => counts[s]) };
        })
        .filter((r) => r.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, LIMITS.axes);
    });

  /** 09b · counts per subregion for a tab (0 and 1: projects; 2: works that mention the subregion). */
  result.subregionCounts = (tab) =>
    memo(`s${tab}`, () => {
      const cnt = Object.fromEntries(raw.subregs.map((s) => [s, 0]));
      if (tab < 2) {
        for (const p of P) {
          if (tab === 1 && !p[5]) continue;
          raw.subregs.forEach((s, i) => { if (p[2] & (1 << i)) cnt[s]++; });
        }
      } else {
        for (const w of W) raw.subregs.forEach((s, i) => { if (w[10] & (1 << i)) cnt[s]++; });
      }
      return cnt;
    });

  return result;
}
