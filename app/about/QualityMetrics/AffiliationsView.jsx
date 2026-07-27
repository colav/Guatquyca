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
  AFFILIATIONS_SCALARS,
} from "./rowBuilders";

/**
 * Component for displaying affiliations data.
 * @param {{ history: any }} param0 - The parameters object.
 * @returns
 * The rendered component.
 */
export function AffiliationsView({ history }) {
  const items = [
    {
      key: "scalars",
      label: "Completitud de campos clave",
      children: (
        <CompareGrid
          rows={scalarRows(
            AFFILIATIONS_SCALARS,
            history,
            "affiliations_collection",
          )}
          history={history}
        />
      ),
    },
    {
      key: "provenance",
      label: "Procedencia y cruce de fuentes",
      children: (
        <ProvenanceGrid
          rows={dualProvRows(history, "affiliations_collection")}
          history={history}
        />
      ),
    },
    {
      key: "types",
      label: "Distribución por tipo de entidad",
      children: (
        <CompareGrid
          rows={objectRows(
            history,
            "affiliations_collection",
            "types_breakdown",
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
            "affiliations_collection",
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
