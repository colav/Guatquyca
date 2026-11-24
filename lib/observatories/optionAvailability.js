/**
 * Lists of options with results (F75, D-178). Each filter with a list offers only the options that leave at least one product
 * with all the other filters applied and without its own, so the user can change the option; the chosen one always stays
 * (the interface keeps it). The products come from the same function that filters the board (the single definition of «this
 * product passes»), so a later change of a rule (X-05) reaches the lists without rewriting them.
 *
 * Cost: one pass over the filtered products for every filter that is not chosen (they share it) and one more filtering for every
 * filter that is chosen (its own filter is taken off), plus the pass that reads the options.
 *
 * @param {Object} config
 * @param {Array} config.items - Products that pass all the filters.
 * @param {{ key: string, chosen: boolean }[]} config.dims - Filters with list; `chosen` = it has a value.
 * @param {(key: string) => Array} config.without - Products that pass all the filters but the one of `key`.
 * @param {(key: string, item: *, set: Set) => void} config.visit - Reads the options of a product for a filter and adds them to `set`.
 * @returns {Object<string, Set>} For each filter, the set of options with products.
 */
export function availableOptions({ items, dims, without, visit }) {
  const out = {};
  const lists = new Map();
  for (const d of dims) {
    out[d.key] = new Set();
    const list = d.chosen ? without(d.key) : items;
    if (!lists.has(list)) lists.set(list, []);
    lists.get(list).push(d.key);
  }
  for (const [list, keys] of lists) {
    for (const item of list) {
      for (const key of keys) visit(key, item, out[key]);
    }
  }
  return out;
}

/** The time of a computation, in milliseconds, for the performance probe of the tests (`window.__obsPerf`, empty in production). */
export function timed(label, fn) {
  if (typeof window === "undefined" || !Array.isArray(window.__obsPerf)) return fn();
  const t0 = performance.now();
  const result = fn();
  window.__obsPerf.push({ label, ms: performance.now() - t0 });
  return result;
}

/**
 * Keeps in a list of options only the ones with products; the chosen ones always stay (F75, D-178). Works on flat lists and on
 * lists in groups (a group without options is dropped). Without the set (the lists are not calculated yet) it keeps everything.
 *
 * @param {Array} options - `{ value, label }` or `{ label, options: [...] }`.
 * @param {Set|undefined} available - Values with products.
 * @param {*} chosen - Value or list of values chosen.
 */
export function onlyAvailable(options, available, chosen) {
  if (!available) return options;
  /* Same list, same set and same choice give the same array: the Select of Ant does not rebuild its tree on every render. */
  const chosenKey = Array.isArray(chosen) ? chosen.join(",") : String(chosen);
  let bySet = shownCache.get(options);
  if (!bySet) shownCache.set(options, (bySet = new WeakMap()));
  let byChoice = bySet.get(available);
  if (!byChoice) bySet.set(available, (byChoice = new Map()));
  if (byChoice.has(chosenKey)) return byChoice.get(chosenKey);
  const keep = new Set(Array.isArray(chosen) ? chosen : [chosen]);
  const ok = (o) => available.has(o.value) || keep.has(o.value);
  const shown = options.map((o) => (o.options ? { ...o, options: o.options.filter(ok) } : o)).filter((o) => (o.options ? o.options.length > 0 : ok(o)));
  byChoice.set(chosenKey, shown);
  return shown;
}
const shownCache = new WeakMap();

/**
 * Memoizes a filtering function by dataset and filters (the last 16): the board counts with the filters applied and the lists of
 * options read the same products, so the second call is free (F75).
 */
export function memoByFilters(fn) {
  const caches = new WeakMap();
  return (ds, filters) => {
    let m = caches.get(ds);
    if (!m) caches.set(ds, (m = new Map()));
    const key = JSON.stringify(Object.keys(filters).sort().map((k) => [k, filters[k]]));
    if (m.has(key)) return m.get(key);
    const value = fn(ds, filters);
    m.set(key, value);
    if (m.size > 16) m.delete(m.keys().next().value);
    return value;
  };
}

/** Callback of `React.Profiler` for the performance probe of the tests (`window.__obsPerf`, empty in production). */
export function profileRender(id, phase, actualDuration) {
  if (typeof window !== "undefined" && Array.isArray(window.__obsPerf)) window.__obsPerf.push({ label: `render:${id}:${phase}`, ms: actualDuration });
}

/** Text under the filters (F75): the lists show only what has products. */
export const OPTIONS_NOTE = "Las listas muestran solo las opciones con productos para los otros filtros elegidos.";
