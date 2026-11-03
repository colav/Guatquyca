/* Constants & utils */
import {
  CATEGORY,
  CATEGORY_ORDER,
  DEFAULT_THRESHOLDS,
  DIMENSION,
  RATIO_BASIS,
  TREND_RULE,
  TREND_WINDOW_YEARS,
  YEAR_RANGE,
} from "./constants";
import { categoryOf } from "./category";
import { officialFwci } from "./fwci";
import { substituteBenchmark } from "./benchmark";
import { trendOf } from "./trend";

/**
 * Pure computation of Board 1 (no React, no DOM). It is a port of compute() and aggregate() of
 * the published artifact, with the filter state passed as a parameter.
 *
 * Dataset shape (adapter of the artifact JSON, see data/artifactAdapter.js):
 *   topics[]  { id, t, sf, f, d, gm (world mean citations per work), gw (world works), link: [[axisId, n]] }
 *   facts[]   [topicIndex, year, citations, type, quartile, oa, facultyIdx[], departmentIdx[], centerIdx[], groupIdx[]]
 *   axes[]    { id, clave, eje, agenda, nivel, meta }
 *   groups[]  [code, name, Minciencias category]
 */

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
  trendRule: TREND_RULE.STRICT,
  ratioBasis: RATIO_BASIS.GLOBAL,
});

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
    topicAxes,
    policyDocs: [...new Set(raw.ejes.map((e) => e.agenda))],
    scopes: [...new Set(raw.ejes.map((e) => e.nivel))],
  };
}

/** Rows of production by topic after applying the filters. */
function aggregateTopics(dataset, filters) {
  const { topics, facts, axes, topicAxes } = dataset;
  const { scope, policyDoc, centerIndex, facultyIndex, departmentIndex } = filters;
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
  }));
  const groupCounts = new Map();
  const pies = { type: [0, 0, 0], quartile: [0, 0, 0, 0, 0], access: [0, 0, 0, 0, 0, 0, 0] };
  let products = 0;
  let citations = 0;

  for (const f of facts) {
    const topicIndex = f[0];
    const year = f[1];
    if (!topicAllowed[topicIndex]) continue;
    if (year < yearFrom || year > yearTo) continue;
    if (facultyIndex >= 0 && !f[6].includes(facultyIndex)) continue;
    if (departmentIndex >= 0 && !f[7].includes(departmentIndex)) continue;
    if (centerIndex >= 0 && !f[8].includes(centerIndex)) continue;

    const row = byTopic[topicIndex];
    row.products++;
    row.citations += f[2];
    const w = windowIndex.get(year);
    if (w !== undefined) row.yearCounts[w]++;
    products++;
    citations += f[2];
    pies.type[f[3]]++;
    pies.quartile[f[4]]++;
    pies.access[f[5]]++;
    for (const g of f[9]) groupCounts.set(g, (groupCounts.get(g) || 0) + 1);
  }

  return { byTopic, topicAllowed, axisFilter, groupCounts, pies, products, citations };
}

function makeUnit({ id, level, label, field, subfield, domain, products, citations, yearCounts, worldMean, topicsWithProduction, topicIndex }, options) {
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
 * Computes everything Board 1 draws for a filter state.
 *
 * @param {Object} dataset - From createDataset().
 * @param {Object} [filters] - Overrides of DEFAULT_FILTERS.
 * @param {Object} [config]
 * @param {import("./benchmark").BenchmarkProvider} [config.benchmark] - Injected benchmark.
 * @param {Object} [config.thresholds] - Overrides of DEFAULT_THRESHOLDS.
 * @returns {Object} result
 */
export function computeCapacity(dataset, filters = {}, config = {}) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const options = {
    benchmark: config.benchmark || substituteBenchmark,
    thresholds: { ...DEFAULT_THRESHOLDS, ...config.thresholds },
    trendRule: f.trendRule,
    ratioBasis: f.ratioBasis,
  };
  const agg = aggregateTopics(dataset, f);

  // Units of the topic level; coarser dimensions are built from them.
  const topicUnits = dataset.topics.map((t, i) => {
    const r = agg.byTopic[i];
    return makeUnit(
      {
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
      },
      options,
    );
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
        g = { key, field: t.f, domain: t.d, subfield: f.dimension === DIMENSION.FIELD ? "" : t.sf, products: 0, citations: 0, worldWorks: 0, worldCitations: 0, yearCounts: TREND_WINDOW_YEARS.map(() => 0), topics: 0 };
        groups.set(key, g);
      }
      g.products += u.products;
      g.citations += u.citations;
      g.worldWorks += t.gw;
      g.worldCitations += t.gw * t.gm;
      g.yearCounts = g.yearCounts.map((v, j) => v + u.yearCounts[j]);
      if (u.products) g.topics++;
    });
    units = [...groups.values()].map((g) =>
      makeUnit(
        {
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
        },
        options,
      ),
    );
  }

  const categoryCounts = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0]));
  units.forEach((u) => categoryCounts[u.category]++);

  // FWCI of the whole filtered set: citations per work over the world mean weighted by UdeA production.
  let worldCitations = 0;
  let worldWorks = 0;
  topicUnits.forEach((u, i) => {
    if (agg.topicAllowed[i] && u.products) {
      worldCitations += dataset.topics[i].gm * u.products;
      worldWorks += u.products;
    }
  });
  const setFwci = worldWorks && agg.products ? agg.citations / agg.products / (worldCitations / worldWorks) : 0;

  return {
    filters: f,
    benchmark: { id: options.benchmark.id, isMock: options.benchmark.isMock },
    products: agg.products,
    citations: agg.citations,
    setFwci,
    units,
    topicUnits,
    categoryCounts,
    unitsWithProduction: units.filter((u) => u.products > 0).length,
    pies: agg.pies,
    groupCounts: agg.groupCounts,
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

/** Top 15 Eje Temático by topics with production (panel 4). */
export function rankAxes(dataset, result, limit = 15) {
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
