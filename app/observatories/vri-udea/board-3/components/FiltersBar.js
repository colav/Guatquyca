"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* lib */
import { ACTIVE_POLICY_DOCUMENTS, YEAR_RANGE } from "@/lib/observatories/foundations";

/* Texts */
import { CENTER_TOOLTIP, centerCoverageNote } from "../../board-1/components/boardTexts";
import { SCOPE_LABELS } from "./boardTexts";

/* Components */
import FilterHelp from "@/app/observatories/components/FilterHelp";
import StickyFilters from "@/app/observatories/components/StickyFilters";

/* UI Library Components */
import { Button, Col, Row, Select, Tooltip, Typography } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }));
const SCOPE_OPTIONS = SCOPE_LABELS.map((label, value) => ({ value, label }));
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 2 };
const searchFilter = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const indexOptions = (list) => list.map((name, i) => ({ value: i, label: name }));

function Field({ label, children, help = null }) {
  return (
    <Col xs={24} sm={12} md={6}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={labelStyle}>{label}</label>
        {help ? <FilterHelp label={label}>{help}</FilterHelp> : null}
      </div>
      {children}
    </Col>
  );
}

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
function FiltersBar({ raw, centerCoverage, filters, onChange, onReset }) {
  /* The filter acts on the products through the axes (bit of the document in the agenda mask), not on goals:
     only the documents with axes (D-129). The value is the position in `agendas_all`, the bit of the mask. */
  const documents = useMemo(() => {
    const withAxes = raw.agendas || raw.agendas_all.slice(0, ACTIVE_POLICY_DOCUMENTS);
    return withAxes.map((name) => ({ value: raw.agendas_all.indexOf(name), label: name }));
  }, [raw]);
  /* «Sin centro» is the 26.ª option, labelled «Sin centro asignado» and at the end of the list (M1, F50). */
  const centerLabel = (i) => (raw.centros[i] === "Sin centro" ? "Sin centro asignado" : raw.centros[i]);
  const centers = useMemo(() => raw.centros.map((name, i) => ({ value: i, label: name === "Sin centro" ? "Sin centro asignado" : name })).sort((a, b) => (a.label === "Sin centro asignado") - (b.label === "Sin centro asignado")), [raw]);
  /* Coverage note of the centre filter (D-126). "Sin centro" is not an option but counts as a product without centre. */
  const centerNote = useMemo(() => centerCoverageNote(centerCoverage), [centerCoverage]);
  const faculties = useMemo(() => indexOptions(raw.facs), [raw]);
  const units = useMemo(() => indexOptions(raw.deps), [raw]);
  const subfields = useMemo(() => indexOptions(raw.subs), [raw]);

  const select = (key, options, placeholder) => (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      options={options}
      filterOption={searchFilter}
      value={filters[key] >= 0 ? filters[key] : undefined}
      onChange={(v) => onChange({ [key]: v === undefined || v === null ? -1 : v })}
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
  ].filter(Boolean);

  return (
    <StickyFilters active={active}>
      <Row gutter={[12, 6]}>
        <Field label="Ámbito">{select("scopeIndex", SCOPE_OPTIONS, "Todos")}</Field>
        <Field label="Documento de política">{select("policyIndex", documents, "Todos")}</Field>
        <Field label="Centro de investigación" help={<><div>{CENTER_TOOLTIP}</div>{centerNote ? <div style={{ marginTop: 6 }}>{centerNote}</div> : null}</>}>
          <Tooltip title={CENTER_TOOLTIP}>
            <div>{select("centerIndex", centers, "Todos")}</div>
          </Tooltip>
        </Field>
        <Field label="Temporalidad">
          <div style={{ display: "flex", gap: 8 }}>
            <Select style={{ width: "50%" }} aria-label="Año inicial" options={YEAR_OPTIONS} value={filters.yearFrom} onChange={(v) => onChange({ yearFrom: v })} />
            <Select style={{ width: "50%" }} aria-label="Año final" options={YEAR_OPTIONS} value={filters.yearTo} onChange={(v) => onChange({ yearTo: v })} />
          </div>
        </Field>
        <Field label="Unidad académica">{select("facultyIndex", faculties, "Todas")}</Field>
        <Field label="Subunidad académica">{select("departmentIndex", units, "Todas")}</Field>
        <Field label="Subcampo de conocimiento">{select("subfieldIndex", subfields, "Todos")}</Field>
        <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "flex-end" }}>
          <Button onClick={onReset}>Limpiar filtros</Button>
        </Col>
      </Row>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Los filtros se aplican al instante y quedan en la dirección de la página. Se combinan con «y»; los paneles 1, 12, 13 y 14 no responden a los filtros y el 7 solo a centro y temporalidad.
      </Typography.Text>
    </StickyFilters>
  );
}

export default memo(FiltersBar);
