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
  SOURCES_SCALARS,
} from "./rowBuilders";

/**
 * Renders the sources section of the quality metrics dashboard.
 *
 * The component builds a set of collapsible panels that display comparison
 * views for source completeness, provenance, open-access distribution,
 * Scimago quartiles, source types, license types, and external identifiers.
 *
 * @param {Array<Object>} history - Historical quality metric entries
 * used to build the comparison views.
 * @returns {JSX.Element} A collapsible set of panels showing source-related
 * quality metrics comparisons.
 */
export function SourcesView({ history }) {
  const items = [
    {
      key: "scalars",
      label: "Completitud de campos clave",
      children: (
        <CompareGrid
          rows={scalarRows(SOURCES_SCALARS, history, "sources_collection")}
          history={history}
        />
      ),
    },
    {
      key: "provenance",
      label: "Procedencia y cruce de fuentes",
      children: (
        <ProvenanceGrid
          rows={dualProvRows(history, "sources_collection")}
          history={history}
        />
      ),
    },
    {
      key: "oa",
      label: "Distribución por acceso abierto",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "sources_collection",
            "open_access_breakdown",
            (col) => col?.total,
          )}
          history={history}
        />
      ),
    },
    {
      key: "scimago",
      label: "Distribución por cuartil Scimago",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "sources_collection",
            "scimago_quartiles_breakdown",
            (col) => col?.total,
          )}
          history={history}
        />
      ),
    },
    {
      key: "source_types",
      label: "Distribución por tipo de fuente",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "sources_collection",
            "source_types_breakdown",
            (col) => col?.total,
          )}
          history={history}
        />
      ),
    },
    {
      key: "licenses",
      label: "Distribución por tipo de licencia",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "sources_collection",
            "license_type_breakdown",
            (col) => col?.total,
          )}
          history={history}
        />
      ),
    },
    {
      key: "ext_ids",
      label: "Identificadores y perfiles externos",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "sources_collection",
            "external_ids_breakdown",
            (col) => col?.total,
          )}
          history={history}
        />
      ),
    },
  ];

  return <Collapse items={items} defaultActiveKey={["scalars"]} size="small" />;
}
