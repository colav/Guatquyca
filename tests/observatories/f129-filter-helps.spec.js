/*
 * F129 (D-273): the «?» help of the filters whose meaning is not obvious exists and carries no hand-written figure (D-174).
 * Board 1: unit and subunit. E2E_LIVE=1 reads the real quyca.
 */
import { test, expect } from "@playwright/test";

const LIVE = !!process.env.E2E_LIVE;

/** Filter label -> fragments that its help must contain (the facts it states, checked against the code in F129). */
const HELPS = {
  1: {
    "Unidad académica": ["unidad elegida", "cuenta en cada una"],
    "Subunidad académica": ["subunidad elegida", "cuenta en cada una"],
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

test.describe("F129 helps of the filters (one run)", () => {
  test.skip(!LIVE, "Set E2E_LIVE=1 to read the real quyca.");

  for (const board of Object.keys(HELPS)) {
    test(`board ${board}: each help exists, says what it counts and has no digits`, async ({ page }) => {
      test.setTimeout(240000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`/observatories/vri-udea/board-${board}`);
      await page.getByTestId("method-notes").waitFor({ timeout: 150000 });
      await page.waitForTimeout(2000);
      for (const [label, fragments] of Object.entries(HELPS[board])) {
        const text = await helpText(page, label);
        for (const fragment of fragments) expect(text.toLowerCase(), `${label}: ${fragment}`).toContain(fragment.toLowerCase());
        expect(text, `${label}: no digits (D-174)`).not.toMatch(/[0-9]/);
        expect(text, `${label}: no «Eje» alone, only «Eje Temático»`).not.toMatch(/\beje\b(?! Temático)/i);
      }
    });
  }
});
