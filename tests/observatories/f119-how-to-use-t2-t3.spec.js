/*
 * F119 (D-260): «¿Cómo usar este tablero?» in the T2 and the T3 (proposal (c) of F112, approved): one line of subtitle, the orientation in a
 * closed collapsible like the one of the T1, the universe of products in the foot of the T3 and the help of the filters of entity with the
 * direct rule (D-226). E2E_LIVE=1 reads the real quyca and the dev server.
 */
import { test, expect } from "@playwright/test";

import { BOARD_LEAD as LEAD2, HOW_TO_USE as HELP2 } from "../../app/observatories/vri-udea/board-2/components/boardTexts";
import { BOARD_LEAD as LEAD3, HOW_TO_USE as HELP3, UNIVERSE_NOTE, methodNotes } from "../../app/observatories/vri-udea/board-3/components/boardTexts";

const LIVE = !!process.env.E2E_LIVE;
const OUTDATED = /delimitan la producción asociada a los tópicos/;

test("texts: one line of subtitle, the orientation inside, no outdated rule, the universe in the foot of the T3", () => {
  expect(LEAD2).toBe("Cómo colabora la UdeA y con quién: grupos, organizaciones no académicas, hélices, territorios y países.");
  expect(LEAD3).toBe("Talento, producción e infraestructura abierta de la UdeA.");
  for (const t of [...HELP2, ...HELP3]) expect(t).not.toMatch(OUTDATED);
  expect(HELP2.join(" ")).toContain("Empiece por el grafo de colaboración entre grupos (panel 2)");
  expect(HELP3.join(" ")).toContain("Empiece por el talento investigador (panel 1)");
  expect(UNIVERSE_NOTE).toMatch(/^Universo de productos\. Artículos, libros, capítulos, apropiación social/);
  expect(methodNotes("x")).toContain(UNIVERSE_NOTE);
  expect(LEAD3).not.toContain("artículos, libros");
});

test.describe("F119 in the page (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const [board, lead, help] of [[2, LEAD2, HELP2], [3, LEAD3, HELP3]]) {
    test(`T${board}: subtitle visible, «¿Cómo usar este tablero?» closed and open, goals collapsible untouched`, async ({ page }) => {
      test.setTimeout(200000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.getByTestId("method-notes").waitFor({ timeout: 120000 });
      const header = page.locator("header").first();
      await expect(header.getByText(lead, { exact: true })).toBeVisible();
      await expect(header).not.toContainText(OUTDATED);

      const toggle = header.getByText("¿Cómo usar este tablero?");
      await expect(toggle).toBeVisible();
      await expect(header.getByText(help[0].slice(0, 60))).toHaveCount(0);
      await toggle.click();
      await expect(header.getByText(help[0].slice(0, 60))).toBeVisible();
      await expect(header.getByText(/^Ver las \d+ metas/)).toBeVisible();
      expect(await header.innerText()).not.toMatch(/NaN|undefined/);
    });
  }

  test("T3: the foot has the universe of products; the filters of entity say the direct rule in their help", async ({ page }) => {
    test.setTimeout(200000);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/observatories/vri-udea/board-3");
    const notes = page.getByTestId("method-notes");
    await notes.waitFor({ timeout: 120000 });
    await expect(notes).toContainText(UNIVERSE_NOTE);
    await expect(notes).toContainText("Los filtros de centro, unidad y subunidad cuentan solo los productos de la entidad elegida.");
    const helps = page.getByTestId("filter-help");
    const n = await helps.count();
    const seen = [];
    for (let i = 0; i < n; i++) {
      await helps.nth(i).focus();
      await page.waitForTimeout(400);
      const tip = (await page.locator(".ant-tooltip:not(.ant-tooltip-hidden)").last().innerText().catch(() => "")) || "";
      seen.push(tip);
    }
    const all = seen.join(" | ");
    for (const s of ["Cuenta solo los productos de la unidad elegida.", "Cuenta solo los productos de la subunidad elegida.", "Cuenta solo los productos del centro elegido.", "Cuenta los productos cuyo tópico principal pertenece al subcampo elegido."]) expect(all).toContain(s);
  });
});
