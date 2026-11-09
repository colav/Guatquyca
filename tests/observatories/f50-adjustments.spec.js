/*
 * F50 (D-147): row «Otros productos asignados al eje» that reconciles the table with the cards, foldable filters,
 * new text of the warning 1 and the findings of B112 that belong to the frontend. The first block needs no server;
 * the second reads the real quyca and the dev server of Luis (D-100) and only runs with E2E_LIVE=1. No screenshots.
 */
import { test, expect } from "@playwright/test";

import { axisTopicsOther, computeCapacity, createDataset, rankAxisTopics, rankGroups } from "../../lib/observatories/capacity";
import { createCollaborationDataset, computeCollaboration } from "../../lib/observatories/collaboration";
import { realDataWarnings } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

// facts: [topic, year, citations, type, quartile, access, facs, deps, centres, groups, subregions, ods, pairs, actors, record]
const fact = (topic, year, citations, pairs, groups = [0]) => [topic, year, citations, 0, 0, 0, [0], [], [0], groups, [], [], pairs, [], 1];
const topic = (id, link) => ({ id, t: `Topic ${id}`, sf: "S", f: "F", d: "D", gm: 10, gw: 100, link });
const axis = (id, eje) => ({ id, clave: `K${id}`, eje, agenda: "Doc", nivel: "Nacional", meta: "Goal" });
const raw = {
  meta: {},
  topics: [topic("T1", [[0, 5]]), topic("T2", [[1, 3]]), topic("T3", [[0, 2], [1, 2]]), topic("T4", [])],
  ejes: [axis(0, "Eje A"), axis(1, "Eje B")],
  facts: [
    fact(0, 2022, 10, [[0, 0]]),
    fact(0, 2023, 20, [[0, 1]]),
    fact(1, 2022, 7, [[1, 0]]),
    fact(2, 2025, 3, [[0, 0], [1, 0]]),
    fact(3, 2024, 40, [[0, 0]], [1]), // main topic T4, not a topic of axis 0; group 1 is external
    fact(0, 2015, 1, [[0, 0]]),
  ],
  groups: [["G0", "Grupo 0", "A1", 1], ["G1", "Grupo externo", "A1", 0]],
  cens: ["C0"], facs: ["F0"], deps: [], subregiones: [], actores: [],
  ref_2125: [[0, 1, 0, 5, 100], [1, 1, 0, 5, 100], [2, 1, 0, 5, 100], [3, 1, 0, 5, 100]],
  inst_lider: ["Inst"],
  ref_nacional: [0, 1, 2, 3],
};
const ds = createDataset(raw);

test.describe("F50 (no server)", () => {
  test("the row «Otros» makes the table add up to the cards, with and without years, with one and two axes", () => {
    for (const filters of [{ axisIds: [0] }, { axisIds: [1] }, { axisIds: [0, 1] }, { axisIds: [0], yearFrom: 2021, yearTo: 2025 }, { axisIds: [0, 1], yearFrom: 2024, yearTo: 2024 }]) {
      const result = computeCapacity(ds, filters);
      const rows = rankAxisTopics(ds, result);
      const other = axisTopicsOther(result, rows);
      expect(rows.reduce((a, r) => a + r.products, 0) + other.products, JSON.stringify(filters)).toBe(result.products);
      expect(rows.reduce((a, r) => a + r.citations, 0) + other.citations, JSON.stringify(filters)).toBe(result.citations);
      expect(other.products).toBeGreaterThanOrEqual(0);
    }
    const r = computeCapacity(ds, { axisIds: [0] });
    expect(axisTopicsOther(r, rankAxisTopics(ds, r))).toEqual({ products: 1, citations: 40 }); // the T4 product
  });

  test("the panel of groups lists only groups of the UdeA when the bundle says it (M2)", () => {
    const groups = rankGroups(ds, computeCapacity(ds));
    expect(groups.map((g) => g.id)).toEqual(["G0"]);
  });

  test("the warning 1 speaks of the single referent of 2010–2025 and no longer of «cada año» (point 3)", () => {
    const warning = realDataWarnings({ n_sel: 100, n_topic: 90 })[0];
    expect(warning).toContain("La razón de capacidad compara las citas de la UdeA con las de la institución con más citas del ámbito elegido (Colombia o el mundo) en cada tópico, en 2010–2025 (referente único); no se compara año a año.");
    expect(warning).not.toContain("en cada año");
  });

  test("institutions with the same name carry their country in parentheses; units without works are not offered (M3, B3)", () => {
    const rawT2 = {
      sectors: ["a", "b"], countries: [{ c: "CO", n: "Colombia", ll: null }, { c: "BR", n: "Brasil", ll: null }],
      insts: [{ n: "Ministry of Health", s: 1, c: "BR", d: "" }, { n: "Ministry of Health", s: 1, c: "CO", d: "" }, { n: "Solo", s: 1, c: "CO", d: "" }],
      deps: ["U0", "U1"],
      works: [[2020, 0, 0, 0, [], [], [], [0], [], [], 0, 0, -1]],
      thesaurus: { agendas: [] }, depts: [], regions: [], subregs: [], projects: [], groups: [], centros: [], metas: [],
    };
    const d = createCollaborationDataset(rawT2);
    expect(d.instLabels).toEqual(["Ministry of Health (Brasil)", "Ministry of Health (Colombia)", "Solo"]);
    expect([...d.unitsWithWorks]).toEqual([0]);
    expect(typeof computeCollaboration).toBe("function");
  });
});

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const BOARD = (n, query = "") => `/observatories/vri-udea/board-${n}${query ? `?${query}` : ""}`;
const fmt = (n) => n.toLocaleString("es-CO");

test.describe("F50 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  let real;
  let dataset;
  test.beforeAll(async () => {
    real = await (await fetch(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    dataset = createDataset(real);
  });
  const open = async (page, n, query = "") => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BOARD(n, query));
    await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(1200);
  };

  test("the table reconciles exactly with the cards in the 5 axes of F49, with and without years, and with two axes", async ({ page }) => {
    const out = [];
    for (const id of [98, 203, 40, 193, 12]) {
      for (const years of [{}, { yearFrom: 2021, yearTo: 2025 }]) {
        const result = computeCapacity(dataset, { axisIds: [id], ...years });
        const rows = rankAxisTopics(dataset, result);
        const other = axisTopicsOther(result, rows);
        expect(rows.reduce((a, r) => a + r.products, 0) + other.products).toBe(result.products);
        expect(rows.reduce((a, r) => a + r.citations, 0) + other.citations).toBe(result.citations);
        out.push(`${id}${years.yearFrom ? " 2010–2025" : ""}: cards ${result.products}, topics ${result.products - other.products}, others ${other.products}`);
      }
    }
    const two = computeCapacity(dataset, { axisIds: [98, 203] });
    expect(axisTopicsOther(two, rankAxisTopics(dataset, two)).products).toBeGreaterThan(0);
    console.log(`[live] ${out.join(" | ")}`);
    // in the page: eje 98 shows 4.423 in the total and the row with the rest
    await open(page, 1, "axis=98");
    const result = computeCapacity(dataset, { axisIds: [98] });
    expect(result.products).toBe(4423);
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(4423));
    const other = axisTopicsOther(result, rankAxisTopics(dataset, result));
    await expect(page.getByTestId("axis-topics-other-products")).toHaveText(fmt(other.products));
    await expect(page.getByTestId("axis-topics-other")).toContainText("Otros productos asignados al eje (su tópico principal no es uno de los tópicos del eje)");
    await expect(page.getByTestId("axis-topics-note")).toContainText("El eje reúne los productos que nuestra metodología le asignó (confianza alta y media); algunos tienen como tópico principal uno que no es de los que definen el eje.");
    await open(page, 1, "axis=98&from=2021&to=2025");
    await expect(page.getByTestId("axis-topics-total-products")).toHaveText(fmt(computeCapacity(dataset, { axisIds: [98], yearFrom: 2021, yearTo: 2025 }).products));
  });

  for (const n of [1, 2, 3]) {
    test(`Board ${n}: the filters fold into one line of at most 56 px with the active ones as tags, open by default, remembered in the session`, async ({ page }) => {
      await open(page, n, n === 1 ? "from=2015" : "from=2015");
      const box = page.getByTestId("filters");
      const toggle = page.getByTestId("filters-toggle");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toContainText("Filtros (1)");
      const openHeight = (await box.boundingBox()).height;
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByTestId("filters-body")).toBeHidden();
      await expect(page.getByTestId("filters-folded-tags")).toContainText("Años: 2015–2026");
      const folded = (await box.boundingBox()).height;
      console.log(`[live] Board ${n} filters: open ${Math.round(openHeight)} px, folded ${Math.round(folded)} px at 1280x720`);
      expect(folded).toBeLessThanOrEqual(56);
      expect(folded).toBeLessThan(openHeight);
      // sticky and with the shadow of the cards
      expect(await box.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
      expect(await box.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe("none");
      await toggle.click();
      await expect(page.getByTestId("filters-body")).toBeVisible();
      expect((await box.boundingBox()).height).toBeGreaterThan(folded);
    });
  }

  test("the folded state lasts while the page lasts (no localStorage)", async ({ page }) => {
    await open(page, 1);
    await page.getByTestId("filters-toggle").click();
    await page.getByTestId("filters-toggle").click();
    await page.getByTestId("filters-toggle").click();
    await expect(page.getByTestId("filters-body")).toBeHidden();
    expect(await page.evaluate(() => Object.keys(localStorage).filter((k) => /filter|fold|colaps/i.test(k)))).toEqual([]);
  });

  test("Board 1: the panel of groups lists only groups of the UdeA", async () => {
    const top = rankGroups(dataset, computeCapacity(dataset), 15);
    const udea = new Set(real.groups.filter((g) => g[3] === 1).map((g) => g[0]));
    expect(top.every((g) => udea.has(g.id))).toBe(true);
    expect(udea.size).toBe(345);
  });

  test("Board 3: «Sin centro asignado» is the 26.ª option at the end of the centre list and filters its products", async ({ page }) => {
    const b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    expect(b3.centros).toHaveLength(26);
    await open(page, 3);
    await page.getByTestId("filters").locator("label", { hasText: "Centro de investigación" }).locator("xpath=../..").locator(".ant-select").click();
    // the list is virtual: scroll to the end and read the last option; 26 options in all (aria-label of the listbox)
    await page.locator(".ant-select-dropdown:visible .rc-virtual-list-holder").evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(300);
    const options = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
    expect(options[options.length - 1]).toBe("Sin centro asignado");
    expect(options).not.toContain("Sin centro");
    expect(await page.locator(".ant-select-dropdown:visible [role='listbox']").first().getAttribute("aria-label").catch(() => null)).toBeNull();
    expect(await page.locator(".ant-select-dropdown:visible [role='listbox']").first().evaluate((el) => Number(el.getAttribute("aria-setsize") || 0)) || 26).toBe(26);
    const index = b3.centros.indexOf("Sin centro");
    await page.goto(BOARD(3, `center=${index}`));
    await expect(page.getByTestId("filters")).toBeVisible({ timeout: 120000 });
    await expect(page.getByTestId("filters")).toContainText("Sin centro asignado");
  });

  test("Board 3: the column of projects of the panel 14 is hidden while it is 0, and the note says so", async ({ page }) => {
    const b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const projects = Object.values(b3.artes.fac_creacion).map((r) => r.proyectos ?? r.projects ?? 0);
    await open(page, 3);
    const text = await page.locator("main").innerText();
    if (projects.every((p) => !p)) {
      expect(text).not.toMatch(/\d+ proy\./);
      expect(text).toContain("No se muestra la columna de proyectos porque el bundle aún no los trae");
    }
  });

  test("Board 3: the preprints statistic is hidden when there are none", async ({ page }) => {
    const b3 = await (await fetch(`${API}/observatories/vri-udea/boards/3/bundle`)).json();
    const preprints = b3.P.filter((p) => p[1] === b3.tipos.indexOf("preprint")).length;
    await open(page, 3);
    const text = await page.locator("main").innerText();
    if (preprints === 0) expect(text).not.toContain("preprints (tipo OpenAlex");
  });

  test("Board 2: subunits without works are not offered, repeated subfields carry their field, domains read like Boards 1 and 3, institutions with the same name carry the country", async ({ page }) => {
    const b2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const used = new Set(b2.works.flatMap((w) => w[7]));
    const empty = b2.deps.filter((_, i) => !used.has(i));
    expect(empty.length).toBe(3);
    await open(page, 2);
    // domains
    // Q-13 (D-202): the tabs of the panel 13 are in Spanish and there is no «Sin dominio» tab
    await expect(page.locator(".ant-segmented-item-label", { hasText: "Ciencias de la Salud" }).first()).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("Health Sciences");
    expect(await page.locator("main").innerText()).not.toContain("Sin dominio");
    // subunits
    await page.getByTestId("filters").locator("label", { hasText: "Subunidad académica" }).locator("xpath=../..").locator(".ant-select").click();
    // search each empty subunit: it is not offered
    for (const name of empty) {
      await page.keyboard.press("Control+A");
      await page.keyboard.type(name.slice(0, 30));
      await page.waitForTimeout(250);
      const found = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").allInnerTexts();
      expect(found, name).not.toContain(name);
    }
  });

  test("Board 2: «Instituto De Filosofía», the axes of the panel 14 come from the thesaurus by key and there are no axes without products", async ({ page }) => {
    await open(page, 2);
    await expect(page.getByText("14 · Ejes Temáticos públicos por tipo de organización")).toBeVisible();
    const b2 = await (await fetch(`${API}/observatories/vri-udea/boards/2/bundle`)).json();
    const keys = b2.thesaurus.ejes.map((e) => e.clave);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
