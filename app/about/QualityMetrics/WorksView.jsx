"use client";

/* Components */
import { CompareGrid, ProvenanceGrid } from "./grids";

/* UI Library Components */
import { Collapse } from "antd";

/* Utils */
import {
  scalarRows,
  objectRows,
  dualProvRows,
  impactuTypeRows,
  WORKS_SCALARS,
} from "./rowBuilders";

/**
 * Renders the works section of the quality metrics dashboard.
 *
 * The component builds a set of collapsible panels that compare key work-related
 * metrics, including field completeness, provenance, ImpactU type coverage,
 * and source-based normalization gaps.
 *
 * @param {Array<Object>} history - Historical quality metric entries
 * used to populate the comparison views.
 * @returns {JSX.Element} A collapsible set of panels showing work-related
 * quality metrics comparisons.
 */
export function WorksView({ history }) {
  const typesSummaryRows = [
    {
      key: "with_impactu_total",
      label: "Con tipo ImpactU",
      values: history.map((run, i) => {
        const col = run.works_collection;
        return {
          value: col?.types_breakdown?.with_impactu_total ?? null,
          total: col?.total,
          prevValue:
            i === 0 && history.length > 1
              ? (history[1].works_collection?.types_breakdown
                  ?.with_impactu_total ?? null)
              : null,
        };
      }),
    },
    {
      key: "without_impactu_total",
      label: "Sin tipo ImpactU",
      lowerIsBetter: true,
      values: history.map((run, i) => {
        const col = run.works_collection;
        return {
          value: col?.types_breakdown?.without_impactu_total ?? null,
          total: col?.total,
          prevValue:
            i === 0 && history.length > 1
              ? (history[1].works_collection?.types_breakdown
                  ?.without_impactu_total ?? null)
              : null,
        };
      }),
    },
    {
      key: "no_types",
      label: "Sin ningún tipo (vacíos)",
      lowerIsBetter: true,
      values: history.map((run, i) => {
        const col = run.works_collection;
        return {
          value: col?.types_breakdown?.without_impactu?.no_types ?? null,
          total: col?.total,
          prevValue:
            i === 0 && history.length > 1
              ? (history[1].works_collection?.types_breakdown?.without_impactu
                  ?.no_types ?? null)
              : null,
        };
      }),
    },
    {
      key: "normalization_skipped",
      label: "Normalización omitida (kahi)",
      lowerIsBetter: true,
      values: history.map((run, i) => {
        const col = run.works_collection;
        return {
          value:
            col?.types_breakdown?.without_impactu?.normalization_skipped ??
            null,
          total: col?.total,
          prevValue:
            i === 0 && history.length > 1
              ? (history[1].works_collection?.types_breakdown?.without_impactu
                  ?.normalization_skipped ?? null)
              : null,
        };
      }),
    },
  ];

  const items = [
    {
      key: "scalars",
      label: "Completitud de campos clave",
      children: (
        <CompareGrid
          rows={scalarRows(WORKS_SCALARS, history, "works_collection")}
          history={history}
        />
      ),
    },
    {
      key: "provenance",
      label: "Procedencia y cruce de fuentes",
      children: (
        <ProvenanceGrid
          rows={dualProvRows(history, "works_collection")}
          history={history}
        />
      ),
    },
    {
      key: "types_detail",
      label: "Distribución por tipo de producto",
      children: (
        <CompareGrid rows={impactuTypeRows(history)} history={history} />
      ),
    },
    {
      key: "types_summary",
      label: "Cobertura de normalización ImpactU",
      children: <CompareGrid rows={typesSummaryRows} history={history} />,
    },
    {
      key: "types_by_source",
      label: "Tipos sin mapear a ImpactU por fuente de origen",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "works_collection",
            "types_breakdown.without_impactu.by_source",
            (col) => col?.types_breakdown?.without_impactu_total,
          )}
          history={history}
        />
      ),
    },
  ];

  return <Collapse items={items} defaultActiveKey={["scalars"]} size="small" />;
}
