"use client";

/* Hooks */
import { memo, useMemo } from "react";

/* lib */
import { PAIR_LEVEL, YEAR_RANGE } from "@/lib/observatories/capacity";

/* Texts */
import {
  ALL_SCOPES,
  DIMENSION_OPTIONS,
  POLICY_DOCUMENTS,
  PAIR_LEVEL_OPTIONS,
  PAIR_LEVEL_TOOLTIP,
  RATIO_BASIS_OPTIONS,
} from "./boardTexts";

/* UI Library Components */
import { Button, Col, Row, Segmented, Select, Tooltip, Typography } from "antd";

/* Constants */
const YEAR_OPTIONS = Array.from(
  { length: YEAR_RANGE.max - YEAR_RANGE.min + 1 },
  (_, i) => ({ value: YEAR_RANGE.min + i, label: String(YEAR_RANGE.min + i) }),
);

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 };

function Field({ label, children, span = 6 }) {
  return (
    <Col xs={24} sm={12} md={span}>
      <label style={labelStyle}>{label}</label>
      {children}
    </Col>
  );
}

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
  const policyOptions = useMemo(
    () =>
      POLICY_DOCUMENTS.map((name) => {
        const available = dataset.policyDocs.includes(name);
        return { value: name, label: available ? name : `${name} (sin thesaurus en v5)`, disabled: !available };
      }),
    [dataset],
  );
  const scopeOptions = useMemo(
    () => ALL_SCOPES.map((s) => ({ value: s, label: dataset.scopes.includes(s) ? s : `${s} (sin agendas en v5)`, disabled: !dataset.scopes.includes(s) })),
    [dataset],
  );
  const centerOptions = useMemo(() => indexOptions(dataset.centers), [dataset]);
  const facultyOptions = useMemo(() => indexOptions(dataset.faculties), [dataset]);
  const departmentOptions = useMemo(() => indexOptions(dataset.departments), [dataset]);

  const select = (key, options, placeholder, mapIndex = false) => (
    <Select
      showSearch
      allowClear
      style={{ width: "100%" }}
      placeholder={placeholder}
      options={options}
      filterOption={searchFilter}
      value={mapIndex ? (filters[key] >= 0 ? filters[key] : undefined) : filters[key] || undefined}
      onChange={(v) => onChange({ [key]: v === undefined || v === null ? (mapIndex ? -1 : "") : v })}
    />
  );

  return (
    <section aria-label="Filtros" style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]}>
        <Field label="1 · Ámbito">{select("scope", scopeOptions, "Todos")}</Field>
        <Field label="2 · Documento de política">{select("policyDoc", policyOptions, "Todos")}</Field>
        <Field label="3 · Centro de investigación">{select("centerIndex", centerOptions, "Todos", true)}</Field>
        <Field label="4 · Temporalidad">
          <div style={{ display: "flex", gap: 8 }}>
            <Select style={{ width: "50%" }} aria-label="Año inicial" options={YEAR_OPTIONS} value={filters.yearFrom} onChange={(v) => onChange({ yearFrom: v })} />
            <Select style={{ width: "50%" }} aria-label="Año final" options={YEAR_OPTIONS} value={filters.yearTo} onChange={(v) => onChange({ yearTo: v })} />
          </div>
        </Field>
        <Field label="5 · Dimensión">
          <Segmented block options={DIMENSION_OPTIONS} value={filters.dimension} onChange={(v) => onChange({ dimension: v })} />
        </Field>
        <Field label="6 · Facultad">{select("facultyIndex", facultyOptions, "Todas", true)}</Field>
        <Field label="7 · Departamento">{select("departmentIndex", departmentOptions, "Todos", true)}</Field>
        <Field label="Referente">
          <Tooltip title="Institución con la que se compara la capacidad de cada tópico: la más citada de Colombia o la más citada del mundo. Los tópicos sin referencia nacional usan la mundial.">
            <div>
              <Segmented block options={RATIO_BASIS_OPTIONS} value={filters.ratioBasis} onChange={(v) => onChange({ ratioBasis: v })} />
            </div>
          </Tooltip>
        </Field>
        {dataset.hasFactDetails ? (
          <Field label="Confianza de la asignación a ejes (IA)">
            <Tooltip title={PAIR_LEVEL_TOOLTIP}>
              <div>
                <Segmented block options={PAIR_LEVEL_OPTIONS} value={filters.pairLevel || PAIR_LEVEL.CORE} onChange={(v) => onChange({ pairLevel: v })} />
              </div>
            </Tooltip>
          </Field>
        ) : null}
        <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "flex-end" }}>
          <Button onClick={onReset}>Restablecer filtros</Button>
        </Col>
      </Row>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Los filtros se aplican al instante y quedan en la dirección de la página.
      </Typography.Text>
    </section>
  );
}

export default memo(FiltersBar);
