/*
 * F75 (D-178): every filter with a list offers only the options that leave at least one product with all the other filters
 * applied and without its own; the chosen one stays. The options are read from the same function that filters the products.
 * The first block needs no server (small boards); the second runs the same property over the real bundles and measures the cost
 * of a change of filter from end to end, with the CPU at a quarter (one run, E2E_LIVE=1).
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, factOptionAvailability, filterFacts } from "../../lib/observatories/capacity";
import { createCollaborationDataset, filterWorks, workOptionAvailability } from "../../lib/observatories/collaboration";
import { DEFAULT_FOUNDATIONS_FILTERS, createFoundationsDataset, filterProducts, productOptionAvailability } from "../../lib/observatories/foundations";
import { onlyAvailable } from "../../lib/observatories/optionAvailability";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

/* ---------- Board 1 (small) ---------- */
const fact = (topic, year, pairs, facs, deps, cens) => [topic, year, 1, 0, 0, 0, facs, deps, cens, [0], [], [], pairs, [], 1];
const topic = (id) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link: [] });
const axis = (id, agenda, nivel) => ({ id, clave: `K${id}`, eje: `Eje ${id}`, agenda, nivel, meta: "M" });
const raw1 = {
  meta: {}, topics: [topic("T1"), topic("T2")],
  ejes: [axis(0, "Doc A", "Local"), axis(1, "Doc B", "Nacional"), axis(2, "Doc C", "Nacional")],
  facts: [
    fact(0, 2022, [[0, 0]], [0], [0], [0]), fact(0, 2023, [[0, 0], [1, 1]], [0, 1], [1], [0]), fact(1, 2022, [[1, 0]], [1], [2], [1]),
    fact(1, 2024, [[2, 0]], [2], [], [1]), fact(0, 2021, [[0, 2]], [0], [], [2]), // the last one: a low pair (not offered by default)
  ],
  groups: [["G0", "Grupo 0", "A1"]], cens: ["C0", "C1", "C2", "C3"], facs: ["F0", "F1", "F2", "F3"], deps: ["D0", "D1", "D2", "D3"], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100]], inst_lider: ["Inst"], ref_nacional: [0, 1],
};
const d1 = createDataset(raw1);
const T1 = {
  options: (f) => factOptionAvailability(d1, { ...computeBase1, ...f }),
  count: (f) => filterFacts(d1, { ...computeBase1, ...f }).length,
  dims: { scope: (v) => ({ scope: v }), policyDoc: (v) => ({ policyDoc: v }), axis: (v) => ({ axisIds: [v] }), center: (v) => ({ centerIndex: v }), unit: (v) => ({ facultyIndex: v }), subunit: (v) => ({ departmentIndex: v }) },
  universe: { scope: ["Local", "Departamental", "Nacional", "Internacional"], policyDoc: ["Doc A", "Doc B", "Doc C"], axis: [0, 1, 2], center: [0, 1, 2, 3], unit: [0, 1, 2, 3], subunit: [0, 1, 2, 3] },
};
const computeBase1 = { ...computeCapacity(d1, {}).filters };

/* ---------- Board 2 (small) ---------- */
const work = (topic, facs, deps, groups, countries = [], masks = 0) => [2022, 0, 0, 0, countries, [], facs, deps, groups, [], masks, 0, topic];
const raw2 = {
  sectors: ["academic", "company", "government", "nonprofit", "healthcare"], sectorsEs: ["A", "E", "G", "S", "H"], tipos: ["Artículo", "Capítulo", "Libro", "Apropiación social"],
  regions: [], countries: [], insts: [], depts: ["Antioquia"], groups: [{ id: "G0", n: "Grupo 0", c: 0, d: 0 }, { id: "G1", n: "Grupo 1", c: 1, d: 0 }], centros: ["C0", "C1", "C2"], deps: ["D0", "D1", "D2"], facs: ["F0", "F1", "F2"],
  subfields: ["S0", "S1", "S2"], sfField: ["F", "F", "F"], subregs: [], doms: [], projects: [],
  works: [work(0, [0], [0], [0]), work(0, [0, 1], [1], [1], [0]), work(1, [1], [], [0], [], 2), work(1, [2], [2], [1])],
  thesaurus: {
    agendas: [{ name: "Doc A", topics: [0] }, { name: "Doc B", topics: [1] }],
    ejes: [
      { id: 1, agenda: "Doc A", clave: "a", eje: "A", nivel: "N", topics: [0], direct: [0, 1], direct_conf: [0, 1] },
      { id: 2, agenda: "Doc B", clave: "b", eje: "B", nivel: "N", topics: [1], direct: [2], direct_conf: [0] },
    ],
  },
};
raw2.works[0][2] = 0; raw2.works[1][2] = 1; raw2.works[2][2] = 1; raw2.works[3][2] = 2;
const d2 = createCollaborationDataset(raw2);
const base2 = { scope: "", policyDoc: "", centerIndex: -1, yearFrom: 2010, yearTo: 2026, facultyIndex: -1, departmentIndex: -1, subfieldIndex: -1, axisId: -1 };
const T2 = {
  options: (f) => workOptionAvailability(d2, { ...base2, ...f }),
  count: (f) => filterWorks(d2, { ...base2, ...f }).length,
  dims: { scope: (v) => ({ scope: v }), policyDoc: (v) => ({ policyDoc: v }), axis: (v) => ({ axisId: v }), center: (v) => ({ centerIndex: v }), unit: (v) => ({ facultyIndex: v }), subunit: (v) => ({ departmentIndex: v }), subfield: (v) => ({ subfieldIndex: v }) },
  universe: { scope: ["local", "dep", "nal", "int"], policyDoc: ["Doc A", "Doc B"], axis: [1, 2], center: [0, 1, 2], unit: [0, 1, 2], subunit: [0, 1, 2], subfield: [0, 1, 2] },
};

/** The property: every option offered leaves at least one product; every option absent leaves none. */
function checkProperty(board, filters, skip = []) {
  /* The axes of another document or level are not offered (chain of F61 and F64) but an axis chosen overrides them, so for the axes only the first half holds. */
  const axisFree = !!(filters.policyDoc || filters.scope);
  const options = board.options(filters);
  for (const [dim, universe] of Object.entries(board.universe)) {
    if (skip.includes(dim)) continue;
    for (const v of universe) {
      const n = board.count({ ...filters, ...board.dims[dim](v) });
      if (options[dim].has(v)) expect(n, `${dim}=${v} is offered and leaves ${n}`).toBeGreaterThan(0);
      else if (!(dim === "axis" && axisFree)) expect(n, `${dim}=${v} is not offered and leaves ${n}`).toBe(0);
    }
  }
  return options;
}

test.describe("options with products (no server)", () => {
  test("Board 1: every option offered leaves a product and every one absent leaves none", () => {
    const none = checkProperty(T1, {});
    expect([...none.center].sort()).toEqual([0, 1, 2]); // C3 has no products
    expect([...none.axis].sort()).toEqual([0, 1, 2]);
    checkProperty(T1, { centerIndex: 1 });
    checkProperty(T1, { facultyIndex: 0 });
    checkProperty(T1, { policyDoc: "Doc B" });
    checkProperty(T1, { scope: "Nacional" });
    checkProperty(T1, { scope: "Nacional", policyDoc: "Doc B" });
    checkProperty(T1, {}, []);
  });

  test("Board 1: with an axis chosen the scope and the document only show the ones that contain it (D-163)", () => {
    const o = T1.options({ axisIds: [1] });
    expect([...o.scope]).toEqual(["Nacional"]);
    expect([...o.policyDoc]).toEqual(["Doc B"]);
    checkProperty(T1, { axisIds: [1] }, ["scope", "policyDoc"]);
  });

  test("Board 1: scope and document are one condition on the axes: while one is chosen the other lists only what its axes have", () => {
    expect([...T1.options({ policyDoc: "Doc A" }).scope]).toEqual(["Local"]);
    expect([...T1.options({ scope: "Local" }).policyDoc]).toEqual(["Doc A"]);
    expect([...T1.options({ scope: "Nacional" }).policyDoc].sort()).toEqual(["Doc B", "Doc C"]);
  });

  test("Board 2: the same property, with the axis and the document", () => {
    checkProperty(T2, {});
    checkProperty(T2, { centerIndex: 1 });
    checkProperty(T2, { facultyIndex: 1 });
    checkProperty(T2, { policyDoc: "Doc A" });
    checkProperty(T2, { subfieldIndex: 1 });
    checkProperty(T2, { scope: "int" });
    const o = T2.options({ axisId: 2 });
    expect([...o.policyDoc]).toEqual(["Doc B"]);
    checkProperty(T2, { axisId: 2 }, ["policyDoc"]);
  });

  test("the chosen option always stays, also when it has no products", () => {
    const options = [{ value: 0, label: "A" }, { value: 1, label: "B" }, { value: 2, label: "C" }];
    expect(onlyAvailable(options, new Set([0]), -1).map((o) => o.value)).toEqual([0]);
    expect(onlyAvailable(options, new Set([0]), 2).map((o) => o.value)).toEqual([0, 2]);
    expect(onlyAvailable(options, undefined, -1)).toBe(options); // lists not calculated yet: everything
    const groups = [{ label: "G1", options: [{ value: 0 }, { value: 1 }] }, { label: "G2", options: [{ value: 2 }] }];
    expect(onlyAvailable(groups, new Set([0]), -1)).toEqual([{ label: "G1", options: [{ value: 0 }] }]); // a group without options goes
  });

  test("a chosen value with no products is not cleared: the board shows no data and the list keeps the value", () => {
    const f = { centerIndex: 3 }; // C3: no facts
    expect(T1.count(f)).toBe(0);
    /* the list of centres is calculated without its own filter: the other centres are offered, and the chosen one is kept by the interface */
    expect([...T1.options(f).center].sort()).toEqual([0, 1, 2]);
    expect(onlyAvailable([{ value: 3, label: "C3" }], T1.options(f).center, 3)).toHaveLength(1);
  });
});

/* ---------- live ---------- */
const sample = (list, n) => (list.length <= n ? list : Array.from({ length: n }, (_, i) => list[Math.floor((i * list.length) / n)]));

test.describe("options with products against the real bundles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("Boards 1, 2 and 3: the property in four scenarios, and the options hidden by scenario", async ({ request }) => {
    test.setTimeout(280000);
    const get = async (n) => (await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();
    const [b1, b2, b3] = [await get(1), await get(2), await get(3)];
    for (const p of b3.P) if (p[0] === 0) p[0] = null;
    const l1 = createDataset(b1);
    const l2 = createCollaborationDataset({ ...b2, funders: b2.ext.funders });
    const l3 = createFoundationsDataset({ ...b3, artes: { ...b3.artes, prof: b3.artes.prof.map(({ id, ...r }) => r) } });
    const base1 = { ...computeCapacity(l1, {}).filters };
    const hidden = [];
    const run = (name, scenario, board, filters, universe, dims, count, optionsOf, skip = []) => {
      const options = optionsOf(filters);
      let bad = 0;
      const out = {};
      for (const [dim, all] of Object.entries(universe)) {
        if (skip.includes(dim)) continue;
        out[dim] = `${all.length - [...all].filter((v) => options[dim].has(v)).length} of ${all.length} hidden`;
        const offered = all.filter((v) => options[dim].has(v));
        const absent = all.filter((v) => !options[dim].has(v));
        for (const v of sample(offered, 12)) if (!(count({ ...filters, ...dims[dim](v) }) > 0)) bad++;
        /* an axis of another document is not offered but an axis chosen overrides the document (F61, D-163): only the first half holds for it */
        if (!(dim === "axis" && (filters.policyDoc || filters.scope))) for (const v of sample(absent, 12)) if (count({ ...filters, ...dims[dim](v) }) !== 0) bad++;
      }
      hidden.push(`${name} ${scenario}: ${Object.entries(out).map(([k, v]) => `${k} ${v}`).join("; ")}${bad ? ` | VIOLATIONS ${bad}` : ""}`);
      return bad;
    };
    const u1 = { scope: ["Local", "Departamental", "Nacional", "Internacional"], policyDoc: l1.policyDocs, axis: l1.axes.map((e) => e.id), center: l1.centers.map((_, i) => i), unit: l1.faculties.map((_, i) => i), subunit: l1.departments.map((_, i) => i) };
    const d1m = { scope: (v) => ({ scope: v }), policyDoc: (v) => ({ policyDoc: v }), axis: (v) => ({ axisIds: [v] }), center: (v) => ({ centerIndex: v }), unit: (v) => ({ facultyIndex: v }), subunit: (v) => ({ departmentIndex: v }) };
    const u2 = { scope: ["local", "dep", "nal", "int"], policyDoc: l2.policyDocs, axis: [...l2.axisById.keys()], center: b2.centros.map((_, i) => i), unit: b2.facs.map((_, i) => i), subunit: b2.deps.map((_, i) => i), subfield: b2.subfields.map((_, i) => i) };
    const d2m = { scope: (v) => ({ scope: v }), policyDoc: (v) => ({ policyDoc: v }), axis: (v) => ({ axisId: v }), center: (v) => ({ centerIndex: v }), unit: (v) => ({ facultyIndex: v }), subunit: (v) => ({ departmentIndex: v }), subfield: (v) => ({ subfieldIndex: v }) };
    const base2l = { scope: "", policyDoc: "", centerIndex: -1, yearFrom: 2010, yearTo: 2026, facultyIndex: -1, departmentIndex: -1, subfieldIndex: -1, axisId: -1 };
    const centre1 = (() => { const c = new Array(l1.centers.length).fill(0); for (const f of l1.facts) for (const x of f[8]) c[x]++; return c.indexOf(Math.max(...c)); })();
    const centre2 = (() => { const c = new Array(b2.centros.length).fill(0); for (const w of l2.raw.works) for (const g of w[8]) if (l2.groupCenter[g] >= 0) c[l2.groupCenter[g]]++; return c.indexOf(Math.max(...c)); })();
    let violations = 0;
    // Board 1
    const o1 = (f) => factOptionAvailability(l1, { ...base1, ...f });
    const c1 = (f) => filterFacts(l1, { ...base1, ...f }).length;
    violations += run("T1", "none", 1, {}, u1, d1m, c1, o1);
    violations += run("T1", "centre", 1, { centerIndex: centre1 }, u1, d1m, c1, o1);
    violations += run("T1", "axis 98", 1, { axisIds: [98] }, u1, d1m, c1, o1, ["scope", "policyDoc"]);
    violations += run("T1", "document CONPES 4144", 1, { policyDoc: "CONPES 4144" }, u1, d1m, c1, o1);
    // Board 2
    const o2 = (f) => workOptionAvailability(l2, { ...base2l, ...f });
    const c2 = (f) => filterWorks(l2, { ...base2l, ...f }).length;
    violations += run("T2", "none", 2, {}, u2, d2m, c2, o2);
    violations += run("T2", "centre", 2, { centerIndex: centre2 }, u2, d2m, c2, o2);
    violations += run("T2", "axis 98", 2, { axisId: 98 }, u2, d2m, c2, o2, ["policyDoc"]);
    violations += run("T2", "document CONPES 4144", 2, { policyDoc: "CONPES 4144" }, u2, d2m, c2, o2);
    expect(Object.keys(o2({ axisId: 98 }))).toContain("policyDoc");
    expect([...o2({ axisId: 98 }).policyDoc]).toEqual([l2.axisById.get(98).agenda]);
    // Board 3 (with the expansion by topics of X-05 the property is approximate: the violations are reported, not hidden)
    const base3 = DEFAULT_FOUNDATIONS_FILTERS;
    const docs3 = (b3.agendas || []).map((n) => b3.agendas_all.indexOf(n));
    const u3 = { scope: [0, 1, 2, 3], policyDoc: docs3, center: b3.centros.map((_, i) => i), unit: b3.facs.map((_, i) => i), subunit: b3.deps.map((_, i) => i), subfield: b3.subs.map((_, i) => i) };
    const d3m = { scope: (v) => ({ scopeIndex: v }), policyDoc: (v) => ({ policyIndex: v }), center: (v) => ({ centerIndex: v }), unit: (v) => ({ facultyIndex: v }), subunit: (v) => ({ departmentIndex: v }), subfield: (v) => ({ subfieldIndex: v }) };
    const o3 = (f) => productOptionAvailability(l3, { ...base3, ...f });
    const c3 = (f) => filterProducts(l3, { ...base3, ...f }).F.length;
    const centre3 = (() => { const c = new Array(b3.centros.length).fill(0); for (const p of l3.products) for (const g of p[12]) { for (let k = 0; k < l3.centerGroups.length; k++) if (l3.centerGroups[k].has(g)) c[k]++; } return c.indexOf(Math.max(...c)); })();
    const v3none = run("T3", "none", 3, {}, u3, d3m, c3, o3);
    const v3centre = run("T3", "centre", 3, { centerIndex: centre3 }, u3, d3m, c3, o3);
    console.log(`[live] options by scenario:\n${hidden.join("\n")}`);
    expect(violations).toBe(0); // Boards 1 and 2: exact
    expect(v3none).toBe(0);
    console.log(`[live] T3 with a centre chosen: ${v3centre} violation(s) of the property (expansion by topics, X-05)`);
    expect([...o3({}).policyDoc].every((i) => docs3.includes(i))).toBe(true); // the 4 documents without axes are not offered
  });
});
