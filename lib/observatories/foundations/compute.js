/* Constants & utils */
import { memoByFilters } from "../optionAvailability";
import {
  AGE_GROUPS,
  AUTHOR,
  CONTRACTS,
  GROUP_CATEGORIES,
  LAST_PUBLICATION_TYPE,
  LIMITS,
  OECD_AREAS,
  PRODUCT,
  STUDENT_LEVELS,
  THESIS_SERIES,
  TYPE,
  TYPE_LABELS,
  YEAR_RANGE,
} from "./constants";

/** Name that the bundle gives to the groups without a research centre. */
const NO_CENTER = "Sin centro";

/**
 * Pure computation of Board 3 (base capacities: talent, production and infrastructure). It is a
 * port of the artifact code (`filterProducts` and `render`), without any DOM, so the figures can be
 * checked against the original page. The population of the "profesores" cards is `isStaff`; the
 * panel 9 (Ondas) is retired (D-106) and is not computed.
 */

/**
 * Builds the dataset from the JSON of the artifact (the adapter calls this function once).
 *
 * @param {Object} raw - JSON of the artifact (`Tablero3_data.json`).
 * @returns {Object} dataset with the raw tables and the derived indexes.
 */
export function createFoundationsDataset(raw) {
  const topicMeta = raw.tops.map((t) => raw.top_meta[t]);
  const centerGroups = raw.centros.map((c) => new Set(raw.groups.map((g, i) => (g[4] === c ? i : -1)).filter((i) => i >= 0)));
  const groupHasCenter = raw.groups.map((g) => g[4] && g[4] !== NO_CENTER);
  return {
    raw,
    /* Products with at least one group in a research centre ("Sin centro" does not count), D-126. */
    centerCoverage: {
      withCenter: raw.P.filter((p) => p[PRODUCT.GROUPS].some((g) => groupHasCenter[g])).length,
      total: raw.P.length,
    },
    products: raw.P,
    authors: raw.A,
    topicMeta,
    centerGroups,
    isStaff: (a) => raw.A[a][AUTHOR.isStaff] === 1,
  };
}

/**
 * Products that pass the filters (artifact `filterProducts`). The entity filters (centre, faculty,
 * department, subfield) expand to the topics where the entity participates (report section 4).
 */
function filterProductsRaw(ds, f) {
  const { products: P, raw, topicMeta } = ds;
  let y0 = +f.yearFrom || YEAR_RANGE.min;
  let y1 = +f.yearTo || YEAR_RANGE.max;
  if (y0 > y1) [y0, y1] = [y1, y0];
  const centerGroups = f.centerIndex >= 0 ? ds.centerGroups[f.centerIndex] : null;
  const preds = [];
  if (centerGroups) preds.push((p) => p[PRODUCT.GROUPS].some((g) => centerGroups.has(g)));
  if (f.facultyIndex >= 0) preds.push((p) => p[PRODUCT.FACULTIES].includes(f.facultyIndex));
  if (f.departmentIndex >= 0) preds.push((p) => p[PRODUCT.DEPARTMENTS].includes(f.departmentIndex));
  if (f.subfieldIndex >= 0) preds.push((p) => p[PRODUCT.TOPIC] >= 0 && topicMeta[p[PRODUCT.TOPIC]][0] === f.subfieldIndex);
  if (f.fieldIndex >= 0) preds.push((p) => p[PRODUCT.TOPIC] >= 0 && topicMeta[p[PRODUCT.TOPIC]][1] === f.fieldIndex);
  const direct = preds.length ? (p) => preds.every((fn) => fn(p)) : null;
  let topicSet = null;
  if (direct) {
    topicSet = new Set();
    for (const p of P) if (p[PRODUCT.TOPIC] >= 0 && direct(p)) topicSet.add(p[PRODUCT.TOPIC]);
  }
  const out = [];
  for (const p of P) {
    const year = p[PRODUCT.YEAR];
    if (year != null && (year < y0 || year > y1)) continue;
    if (year == null && (y0 > YEAR_RANGE.min || y1 < YEAR_RANGE.max)) continue;
    if (f.scopeIndex >= 0 && p[PRODUCT.SCOPE] !== f.scopeIndex) continue;
    if (f.policyIndex >= 0 && !(p[PRODUCT.AGENDA_MASK] & (1 << f.policyIndex))) continue;
    if (topicSet && !((p[PRODUCT.TOPIC] >= 0 && topicSet.has(p[PRODUCT.TOPIC])) || direct(p))) continue;
    out.push(p);
  }
  return { F: out, y0, y1, direct };
}

/** Products that pass all the filters; the last results are kept, as the lists of options read the same products (F75). */
export const filterProducts = memoByFilters(filterProductsRaw);

const addTo = (map, key, value) => {
  let set = map.get(key);
  if (!set) map.set(key, (set = new Set()));
  set.add(value);
};
const unionSize = (sets) => {
  const all = new Set();
  for (const s of sets) for (const x of s) all.add(x);
  return all.size;
};

/**
 * Computes every figure of the board for a filter state.
 *
 * @param {Object} ds - Dataset from `createFoundationsDataset`.
 * @param {Object} filters - Filters (see DEFAULT_FOUNDATIONS_FILTERS).
 * @returns {Object} status, tiles and the data of each panel (names of the artifact numbering in comments).
 */
export function computeFoundations(ds, filters) {
  const { raw, authors: A, topicMeta, isStaff } = ds;
  const { F, y0, y1 } = filterProducts(ds, filters);
  const center = filters.centerIndex >= 0 ? raw.centros[filters.centerIndex] : "";
  const ageBin = (year, a) => {
    const birth = A[a][AUTHOR.birthYear];
    if (!birth || !year) return null;
    const age = year - birth;
    return age < 35 ? 0 : age < 45 ? 1 : age < 55 ? 2 : age < 65 ? 3 : 4;
  };

  const authorSet = new Set();
  const staffSet = new Set();
  const groupsIn = new Set();
  for (const p of F) {
    for (const a of p[PRODUCT.AUTHORS]) {
      authorSet.add(a);
      if (isStaff(a)) staffSet.add(a);
    }
    for (const g of p[PRODUCT.GROUPS]) groupsIn.add(g);
  }
  const pubs = F.filter((p) => p[PRODUCT.TYPE] <= LAST_PUBLICATION_TYPE);
  const count = (type) => F.filter((p) => p[PRODUCT.TYPE] === type).length;
  const nTheses = F.filter((p) => p[PRODUCT.TYPE] === TYPE.THESIS_POSTGRAD || p[PRODUCT.TYPE] === TYPE.THESIS_UNDERGRAD).length;
  const nDatasets = count(TYPE.DATASET);
  const nCompany = F.filter((p) => p[PRODUCT.SECTOR_MASK] & 1).length;

  const years = [];
  for (let y = Math.max(YEAR_RANGE.min, y0); y <= Math.min(YEAR_RANGE.max, y1); y++) years.push(y);

  const status = { products: F.length, authors: authorSet.size, staff: staffSet.size, groups: groupsIn.size, yearFrom: y0, yearTo: y1 };
  const tiles = {
    products: F.length,
    publications: pubs.length,
    theses: nTheses,
    authors: authorSet.size,
    staff: staffSet.size,
    groups: groupsIn.size,
    datasets: nDatasets,
    withCompany: nCompany,
  };

  /* Panel 1 (static, no filters): talent by Minciencias category. */
  const talent = raw.talent;

  /* Panel 7: students in projects (responds to centre and years only). */
  const pr = raw.proj;
  const centerKnown = Boolean(center && pr.by_centro[center]);
  /* A centre without key in `by_centro` has no projects: zeros, never all the projects (F87, D-199 (4)). «Sin centro» is that case: no project lacks a managing centre. */
  const zeros = pr.years.map(() => pr.levels.map(() => 0));
  const matrix = !center ? pr.all : centerKnown ? pr.by_centro[center] : zeros;
  const projectYears = pr.years.filter((y) => y >= y0 && y <= y1);
  const projectIdx = projectYears.map((y) => pr.years.indexOf(y));
  const students = {
    years: projectYears,
    series: STUDENT_LEVELS.map((level) => ({ label: level, values: projectIdx.map((i) => matrix[i][pr.levels.indexOf(level)]) })),
    uniqueStudents: pr.estudiantes_unicos,
    projects: pr.proyectos_total,
    byCenter: centerKnown,
    /* A centre was chosen but the table of projects has no key for it: the panel shows all projects (F85, G-4). */
    centerMissing: Boolean(center) && !centerKnown,
    /* «Sin centro»: no project of the table lacks a managing centre (F87). */
    withoutCenter: center === NO_CENTER,
  };

  /* Panel 16: datasets by topic (top 15). */
  const dsTopics = new Map();
  for (const p of F) {
    if (p[PRODUCT.TYPE] !== TYPE.DATASET) continue;
    const key = p[PRODUCT.TOPIC] >= 0 ? raw.tops[p[PRODUCT.TOPIC]] : "Sin tópico";
    const o = dsTopics.get(key) || { count: 0, staff: new Set(), faculties: new Set() };
    o.count++;
    for (const a of p[PRODUCT.AUTHORS]) if (isStaff(a)) o.staff.add(a);
    for (const fac of p[PRODUCT.FACULTIES]) o.faculties.add(fac);
    dsTopics.set(key, o);
  }
  const datasets = {
    rows: [...dsTopics.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, LIMITS.datasets)
      .map(([label, o]) => ({ label, value: o.count, staff: o.staff.size, faculties: o.faculties.size, noTopic: label === "Sin tópico" })),
    total: nDatasets,
    open: F.filter((p) => p[PRODUCT.TYPE] === TYPE.DATASET && p[PRODUCT.OPEN_ACCESS] === 1).length,
    /* F88: datasets whose year is 2026 (load date of the record), among the filtered ones. */
    year2026: F.filter((p) => p[PRODUCT.TYPE] === TYPE.DATASET && p[PRODUCT.YEAR] === 2026).length,
    staff: unionSize([...dsTopics.values()].map((o) => o.staff)),
    faculties: unionSize([...dsTopics.values()].map((o) => o.faculties)),
  };

  /* Panel 2: active researchers linked to groups, by OECD area. */
  const areaAuthors = new Map();
  const active = new Set();
  const activeFrom = Math.max(2021, y0);
  for (const p of F) {
    if (!p[PRODUCT.YEAR] || p[PRODUCT.YEAR] < activeFrom) continue;
    for (const a of p[PRODUCT.AUTHORS]) {
      const g = A[a][AUTHOR.mainGroup];
      if (g < 0) continue;
      addTo(areaAuthors, raw.groups[g][2], a);
      active.add(a);
    }
  }
  const areas = { items: OECD_AREAS.map((name) => ({ name, value: (areaAuthors.get(name) || new Set()).size })), active: active.size, from: activeFrom };

  /* Panel 3: active groups by OECD area and Minciencias category. */
  const groupCells = {};
  let activeGroups = 0;
  const otherFilters = filters.facultyIndex >= 0 || filters.departmentIndex >= 0 || filters.subfieldIndex >= 0 || filters.fieldIndex >= 0 || filters.policyIndex >= 0 || filters.scopeIndex >= 0;
  raw.groups.forEach((g, i) => {
    if (g[6] !== "Activo") return;
    if (center && g[4] !== center) return;
    if (otherFilters && !groupsIn.has(i)) return;
    const category = GROUP_CATEGORIES.includes(g[3]) ? g[3] : "No aplica";
    const key = `${g[2]}|${category}`;
    groupCells[key] = (groupCells[key] || 0) + 1;
    activeGroups++;
  });
  const groupGrid = {
    cells: OECD_AREAS.flatMap((area) => GROUP_CATEGORIES.map((category) => ({ area, category, value: groupCells[`${area}|${category}`] || 0 }))).filter((c) => c.value > 0),
    total: activeGroups,
  };

  /* Panels 10 and 11: staff by main faculty with appropriation / company. */
  const facStaff = new Map();
  const facAppropriation = new Map();
  const facCompany = new Map();
  for (const p of F) {
    for (const a of p[PRODUCT.AUTHORS]) {
      if (!isStaff(a)) continue;
      const faculty = A[a][AUTHOR.mainFaculty] >= 0 ? raw.facs[A[a][AUTHOR.mainFaculty]] : "Sin unidad";
      addTo(facStaff, faculty, a);
      if (p[PRODUCT.TYPE] === TYPE.APPROPRIATION) addTo(facAppropriation, faculty, a);
      if (p[PRODUCT.SECTOR_MASK] & 1) addTo(facCompany, faculty, a);
    }
  }
  const facultyRows = (map) =>
    [...facStaff.entries()]
      .map(([label, set]) => ({ label, value: (map.get(label) || new Set()).size, total: set.size }))
      .filter((r) => r.value >= 1)
      .sort((a, b) => b.value - a.value);
  const appropriation = { rows: facultyRows(facAppropriation), staff: unionSize(facAppropriation.values()) };
  const company = { rows: facultyRows(facCompany), products: nCompany, staff: unionSize(facCompany.values()) };

  /* Panel 15: repository against total by year and domain. */
  const repo = {};
  for (const p of pubs) {
    if (p[PRODUCT.YEAR] == null) continue;
    const domain = p[PRODUCT.TOPIC] >= 0 ? raw.doms[topicMeta[p[PRODUCT.TOPIC]][2]] : "Sin tópico";
    const key = `${domain}|${p[PRODUCT.YEAR]}`;
    repo[key] = repo[key] || [0, 0];
    repo[key][0]++;
    if (p[PRODUCT.REPOSITORY] === 1) repo[key][1]++;
  }
  const repository = {
    years,
    domains: raw.doms.map((domain) => {
      const total = years.map((y) => (repo[`${domain}|${y}`] || [0, 0])[0]);
      const inRepository = years.map((y) => (repo[`${domain}|${y}`] || [0, 0])[1]);
      return { domain, total, inRepository, totalSum: total.reduce((a, b) => a + b, 0), repositorySum: inRepository.reduce((a, b) => a + b, 0) };
    }),
    inRepository: pubs.filter((p) => p[PRODUCT.REPOSITORY] === 1).length,
    publications: pubs.length,
    known: pubs.filter((p) => p[PRODUCT.REPOSITORY] != null).length,
  };

  /* Panel 17: open access. */
  const openAccess = {
    open: pubs.filter((p) => p[PRODUCT.OPEN_ACCESS] === 1).length,
    closed: pubs.filter((p) => p[PRODUCT.OPEN_ACCESS] === 0).length,
    noData: pubs.filter((p) => p[PRODUCT.OPEN_ACCESS] == null).length,
    datasetsOpen: datasets.open,
    datasets: nDatasets,
    /* Preprints are a mark of the product (P[17], B126b), not a type. */
    preprints: F.filter((p) => p[PRODUCT.PREPRINT] === 1).length,
    software: count(TYPE.SOFTWARE),
    /* Pie of the indicator 17 (D-175 (4)(b)): every product in one portion, with the precedence preprint → publication → research data → software. */
    classes: (() => {
      const c = { preprints: 0, publications: 0, datasets: 0, software: 0 };
      for (const p of F) {
        if (p[PRODUCT.PREPRINT] === 1) c.preprints++;
        else if (p[PRODUCT.TYPE] <= LAST_PUBLICATION_TYPE) c.publications++;
        else if (p[PRODUCT.TYPE] === TYPE.DATASET) c.datasets++;
        else if (p[PRODUCT.TYPE] === TYPE.SOFTWARE) c.software++;
      }
      return c;
    })(),
    /* Preprints that are articles, books or chapters: they leave «publications» in the pie. */
    preprintsFromPublications: pubs.filter((p) => p[PRODUCT.PREPRINT] === 1).length,
  };

  /* Panel c: staff by product type (without articles, books or chapters), stacked by contract. */
  const contractIndex = (c) => {
    const i = CONTRACTS.indexOf(c);
    return i >= 0 ? i : CONTRACTS.length - 1;
  };
  const typeStaff = {};
  for (const p of F) {
    if (p[PRODUCT.TYPE] <= LAST_PUBLICATION_TYPE) continue;
    const t = raw.tipos[p[PRODUCT.TYPE]];
    typeStaff[t] = typeStaff[t] || new Map();
    for (const a of p[PRODUCT.AUTHORS]) if (isStaff(a)) typeStaff[t].set(a, contractIndex(A[a][AUTHOR.contract]));
  }
  const staffByType = Object.entries(typeStaff)
    .map(([t, m]) => {
      const values = CONTRACTS.map(() => 0);
      for (const c of m.values()) values[c]++;
      return { label: TYPE_LABELS[t] || t, values, total: m.size };
    })
    .sort((a, b) => b.total - a.total);

  /* Panels 4, 5 and 6: authors by age group, by sex and by topic. */
  const ageYear = {};
  const sexYear = {};
  const topicAge = {};
  for (const p of F) {
    const year = p[PRODUCT.YEAR];
    if (year == null) continue;
    for (const a of p[PRODUCT.AUTHORS]) {
      const bin = ageBin(year, a);
      if (bin != null) {
        (ageYear[`${bin}|${year}`] = ageYear[`${bin}|${year}`] || new Set()).add(a);
        if (p[PRODUCT.TOPIC] >= 0) {
          const k = p[PRODUCT.TOPIC];
          topicAge[k] = topicAge[k] || AGE_GROUPS.map(() => new Set());
          topicAge[k][bin].add(a);
        }
      }
      const sex = A[a][AUTHOR.sex];
      (sexYear[`${sex}|${year}`] = sexYear[`${sex}|${year}`] || new Set()).add(a);
    }
  }
  const authorList = [...authorSet];
  const ageByYear = {
    years,
    series: AGE_GROUPS.map((label, i) => ({ label, values: years.map((y) => (ageYear[`${i}|${y}`] || new Set()).size) })),
    withBirthYear: authorList.filter((a) => A[a][AUTHOR.birthYear]).length,
    authors: authorSet.size,
  };
  const sexByYear = {
    years,
    series: [1, 2, 0].map((s) => ({ sex: s, values: years.map((y) => (sexYear[`${s}|${y}`] || new Set()).size) })),
    withSex: authorList.filter((a) => A[a][AUTHOR.sex] > 0).length,
    authors: authorSet.size,
  };
  const ageByTopic = Object.entries(topicAge)
    .map(([k, sets]) => ({ label: raw.tops[k], values: sets.map((s) => s.size), total: unionSize(sets) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, LIMITS.ageTopics);

  /* Panel 18: coverage of persistent identifiers. */
  const staffList = [...staffSet];
  const institutions = new Set();
  for (const p of F) for (const i of p[PRODUCT.INSTITUTIONS]) institutions.add(i);
  const withRor = [...institutions].filter((i) => raw.inst[i][1]).length;
  const doiAll = F.filter((p) => p[PRODUCT.DOI]).length;
  const doiPublications = pubs.filter((p) => p[PRODUCT.DOI]).length;
  const pidCount = (key) => authorList.filter((a) => A[a][key]).length;
  /* «All the identifiers available» (D-175 (4)(a)): product = DOI or handle; person = ORCID or OpenAlex ID; organisation = ROR (the only one). */
  const hasHandle = raw.P.length > 0 && raw.P[0].length > PRODUCT.HANDLE;
  const handleAll = hasHandle ? F.filter((p) => p[PRODUCT.HANDLE] === 1).length : 0;
  const anyProductId = hasHandle ? F.filter((p) => p[PRODUCT.DOI] || p[PRODUCT.HANDLE] === 1).length : 0;
  const anyPersonId = authorList.filter((a) => A[a][AUTHOR.orcid] || A[a][AUTHOR.openAlexId]).length;
  const pid = [
    ["Personas · ORCID", pidCount(AUTHOR.orcid), authorSet.size],
    ["Personas · OpenAlex", pidCount(AUTHOR.openAlexId), authorSet.size],
    ["Personas · Scholar", pidCount(AUTHOR.scholar), authorSet.size],
    ["Profesores · ORCID", staffList.filter((a) => A[a][AUTHOR.orcid]).length, staffSet.size],
    ["Productos · DOI (todos)", doiAll, F.length],
    ["Publicaciones · DOI", doiPublications, pubs.length],
    ...(hasHandle
      ? [
          ["Personas · todos (ORCID u OpenAlex)", anyPersonId, authorSet.size],
          ["Productos · Handle", handleAll, F.length],
          ["Productos · todos (DOI o Handle)", anyProductId, F.length],
        ]
      : []),
    [hasHandle ? "Organizaciones · ROR (único disponible)" : "Organizaciones · ROR", withRor, institutions.size],
  ].map(([label, withId, total]) => ({ label, withId, withoutId: total - withId, total }));

  /* Panel 8: theses by subtype and year. */
  const thesis = {};
  for (const p of F) {
    if ((p[PRODUCT.TYPE] === TYPE.THESIS_POSTGRAD || p[PRODUCT.TYPE] === TYPE.THESIS_UNDERGRAD) && p[PRODUCT.YEAR] != null) {
      const key = `${raw.tesis_sub[p[PRODUCT.THESIS_SUBTYPE]]}|${p[PRODUCT.YEAR]}`;
      thesis[key] = (thesis[key] || 0) + 1;
    }
  }
  const theses = {
    years,
    series: THESIS_SERIES.map((s) => ({ label: s.name, values: years.map((y) => s.keys.reduce((acc, k) => acc + (thesis[`${k}|${y}`] || 0), 0)) })),
  };
  theses.totals = theses.series.map((s) => s.values.reduce((a, b) => a + b, 0));

  /* Panels 12, 13 and 14 (static, no filters): arts. */
  const arts = computeArts(raw.artes);

  return {
    status,
    tiles,
    talent,
    students,
    datasets,
    areas,
    groupGrid,
    appropriation,
    company,
    repository,
    openAccess,
    staffByType,
    ageByYear,
    sexByYear,
    ageByTopic,
    pid,
    theses,
    arts,
    creation: raw.creacion,
  };
}

/** Contract group of the scatter of the panel 12 (artifact `contrG`). */
const artContract = (c) => (c === "vinculado" ? "vinculado" : c === "ocasional" ? "ocasional" : "otro/desconocido");
const ART_GROUPS = ["vinculado", "ocasional", "otro/desconocido"];
/** Level of education of the staff of the arts (B126b, `artes.prof[].nivel`); the two kinds of specialisation go together. */
export const ART_LEVELS = Object.freeze(["Doctorado", "Maestría", "Especialización", "Profesional", "Sin dato"]);
const artLevel = (n) => {
  const t = String(n || "").toLowerCase();
  if (t.startsWith("doctor")) return "Doctorado";
  if (t.startsWith("maestr")) return "Maestría";
  if (t.startsWith("especializ")) return "Especialización";
  if (t.startsWith("profesional")) return "Profesional";
  return "Sin dato";
};

function computeArts(artes) {
  const professors = artes.prof.filter((p) => p.works + p.obras > 0);
  /* With the level in the bundle (B126b) the scatter groups by level; the artifact has only the contract. */
  const byLevel = artes.prof.some((p) => p.nivel !== undefined);
  const groups = byLevel ? ART_LEVELS : ART_GROUPS;
  const groupOf = byLevel ? (p) => artLevel(p.nivel) : (p) => artContract(p.contrato);
  const counts = {};
  for (const p of professors) {
    const key = `${groupOf(p)}|${Math.min(p.works + p.obras, LIMITS.maxArtProducts)}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  const points = [];
  for (const group of groups) {
    for (let x = 1; x <= LIMITS.maxArtProducts; x++) {
      const value = counts[`${group}|${x}`];
      if (value) points.push({ group, products: x, professors: value });
    }
  }
  const projectsByGroup = Object.entries(artes.proy_grupos).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  const creationByFaculty = Object.entries(artes.fac_creacion)
    .map(([label, v]) => ({ label, works: v.obras, projects: v.proyectos, people: v.personas }))
    .sort((a, b) => b.works - a.works);
  return {
    points,
    groups,
    byLevel,
    professors: professors.length,
    linked: professors.filter((p) => p.contrato === "vinculado").length,
    occasional: professors.filter((p) => p.contrato === "ocasional").length,
    projectsByGroup,
    projectsTotal: projectsByGroup.reduce((a, r) => a + r.value, 0),
    creationByFaculty,
    uniqueProjects: artes.creacion_proyectos_unicos,
  };
}

