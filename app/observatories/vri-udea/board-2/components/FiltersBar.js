"use client";

/* Hooks */
import { memo, useMemo, useRef, useState } from "react";

/* lib */
import { YEAR_RANGE } from "@/lib/observatories/collaboration";

/* Texts */
import { CENTER_TOOLTIP, centerCoverageNote } from "../../board-1/components/boardTexts";
import { AXIS_FILTER_NOTE, AXIS_FILTER_NOTE_NO_PROJECTS, SCOPE_OPTIONS } from "./boardTexts";

/* Components */
import FilterHelp from "@/app/observatories/components/FilterHelp";
import StickyFilters from "@/app/observatories/components/StickyFilters";

/* UI Library Components */
import { Col, Row, Select, Tooltip, Typography } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }));
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 2 };
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

  /* Eje Temático (F59, D-159): grouped by document of policy; with a document chosen it lists only the axes of that document. */
  const axisGroups = useMemo(() => dataset.axisGroups.map((g) => ({ label: g.agenda, options: g.axes.map((a) => ({ value: a.id, label: a.label })) })), [dataset]);
  const axisOptions = filters.policyDoc ? axisGroups.filter((g) => g.label === filters.policyDoc) : axisGroups;
  const axisNote = dataset.hasProjectPairs ? AXIS_FILTER_NOTE : AXIS_FILTER_NOTE_NO_PROJECTS;
  const axisLabel = (id) => axisGroups.flatMap((g) => g.options).find((o) => o.value === id)?.label ?? String(id);
  /* A document that does not contain the chosen axis clears it (otherwise the two would leave nothing). */
  const changeDocument = (v) => {
    const doc = v || "";
    const owner = dataset.axisById.get(filters.axisId)?.agenda;
    onChange({ policyDoc: doc, ...(doc && owner && owner !== doc ? { axisId: -1 } : {}) });
  };

  /* List of the axes with the size of the list of Board 1 (F62, D-165): the field of Board 1 is half the row (span 12) from md up and the list has the width of the field; here the field is a quarter, so the width is set to the one of Board 1, never wider than the window. Height: the default of Ant Design, as in Board 1. */
  const rowRef = useRef(null);
  const [axisWidth, setAxisWidth] = useState(true);
  const onAxisOpen = (open) => {
    if (!open || !rowRef.current) return;
    const row = rowRef.current.offsetWidth;
    const board1 = window.innerWidth >= 768 ? row / 2 - 12 : row - 12;
    setAxisWidth(Math.max(240, Math.round(Math.min(board1, window.innerWidth - 32))));
  };

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
    dataset.hasAxisPairs && filters.axisId >= 0 && dataset.axisById.has(filters.axisId) && `Eje: ${axisLabel(filters.axisId)}`,
    filters.centerIndex >= 0 && `Centro: ${raw.centros[filters.centerIndex]}`,
    (filters.yearFrom !== YEAR_RANGE.min || filters.yearTo !== YEAR_RANGE.max) && `Años: ${filters.yearFrom}–${filters.yearTo}`,
    filters.facultyIndex >= 0 && `Unidad: ${raw.facs[filters.facultyIndex]}`,
    filters.departmentIndex >= 0 && `Subunidad: ${raw.deps[filters.departmentIndex]}`,
    filters.subfieldIndex >= 0 && `Subcampo: ${subfieldLabel(filters.subfieldIndex)}`,
  ].filter(Boolean);

  return (
    <StickyFilters active={active} onReset={onReset} resetLabel="Limpiar filtros">
      <Row gutter={[12, 6]} ref={rowRef}>
        <Field label="Ámbito">{select("scope", SCOPE_OPTIONS, "Todos", false)}</Field>
        <Field label="Documento de política">
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Todos"
            options={docs}
            filterOption={searchFilter}
            value={filters.policyDoc || undefined}
            onChange={changeDocument}
          />
        </Field>
        {dataset.hasAxisPairs ? (
          <Field label="Eje Temático" help={axisNote}>
            <Select
              showSearch
              allowClear
              data-testid="axis-filter"
              style={{ width: "100%" }}
              popupMatchSelectWidth={axisWidth}
              onOpenChange={onAxisOpen}
              optionRender={(o) => <div style={{ whiteSpace: "normal", lineHeight: 1.3 }}>{o.label}</div>}
              placeholder="Todos"
              options={axisOptions}
              filterOption={searchFilter}
              value={filters.axisId >= 0 ? filters.axisId : undefined}
              onChange={(v) => onChange({ axisId: v === undefined || v === null ? -1 : v })}
            />
          </Field>
        ) : null}
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
      </Row>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Se combinan con «y»; los proyectos solo responden a temporalidad, centro y ámbito departamental.
        {filters.axisId >= 0 && dataset.axisById.has(filters.axisId) ? <span data-testid="axis-filter-note"> {axisNote}</span> : null}
      </Typography.Text>
    </StickyFilters>
  );
}

export default memo(FiltersBar);
