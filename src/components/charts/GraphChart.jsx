import React from "react";
import Graphin, { Behaviors, GraphinContext } from "@antv/graphin";

/* Library Sub-components */
const { ZoomCanvas, ActivateRelations, Hoverable } = Behaviors;

const Graph = ({ data }) => {
  const defaultNode = {
    type: "graphin-circle",
    style: {
      keyshape: {
        stroke: "#3996C8",
        fill: "#52C5E6",
        fillOpacity: 0.7,
      },
      label: {
        fontSize: 8,
      },
    },
  };

  const defaultEdge = {
    type: "graphin-line",
    style: {
      keyshape: {
        type: "poly",
        poly: { distance: 30 },
        endArrow: null,
        stroke: "#e8e7e3",
      },
    },
  };

  return (
    <Graphin data={data} defaultNode={defaultNode} defaultEdge={defaultEdge}>
      <Hoverable bindType="node" />
      <ZoomCanvas enableOptimize />
      <ActivateRelations />
    </Graphin>
  );
};

export default Graph;
