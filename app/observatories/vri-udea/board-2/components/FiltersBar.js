"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* lib */
import { YEAR_RANGE } from "@/lib/observatories/collaboration";

/* Texts */
import { CENTER_TOOLTIP, centerCoverageNote } from "../../board-1/components/boardTexts";
import { SCOPE_OPTIONS } from "./boardTexts";

/* Components */
import FilterHelp from "@/app/observatories/components/FilterHelp";
import StickyFilters from "@/app/observatories/components/StickyFilters";

/* UI Library Components */
import { Button, Col, Row, Select, Tooltip, Typography } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }));
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 };
const searchFilter = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
const indexOptions = (list) => list.map((name, i) => ({ value: i, label: name }));

function Field({ label, children, span = 6, help = null }) {
  return (
    <Col xs={24} sm={12} md={span}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={labelStyle}>{label}</label>
        {help ? <FilterHelp label={label}>{help}</FilterHelp> : null}
      </div>
      {children}
    </Col>
  );
}

/**
 * Filters of Board 2 (report section 4). They apply at once; all of them are combined with AND.
 *
 * @param {Object} dataset - Dataset of the board.
 * @param {Object} filters - Current (draft) filters.
 * @param {Function} onChange - Receives a patch of the filters.
 * @param {Function} onReset - Restores the defaults.
 */
function FiltersBar({ dataset, filters, onChange, onReset }) {
  const { raw } = dataset;
  /* The filter acts on the works through the terms of the thesaurus (axes), not on goals: only the documents with terms (D-129). */
  const docs = useMemo(() => dataset.policyDocs.map((name) => ({ value: name, label: name })), [dataset]);
  /* A subfield name that two fields share carries its field in parentheses, as in Board 3 (B2, F50). */
  const subfieldLabel = useMemo(() => {
    const count = new Map();
    for (const name of raw.subfields) count.set(name, (count.get(name) || 0) + 1);
    return (i) => (count.get(raw.subfields[i]) > 1 ? `${raw.subfields[i]} (${raw.sfField[i]})` : raw.subfields[i]);
  }, [raw]);
  const subfields = useMemo(() => {
    const order = raw.subfields.map((_, i) => i).sort((a, b) => (raw.sfField[a] + raw.subfields[a]).localeCompare(raw.sfField[b] + raw.subfields[b]));
    const groups = [];
    for (const i of order) {
      const last = groups[groups.length - 1];
      if (!last || last.label !== raw.sfField[i]) groups.push({ label: raw.sfField[i], options: [] });
      groups[groups.length - 1].options.push({ value: i, label: subfieldLabel(i) });
    }
    return groups;
  }, [raw, subfieldLabel]);
  const centers = useMemo(() => indexOptions(raw.centros), [raw]);
  /* Coverage note of the centre filter, from the data of the board (D-126). */
  const centerNote = useMemo(() => centerCoverageNote(dataset.centerCoverage), [dataset]);
  const faculties = useMemo(() => indexOptions(raw.facs), [raw]);
  /* Subunits without works are not offered (B3, F50). */
  const units = useMemo(() => indexOptions(raw.deps).filter((o) => dataset.unitsWithWorks.has(o.value)), [raw, dataset]);

  const select = (key, options, placeholder, isIndex) => (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      options={options}
      filterOption={searchFilter}
      value={isIndex ? (filters[key] >= 0 ? filters[key] : undefined) : filters[key] || undefined}
      onChange={(v) => onChange({ [key]: v === undefined || v === null ? (isIndex ? -1 : "") : v })}
    />
  );

  /* Active filters for the folded bar (F50). */
  const active = [
    filters.scope && `Ámbito: ${SCOPE_OPTIONS.find((o) => o.value === filters.scope)?.label ?? filters.scope}`,
    filters.policyDoc && `Documento: ${filters.policyDoc}`,
    filters.centerIndex >= 0 && `Centro: ${raw.centros[filters.centerIndex]}`,
    (filters.yearFrom !== YEAR_RANGE.min || filters.yearTo !== YEAR_RANGE.max) && `Años: ${filters.yearFrom}–${filters.yearTo}`,
    filters.facultyIndex >= 0 && `Unidad: ${raw.facs[filters.facultyIndex]}`,
    filters.departmentIndex >= 0 && `Subunidad: ${raw.deps[filters.departmentIndex]}`,
    filters.subfieldIndex >= 0 && `Subcampo: ${subfieldLabel(filters.subfieldIndex)}`,
  ].filter(Boolean);

  return (
    <StickyFilters active={active}>
      <Row gutter={[12, 12]}>
        <Field label="Ámbito">{select("scope", SCOPE_OPTIONS, "Todos", false)}</Field>
        <Field label="Documento de política">{select("policyDoc", docs, "Todos", false)}</Field>
        <Field label="Centro de investigación" help={<><div>{CENTER_TOOLTIP}</div>{centerNote ? <div style={{ marginTop: 6 }}>{centerNote}</div> : null}</>}>
          <Tooltip title={CENTER_TOOLTIP}>
            <div>{select("centerIndex", centers, "Todos", true)}</div>
          </Tooltip>
        </Field>
        <Field label="Temporalidad">
          <div style={{ display: "flex", gap: 8 }}>
            <Select style={{ width: "50%" }} aria-label="Año inicial" options={YEAR_OPTIONS} value={filters.yearFrom} onChange={(v) => onChange({ yearFrom: v })} />
            <Select style={{ width: "50%" }} aria-label="Año final" options={YEAR_OPTIONS} value={filters.yearTo} onChange={(v) => onChange({ yearTo: v })} />
          </div>
        </Field>
        <Field label="Unidad académica">{select("facultyIndex", faculties, "Todas", true)}</Field>
        <Field label="Subunidad académica">{select("departmentIndex", units, "Todas", true)}</Field>
        <Field label="Subcampo de conocimiento">{select("subfieldIndex", subfields, "Todos", true)}</Field>
        <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "flex-end" }}>
          <Button onClick={onReset}>Limpiar filtros</Button>
        </Col>
      </Row>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Los filtros se aplican al instante y quedan en la dirección de la página. Se combinan con «y»; los proyectos solo responden a temporalidad, centro y ámbito departamental.
      </Typography.Text>
    </StickyFilters>
  );
}

export default memo(FiltersBar);
