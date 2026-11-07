"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* lib */
import { PAIR_LEVEL, YEAR_RANGE, axesOutsideDocument, docsInScope, scopeChangePatch } from "@/lib/observatories/capacity";

/* Texts */
import {
  ALL_SCOPES,
  SCOPE_LABELS,
  byPolicyOrder,
  DIMENSION_OPTIONS,
  PAIR_LEVEL_OPTIONS,
  PAIR_LEVEL_TOOLTIP,
  CENTER_TOOLTIP,
  RATIO_BASIS_OPTIONS,
  centerCoverageNote,
  AXIS_FILTER_LABEL,
  ODS_FILTER_HELP,
  ODS_FILTER_LABEL,
  AXIS_FILTER_TOOLTIP,
} from "./boardTexts";

/* Components */
import FilterHelp from "@/app/observatories/components/FilterHelp";
import StickyFilters from "@/app/observatories/components/StickyFilters";

/* UI Library Components */
import { Col, Row, Segmented, Select, Tooltip } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from(
  { length: YEAR_RANGE.max - YEAR_RANGE.min + 1 },
  (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }),
);

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 2 };

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

/* Long names go in two lines, not cut (F67). */
const wrapOption = (o) => <div style={{ whiteSpace: "normal", lineHeight: 1.3 }}>{o.label}</div>;
const indexOptions = (list) => list.map((name, i) => ({ value: i, label: name }));
const searchFilter = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

/**
 * Filters of Board 1. Every control applies at once (the hook debounces); nothing to confirm.
 *
 * @param {Object} dataset - Dataset of the board (lists of scopes, centers, faculties…).
 * @param {Object} filters - Current (draft) filters.
 * @param {Function} onChange - Receives a patch of the filters.
 * @param {Function} onReset - Restores the defaults.
 */
function FiltersBar({ dataset, filters, onChange, onReset }) {
  /* Only the documents with curated axes (D-129); the names come from the bundle. */
  /* Chain Ámbito → Documento → Eje (F64, D-166): the scope limits the documents listed and the axes of those documents. */
  const policyOptions = useMemo(() => [...docsInScope(dataset, filters.scope)].sort(byPolicyOrder).map((name) => ({ value: name, label: name })), [dataset, filters.scope]);
  const scopeOptions = useMemo(
    () => ALL_SCOPES.map((s) => ({ value: s, label: dataset.scopes.includes(s) ? SCOPE_LABELS[s] : `${SCOPE_LABELS[s]} (sin agendas)`, disabled: !dataset.scopes.includes(s) })),
    [dataset],
  );
  const centerOptions = useMemo(() => indexOptions(dataset.centers), [dataset]);
  /* Coverage note of the centre filter, from the data of the board (no fixed figures, D-124). */
  const centerNote = useMemo(() => centerCoverageNote(dataset.centerCoverage), [dataset]);
  /* Ejes Temáticos grouped by policy document, in the order of the documents of the filter. */
  const axisGroups = useMemo(
    () =>
      dataset.policyDocs.map((agenda) => ({
        label: agenda,
        options: dataset.axes.filter((e) => e.agenda === agenda).map((e) => ({ value: e.id, label: e.eje })),
      })),
    [dataset],
  );
  /* With a document chosen the filter lists only the axes of that document (F61, D-163). */
  const axisOptions = (filters.policyDoc ? axisGroups.filter((g) => g.label === filters.policyDoc) : axisGroups)
    .map((g) => (filters.scope ? { ...g, options: g.options.filter((o) => dataset.axes.find((e) => e.id === o.value)?.nivel === filters.scope) } : g))
    .filter((g) => g.options.length);
  /* A change of scope clears the document and the axes that no longer belong to it. */
  const changeScope = (v) => onChange(scopeChangePatch(dataset, filters, v || ""));
  /* A document that does not contain some chosen axes removes them from the selection (as in Board 2). */
  const changeDocument = (v) => {
    const doc = v || "";
    const outside = doc ? axesOutsideDocument(dataset, { policyDoc: doc, axisIds: filters.axisIds }) : [];
    onChange({ policyDoc: doc, ...(outside.length ? { axisIds: filters.axisIds.filter((id) => !outside.includes(id)) } : {}) });
  };
  /* Field, subfield or topic (F69, T1-02): three groups in one searchable list; the key says which one it is. */
  const topicOptions = useMemo(() => {
    const fields = [...new Set(dataset.topics.map((t) => t.f))].sort((a, b) => a.localeCompare(b, "es"));
    const subfields = [...new Set(dataset.topics.map((t) => `${t.f}|${t.sf}`))].sort((a, b) => a.localeCompare(b, "es"));
    const topics = dataset.topics.map((t) => ({ value: `t:${t.id}`, label: t.t })).sort((a, b) => a.label.localeCompare(b.label, "es"));
    return [
      { label: "Campos", options: fields.map((f) => ({ value: `f:${f}`, label: f })) },
      { label: "Subcampos", options: subfields.map((s) => ({ value: `s:${s}`, label: `${s.split("|")[1]} (${s.split("|")[0]})` })) },
      { label: "Tópicos", options: topics },
    ];
  }, [dataset]);
  /* ODS (F71, C1-07): the 17 goals of the bundle, chosen by number. */
  const odsOptions = useMemo(() => (dataset.hasFactDetails && dataset.ods ? dataset.ods.map(([number, name]) => ({ value: number, label: `${number} · ${name}` })) : []), [dataset]);
  const odsLabel = (n) => odsOptions.find((o) => o.value === n)?.label ?? String(n);
  const topicLabel = (key) => topicOptions.flatMap((g) => g.options).find((o) => o.value === key)?.label ?? key;
  const facultyOptions = useMemo(() => indexOptions(dataset.faculties), [dataset]);
  const departmentOptions = useMemo(() => indexOptions(dataset.departments), [dataset]);

  const select = (key, options, placeholder, mapIndex = false, custom = null, wrap = false) => (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      options={options}
      optionRender={wrap ? wrapOption : undefined}
      filterOption={searchFilter}
      value={mapIndex ? (filters[key] >= 0 ? filters[key] : undefined) : filters[key] || undefined}
      onChange={custom || ((v) => onChange({ [key]: v === undefined || v === null ? (mapIndex ? -1 : "") : v }))}
    />
  );

  /* Active filters for the folded bar (F50). */
  const active = [
    filters.scope && `Ámbito: ${filters.scope}`,
    filters.policyDoc && `Documento: ${filters.policyDoc}`,
    filters.centerIndex >= 0 && `Centro: ${dataset.centers[filters.centerIndex]}`,
    (filters.yearFrom !== YEAR_RANGE.min || filters.yearTo !== YEAR_RANGE.max) && `Años: ${filters.yearFrom}–${filters.yearTo}`,
    filters.facultyIndex >= 0 && `Unidad: ${dataset.faculties[filters.facultyIndex]}`,
    filters.departmentIndex >= 0 && `Subunidad: ${dataset.departments[filters.departmentIndex]}`,
    filters.axisIds && filters.axisIds.length && `Ejes: ${filters.axisIds.length}`,
    filters.topicKey && `Tema: ${topicLabel(filters.topicKey)}`,
    filters.odsNumber > 0 && `ODS: ${odsLabel(filters.odsNumber)}`,
  ].filter(Boolean);

  return (
    <StickyFilters active={active} onReset={onReset} resetLabel="Restablecer filtros">
      <Row gutter={[12, 6]}>
        <Field label="1 · Ámbito">{select("scope", scopeOptions, "Todos", false, changeScope)}</Field>
        <Field label="2 · Documento de política">{select("policyDoc", policyOptions, "Todos", false, changeDocument, true)}</Field>
        <Field label="3 · Centro de investigación" help={<><div>{CENTER_TOOLTIP}</div>{centerNote ? <div style={{ marginTop: 6 }}>{centerNote}</div> : null}</>}>
          <Tooltip title={CENTER_TOOLTIP}>
            <div>{select("centerIndex", centerOptions, "Todos", true)}</div>
          </Tooltip>
        </Field>
        <Field label="4 · Temporalidad">
          <div style={{ display: "flex", gap: 8 }}>
            <Select style={{ width: "50%" }} aria-label="Año inicial" options={YEAR_OPTIONS} value={filters.yearFrom} onChange={(v) => onChange({ yearFrom: v })} />
            <Select style={{ width: "50%" }} aria-label="Año final" options={YEAR_OPTIONS} value={filters.yearTo} onChange={(v) => onChange({ yearTo: v })} />
          </div>
        </Field>
        <Field label="5 · Dimensión (campos, subcampos o tópicos)">
          <Segmented size="small" block options={DIMENSION_OPTIONS} value={filters.dimension} onChange={(v) => onChange({ dimension: v })} />
        </Field>
        <Field label="6 · Unidad académica">{select("facultyIndex", facultyOptions, "Todas", true)}</Field>
        <Field label="7 · Subunidad académica">{select("departmentIndex", departmentOptions, "Todas", true)}</Field>
        <Field label="Campo, subcampo o tópico" span={12}>
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Todos"
            options={topicOptions}
            optionRender={wrapOption}
            filterOption={(input, option) => `${option?.label ?? ""} ${option?.field ?? ""}`.toLowerCase().includes(input.toLowerCase())}
            value={filters.topicKey || undefined}
            onChange={(v) => onChange({ topicKey: v || "" })}
            aria-label="Campo, subcampo o tópico"
            data-testid="topic-filter"
          />
        </Field>
        {odsOptions.length ? (
          <Field label={ODS_FILTER_LABEL} span={12} help={ODS_FILTER_HELP}>
            <Select
              showSearch
              allowClear
              style={{ width: "100%" }}
              placeholder="Todos"
              options={odsOptions}
              optionRender={wrapOption}
              filterOption={searchFilter}
              value={filters.odsNumber > 0 ? filters.odsNumber : undefined}
              onChange={(v) => onChange({ odsNumber: v || 0 })}
              aria-label="ODS"
              data-testid="ods-filter"
            />
          </Field>
        ) : null}
        {dataset.hasFactDetails ? (
          <Field label={AXIS_FILTER_LABEL} span={12}>
            <Tooltip title={AXIS_FILTER_TOOLTIP}>
              <div>
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Todos"
                  maxTagCount="responsive"
                  options={axisOptions}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  value={filters.axisIds}
                  onChange={(v) => onChange({ axisIds: v })}
                  aria-label="Eje Temático"
                />
              </div>
            </Tooltip>
          </Field>
        ) : null}
        <Field label="Referente">
          <Tooltip title="Institución con la que se compara la capacidad de cada tópico: la más citada de Colombia o la más citada del mundo. Los tópicos sin referencia nacional usan la mundial.">
            <div>
              <Segmented size="small" block options={RATIO_BASIS_OPTIONS} value={filters.ratioBasis} onChange={(v) => onChange({ ratioBasis: v })} />
            </div>
          </Tooltip>
        </Field>
        {dataset.hasFactDetails ? (
          <Field label="Confianza de la asignación a ejes">
            <Tooltip title={PAIR_LEVEL_TOOLTIP}>
              <div>
                <Segmented size="small" block options={PAIR_LEVEL_OPTIONS} value={filters.pairLevel || PAIR_LEVEL.CORE} onChange={(v) => onChange({ pairLevel: v })} />
              </div>
            </Tooltip>
          </Field>
        ) : null}
      </Row>
    </StickyFilters>
  );
}

export default memo(FiltersBar);
