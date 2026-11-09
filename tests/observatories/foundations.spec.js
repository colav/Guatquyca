/* Tests of the base-capacities model of Board 3 against the numbers of the published artifact. */
import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import {
  AGE_GROUPS,
  CONTRACTS,
  DEFAULT_FOUNDATIONS_FILTERS,
  SEX_LABELS,
  computeFoundations,
  createFoundationsDataset,
  parseFoundationsFilters,
  serializeFoundationsFilters,
} from "../../lib/observatories/foundations";
import { withoutPersonalIdentifiers } from "../../lib/observatories/data/capacidadesAdapter";

const MOCK_FILE = path.join(__dirname, "..", "..", "mock-data", "observatories", "vri-udea-board-3.json");
const ORIGINAL = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "board-3-original.json"), "utf8"));
const fmt = (n) => Number(n).toLocaleString("es-CO");
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1).replace(".", ",")} %` : "–");

test.describe("URL filters of Board 3", () => {
  test("round trip, defaults and invalid values", () => {
    expect(serializeFoundationsFilters(DEFAULT_FOUNDATIONS_FILTERS)).toBe("");
    const filters = { ...DEFAULT_FOUNDATIONS_FILTERS, scopeIndex: 3, policyIndex: 1, centerIndex: 1, yearFrom: 2018, yearTo: 2022, facultyIndex: 7 };
    expect(parseFoundationsFilters(new URLSearchParams(serializeFoundationsFilters(filters)))).toEqual(filters);
    const invalid = parseFoundationsFilters(new URLSearchParams("scope=9&from=abc&to=3000&faculty=-4"));
    expect(invalid.scopeIndex).toBe(-1);
    expect(invalid.yearFrom).toBe(2010);
    expect(invalid.yearTo).toBe(2026);
    expect(invalid.facultyIndex).toBe(-1);
  });
});

test.describe("computeFoundations against the original page (numbers read from the unmodified artifact) [mock data]", () => {
  test.skip(!fs.existsSync(MOCK_FILE), "mock-data/observatories/vri-udea-board-3.json is not in this machine");

  let ds;
  let centerArts;
  test.beforeAll(() => {
    const raw = JSON.parse(fs.readFileSync(MOCK_FILE, "utf8"));
    ds = createFoundationsDataset(raw);
    centerArts = raw.centros.indexOf("Artes");
  });

  /* The same state of the filters the original page was captured in. */
  const states = () => ({
    default: DEFAULT_FOUNDATIONS_FILTERS,
    doc1: { ...DEFAULT_FOUNDATIONS_FILTERS, policyIndex: 1 },
    years_int: { ...DEFAULT_FOUNDATIONS_FILTERS, yearFrom: 2018, yearTo: 2022, scopeIndex: 3 },
  });

  /* F102 (X-05, D-226): the state «centro_fac» (centre Artes + faculty 7) is no longer compared with the page of the artifact: that page expanded the
     entity filters to the topics of the entity and the board counts only the products of the entity now. The figure is checked against a count by hand. */
  test("state centro_fac is direct (no longer comparable with the artifact): the products are the ones of the centre and of the faculty", () => {
    const f = { ...DEFAULT_FOUNDATIONS_FILTERS, centerIndex: centerArts, facultyIndex: 7 };
    const groups = ds.centerGroups[centerArts];
    const expected = ds.raw.P.filter((p) => (p[0] == null || (p[0] >= 2010 && p[0] <= 2026)) && p[12].some((g) => groups.has(g)) && p[10].includes(7)).length;
    expect(computeFoundations(ds, f).tiles.products).toBe(expected);
  });

  for (const name of ["default", "doc1", "years_int"]) {
    test(`state ${name}: tiles, status and the panels`, () => {
      const expected = ORIGINAL[name];
      const r = computeFoundations(ds, states()[name]);
      const t = r.tiles;
      expect([t.products, t.publications, t.theses, t.authors, t.staff, t.groups, t.datasets, t.withCompany].map(fmt)).toEqual(expected.tiles);
      expect(expected.status.startsWith(`${fmt(r.status.products)} productos · ${fmt(r.status.authors)} autores UdeA · ${fmt(r.status.staff)} profesores · ${fmt(r.status.groups)} grupos`)).toBe(true);

      const tt = (k) => expected.tt[k].tt;
      /* 2: treemap of the OECD areas (the original draws the areas with value > 0 only). */
      const total2 = r.areas.items.reduce((a, i) => a + i.value, 0);
      expect(r.areas.items.filter((i) => i.value > 0).map((i) => `${i.name}: ${fmt(i.value)} (${pct(i.value, total2)})`).sort()).toEqual([...tt("2")].sort());
      /* 10 and 11: professors by faculty with appropriation / company. */
      const rows = (list) => list.map((x) => `${x.label}: ${x.value} de ${x.total} (${pct(x.value, x.total)})`);
      expect(rows(r.appropriation.rows)).toEqual(tt("10"));
      expect(rows(r.company.rows)).toEqual(tt("11"));
      /* 4, 5 and 8: every point of the line charts. */
      const points = (years, series) => series.flatMap((s) => years.map((y, i) => `${s.label} · ${y}: ${fmt(s.values[i])}`));
      expect(points(r.ageByYear.years, r.ageByYear.series)).toEqual(tt("4"));
      expect(points(r.sexByYear.years, r.sexByYear.series.map((s) => ({ label: SEX_LABELS[s.sex], values: s.values })))).toEqual(tt("5"));
      expect(points(r.theses.years, r.theses.series)).toEqual(tt("8"));
      /* 18: identifiers. */
      expect(r.pid.map((x) => `${x.label}${fmt(x.withId)}${fmt(x.total)}${pct(x.withId, x.total)}`)).toEqual(expected.tt["18"].rows.slice(1));
      /* 3: group grid; 17: open-access donut; c: staff by product type and contract. */
      expect(r.groupGrid.cells.map((c) => `${c.area} · ${c.category}: ${fmt(c.value)} grupos`).sort()).toEqual([...tt("3")].sort());
      const oaTotal = r.openAccess.open + r.openAccess.closed + r.openAccess.noData;
      expect(
        [["Acceso abierto", r.openAccess.open], ["Cerrado", r.openAccess.closed], ["Sin dato (solo ScienTI)", r.openAccess.noData]]
          .filter(([, v]) => v > 0).map(([n, v]) => `${n}: ${fmt(v)} (${pct(v, oaTotal)})`),
      ).toEqual(tt("17").map((s) => s.replace("SCIENTI", "ScienTI"))); // F106: the artifact writes SCIENTI, the board ScienTI
      expect(r.staffByType.flatMap((row) => row.values.map((v, i) => [row.label, v, i]).filter(([, v]) => v > 0).map(([l, v, i]) => `${l} · ${CONTRACTS[i]}: ${fmt(v)}`))).toEqual(tt("c"));
      /* 16: datasets by topic. */
      expect(r.datasets.rows.map((x) => `${x.label}: ${x.value} conjuntos · ${x.staff} profesores · ${x.faculties} unidades`)).toEqual(tt("16"));
    });
  }

  test("age groups and sex labels are the ones of the artifact", () => {
    expect(AGE_GROUPS).toEqual(["<35", "35-44", "45-54", "55-64", "65+"]);
    expect(SEX_LABELS).toEqual(["Sin dato", "Hombre", "Mujer", "Intersexual"]);
  });

  test("the adapter removes the personal identifier of the arts table", () => {
    const raw = JSON.parse(fs.readFileSync(MOCK_FILE, "utf8"));
    const clean = withoutPersonalIdentifiers(raw);
    expect(raw.artes.prof[0].id).toBeTruthy();
    expect(clean.artes.prof.every((p) => !("id" in p))).toBe(true);
    expect(clean.artes.prof.length).toBe(raw.artes.prof.length);
  });

  test("no table of the data has names of people (D-106 Q3)", () => {
    const raw = JSON.parse(fs.readFileSync(MOCK_FILE, "utf8"));
    /* Every string that can reach a screen: catalogues, groups, institutions, goals and contract labels. */
    const texts = new Set([
      ...raw.doms, ...raw.fields, ...raw.subs, ...raw.tops, ...raw.facs, ...raw.deps, ...raw.centros,
      ...raw.groups.flat(), ...raw.agendas_all, ...raw.tipos, ...raw.tesis_sub, ...raw.inst.map((i) => i[0]),
      ...raw.metas.flatMap((m) => [m.agenda, m.cod, m.titulo]),
      ...raw.A.flatMap((a) => [a[9], a[10], a[11]]).filter((x) => typeof x === "string"),
      ...Object.keys(raw.artes.proy_grupos), ...Object.keys(raw.artes.fac_creacion), ...Object.keys(raw.creacion.por_grupo),
    ]);
    /* The products and authors are arrays of numbers; the personal fields do not exist as keys. */
    expect(raw.P.every((p) => p.every((v) => typeof v !== "string"))).toBe(true);
    const personKeys = JSON.stringify(Object.keys(raw)).match(/nombre|name|cedula|document|documento/i);
    expect(personKeys).toBeNull();
    expect(texts.size).toBeGreaterThan(1000);
  });
});
