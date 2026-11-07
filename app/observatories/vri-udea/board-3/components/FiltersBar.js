"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* lib */
import { ACTIVE_POLICY_DOCUMENTS, YEAR_RANGE } from "@/lib/observatories/foundations";

/* Texts */
import { CENTER_TOOLTIP, centerCoverageNote } from "../../board-1/components/boardTexts";
import { DOCUMENT_FILTER_HELP, SCOPE_LABELS } from "./boardTexts";
import { OPTIONS_NOTE, onlyAvailable } from "@/lib/observatories/optionAvailability";
import { HierarchySelect, indexTree, pruneTree } from "@/app/observatories/components/HierarchySelect";
import { subunitOptions, unitChangePatch } from "@/lib/observatories/unitHierarchy";
import { FilterSelect, useStableChange } from "@/app/observatories/components/FilterSelect";
import { byPolicyOrder } from "../../board-1/components/boardTexts";

/* Components */
import FilterRows, { SWITCH_COLUMN, YEARS_COLUMN } from "@/app/observatories/components/FilterRows";
import Field from "@/app/observatories/components/Field";
import StickyFilters from "@/app/observatories/components/StickyFilters";

/* UI Library Components */
import { Select, Tooltip, Typography } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }));
const SCOPE_OPTIONS = SCOPE_LABELS.map((label, value) => ({ value, label }));
/** Filter of the state -> list of the availability (F75). */
const AVAILABLE_KEY = { scopeIndex: "scope", policyIndex: "policyDoc", centerIndex: "center", facultyIndex: "unit", departmentIndex: "subunit", subfieldIndex: "subfield" };
const searchFilter = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const indexOptions = (list) => list.map((name, i) => ({ value: i, label: name }));

/**
 * Filters of Board 3 (report section 4). They apply at once and are combined with AND; the
 * entity filters (centre, unit, subunit, subfield) expand to the topics where the entity takes part.
 *
 * @param {Object} raw - Tables of the dataset.
 * @param {{ withCenter: number, total: number }} centerCoverage - Products that belong to a research centre.
 * @param {Object} filters - Current (draft) filters.
 * @param {Function} onChange - Receives a patch of the filters.
 * @param {Function} onReset - Restores the defaults.
 */
function FiltersBar({ raw, centerCoverage, filters, onChange, onReset, available = null }) {
  /* The filter acts on the products through the axes (bit of the document in the agenda mask), not on goals:
     only the documents with axes (D-129). The value is the position in `agendas_all`, the bit of the mask. */
  const documents = useMemo(() => {
    const withAxes = raw.agendas || raw.agendas_all.slice(0, ACTIVE_POLICY_DOCUMENTS);
    return [...withAxes].sort(byPolicyOrder).map((name) => ({ value: raw.agendas_all.indexOf(name), label: name }));
  }, [raw]);
  /* «Sin centro» is the 26.ª option, labelled «Sin centro asignado» and at the end of the list (M1, F50). */
  const centerLabel = (i) => (raw.centros[i] === "Sin centro" ? "Sin centro asignado" : raw.centros[i]);
  const centers = useMemo(() => raw.centros.map((name, i) => ({ value: i, label: name === "Sin centro" ? "Sin centro asignado" : name })).sort((a, b) => (a.label === "Sin centro asignado") - (b.label === "Sin centro asignado")), [raw]);
  /* Coverage note of the centre filter (D-126). "Sin centro" is not an option but counts as a product without centre. */
  const centerNote = useMemo(() => centerCoverageNote(centerCoverage), [centerCoverage]);
  const faculties = useMemo(() => indexOptions(raw.facs), [raw]);
  const units = useMemo(() => subunitOptions(raw.deps, raw.deps_fac, raw.facs, filters.facultyIndex), [raw, filters.facultyIndex]);
  /* Tree field → subfield (F76): choosing a field is choosing all its subfields. */
  const subfieldTree = useMemo(() => {
    const byField = new Map();
    raw.subs.forEach((name, i) => {
      const f = raw.sub_meta && raw.sub_meta[name] ? raw.sub_meta[name][0] : 0;
      if (!byField.has(f)) byField.set(f, []);
      byField.get(f).push({ value: `s:${i}`, title: name, leafId: i });
    });
    const byTitle = (a, b) => a.title.localeCompare(b.title, "es");
    return [...byField.entries()].map(([f, kids]) => ({ value: `f:${f}`, title: (raw.fields && raw.fields[f]) || "Campo", children: kids.sort(byTitle) })).sort(byTitle);
  }, [raw]);
  const subfieldPaths = useMemo(() => indexTree(subfieldTree).path, [subfieldTree]);
  const subfieldValue = filters.subfieldIndex >= 0 ? `s:${filters.subfieldIndex}` : filters.fieldIndex >= 0 ? `f:${filters.fieldIndex}` : "";
  const subfieldShown = pruneTree(subfieldTree, available && available.subfield, subfieldValue);
  const changeSubfield = (v) => {
    if (!v) onChange({ subfieldIndex: -1, fieldIndex: -1 });
    else if (v.startsWith("s:")) onChange({ subfieldIndex: Number(v.slice(2)), fieldIndex: -1 });
    else onChange({ subfieldIndex: -1, fieldIndex: Number(v.slice(2)) });
  };

  /* Each select keeps its handler and only re-renders when its own options or value change (F75). */
  const stable = useStableChange();
  const select = (key, options, placeholder, custom = null) => (
    <FilterSelect
      data-testid={`filter-${key}`}
      placeholder={placeholder}
      options={onlyAvailable(options, available && available[AVAILABLE_KEY[key]], filters[key])}
      filterOption={searchFilter}
      value={filters[key] >= 0 ? filters[key] : undefined}
      onChange={stable(key, custom || ((v) => onChange({ [key]: v === undefined || v === null ? -1 : v })))}
    />
  );

  /* Active filters for the folded bar (F50). */
  const active = [
    filters.scopeIndex >= 0 && `Ámbito: ${SCOPE_LABELS[filters.scopeIndex]}`,
    filters.policyIndex >= 0 && `Documento: ${raw.agendas_all[filters.policyIndex]}`,
    filters.centerIndex >= 0 && `Centro: ${centerLabel(filters.centerIndex)}`,
    (filters.yearFrom !== YEAR_RANGE.min || filters.yearTo !== YEAR_RANGE.max) && `Años: ${filters.yearFrom}–${filters.yearTo}`,
    filters.facultyIndex >= 0 && `Unidad: ${raw.facs[filters.facultyIndex]}`,
    filters.departmentIndex >= 0 && `Subunidad: ${raw.deps[filters.departmentIndex]}`,
    filters.subfieldIndex >= 0 && `Subcampo: ${raw.subs[filters.subfieldIndex]}`,
    filters.fieldIndex >= 0 && `Campo: ${raw.fields[filters.fieldIndex]}`,
  ].filter(Boolean);

  return (
    <StickyFilters active={active} onReset={onReset} resetLabel="Limpiar filtros">
      <FilterRows
        rows={[
          {
            columns: "1fr 1fr 1fr",
            cells: [
              <Field key="unit" label="Unidad académica">{select("facultyIndex", faculties, "Todas", (v) => onChange(unitChangePatch(raw.deps_fac, v ?? -1, filters.departmentIndex)))}</Field>,
              <Field key="subunit" label="Subunidad académica">{select("departmentIndex", units, "Todas")}</Field>,
              <Field key="center" label="Centro de investigación" help={<><div>{CENTER_TOOLTIP}</div>{centerNote ? <div style={{ marginTop: 6 }}>{centerNote}</div> : null}</>}>
                <Tooltip title={CENTER_TOOLTIP}>
                  <div>{select("centerIndex", centers, "Todos")}</div>
                </Tooltip>
              </Field>,
            ],
          },
          {
            columns: "1fr 1fr 1fr",
            cells: [
              <Field key="scope" label="Ámbito">{select("scopeIndex", SCOPE_OPTIONS, "Todos")}</Field>,
              <Field key="doc" label="Documento de política" help={DOCUMENT_FILTER_HELP}>{select("policyIndex", documents, "Todos")}</Field>,
            ],
          },
          {
            columns: `1fr ${YEARS_COLUMN}px`,
            cells: [
              <Field key="subfield" label="Subcampo de conocimiento">
                <HierarchySelect tree={subfieldShown} paths={subfieldPaths} value={subfieldValue} onChange={stable("subfield", changeSubfield)} data-testid="subfield-filter" />
              </Field>,
              <Field key="years" label="Temporalidad">
                <div style={{ display: "flex", gap: 8 }}>
                  <FilterSelect style={{ width: 94 }} popupMatchSelectWidth showSearch={false} allowClear={false} aria-label="Año inicial" options={YEAR_OPTIONS} value={filters.yearFrom} onChange={stable("yearFrom", (v) => onChange({ yearFrom: v }))} />
                  <FilterSelect style={{ width: 94 }} popupMatchSelectWidth showSearch={false} allowClear={false} aria-label="Año final" options={YEAR_OPTIONS} value={filters.yearTo} onChange={stable("yearTo", (v) => onChange({ yearTo: v }))} />
                </div>
              </Field>,
            ],
          },
        ]}
      />
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Se combinan con «y»; los paneles 1, 12, 13 y 14 no responden a los filtros y el 7 solo a centro y temporalidad. {OPTIONS_NOTE}
      </Typography.Text>
    </StickyFilters>
  );
}

export default memo(FiltersBar);
