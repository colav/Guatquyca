/* Constants & utils */
import {
  CATEGORY,
  CATEGORY_ORDER,
  CATEGORY_ORDER_LEGACY,
  DEFAULT_THRESHOLDS,
  DIMENSION,
  MIN_PRODUCTS_CLASSIFY,
  MIN_TREND_VOLUME,
  PAIR_LEVEL,
  PAIR_LEVEL_MAX_CODE,
  RATIO_BASIS,
  TREND_RULE,
  CAPACITY_WINDOW,
  LEGACY_TREND_WINDOW_YEARS,
  TREND_WINDOW_YEARS,
  YEAR_RANGE,
} from "./constants";
import { categoryByCapacity, categoryOf } from "./category";
import { officialFwci } from "./fwci";
import { substituteBenchmark } from "./benchmark";
import { trendByBand, trendOf } from "./trend";

/**
 * Pure computation of Board 1 (no React, no DOM). It is a port of compute() and aggregate() of
 * the published artifact, with the filter state passed as a parameter.
 *
 * Dataset shape (adapter of the artifact JSON, see data/artifactAdapter.js):
 *   topics[]  { id, t, sf, f, d, gm (world mean citations per work), gw (world works), link: [[axisId, n]] }
 *   facts[]   [topicIndex, year, citations, type, quartile, oa, facultyIdx[], departmentIdx[], centerIdx[], groupIdx[]]
 *   axes[]    { id, clave, eje, agenda, nivel, meta }
 *   groups[]  [code, name, Minciencias category]
 * The quyca bundle (02 §3.11) adds per fact: [10] subregion indexes, [11] [[ods, score*100]],
 * [12] axis pairs with confidence and [13] indexes into afils (non-academic actors); they are
 * counted in the same pass as the filters, so every filter stacks on them (Q23).
 * It also carries [14] (1 = the work has a record in OpenAlex, B97), `lideres` (the leader
 * institution of each topic, scope and year) and `ref_nacional` (topics with a national
 * reference); with them the model of D-121 and D-122 applies (see computeCapacity).
 */

/** The ODS rows of the bundle come with a score; the client applies this cut (0.40 · 100, 02 §3.11, obs.facts_extra). */
export const ODS_MIN_SCORE = 40;

/** Filters of the board with their default values. */
export const DEFAULT_FILTERS = Object.freeze({
  scope: "",
  policyDoc: "",
  centerIndex: -1,
  facultyIndex: -1,
  departmentIndex: -1,
  yearFrom: YEAR_RANGE.min,
  yearTo: YEAR_RANGE.max,
  dimension: DIMENSION.TOPIC,
  /* Reference of the capacity ratio: Colombia ("national") by default, or the world ("global") (D-122). */
  ratioBasis: RATIO_BASIS.NATIONAL,
  pairLevel: PAIR_LEVEL.CORE,
  /* Ejes Temáticos chosen (ids of `ejes`): the whole board is cut to the products linked to them (F49, D-142). */
  axisIds: [],
  /* Field, subfield or topic chosen (F69, T1-02): "f:<field>", "s:<field>|<subfield>" or "t:<id of the topic>"; empty = all. */
  topicKey: "",
  /* ODS chosen (F71, C1-07): number 1 to 17, 0 = all. The products with that ODS (assignment of score ODS_MIN_SCORE or more) cut the board. */
  odsNumber: 0,
});

/**
 * Policy documents that have curated axes (D-129), in the order of the bundle (`documentos`) when
 * it has one. The filter lists only these: the documents without axes only have goals, and no filter
 * of the boards acts on goals.
 *
 * @param {Object} raw
 * @returns {string[]}
 */
export function documentsWithAxes(raw) {
  const withAxes = [...new Set(raw.ejes.map((e) => e.agenda))];
  if (!Array.isArray(raw.documentos)) return withAxes;
  const ordered = raw.documentos.map((d) => d[0]).filter((name) => withAxes.includes(name));
  return [...ordered, ...withAxes.filter((name) => !ordered.includes(name))];
}

/**
 * Builds the indexes that do not depend on the filters.
 *
 * @param {Object} raw - JSON in the shape of the artifact.
 * @returns {Object} dataset
 */
export function createDataset(raw) {
  const topicAxes = raw.topics.map((t) => t.link.map((l) => l[0]));
  /* State of each link topic–axis (third element, B110; D-148): 0 included, 1 frontier, null when the bundle does not carry it. */
  const topicLinkStates = raw.topics.map((t) => t.link.map((l) => (l[2] === 0 || l[2] === 1 ? l[2] : null)));
  return {
    meta: raw.meta,
    topics: raw.topics,
    facts: raw.facts,
    axes: raw.ejes,
    groups: raw.groups,
    centers: raw.cens,
    faculties: raw.facs,
    departments: raw.deps,
    departmentUnit: raw.deps_fac,
    subregions: raw.subregiones,
    actors: raw.actores,
    afils: raw.afils || null,
    actorTypes: raw.actor_tipos || null,
    ods: raw.ods || null,
    hasFactDetails: Array.isArray(raw.facts[0]) && raw.facts[0].length >= 14,
    /* Model of D-121, D-122 and D-133: needs the single referent of 2010–2025 (`ref_2125`, B106) or, while a bundle
       does not have it, the yearly leaders (`lideres`), and the OpenAlex mark of each work. `lideres` is not read
       when `ref_2125` is there, so B107 can remove it from the bundle. */
    hasCapacityModel:
      ((Array.isArray(raw.ref_1025) && raw.ref_1025.length > 0) || (Array.isArray(raw.ref_2125) && raw.ref_2125.length > 0) || (Array.isArray(raw.lideres) && raw.lideres.length > 0)) &&
      Array.isArray(raw.facts[0]) &&
      raw.facts[0].length >= 15,
    /* Extraction of ImpactU (`obs.corte`), for the text of the sources (F47). */
    obsCut: (raw.obs && raw.obs.corte) || null,
    leaders: raw.lideres || [],
    /* Single referent of 2010–2025 per topic and scope (B106, D-133): rows [topic, scope, institution, works, citations]. */
    ref2125: Array.isArray(raw.ref_2125) ? raw.ref_2125 : null,
    /* Single referent of 2010–2025 (B153, D-221): the one the calculator reads; `ref_2125` is kept only as a fallback for old bundles. */
    ref1025: Array.isArray(raw.ref_1025) ? raw.ref_1025 : null,
    referentCache: null,
    leaderNames: raw.inst_lider || [],
    nationalTopics: new Set(raw.ref_nacional || []),
    leaderCache: new Map(),
    /* Works that belong to some research centre (facts[8] not empty) over all the works (D-124). */
    centerCoverage: { withCenter: raw.facts.filter((f) => f[8].length > 0).length, total: raw.facts.length },
    topicAxes,
    topicLinkStates,
    policyDocs: documentsWithAxes(raw),
    scopes: [...new Set(raw.ejes.map((e) => e.nivel))],
  };
}

/**
 * Axes chosen that are not of the document chosen (F61, D-163). Returns the ids that belong to another document, or
 * [] when the filters are consistent.
 *
 * @param {{ axes: Object[] }} dataset
 * @param {Object} filters
 * @returns {number[]}
 */
export function axesOutsideDocument(dataset, filters) {
  if (!filters.policyDoc || !filters.axisIds || !filters.axisIds.length) return [];
  const agendaById = new Map(dataset.axes.map((e) => [e.id, e.agenda]));
  return filters.axisIds.filter((id) => agendaById.has(id) && agendaById.get(id) !== filters.policyDoc);
}

/**
 * Predicate of the filter of field, subfield or topic (F69, T1-02): the topics of the field, of the subfield or the topic itself.
 * The key is "d:<domain>" (F76), "f:<field>", "s:<field>|<subfield>" or "t:<id>"; an empty or unknown key does not filter (null).
 *
 * @param {string} key
 * @returns {((topic: Object) => boolean)|null}
 */
export function topicPredicate(key) {
  const text = String(key || "");
  const kind = text.slice(0, 2);
  const value = text.slice(2);
  if (!value) return null;
  if (kind === "d:") return (t) => t.d === value;
  if (kind === "f:") return (t) => t.f === value;
  if (kind === "s:") return (t) => `${t.f}|${t.sf}` === value;
  if (kind === "t:") return (t) => t.id === value;
  return null;
}

/**
 * Chain of filters Ámbito → Documento de política → Eje Temático of Board 1 (F64, D-166): the scope is the level of the
 * policy document, so a scope limits the documents that are listed and the axes of those documents; a document limits its
 * axes. These helpers say what is left in each list and what a change clears.
 */
export const docsInScope = (dataset, scope) => (scope ? dataset.policyDocs.filter((d) => dataset.axes.some((e) => e.agenda === d && e.nivel === scope)) : dataset.policyDocs);

/** Patch that a change of scope makes: the document and the axes that do not belong to the new scope are cleared. */
export function scopeChangePatch(dataset, filters, scope) {
  const next = scope || "";
  const patch = { scope: next };
  if (next && filters.policyDoc && !docsInScope(dataset, next).includes(filters.policyDoc)) patch.policyDoc = "";
  const ids = filters.axisIds || [];
  if (next && ids.length) {
    const nivel = new Map(dataset.axes.map((e) => [e.id, e.nivel]));
    const kept = ids.filter((id) => !nivel.has(id) || nivel.get(id) === next);
    if (kept.length !== ids.length) patch.axisIds = kept;
  }
  return patch;
}

/**
 * Inconsistent chain (from the URL): the axes win (D-163), then the document wins over the scope... in the sense that
 * the lower filter is the one cleared. Returns the patch or null when the filters are consistent.
 */
export function reconcileChain(dataset, filters) {
  const patch = {};
  let scope = filters.scope || "";
  let doc = filters.policyDoc || "";
  const byId = new Map(dataset.axes.map((e) => [e.id, e]));
  const known = (filters.axisIds || []).map((id) => byId.get(id)).filter(Boolean);
  if (scope && known.some((e) => e.nivel !== scope)) {
    scope = "";
    patch.scope = "";
  }
  if (doc && known.some((e) => e.agenda !== doc)) {
    doc = "";
    patch.policyDoc = "";
  }
  if (doc && scope && !docsInScope(dataset, scope).includes(doc)) patch.policyDoc = "";
  return Object.keys(patch).length ? patch : null;
}

/**
 * The filters of a fact (product) of Board 1 except the years: the document and the scope by the pairs product–axis (F74), the
 * topic (field, subfield or topic), the unit, the subunit, the centre and the axes. It is the only definition of «this product
 * passes»: the board uses it to count and the lists of options (F75) use it to know what is left, so a change of a rule (X-05)
 * reaches both.
 */
function buildFactFilter(dataset, filters) {
  const { topics, facts, axes, topicAxes } = dataset;
  const { scope, policyDoc, centerIndex, facultyIndex, departmentIndex, pairLevel } = filters;
  /* Axes chosen: they command (F61, D-163), the document no longer restricts the products; it only limits the list of axes. */
  const axisSelection = filters.axisIds && filters.axisIds.length ? new Set(filters.axisIds) : null;
  const docRestricts = !axisSelection && policyDoc;
  /* The scope is the level of the document: with an axis chosen it does not restrict the products either (F64, D-166). */
  const scopeRestricts = !axisSelection && scope;
  let axisFilter = null;
  if (scopeRestricts || docRestricts) {
    axisFilter = new Set(
      axes
        .filter((e) => (!scopeRestricts || e.nivel === scope) && (!docRestricts || e.agenda === policyDoc))
        .map((e) => e.id),
    );
  }
  const topicPick = topicPredicate(filters.topicKey);
  const odsPick = filters.odsNumber >= 1 && filters.odsNumber <= 17 ? filters.odsNumber : 0;
  /* The document (and the scope, the level of the document) delimits the products by the pairs product–axis that the panel of judges
     gave to some axis of the document, with the confidence of the board (F74, D-177); the link topic–axis (included or frontier) no
     longer decides it. A product without pair does not count even if its topic is linked. Without pairs in the bundle (test data) the
     topics linked to the axes decide, as before. */
  const docPairMax = PAIR_LEVEL_MAX_CODE[pairLevel] ?? PAIR_LEVEL_MAX_CODE[PAIR_LEVEL.CORE];
  const inDocument = (f) => f[12].some(([axis, code]) => code <= docPairMax && axisFilter.has(axis));
  let documentTopics = null;
  if (axisFilter && dataset.hasFactDetails) {
    documentTopics = new Set();
    for (const f of facts) if (inDocument(f)) documentTopics.add(f[0]);
  }
  const topicAllowed = topics.map((t, i) => (!axisFilter || (documentTopics ? documentTopics.has(i) : topicAxes[i].some((e) => axisFilter.has(e)))) && (!topicPick || topicPick(t)));
  /* Ejes Temáticos chosen: the product-axis pairs (facts[12]) of the confidence level of the board decide. */

  const maxPairCode = PAIR_LEVEL_MAX_CODE[pairLevel] ?? PAIR_LEVEL_MAX_CODE[PAIR_LEVEL.CORE];
  const pass = (f) => {
    if (!topicAllowed[f[0]]) return false;
    if (documentTopics && !inDocument(f)) return false;
    if (facultyIndex >= 0 && !f[6].includes(facultyIndex)) return false;
    if (departmentIndex >= 0 && !f[7].includes(departmentIndex)) return false;
    if (centerIndex >= 0 && !f[8].includes(centerIndex)) return false;
    if (axisSelection && !(dataset.hasFactDetails && f[12].some(([axis, code]) => code <= maxPairCode && axisSelection.has(axis)))) return false;
    return true;
  };
  const odsOk = (f) => !odsPick || (dataset.hasFactDetails && f[11].some(([ods, score]) => ods === odsPick && score >= ODS_MIN_SCORE));
  return { axisFilter, axisSelection, topicAllowed, documentTopics, inDocument, odsPick, pass, odsOk };
}

/** Facts that pass all the filters, the years included (used by the lists of options, F75). */
export function filterFacts(dataset, filters) {
  const ff = buildFactFilter(dataset, filters);
  let { yearFrom, yearTo } = filters;
  if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];
  return dataset.facts.filter((f) => f[1] >= yearFrom && f[1] <= yearTo && ff.pass(f) && ff.odsOk(f));
}

/** Rows of production by topic after applying the filters. */
function aggregateTopics(dataset, filters) {
  const { topics, facts, axes, topicAxes } = dataset;
  const { scope, policyDoc, centerIndex, facultyIndex, departmentIndex, pairLevel } = filters;
  let { yearFrom, yearTo } = filters;
  if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];

  const ff = buildFactFilter(dataset, filters);
  const { axisFilter, axisSelection, topicAllowed, documentTopics, odsPick } = ff;

  /* The new model counts 2010–2025 (F101); the legacy model of the test data keeps 2010–2025. */
  const windowYears = dataset.hasCapacityModel ? TREND_WINDOW_YEARS : LEGACY_TREND_WINDOW_YEARS;
  const windowIndex = new Map(windowYears.map((y, i) => [y, i]));
  const byTopic = topics.map(() => ({
    products: 0,
    citations: 0,
    yearCounts: windowYears.map(() => 0),
    recordProducts: 0,
    recordCitations: 0,
    /* Production outside the years of the call: before it and after it (F43b: informative tooltip of "sin producción"). */
    before: false,
    after: false,
  }));
  /* With the new model the trend window is always 2010–2025 and ignores the years filter (D-121). */
  const fixedWindow = dataset.hasCapacityModel;
  const groupCounts = new Map();
  const pies = { type: [0, 0, 0], quartile: [0, 0, 0, 0, 0], access: [0, 0, 0, 0, 0, 0, 0] };
  const details = dataset.hasFactDetails;
  const subregionCounts = new Array(dataset.subregions ? dataset.subregions.length : 0).fill(0);
  const odsCounts = new Array(dataset.ods ? dataset.ods.length : 0).fill(0);
  /* With an ODS chosen: products (with the other filters) without a record in OpenAlex; they have no ODS and stay out (F72). */
  let odsNoRecord = 0;
  const actorCounts = new Map();
  /* Works by Eje Temático from the axis–work pairs (facts[12]), by confidence level and axis filter. */
  const axisPairCounts = new Array(dataset.axes.length).fill(0);
  const maxPairCode = PAIR_LEVEL_MAX_CODE[pairLevel] ?? PAIR_LEVEL_MAX_CODE[PAIR_LEVEL.CORE];
  let products = 0;
  let citations = 0;
  let recordProducts = 0;
  let recordCitations = 0;

  for (const f of facts) {
    const topicIndex = f[0];
    const year = f[1];
    if (!ff.pass(f)) continue;
    /* ODS chosen: the other products do not reach the board, but they still count in the ranking of ODS so the choice can be changed. */
    if (!ff.odsOk(f)) {
      if (dataset.hasFactDetails && year >= yearFrom && year <= yearTo) {
        for (const [ods, score] of f[11]) if (score >= ODS_MIN_SCORE) odsCounts[ods - 1]++;
        if (f[14] !== 1) odsNoRecord++;
      }
      continue;
    }

    const inYears = year >= yearFrom && year <= yearTo;
    const w = windowIndex.get(year);
    const row = byTopic[topicIndex];
    if (fixedWindow && w !== undefined) row.yearCounts[w]++;
    if (!inYears) {
      if (year < yearFrom) row.before = true;
      else row.after = true;
      continue;
    }

    row.products++;
    row.citations += f[2];
    if (!fixedWindow && w !== undefined) row.yearCounts[w]++;
    products++;
    citations += f[2];
    if (fixedWindow && f[14] === 1) {
      row.recordProducts++;
      row.recordCitations += f[2];
      recordProducts++;
      recordCitations += f[2];
    }
    pies.type[f[3]]++;
    pies.quartile[f[4]]++;
    pies.access[f[5]]++;
    for (const g of f[9]) groupCounts.set(g, (groupCounts.get(g) || 0) + 1);
    if (details) {
      for (const s of f[10]) subregionCounts[s]++;
      for (const [ods, score] of f[11]) if (score >= ODS_MIN_SCORE) odsCounts[ods - 1]++;
      for (const a of f[13]) actorCounts.set(a, (actorCounts.get(a) || 0) + 1);
      for (const [axis, code] of f[12]) {
        if (code <= maxPairCode && (!axisFilter || axisFilter.has(axis))) axisPairCounts[axis]++;
      }
    }
  }

  return { byTopic, topicAllowed, axisFilter, axisSelection, groupCounts, pies, products, citations, recordProducts, recordCitations, subregionCounts, odsCounts, odsNoRecord, actorCounts, axisPairCounts };
}

/**
 * Citations of the leader institution of every topic, summed over the years of the filter
 * (denominator of the capacity ratio, D-122). The bundle has one row per topic, scope (0 world,
 * 1 Colombia) and year with the leader of that year, so the sum is over the leaders of each year.
 * Cached by years because the other filters do not change it.
 *
 * It also keeps, for every topic and scope, the institution that adds the most citations to that sum
 * (the "main referent" of the tooltip, F39): `worldTop` and `nationalTop` are indexes into
 * `inst_lider` (-1 when the topic has no leader).
 *
 * @returns {{ world: Float64Array, national: Float64Array, worldTop: Int32Array, nationalTop: Int32Array }}
 */
function leaderCitations(dataset, yearFrom, yearTo) {
  const key = `${yearFrom}-${yearTo}`;
  const cached = dataset.leaderCache.get(key);
  if (cached) return cached;
  const world = new Float64Array(dataset.topics.length);
  const national = new Float64Array(dataset.topics.length);
  const byInstitution = new Map();
  for (const [topic, scope, year, institution, , citations] of dataset.leaders) {
    if (year < yearFrom || year > yearTo) continue;
    (scope === 0 ? world : national)[topic] += citations;
    const key = `${scope}|${topic}|${institution}`;
    byInstitution.set(key, (byInstitution.get(key) || 0) + citations);
  }
  const worldTop = new Int32Array(dataset.topics.length).fill(-1);
  const nationalTop = new Int32Array(dataset.topics.length).fill(-1);
  const best = new Map();
  for (const [key, total] of byInstitution) {
    const [scope, topic, institution] = key.split("|").map(Number);
    const bestKey = `${scope}|${topic}`;
    if (!best.has(bestKey) || total > best.get(bestKey)[0]) best.set(bestKey, [total, institution]);
  }
  for (const [key, [, institution]] of best) {
    const [scope, topic] = key.split("|").map(Number);
    (scope === 0 ? worldTop : nationalTop)[topic] = institution;
  }
  const result = { world, national, worldTop, nationalTop };
  dataset.leaderCache.set(key, result);
  return result;
}

/** Window of the snapshot of the panels 1 and 2 (D-133): fixed, it ignores the years filter. */
export const SNAPSHOT_YEARS = Object.freeze([CAPACITY_WINDOW.from, CAPACITY_WINDOW.to]);

/**
 * Referent of every topic for the snapshot (D-133): one real institution, the one with the most
 * citations in 2010–2025 by topic and scope (0 world, 1 Colombia), measured in the same window as the
 * UdeA and independent of the years filter. It reads `ref_2125` of the bundle (B106); while the
 * bundle does not have it, the sum of the yearly leaders over 2010–2025 is used as a stopgap and
 * `source` says so (it is the calculation that D-133 replaces).
 *
 * @returns {{ world: Float64Array, national: Float64Array, worldTop: Int32Array, nationalTop: Int32Array, source: string }}
 */
function referentTable(dataset) {
  if (dataset.referentCache) return dataset.referentCache;
  let table;
  const rows = dataset.ref1025 || dataset.ref2125;
  if (rows) {
    const n = dataset.topics.length;
    table = { world: new Float64Array(n), national: new Float64Array(n), worldTop: new Int32Array(n).fill(-1), nationalTop: new Int32Array(n).fill(-1), source: dataset.ref1025 ? "ref_1025" : "ref_2125" };
    for (const [topic, scope, institution, , citations] of rows) {
      (scope === 0 ? table.world : table.national)[topic] = citations;
      (scope === 0 ? table.worldTop : table.nationalTop)[topic] = institution;
    }
  } else {
    table = { ...leaderCitations(dataset, SNAPSHOT_YEARS[0], SNAPSHOT_YEARS[1]), source: "lideres" };
  }
  dataset.referentCache = table;
  return table;
}

const sumOf = (values) => values.reduce((a, b) => a + b, 0);

/* Legacy unit (artifact data, `?source=mock`): old trend rules, substitute benchmark and categories. */
function makeLegacyUnit({ id, level, label, field, subfield, domain, products, citations, yearCounts, worldMean, topicsWithProduction, topicIndex }, options) {
  const { benchmark, trendRule, ratioBasis, thresholds } = options;
  const trend = trendOf(yearCounts, trendRule);
  const fwci = officialFwci({ citations, count: products, worldMean });
  const ratio = products ? benchmark.ratio({ id, level, citations, count: products, worldMean }, ratioBasis) : NaN;
  return {
    id,
    topicIndex,
    label,
    field,
    subfield,
    domain,
    products,
    citations,
    yearCounts,
    trend,
    fwci,
    ratio,
    topicsWithProduction,
    category: categoryOf({ products, trend, ratio }, thresholds),
  };
}

/**
 * Unit of the model of D-121 and D-122: trend by the slope of the window (always 2010–2025),
 * ratio = UdeA citations over the citations of the leader institution (cap 1), FWCI only over
 * the works with a record in OpenAlex, and the seven categories.
 *
 * Rule (b) of D-153 (F57) for a field or subfield: the ratio adds only the topics where the UdeA has
 * MIN_PRODUCTS_CLASSIFY or more products (`ratioCitations` over `leaderCitations`, both of those topics); the cap of 1
 * is on the ratio. `ratioTopics` counts those topics. A group with none has `ratio` null («no se calcula la razón»)
 * and, if it has production, the category «presencia puntual» (it is not classified by ratio).
 */
function makeUnit({ id, level, label, field, subfield, domain, products, citations, yearCounts, worldMean, topicsWithProduction, topicIndex, recordProducts, recordCitations, leaderCitations: leader, ratioCitations = citations, ratioTopics = null, referent = "", before = false, after = false }, options) {
  const windowTotal = sumOf(yearCounts);
  const trend = trendByBand(yearCounts);
  const noRatio = ratioTopics === 0;
  const ratio = noRatio ? null : leader > 0 ? Math.min(ratioCitations / leader, 1) : 0;
  const fwci = officialFwci({ citations: recordCitations, count: recordProducts, worldMean });
  return {
    id,
    topicIndex,
    label,
    field,
    subfield,
    domain,
    products,
    citations,
    yearCounts,
    windowTotal,
    indicative: windowTotal > 0 && windowTotal < MIN_TREND_VOLUME,
    trend,
    fwci,
    recordProducts,
    ratio,
    noRatio,
    ratioCitations,
    ratioTopics,
    /* A unit with a ratio but a leader of 0 citations has no real referent (F85, A1-01); measured: none with MIN_PRODUCTS_CLASSIFY or more products. */
    noReferent: !noRatio && leader <= 0,
    leaderCitations: leader,
    referent,
    before,
    after,
    topicsWithProduction,
    category: noRatio ? (windowTotal > 0 ? CATEGORY.PUNCTUAL : CATEGORY.NONE) : categoryByCapacity({ products: windowTotal, trend, ratio }, options.thresholds),
  };
}

/**
 * Computes everything Board 1 draws for a filter state.
 *
 * Two models. With the bundle of quyca (`dataset.hasCapacityModel`) it applies D-121 and D-122:
 * trend by the slope of the least-squares line over 2010–2025 (stable band ±TREND_BAND, window
 * independent of the years filter), capacity ratio against the leader institution of Colombia or
 * of the world (`filters.ratioBasis`; topics without a national reference use the world one),
 * seven categories, FWCI only over works with a record in OpenAlex. With the data of the artifact
 * (`?source=mock`, no leaders and no OpenAlex mark) it keeps the old calculation.
 *
 * @param {Object} dataset - From createDataset().
 * @param {Object} [filters] - Overrides of DEFAULT_FILTERS.
 * @param {Object} [config]
 * @param {import("./benchmark").BenchmarkProvider} [config.benchmark] - Injected benchmark (old model only).
 * @param {Object} [config.thresholds] - Overrides of DEFAULT_THRESHOLDS.
 * @returns {Object} result
 */
export function computeCapacity(dataset, filters = {}, config = {}) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const modern = dataset.hasCapacityModel;
  const options = {
    benchmark: config.benchmark || substituteBenchmark,
    thresholds: { ...DEFAULT_THRESHOLDS, ...config.thresholds },
    trendRule: f.trendRule || TREND_RULE.STRICT,
    ratioBasis: f.ratioBasis,
  };
  const agg = aggregateTopics(dataset, f);
  /* The panels 1 and 2 are a snapshot of 2010–2025 that ignores the years filter (D-133): the units, the
     categories and the calculator come from the products of those years with all the other filters. The
     rest of the board (products, citations, FWCI, groups, pies…) follows the years filter through `agg`. */
  const unitAgg = modern ? aggregateTopics(dataset, { ...f, yearFrom: SNAPSHOT_YEARS[0], yearTo: SNAPSHOT_YEARS[1] }) : agg;
  const leaders = modern ? referentTable(dataset) : null;
  /* Leader citations of a topic for the chosen reference; a topic without national reference uses the world one. */
  const referentOf = (topic) => {
    const top = f.ratioBasis === RATIO_BASIS.NATIONAL && dataset.nationalTopics.has(topic) ? leaders.nationalTop[topic] : leaders.worldTop[topic];
    return top >= 0 ? top : -1;
  };
  const leaderOf = (topic) =>
    f.ratioBasis === RATIO_BASIS.NATIONAL && dataset.nationalTopics.has(topic) ? leaders.national[topic] : leaders.world[topic];

  const minMass = options.thresholds.minProducts ?? MIN_PRODUCTS_CLASSIFY;
  // Units of the topic level; coarser dimensions are built from them.
  const topicUnits = dataset.topics.map((t, i) => {
    const r = unitAgg.byTopic[i];
    const base = {
      id: t.id,
      level: DIMENSION.TOPIC,
      label: t.t,
      field: t.f,
      subfield: t.sf,
      domain: t.d,
      products: r.products,
      citations: r.citations,
      yearCounts: r.yearCounts,
      worldMean: t.gm,
      topicsWithProduction: r.products ? 1 : 0,
      topicIndex: i,
    };
    return modern
      ? makeUnit({ ...base, recordProducts: r.recordProducts, recordCitations: r.recordCitations, leaderCitations: leaderOf(i), referent: dataset.leaderNames[referentOf(i)] || "", before: r.before, after: r.after }, options)
      : makeLegacyUnit(base, options);
  });

  let units;
  if (f.dimension === DIMENSION.TOPIC) {
    units = topicUnits.filter((_, i) => unitAgg.topicAllowed[i]);
  } else {
    const groups = new Map();
    topicUnits.forEach((u, i) => {
      if (!unitAgg.topicAllowed[i]) return;
      const t = dataset.topics[i];
      const key = f.dimension === DIMENSION.FIELD ? t.f : t.sf;
      let g = groups.get(key);
      if (!g) {
        g = { key, field: t.f, domain: t.d, subfield: f.dimension === DIMENSION.FIELD ? "" : t.sf, products: 0, citations: 0, worldWorks: 0, worldCitations: 0, yearCounts: (modern ? TREND_WINDOW_YEARS : LEGACY_TREND_WINDOW_YEARS).map(() => 0), topics: 0, recordProducts: 0, recordCitations: 0, leader: 0, ratioCitations: 0, ratioTopics: 0, referents: new Set(), before: false, after: false };
        groups.set(key, g);
      }
      g.products += u.products;
      g.citations += u.citations;
      g.worldWorks += t.gw;
      g.worldCitations += t.gw * t.gm;
      g.yearCounts = g.yearCounts.map((v, j) => v + u.yearCounts[j]);
      if (u.products) g.topics++;
      if (modern) {
        g.recordProducts += unitAgg.byTopic[i].recordProducts;
        g.recordCitations += unitAgg.byTopic[i].recordCitations;
        if (unitAgg.byTopic[i].before) g.before = true;
        if (unitAgg.byTopic[i].after) g.after = true;
        /* Rule (b), D-153: only the topics where the UdeA has MIN_PRODUCTS_CLASSIFY or more products add their
           citations to the numerator and their leader to the denominator. */
        if (u.windowTotal >= minMass) {
          g.leader += leaderOf(i);
          g.ratioCitations += u.citations;
          g.ratioTopics++;
          g.referents.add(referentOf(i));
        }
      }
    });
    units = [...groups.values()].map((g) => {
      const base = {
        id: g.key,
        level: f.dimension,
        label: g.key,
        field: g.field,
        subfield: g.subfield,
        domain: g.domain,
        products: g.products,
        citations: g.citations,
        yearCounts: g.yearCounts,
        worldMean: g.worldWorks ? g.worldCitations / g.worldWorks : 0,
        topicsWithProduction: g.topics,
        topicIndex: -1,
      };
      return modern
        ? makeUnit({ ...base, recordProducts: g.recordProducts, recordCitations: g.recordCitations, leaderCitations: g.leader, ratioCitations: g.ratioCitations, ratioTopics: g.ratioTopics, referent: g.referents.size === 1 ? dataset.leaderNames[[...g.referents][0]] || "" : "", before: g.before, after: g.after }, options)
        : makeLegacyUnit(base, options);
    });
  }

  const categoryOrder = modern ? CATEGORY_ORDER : CATEGORY_ORDER_LEGACY;
  const categoryCounts = Object.fromEntries(categoryOrder.map((c) => [c, 0]));
  units.forEach((u) => categoryCounts[u.category]++);

  /* Units without production in 2010–2025: some had production in other years and some none at all (F43b). */
  const noProduction = modern
    ? (() => {
        const none = units.filter((u) => u.category === CATEGORY.NONE);
        const otherYears = none.filter((u) => u.before || u.after).length;
        return { total: none.length, otherYears, never: none.length - otherYears };
      })()
    : null;

  // FWCI of the whole filtered set: citations per work over the world mean weighted by UdeA production.
  // With the new model only the works with a record in OpenAlex enter (the others have no citation data).
  let worldCitations = 0;
  let worldWorks = 0;
  topicUnits.forEach((u, i) => {
    if (!agg.topicAllowed[i]) return;
    const count = modern ? agg.byTopic[i].recordProducts : u.products;
    if (count) {
      worldCitations += dataset.topics[i].gm * count;
      worldWorks += count;
    }
  });
  const fwciProducts = modern ? agg.recordProducts : agg.products;
  const fwciCitations = modern ? agg.recordCitations : agg.citations;
  const setFwci = worldWorks && fwciProducts ? fwciCitations / fwciProducts / (worldCitations / worldWorks) : 0;

  // Units with production in the trend window, and how many of them have a trend that is only indicative (< MIN_TREND_VOLUME).
  const inWindow = units.filter((u) => (modern ? u.windowTotal > 0 : u.products > 0));
  const indicativeUnits = modern ? inWindow.filter((u) => u.indicative).length : 0;

  return {
    filters: f,
    model: modern ? "capacity" : "legacy",
    categoryOrder,
    benchmark: modern ? { id: "leader-institution", isMock: false } : { id: options.benchmark.id, isMock: options.benchmark.isMock },
    products: agg.products,
    citations: agg.citations,
    setFwci,
    /* Works with and without a record in OpenAlex among the filtered ones (the second have no citation data). */
    fwciBasis: modern ? { withRecord: agg.recordProducts, withoutRecord: agg.products - agg.recordProducts } : null,
    /* Window and source of the referent of the snapshot of the panels 1 and 2 (D-133). */
    snapshotYears: modern ? SNAPSHOT_YEARS : null,
    referentSource: modern ? leaders.source : null,
    noProduction,
    units,
    topicUnits,
    categoryCounts,
    unitsWithProduction: units.filter((u) => u.products > 0).length,
    /* Fields or subfields with production but without any topic of MIN_PRODUCTS_CLASSIFY or more products: no ratio (F57). */
    unitsWithoutRatio: units.filter((u) => u.noRatio && u.windowTotal > 0).length,
    unitsInWindow: inWindow.length,
    indicativeUnits,
    pies: agg.pies,
    groupCounts: agg.groupCounts,
    subregionCounts: agg.subregionCounts,
    odsCounts: agg.odsCounts,
    odsNoRecord: agg.odsNoRecord,
    actorCounts: agg.actorCounts,
    axisPairCounts: agg.axisPairCounts,
    topicAllowed: agg.topicAllowed,
    axisFilter: agg.axisFilter,
    /* Ejes chosen and what each topic has with all the filters (years included), for the table of the topics of the axis (F49). */
    axisSelection: agg.axisSelection,
    byTopic: agg.byTopic,
  };
}

/** Top 15 research groups by associated products (panel 3). */
export function rankGroups(dataset, result, limit = 15) {
  return [...result.groupCounts.entries()]
    .filter(([g]) => dataset.groups[g][3] !== 0) /* only UdeA groups (es_grupo_udea = 1) when the bundle says it (B112 M2, F50) */
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([g, value]) => ({ id: dataset.groups[g][0], label: dataset.groups[g][1], detail: dataset.groups[g][2], value }));
}

/**
 * Top 15 Eje Temático (panel 4). With the pairs of the bundle (facts[12]) it counts works per axis
 * at the chosen confidence level; without them (artifact) it counts topics with production.
 */
export function rankAxes(dataset, result, limit = 15) {
  if (dataset.hasFactDetails) {
    return result.axisPairCounts
      .map((value, e) => ({ e, value }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value || a.e - b.e)
      .slice(0, limit)
      .map(({ e, value }) => {
        const axis = dataset.axes[e];
        return { id: axis.id, label: axis.eje, fullLabel: `${axis.eje} — ${axis.agenda}`, detail: axis.clave.split("|").pop(), value };
      });
  }
  const counts = new Map();
  const lead = new Map();
  result.topicUnits.forEach((u, i) => {
    if (!result.topicAllowed[i] || !u.products) return;
    for (const e of dataset.topicAxes[i]) {
      if (result.axisFilter && !result.axisFilter.has(e)) continue;
      counts.set(e, (counts.get(e) || 0) + 1);
      if (u.category === CATEGORY.LEADER || u.category === CATEGORY.CONSOLIDATED) lead.set(e, (lead.get(e) || 0) + 1);
    }
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([e, value]) => {
      const axis = dataset.axes[e];
      return {
        id: axis.id,
        label: axis.eje,
        fullLabel: `${axis.eje} — ${axis.agenda}`,
        detail: axis.clave.split("|").pop() + (lead.get(e) ? ` · ${lead.get(e)} líder/cons.` : ""),
        value,
      };
    });
}

/** Top 12 goals (meta / reto / programa / estrategia) by number of Eje Temático (panel 6). */
export function rankGoals(dataset, result, limit = 12) {
  const map = new Map();
  for (const axis of dataset.axes) {
    if (result.axisFilter && !result.axisFilter.has(axis.id)) continue;
    if (result.axisSelection && !result.axisSelection.has(axis.id)) continue;
    const key = `${axis.agenda}|${axis.meta}`;
    const entry = map.get(key) || { axes: new Set(), axis };
    entry.axes.add(axis.id);
    map.set(key, entry);
  }
  return [...map.values()]
    .map((o) => ({
      id: `${o.axis.agenda}|${o.axis.meta}`,
      /* Full route of the goal (Línea › Componente › Programa); empty when the axis has no goal above it (F48b). */
      label: o.axis.meta,
      /* What follows the last « › »: the part that tells the goals apart. */
      end: o.axis.meta ? o.axis.meta.split(" › ").pop() : "",
      noParent: !o.axis.meta,
      detail: o.axis.agenda,
      value: o.axes.size,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Topics of the chosen Ejes Temáticos with their products and citations (table «Tópicos del Eje Temático», F49).
 * One row per topic linked to at least one chosen axis (`topics[i].link`), also the ones with 0 products with the
 * current filters, so the coverage is seen. A product counts once, in its main topic (facts[0]); products and
 * citations follow all the filters, the years included. With several axes the topics are the union and the
 * products are not counted twice. Sorted by products, highest first.
 *
 * @returns {{ index: number, id: string, label: string, products: number, citations: number, axes: string[] }[]}
 */
export function rankAxisTopics(dataset, result) {
  if (!result.axisSelection) return [];
  return dataset.topics
    .map((t, index) => {
      const linked = dataset.topicAxes[index].filter((e) => result.axisSelection.has(e));
      /* Link with the chosen axes: included (0) if it is in any of them, else frontier (1); null if the bundle has no state. */
      const states = dataset.topicAxes[index].map((e, k) => (result.axisSelection.has(e) ? dataset.topicLinkStates[index][k] : undefined)).filter((s) => s !== undefined);
      const state = states.length && states.every((s) => s !== null) ? Math.min(...states) : null;
      return { index, t, linked, state };
    })
    .filter((x) => x.linked.length)
    .map(({ index, t, linked, state }) => ({
      index,
      state,
      id: t.id,
      label: t.t,
      products: result.byTopic[index].products,
      citations: result.byTopic[index].citations,
      axes: linked.map((e) => dataset.axes[e].eje),
    }))
    .sort((a, b) => b.products - a.products || b.citations - a.citations || a.label.localeCompare(b.label));
}

/**
 * Row «Otros productos asignados al eje» (F50, D-147): products and citations of the filtered set whose main topic
 * is not one of the topics of the table, so that the table adds up to the cards (the pairs of facts[12] assign
 * the product to the axis; the table counts it in its main topic).
 *
 * @param {object} result - Result of the calculation.
 * @param {{ products: number, citations: number }[]} rows - Rows of rankAxisTopics.
 */
export function axisTopicsOther(result, rows) {
  const products = rows.reduce((a, r) => a + r.products, 0);
  const citations = rows.reduce((a, r) => a + r.citations, 0);
  return { products: result.products - products, citations: result.citations - citations };
}

/**
 * Non-academic actors of the filtered production, most frequent first (complement of Board 1).
 * Only for bundles that carry facts[13] and afils; "Otros (sin clasificar)" is left out as in
 * the artifact table.
 */
export function rankActors(dataset, result, limit = 22) {
  if (!dataset.afils || !dataset.actorTypes) return [];
  const unclassified = dataset.actorTypes.length - 1;
  return [...result.actorCounts.entries()]
    .filter(([a]) => dataset.afils[a][2] !== unclassified)
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([a, value]) => ({ name: dataset.afils[a][0], country: dataset.afils[a][1], type: dataset.actorTypes[dataset.afils[a][2]], products: value }));
}

/** ODS of the filtered production by number of products, most frequent first (panels 5 and 8). */
export function rankOds(dataset, result) {
  if (!dataset.ods) return [];
  return dataset.ods
    .map(([number, name, color], i) => ({ number, name, color, value: result.odsCounts[i] }))
    .sort((x, y) => y.value - x.value);
}
