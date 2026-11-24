/* Tests of the collaboration model of Board 2 against the numbers of the published artifact. */
import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import {
  DEFAULT_COLLAB_FILTERS,
  computeCollaboration,
  createCollaborationDataset,
  parseCollabFilters,
  serializeCollabFilters,
} from "../../lib/observatories/collaboration";

const MOCK_FILE = path.join(__dirname, "..", "..", "mock-data", "observatories", "vri-udea-board-2.json");

test.describe("URL filters of Board 2", () => {
  test("round trip, defaults and invalid values", () => {
    const filters = { scope: "int", policyDoc: "CONPES 4144", centerIndex: 3, yearFrom: 2018, yearTo: 2022, facultyIndex: 5, departmentIndex: 7, subfieldIndex: 9, axisId: 98, fieldName: "Ciencias de la salud" };
    expect(parseCollabFilters(new URLSearchParams(serializeCollabFilters(filters)))).toEqual(filters);
    expect(serializeCollabFilters(DEFAULT_COLLAB_FILTERS)).toBe("");
    expect(parseCollabFilters(new URLSearchParams("scope=zzz&from=1900&faculty=-2"))).toMatchObject({ scope: "", yearFrom: 2010, facultyIndex: -1 });
  });
});

test.describe("computeCollaboration against the original page (numbers read from the unmodified artifact) [mock data]", () => {
  test.skip(!fs.existsSync(MOCK_FILE), "mock-data/observatories/vri-udea-board-2.json is not present");
  let dataset;
  test.beforeAll(() => {
    dataset = createCollaborationDataset(JSON.parse(fs.readFileSync(MOCK_FILE, "utf8")));
  });
  const k = (r) => [r.kpis.works, r.kpis.withExternal, r.kpis.withNonAcademic, r.kpis.withInternational, r.kpis.projects, r.kpis.projectsExternal];

  test("no filters: KPIs, helices, IAP, graph and North-South", () => {
    const r = computeCollaboration(dataset);
    expect(k(r)).toEqual([51093, 25720, 9988, 13963, 2524, 1259]);
    expect([r.helices.triple, r.helices.tripleProjects, r.helices.withCompany, r.helices.withGovernment, r.helices.withHealthcare]).toEqual([267, 74, 769, 3316, 5496]);
    expect([r.helices.quadruple, r.helices.quadrupleProjects, r.helices.appropriationWithCompanyOrNonprofit, r.helices.withNonprofit, r.helices.governmentNonprofit, r.helices.companyNonprofit]).toEqual([137, 9, 0, 3816, 1210, 284]);
    expect([r.iap.works, r.iap.projects]).toEqual([23, 13]);
    expect([r.graph.groupsWithCollaboration, r.graph.pairs]).toEqual([308, 1379]);
    expect(r.graph.nodes).toHaveLength(60);
    expect([r.northSouth.north, r.northSouth.south]).toEqual([9731, 7225]);
  });

  test("policy document CONPES 4144 (projects are not filtered by document)", () => {
    const r = computeCollaboration(dataset, { policyDoc: "CONPES 4144" });
    expect(k(r)).toEqual([22925, 12545, 4659, 7037, 2524, 1259]);
    expect([r.helices.triple, r.helices.withCompany, r.helices.withGovernment, r.helices.withHealthcare]).toEqual([119, 355, 1611, 2565]);
    expect([r.graph.groupsWithCollaboration, r.graph.pairs]).toEqual([277, 890]);
  });

  test("years 2018-2022 with the international scope (projects ignore the scope, report section 11)", () => {
    const r = computeCollaboration(dataset, { yearFrom: 2018, yearTo: 2022, scope: "int" });
    expect(k(r)).toEqual([5115, 5115, 2498, 5115, 1421, 717]);
    expect([r.helices.triple, r.helices.withCompany, r.iap.works, r.iap.projects]).toEqual([108, 258, 0, 9]);
    expect([r.graph.groupsWithCollaboration, r.graph.pairs]).toEqual([178, 316]);
  });

  test("centre 3 (the centre filter of projects compares the first word of the name)", () => {
    const r = computeCollaboration(dataset, { centerIndex: 3 });
    expect(k(r)).toEqual([2411, 1279, 309, 762, 300, 195]);
    expect([r.graph.groupsWithCollaboration, r.graph.pairs]).toEqual([104, 205]);
  });

  test("tab-dependent views are cached and consistent", () => {
    const r = computeCollaboration(dataset);
    expect(r.axisRows(6)).toBe(r.axisRows(6));
    expect(r.axisRows(6).length).toBeGreaterThan(0);
    expect(r.axisRows(6)[0].total).toBeGreaterThanOrEqual(r.axisRows(6)[1].total);
    /* F118 (D-260): no cap, all the groups of the domain */
    expect(r.domainRows(0).length).toBeGreaterThan(12);
    expect(Object.keys(r.subregionCounts(2))).toHaveLength(9);
    expect(r.organizations.find((o) => o.verify)?.label ?? "Alcaldía de Medellín").toBe("Alcaldía de Medellín");
  });
});
