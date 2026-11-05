/* Constants & utils */
import {
  CATEGORY,
  CATEGORY_ORDER,
  CATEGORY_ORDER_LEGACY,
  DEFAULT_THRESHOLDS,
  DIMENSION,
  MIN_TREND_VOLUME,
  PAIR_LEVEL,
  PAIR_LEVEL_MAX_CODE,
  RATIO_BASIS,
  TREND_RULE,
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
  return {
    meta: raw.meta,
    topics: raw.topics,
    facts: raw.facts,
    axes: raw.ejes,
    groups: raw.groups,
    centers: raw.cens,
    faculties: raw.facs,
    departments: raw.deps,
    subregions: raw.subregiones,
    actors: raw.actores,
    afils: raw.afils || null,
    actorTypes: raw.actor_tipos || null,
    ods: raw.ods || null,
    hasFactDetails: Array.isArray(raw.facts[0]) && raw.facts[0].length >= 14,
    /* Model of D-121 and D-122: needs the leaders by year and the OpenAlex mark of each work. */
    hasCapacityModel: Array.isArray(raw.lideres) && raw.lideres.length > 0 && Array.isArray(raw.facts[0]) && raw.facts[0].length >= 15,
    leaders: raw.lideres || null,
    leaderNames: raw.inst_lider || [],
    nationalTopics: new Set(raw.ref_nacional || []),
    leaderCache: new Map(),
    /* Works that belong to some research centre (facts[8] not empty) over all the works (D-124). */
    centerCoverage: { withCenter: raw.facts.filter((f) => f[8].length > 0).length, total: raw.facts.length },
    topicAxes,
    policyDocs: documentsWithAxes(raw),
    scopes: [...new Set(raw.ejes.map((e) => e.nivel))],
  };
}

/** Rows of production by topic after applying the filters. */
function aggregateTopics(dataset, filters) {
  const { topics, facts, axes, topicAxes } = dataset;
  const { scope, policyDoc, centerIndex, facultyIndex, departmentIndex, pairLevel } = filters;
  let { yearFrom, yearTo } = filters;
  if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];

  let axisFilter = null;
  if (scope || policyDoc) {
    axisFilter = new Set(
      axes
        .filter((e) => (!scope || e.nivel === scope) && (!policyDoc || e.agenda === policyDoc))
        .map((e) => e.id),
    );
  }
  const topicAllowed = topics.map((_, i) => !axisFilter || topicAxes[i].some((e) => axisFilter.has(e)));

  const windowIndex = new Map(TREND_WINDOW_YEARS.map((y, i) => [y, i]));
  const byTopic = topics.map(() => ({
    products: 0,
    citations: 0,
    yearCounts: TREND_WINDOW_YEARS.map(() => 0),
    recordProducts: 0,
    recordCitations: 0,
  }));
  /* With the new model the trend window is always 2021–2025 and ignores the years filter (D-121). */
  const fixedWindow = dataset.hasCapacityModel;
  const groupCounts = new Map();
  const pies = { type: [0, 0, 0], quartile: [0, 0, 0, 0, 0], access: [0, 0, 0, 0, 0, 0, 0] };
  const details = dataset.hasFactDetails;
  const subregionCounts = new Array(dataset.subregions ? dataset.subregions.length : 0).fill(0);
  const odsCounts = new Array(dataset.ods ? dataset.ods.length : 0).fill(0);
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
    if (!topicAllowed[topicIndex]) continue;
    if (facultyIndex >= 0 && !f[6].includes(facultyIndex)) continue;
    if (departmentIndex >= 0 && !f[7].includes(departmentIndex)) continue;
    if (centerIndex >= 0 && !f[8].includes(centerIndex)) continue;

    const inYears = year >= yearFrom && year <= yearTo;
    const w = windowIndex.get(year);
    const row = byTopic[topicIndex];
    if (fixedWindow && w !== undefined) row.yearCounts[w]++;
    if (!inYears) continue;

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

  return { byTopic, topicAllowed, axisFilter, groupCounts, pies, products, citations, recordProducts, recordCitations, subregionCounts, odsCounts, actorCounts, axisPairCounts };
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
 * Unit of the model of D-121 and D-122: trend by the slope of the window (always 2021–2025),
 * ratio = UdeA citations over the citations of the leader institution (cap 1), FWCI only over
 * the works with a record in OpenAlex, and the seven categories.
 */
function makeUnit({ id, level, label, field, subfield, domain, products, citations, yearCounts, worldMean, topicsWithProduction, topicIndex, recordProducts, recordCitations, leaderCitations: leader, referent = "" }, options) {
  const windowTotal = sumOf(yearCounts);
  const trend = trendByBand(yearCounts);
  const ratio = leader > 0 ? Math.min(citations / leader, 1) : 0;
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
    leaderCitations: leader,
    referent,
    topicsWithProduction,
    category: categoryByCapacity({ products: windowTotal, trend, ratio }, options.thresholds),
  };
}

/**
 * Computes everything Board 1 draws for a filter state.
 *
 * Two models. With the bundle of quyca (`dataset.hasCapacityModel`) it applies D-121 and D-122:
 * trend by the slope of the least-squares line over 2021–2025 (stable band ±TREND_BAND, window
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

  let [yearFrom, yearTo] = [f.yearFrom, f.yearTo];
  if (yearFrom > yearTo) [yearFrom, yearTo] = [yearTo, yearFrom];
  const leaders = modern ? leaderCitations(dataset, yearFrom, yearTo) : null;
  /* Leader citations of a topic for the chosen reference; a topic without national reference uses the world one. */
  const referentOf = (topic) => {
    const top = f.ratioBasis === RATIO_BASIS.NATIONAL && dataset.nationalTopics.has(topic) ? leaders.nationalTop[topic] : leaders.worldTop[topic];
    return top >= 0 ? top : -1;
  };
  const leaderOf = (topic) =>
    f.ratioBasis === RATIO_BASIS.NATIONAL && dataset.nationalTopics.has(topic) ? leaders.national[topic] : leaders.world[topic];

  // Units of the topic level; coarser dimensions are built from them.
  const topicUnits = dataset.topics.map((t, i) => {
    const r = agg.byTopic[i];
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
      ? makeUnit({ ...base, recordProducts: r.recordProducts, recordCitations: r.recordCitations, leaderCitations: leaderOf(i), referent: dataset.leaderNames[referentOf(i)] || "" }, options)
      : makeLegacyUnit(base, options);
  });

  let units;
  if (f.dimension === DIMENSION.TOPIC) {
    units = topicUnits.filter((_, i) => agg.topicAllowed[i]);
  } else {
    const groups = new Map();
    topicUnits.forEach((u, i) => {
      if (!agg.topicAllowed[i]) return;
      const t = dataset.topics[i];
      const key = f.dimension === DIMENSION.FIELD ? t.f : t.sf;
      let g = groups.get(key);
      if (!g) {
        g = { key, field: t.f, domain: t.d, subfield: f.dimension === DIMENSION.FIELD ? "" : t.sf, products: 0, citations: 0, worldWorks: 0, worldCitations: 0, yearCounts: TREND_WINDOW_YEARS.map(() => 0), topics: 0, recordProducts: 0, recordCitations: 0, leader: 0, referents: new Set() };
        groups.set(key, g);
      }
      g.products += u.products;
      g.citations += u.citations;
      g.worldWorks += t.gw;
      g.worldCitations += t.gw * t.gm;
      g.yearCounts = g.yearCounts.map((v, j) => v + u.yearCounts[j]);
      if (u.products) g.topics++;
      if (modern) {
        g.recordProducts += agg.byTopic[i].recordProducts;
        g.recordCitations += agg.byTopic[i].recordCitations;
        /* Only the topics where the UdeA has production add their leader to the denominator. */
        if (u.products) {
          g.leader += leaderOf(i);
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
        ? makeUnit({ ...base, recordProducts: g.recordProducts, recordCitations: g.recordCitations, leaderCitations: g.leader, referent: g.referents.size === 1 ? dataset.leaderNames[[...g.referents][0]] || "" : "" }, options)
        : makeLegacyUnit(base, options);
    });
  }

  const categoryOrder = modern ? CATEGORY_ORDER : CATEGORY_ORDER_LEGACY;
  const categoryCounts = Object.fromEntries(categoryOrder.map((c) => [c, 0]));
  units.forEach((u) => categoryCounts[u.category]++);

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
    units,
    topicUnits,
    categoryCounts,
    unitsWithProduction: units.filter((u) => u.products > 0).length,
    unitsInWindow: inWindow.length,
    indicativeUnits,
    pies: agg.pies,
    groupCounts: agg.groupCounts,
    subregionCounts: agg.subregionCounts,
    odsCounts: agg.odsCounts,
    actorCounts: agg.actorCounts,
    axisPairCounts: agg.axisPairCounts,
    topicAllowed: agg.topicAllowed,
    axisFilter: agg.axisFilter,
  };
}

/** Top 15 research groups by associated products (panel 3). */
export function rankGroups(dataset, result, limit = 15) {
  return [...result.groupCounts.entries()]
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
    const key = `${axis.agenda}|${axis.meta}`;
    const entry = map.get(key) || { axes: new Set(), axis };
    entry.axes.add(axis.id);
    map.set(key, entry);
  }
  return [...map.values()]
    .map((o) => ({ id: `${o.axis.agenda}|${o.axis.meta}`, label: o.axis.meta, detail: o.axis.agenda, value: o.axes.size }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
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
