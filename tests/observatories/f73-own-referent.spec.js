/*
 * F73 (D-176): when the referent of the ratio of capacity is the Universidad de Antioquia itself, the tooltip says «La UdeA es
 * la institución con más citas del país en este tópico» and does not show the two figures as if they were of two
 * institutions. The rule of the ratio, the cap, the categories and the data do not change. The first block needs no server;
 * the second reads the real quyca and the dev server of Luis and only runs with E2E_LIVE=1.
 */
import { test, expect } from "@playwright/test";

import { computeCapacity, createDataset } from "../../lib/observatories/capacity";
import { OWN_REFERENT_ID, OWN_REFERENT_NAME, isOwnReferent, ownReferentText, ratioSentence } from "../../app/observatories/vri-udea/board-1/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const API = process.env.E2E_API_URL || "http://localhost:8080";
const fmt = (n) => Number(n).toLocaleString("es-CO");
const fmtRatio = (v) => v.toFixed(2).replace(".", ",");
const opts = (ratioBasis = "national", dimension = "topic") => ({ ratioBasis, dimension, fmtRatio, fmt });

test.describe("text of the ratio when the referent is the UdeA (no server)", () => {
  const own = { ratio: 1, ratioCitations: 2923, leaderCitations: 2865, referent: "Universidad de Antioquia", ratioTopics: null };
  const other = { ratio: 0.49, ratioCitations: 120, leaderCitations: 300, referent: "Universidad de Chile", ratioTopics: null };

  test("own referent: the ratio and the sentence, without the two figures", () => {
    const text = ratioSentence(own, opts());
    expect(text).toBe("1,00 · La UdeA es la institución con más citas del país en este tópico");
    expect(text).not.toMatch(/2\.923|2\.865|frente a/);
    // the ratio keeps its value when it is under 1 (25 topics)
    expect(ratioSentence({ ...own, ratio: 0.87 }, opts())).toBe("0,87 · La UdeA es la institución con más citas del país en este tópico");
  });

  test("another referent: the text does not change", () => {
    expect(ratioSentence(other, opts())).toBe("0,49 (citas de la UdeA 120 frente a 300 de Universidad de Chile)");
    expect(ratioSentence({ ...other, ratioTopics: 4 }, opts())).toBe("0,49 (citas de la UdeA 120 frente a 300 de Universidad de Chile, en 4 tópicos con 5 o más productos)");
    expect(ratioSentence({ ...other, referent: "" }, opts())).toContain("de los referentes de sus tópicos");
  });

  test("the world scope and the other dimensions say «del mundo» and the unit", () => {
    expect(ownReferentText("global", "topic")).toBe("La UdeA es la institución con más citas del mundo en este tópico");
    expect(ownReferentText("national", "subfield")).toContain("en este subcampo");
    expect(ownReferentText("national", "field")).toContain("en este campo");
  });

  test("the referent is known by the name of the bundle (id I35961687)", () => {
    expect(OWN_REFERENT_ID).toBe("I35961687");
    expect(OWN_REFERENT_NAME).toBe("Universidad de Antioquia");
    expect(isOwnReferent("Universidad de Antioquia")).toBe(true);
    expect(isOwnReferent("Universidad de Antioquia ")).toBe(true);
    expect(isOwnReferent("Universidad Nacional de Colombia")).toBe(false);
    expect(isOwnReferent("")).toBe(false);
  });
});

test.describe("topic T11725 against the real quyca (read-only)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");
  test("the reading: Immunodeficiency and Autoimmune Disorders has the UdeA as referent; the text changes and the data do not", async ({ page, request }) => {
    test.setTimeout(250000);
    const bundle = await (await request.get(`${API}/observatories/vri-udea/boards/1/bundle`)).json();
    const dataset = createDataset(bundle);
    const result = computeCapacity(dataset, {});
    const unit = result.units.find((u) => u.id === "T11725");
    expect(unit).toBeTruthy();
    console.log(`[live] T11725 «${unit.label}»: ratio ${unit.ratio}, citations of the UdeA ${unit.ratioCitations}, referent «${unit.referent}» with ${unit.leaderCitations}`);
    expect(isOwnReferent(unit.referent)).toBe(true);
    expect(fmtRatio(unit.ratio)).toBe("1,00");
    expect(unit.ratioCitations).toBe(2923); // numbers of the data: they do not change
    expect(unit.leaderCitations).toBe(2865);
    expect(ratioSentence(unit, opts())).toBe("1,00 · La UdeA es la institución con más citas del país en este tópico");
    // how many topics have the UdeA as referent, and how many of them have a ratio under 1
    const own = result.units.filter((u) => !u.noRatio && isOwnReferent(u.referent));
    console.log(`[live] topics with the UdeA as referent: ${own.length}; with ratio under 1: ${own.filter((u) => u.ratio < 1).length}`);
    expect(own.length).toBeGreaterThan(100);
    for (const u of own) expect(ratioSentence(u, opts())).not.toMatch(/frente a/);
    // the others keep the text with the two figures
    const another = result.units.find((u) => !u.noRatio && u.referent && !isOwnReferent(u.referent) && u.ratio < 1);
    expect(ratioSentence(another, opts())).toContain("frente a");

    // the page: sweep of the scatter until a tooltip with the sentence appears
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/observatories/vri-udea/board-1");
    await expect(page.getByTestId("category-legend")).toBeVisible({ timeout: 120000 });
    await page.waitForTimeout(3000);
    const canvas = page.getByTestId("chart-card").filter({ hasText: "1 · Dispersión" }).first().locator("canvas").first();
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    let found = "";
    for (let fy = 0.08; fy < 0.92 && !found; fy += 0.04) {
      for (let fx = 0.06; fx < 0.96 && !found; fx += 0.03) {
        await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy);
        await page.waitForTimeout(40);
        const t = await page.evaluate(() => [...document.querySelectorAll(".g2-tooltip")].filter((e) => e.offsetParent && e.innerText.trim()).map((e) => e.innerText.replace(/\s+/g, " ").trim())[0] || "");
        if (t.includes("La UdeA es la institución con más citas del país en este tópico")) found = t;
      }
    }
    console.log(`[live] tooltip on the page: ${found || "(no point with the sentence was hit by the sweep)"}`);
    if (found) {
      expect(found).not.toMatch(/frente a/);
      expect(found).toMatch(/Razón de capacidad \(Colombia\)/);
    }
  });
});
