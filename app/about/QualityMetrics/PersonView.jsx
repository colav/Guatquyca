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
  PERSON_SCALARS,
} from "./rowBuilders";

/**
 * Renders the person view with a collapsible interface.
 *
 * The component displays a collapse with three sections: scalars, provenance, and external IDs.
 *
 * @param {Array} history - The execution history.
 * @returns {JSX.Element} The person view UI.
 */
export function PersonView({ history }) {
  const items = [
    {
      key: "scalars",
      label: "Completitud de campos clave",
      children: (
        <CompareGrid
          rows={scalarRows(PERSON_SCALARS, history, "person_collection")}
          history={history}
        />
      ),
    },
    {
      key: "provenance",
      label: "Procedencia y cruce de fuentes",
      children: (
        <ProvenanceGrid
          rows={dualProvRows(history, "person_collection")}
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
            "person_collection",
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
