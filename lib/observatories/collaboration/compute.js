/* Constants & utils */
import {
  AXIS_TABS,
  FLAGGED_INSTITUTION,
  GRAPH_MIN_EDGE,
  LIMITS,
  NON_ACADEMIC_SECTORS,
  SCOPE,
  TRANSDISCIPLINARY_MIN_SUBFIELDS,
  WORK_TYPE,
} from "./constants";
import { DEFAULT_COLLAB_FILTERS } from "./filters";

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
 * @param {Object} raw - JSON in the shape of window.T2 of the artifact (plus `funders`).
 * @returns {Object} dataset
 */
export function createCollaborationDataset(raw) {
  const sectorIndex = Object.fromEntries(raw.sectors.map((s, i) => [s, i]));
  const nonAcademicMask = NON_ACADEMIC_SECTORS.reduce((m, s) => m | (1 << sectorIndex[s]), 0);
  const agendaIndexByName = Object.fromEntries(raw.thesaurus.agendas.map((a, i) => [a.name, i]));
  return {
    raw,
    works: raw.works,
    projects: raw.projects,
    sectorIndex,
    nonAcademicMask,
    agendaIndexByName,
    agendaTopicSets: raw.thesaurus.agendas.map((a) => new Set(a.topics)),
    groupCenter: raw.groups.map((g) => g.c),
    centerKeys: raw.centros.map((c) => c.toLowerCase().replace(/^ci |^cic |^corp\. |\(.*\)/g, "").split(" ")[0]),
    antioquia: raw.depts.indexOf("Antioquia"),
    flaggedInstitution: raw.insts.findIndex((x) => x.n === FLAGGED_INSTITUTION),
    policyDocs: raw.thesaurus.agendas.map((a) => a.name),
  };
}

function filterWorks(ds, f) {
  const { works, agendaTopicSets, agendaIndexByName, groupCenter, antioquia } = ds;
  const doc = f.policyDoc in agendaIndexByName ? agendaIndexByName[f.policyDoc] : -1;
  const { centerIndex: c, facultyIndex: fa, departmentIndex: dp, subfieldIndex: sf, scope } = f;
  const y1 = f.yearFrom;
  const y2 = f.yearTo;
  return works.filter((w) => {
    const y = w[0];
    if (y && (y < y1 || y > y2)) return false;
    if (doc >= 0 && !agendaTopicSets[doc].has(w[12])) return false;
    if (sf >= 0 && w[2] !== sf) return false;
    if (fa >= 0 && !w[6].includes(fa)) return false;
    if (dp >= 0 && !w[7].includes(dp)) return false;
    if (c >= 0 && !w[8].some((g) => groupCenter[g] === c)) return false;
    if (scope === SCOPE.LOCAL && !w[5].includes(antioquia)) return false;
    if (scope === SCOPE.DEPARTMENTAL && !(w[10] & ~1)) return false;
    if (scope === SCOPE.NATIONAL && !w[5].some((d) => d !== antioquia)) return false;
    if (scope === SCOPE.INTERNATIONAL && !w[4].length) return false;
    return true;
  });
}

function filterProjects(ds, f) {
  const c = f.centerIndex;
  const key = c >= 0 ? ds.centerKeys[c] : null;
  return ds.projects.filter((p) => {
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

  const result = {
    filters: f,
    works: W.length,
    projects: P.length,
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
      quadrupleProjects: P.filter((p) => hasP(p, "company", "government", "nonprofit")).length,
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
        if (!m.has(i)) m.set(i, { index: i, label: raw.insts[i].n, verify: i === flagged, byType: [0, 0, 0, 0] });
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
    result.trendOthers = [
      { label: raw.tipos[WORK_TYPE.CHAPTER], values: byTypeYear(WORK_TYPE.CHAPTER) },
      { label: raw.tipos[WORK_TYPE.BOOK], values: byTypeYear(WORK_TYPE.BOOK) },
      { label: raw.tipos[WORK_TYPE.APPROPRIATION], values: byTypeYear(WORK_TYPE.APPROPRIATION) },
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
      .filter((c) => c.value > 0 && c.ll)
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
      const byTopic = memo("byTopic", () => {
        const m = new Map();
        for (const w of W) {
          if (w[1] === WORK_TYPE.APPROPRIATION || w[12] < 0 || !(w[3] & naMask)) continue;
          if (!m.has(w[12])) m.set(w[12], []);
          m.get(w[12]).push(w);
        }
        return m;
      });
      const spec = AXIS_TABS[tab];
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
