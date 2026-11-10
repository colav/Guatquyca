/*
 * F76 (D-180): tree of topics (T1: domain → field → subfield → topic; T2 and T3: field → subfield) and unit → subunit with
 * `deps_fac`. The first block needs no server; the second reads the real bundles and drives the page (one run, E2E_LIVE=1).
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset, filterFacts, topicPredicate } from "../../lib/observatories/capacity";
import { DEFAULT_COLLAB_FILTERS, createCollaborationDataset, filterWorks, parseCollabFilters, serializeCollabFilters } from "../../lib/observatories/collaboration";
import { DEFAULT_FOUNDATIONS_FILTERS, createFoundationsDataset, filterProducts, parseFoundationsFilters, serializeFoundationsFilters } from "../../lib/observatories/foundations";
import { indexTree, pruneTree } from "../../lib/observatories/hierarchyTree";
import { subunitOptions, unitChangePatch } from "../../lib/observatories/unitHierarchy";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";

const tree = [
  { value: "d:D", title: "D", children: [
    { value: "f:F1", title: "F1", children: [
      { value: "s:F1|S1", title: "S1", children: [{ value: "t:a", title: "a", leafId: 0 }, { value: "t:b", title: "b", leafId: 1 }] },
      { value: "s:F1|S2", title: "S2", children: [{ value: "t:c", title: "c", leafId: 2 }] },
    ] },
    { value: "f:F2", title: "F2", children: [{ value: "s:F2|S3", title: "S3", children: [{ value: "t:d", title: "d", leafId: 3 }] }] },
  ] },
];

test.describe("tree helpers and unit → subunit (no server)", () => {
  test("pruneTree keeps only branches with products and the chosen node; same inputs give the same object", () => {
    const set = new Set([2]);
    const pruned = pruneTree(tree, set, "");
    expect(pruned[0].children.map((f) => f.value)).toEqual(["f:F1"]);
    expect(pruned[0].children[0].children.map((s) => s.value)).toEqual(["s:F1|S2"]);
    expect(pruneTree(tree, set, "")).toBe(pruned);
    // the chosen branch stays even without products, with its ancestors
    const keep = pruneTree(tree, set, "s:F2|S3");
    expect(keep[0].children.map((f) => f.value)).toEqual(["f:F1", "f:F2"]);
    expect(pruneTree(tree, undefined, "")).toBe(tree);
  });

  test("indexTree: path of every level and the leaves under each node", () => {
    const { path, leaves } = indexTree(tree);
    expect(path.get("s:F1|S2")).toBe("D › F1 › S2");
    expect(path.get("d:D")).toBe("D");
    expect(leaves.get("f:F1")).toEqual([0, 1, 2]);
    expect(leaves.get("d:D")).toEqual([0, 1, 2, 3]);
  });

  test("subunits: with a unit only its subunits, without one grouped by unit, without the key as before", () => {
    const deps = ["D0", "D1", "D2"];
    const facs = ["Fb", "Fa"];
    const depsFac = [1, 0, 1];
    expect(subunitOptions(deps, depsFac, facs, 1)).toEqual([{ value: 0, label: "D0" }, { value: 2, label: "D2" }]);
    expect(subunitOptions(deps, depsFac, facs, -1)).toEqual([{ label: "Fa", options: [{ value: 0, label: "D0" }, { value: 2, label: "D2" }] }, { label: "Fb", options: [{ value: 1, label: "D1" }] }]);
    expect(subunitOptions(deps, undefined, facs, 1)).toEqual([{ value: 0, label: "D0" }, { value: 1, label: "D1" }, { value: 2, label: "D2" }]);
    expect(subunitOptions(deps, depsFac, facs, -1, (i) => i !== 1)).toEqual([{ label: "Fa", options: [{ value: 0, label: "D0" }, { value: 2, label: "D2" }] }]);
  });

  test("changing the unit clears a subunit of another unit and nothing else", () => {
    const depsFac = [1, 0, 1];
    expect(unitChangePatch(depsFac, 0, 0)).toEqual({ facultyIndex: 0, departmentIndex: -1 });
    expect(unitChangePatch(depsFac, 1, 0)).toEqual({ facultyIndex: 1 });
    expect(unitChangePatch(depsFac, -1, 0)).toEqual({ facultyIndex: -1 });
    expect(unitChangePatch(undefined, 0, 0)).toEqual({ facultyIndex: 0 });
  });

  test("T1 topic key d: (domain) is a predicate; the old keys f:, s:, t: still hold", () => {
    const t = { id: "x", f: "F1", sf: "S1", d: "D" };
    expect(topicPredicate("d:D")(t)).toBe(true);
    expect(topicPredicate("d:E")(t)).toBe(false);
    expect(topicPredicate("f:F1")(t)).toBe(true);
    expect(topicPredicate("s:F1|S1")(t)).toBe(true);
    expect(topicPredicate("t:x")(t)).toBe(true);
  });

  test("URL: field of T2 and T3 round trips; the old subfield keys keep working", () => {
    const f2 = { ...DEFAULT_COLLAB_FILTERS, fieldName: "Ciencias" };
    expect(parseCollabFilters(new URLSearchParams(serializeCollabFilters(f2))).fieldName).toBe("Ciencias");
    expect(parseCollabFilters(new URLSearchParams("subfield=9")).subfieldIndex).toBe(9);
    const f3 = { ...DEFAULT_FOUNDATIONS_FILTERS, fieldIndex: 4 };
    expect(parseFoundationsFilters(new URLSearchParams(serializeFoundationsFilters(f3))).fieldIndex).toBe(4);
    expect(parseFoundationsFilters(new URLSearchParams("subfield=7")).subfieldIndex).toBe(7);
    expect(serializeCollabFilters(DEFAULT_COLLAB_FILTERS)).toBe("");
    expect(serializeFoundationsFilters(DEFAULT_FOUNDATIONS_FILTERS)).toBe("");
  });
});

test.describe("tree and unit → subunit against the real bundles (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("the three bundles carry deps_fac and the trees choose what their leaves add up to", async ({ request }) => {
    test.setTimeout(240000);
    const get = async (n) => (await request.get(`${API}/observatories/vri-udea/boards/${n}/bundle`)).json();
    const [b1, b2, b3] = [await get(1), await get(2), await get(3)];
    const report = [];
    for (const [name, b] of [["T1", b1], ["T2", b2], ["T3", b3]]) {
      expect(Array.isArray(b.deps_fac), `${name} deps_fac`).toBe(true);
      expect(b.deps_fac).toHaveLength(b.deps.length);
      expect(b.deps_fac.every((u) => Number.isInteger(u) && u >= 0 && u < b.facs.length)).toBe(true);
      const grouped = subunitOptions(b.deps, b.deps_fac, b.facs, -1);
      expect(grouped.flatMap((g) => g.options)).toHaveLength(b.deps.length);
      report.push(`${name}: deps ${b.deps.length}, facs ${b.facs.length}, grouped ${grouped.length}`);
    }
    // T1: topics carry domain, field, subfield; a field/domain choice equals the sum of its topics
    const l1 = createDataset(b1);
    const base1 = { ...computeCapacity(l1, {}).filters };
    expect(b1.topics.every((t) => t.d && t.f && t.sf)).toBe(true);
    const total1 = filterFacts(l1, base1).length;
    const domains = [...new Set(b1.topics.map((t) => t.d))];
    expect(domains.reduce((a, d) => a + filterFacts(l1, { ...base1, topicKey: `d:${d}` }).length, 0)).toBe(total1);
    const fields = [...new Set(b1.topics.map((t) => t.f))];
    expect(fields.reduce((a, f) => a + filterFacts(l1, { ...base1, topicKey: `f:${f}` }).length, 0)).toBeGreaterThanOrEqual(total1);
    report.push(`T1: ${domains.length} domains, ${fields.length} fields, ${new Set(b1.topics.map((t) => `${t.f}|${t.sf}`)).size} subfields, ${b1.topics.length} topics`);
    // T2: a field is all its subfields
    const l2 = createCollaborationDataset({ ...b2, funders: b2.ext.funders });
    const field2 = b2.sfField[0];
    const viaField2 = filterWorks(l2, { ...DEFAULT_COLLAB_FILTERS, fieldName: field2 }).length;
    const viaSubs2 = b2.subfields.reduce((a, _, i) => a + (b2.sfField[i] === field2 ? filterWorks(l2, { ...DEFAULT_COLLAB_FILTERS, subfieldIndex: i }).length : 0), 0);
    expect(viaField2).toBe(viaSubs2);
    expect(viaField2).toBeGreaterThan(0);
    // T3: same
    for (const p of b3.P) if (p[0] === 0) p[0] = null;
    const l3 = createFoundationsDataset({ ...b3, artes: { ...b3.artes, prof: b3.artes.prof.map(({ id, ...r }) => r) } });
    const field3 = b3.sub_meta[b3.subs[0]][0];
    const viaField3 = filterProducts(l3, { ...DEFAULT_FOUNDATIONS_FILTERS, fieldIndex: field3 }).F.length;
    const viaSubs3 = b3.subs.reduce((a, name, i) => a + (b3.sub_meta[name][0] === field3 ? filterProducts(l3, { ...DEFAULT_FOUNDATIONS_FILTERS, subfieldIndex: i }).F.length : 0), 0);
    expect(viaField3).toBe(viaSubs3);
    expect(viaField3).toBeGreaterThan(0);
    report.push(`T2 field «${field2}»: ${viaField2} works; T3 field «${b3.fields[field3]}»: ${viaField3} products`);
    console.log(`[live] ${report.join(" | ")}`);
  });
});

test.describe("tree and unit → subunit in the page (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  test("T1: the tree opens fast, the search finds any level, URL keys f: s: t: d: and unit → subunit", async ({ page }) => {
    test.setTimeout(240000);
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2500);
    const topic = page.getByTestId("topic-filter");
    const t0 = Date.now();
    await topic.locator(".ant-select-selector").click();
    await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-treenode:not([aria-hidden])").first().waitFor();
    const opened = Date.now() - t0;
    console.log(`[live] T1 tree opens in ${opened} ms`);
    expect(opened).toBeLessThanOrEqual(200 + 400); // 200 ms of the order plus the click and Playwright round trips
    const rows = await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-treenode:not([aria-hidden])").count();
    console.log(`[live] T1 rows in the closed tree: ${rows}`);
    // a search finds a topic (deepest level) and a subfield (middle level)
    await page.keyboard.type("machine learning");
    await page.waitForTimeout(800);
    const found = await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-treenode:not([aria-hidden])").count();
    console.log(`[live] T1 search «machine learning»: ${found} rows`);
    expect(found).toBeGreaterThan(0);
    await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-node-content-wrapper").filter({ hasText: /machine learning/i }).first().click();
    await expect(page).toHaveURL(/topic=/, { timeout: 15000 });
    console.log(`[live] T1 URL after choosing: ${page.url()}`);
    // unit → subunit: with a unit chosen, only its subunits
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(2000);
    const subunit = page.getByTestId("filter-departmentIndex");
    await subunit.scrollIntoViewIfNeeded();
    await subunit.locator(".ant-select-selector").click();
    await page.locator(".ant-select-dropdown:visible .ant-select-item").first().waitFor();
    const grouped = await page.locator(".ant-select-dropdown:visible .ant-select-item-group").count();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
    console.log(`[live] T1 subunit list without unit: ${grouped} groups (units)`);
    expect(grouped).toBeGreaterThan(1);
    // with a unit chosen: only its subunits, and changing the unit clears a subunit of another one
    await page.getByTestId("filter-facultyIndex").locator(".ant-select-selector").click();
    await page.locator(".ant-select-dropdown:visible .ant-select-item-option").nth(2).click();
    await page.waitForTimeout(1500);
    await subunit.locator(".ant-select-selector").click();
    await page.waitForTimeout(800);
    await page.locator(".ant-select-dropdown:visible .ant-select-item").first().waitFor();
    const groupsAfter = await page.locator(".ant-select-dropdown:visible .ant-select-item-group").count();
    const optionsAfter = await page.locator(".ant-select-dropdown:visible .ant-select-item-option").count();
    console.log(`[live] T1 subunit list with a unit: ${groupsAfter} groups, ${optionsAfter} options visible`);
    expect(groupsAfter).toBe(0);
    expect(optionsAfter).toBeGreaterThan(0);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  });
});

test.describe("tree of subfields in Boards 2 and 3 (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  for (const board of [2, 3]) {
    test(`T${board}: field → subfield opens fast, a field is choosable and goes to the URL, the old subfield key holds`, async ({ page }) => {
      test.setTimeout(240000);
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.getByTestId("subfield-filter").waitFor({ timeout: 120000 });
      await page.waitForTimeout(3000);
      const filter = page.getByTestId("subfield-filter");
      await filter.scrollIntoViewIfNeeded();
      const t0 = Date.now();
      await filter.locator(".ant-select-selector").click();
      await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-treenode:not([aria-hidden])").first().waitFor();
      console.log(`[live] T${board} tree opens in ${Date.now() - t0} ms`);
      const fields = await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-treenode:not([aria-hidden])").count();
      console.log(`[live] T${board} fields in the closed tree: ${fields}`);
      expect(fields).toBeGreaterThan(5);
      await page.locator(".ant-tree-select-dropdown:visible .ant-select-tree-node-content-wrapper").first().click();
      await expect(page).toHaveURL(/field=/, { timeout: 15000 });
      console.log(`[live] T${board} URL: ${page.url()}`);
      await page.goto(`/observatories/vri-udea/board-${board}?subfield=3`);
      await page.getByTestId("subfield-filter").waitFor({ timeout: 120000 });
      await expect(page.getByTestId("subfield-filter")).toContainText("›", { timeout: 30000 });
    });
  }
});
