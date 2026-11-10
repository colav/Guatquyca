/*
 * F129 (D-273): the «?» help of the filters whose meaning is not obvious exists and carries no hand-written figure (D-174).
 * Board 1: unit and subunit. Board 2: unit, subunit, scope, the state line of the panel 9b by view and the (i) of panels 10 and 11·12.
 * E2E_LIVE=1 reads the real quyca.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

/** Filter label -> fragments that its help must contain (the facts it states, checked against the code in F129). */
const HELPS = {
  1: {
    "Unidad académica": ["unidad elegida", "cuenta en cada una"],
    "Subunidad académica": ["subunidad elegida", "cuenta en cada una"],
  },
  2: {
    "Unidad académica": ["unidad elegida", "cuenta en cada una"],
    "Subunidad académica": ["subunidad elegida", "cuenta en cada una"],
    Ámbito: ["coautor en Antioquia", "coautor de otros departamentos", "coautor extranjero", "puede estar en varios", "título", "Valle de Aburrá", "proyectos solo responde «Departamental»"],
  },
};

const helpText = async (page, label) => {
  const button = page.getByRole("button", { name: `Ayuda del filtro ${label}` });
  await expect(button, `help of ${label}`).toHaveCount(1);
  await button.scrollIntoViewIfNeeded();
  await button.hover();
  const tooltip = page.locator(".ant-tooltip:not(.ant-tooltip-hidden)").last();
  await expect(tooltip).toBeVisible();
  const text = (await tooltip.innerText()).replace(/\s+/g, " ").trim();
  await page.mouse.move(0, 0);
  await expect(page.locator(".ant-tooltip:not(.ant-tooltip-hidden)")).toHaveCount(0);
  return text;
};

const openBoard = async (page, board) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/observatories/vri-udea/board-${board}`);
  await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
  await page.waitForTimeout(2000);
};

test.describe("F129 helps of the filters (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const board of Object.keys(HELPS)) {
    test(`board ${board}: each help exists, says what it counts and has no digits`, async ({ page }) => {
      test.setTimeout(240000);
      await openBoard(page, board);
      for (const [label, fragments] of Object.entries(HELPS[board])) {
        const text = await helpText(page, label);
        for (const fragment of fragments) expect(text.toLowerCase(), `${label}: ${fragment}`).toContain(fragment.toLowerCase());
        expect(text, `${label}: no digits (D-174)`).not.toMatch(/[0-9]/);
        expect(text, `${label}: «Eje» only as «Eje Temático»`).not.toMatch(/\beje\b(?! Temático)/i);
      }
    });
  }

  test("board 2: panel 9b says which filters each view answers; the (i) of panels 10 and 11·12 explain the scope Internacional", async ({ page }) => {
    test.setTimeout(240000);
    await openBoard(page, 2);
    const card = page.getByTestId("chart-card").filter({ has: page.locator(".ant-card-head-title", { hasText: "9b" }) }).first();
    const note = card.getByTestId("subregion-view-note");
    const views = [
      ["Proyectos (lugar de ejecución)", /años, centro, Eje Temático, documento y al ámbito «Departamental»/],
      ["Proyectos con aportante externo", /años, centro, Eje Temático, documento y al ámbito «Departamental»/],
      ["Productos (mención en título)", /responde a todos los filtros/],
    ];
    for (const [view, expected] of views) {
      await card.locator(".ant-segmented-item", { hasText: view }).first().click();
      await expect(note, view).toHaveText(expected);
      expect(await note.innerText(), "no digits").not.toMatch(/[0-9]/);
    }
    /* Not repeated in the (i) of the same panel (D-243). */
    await card.getByTestId("panel-info").click();
    const whole = (await page.getByTestId("panel-info-content").last().innerText()).toLowerCase();
    expect(whole).not.toContain("responde a todos los filtros");
    await page.keyboard.press("Escape");
    for (const title of ["10 ·", "11 · 12"]) {
      const c = page.getByTestId("chart-card").filter({ has: page.locator(".ant-card-head-title", { hasText: title }) }).first();
      await c.scrollIntoViewIfNeeded();
      await c.getByTestId("panel-info").click();
      const care = page.getByTestId("panel-info-content").last();
      await expect(care, title).toContainText("el ámbito «Internacional» no lo cambia");
      await expect(care, title).toContainText("coautores extranjeros");
      expect(await care.innerText(), "no digits").not.toMatch(/[0-9]/);
      await page.keyboard.press("Escape");
    }
  });
});
