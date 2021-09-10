import React from "react";

/* Libraries */
import Graphin, { Behaviors, GraphinContext } from "@antv/graphin";
import { Tooltip } from "@antv/graphin-components";

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Card = require("antd/lib/card").default;
const notification = require("antd/lib/notification").default;

/* Library Sub-components */
const { ZoomCanvas, ActivateRelations, Hoverable } = Behaviors;

const GraphChart = ({ data, title, type, height = 500 }) => {
  // Node interaction - click.
  const ClickBehavior = () => {
    const { graph } = React.useContext(GraphinContext);

    React.useEffect(() => {
      const handleClick = (evt) => {
        const node = evt.item;
        const model = node.getModel();
        const btn = (
          <Button
            type="primary"
            href={`/app/${type}?apikey=colavudea&data=info&id=${model.id}`}
          >
            Ir al perfil
          </Button>
        );

        notification.open({
          style: { width: 550, border: "2px solid #DCDCD5" },
          message: model.style.label.value,
          description: (
            <>
              <p>{model.affiliation}</p>
              <p>Grado: {model.degree}</p>
            </>
          ),
          btn,
        });
      };
      graph.on("node:click", handleClick);
    }, [graph]);
    return null;
  };

  // Styles.
  const defaultNode = {
    type: "graphin-circle",
    style: {
      keyshape: {
        stroke: "#3996C8",
        fill: "#52C5E6",
        fillOpacity: 0.7,
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

  //
  const CustomTooltip = () => {
    const { tooltip } = React.useContext(GraphinContext);
    let context = tooltip.edge;
    const { item } = context;
    const model = item && item.getModel();
    return (
      <div>
        <Card style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
          <p>Coautorías: {model.coauthorships}</p>
        </Card>
      </div>
    );
  };

  let algo = "";
  data.nodes.length > 20 ? (algo = "forceAtlas2") : (algo = "force");

  return (
    <Card size="small" title={title} bodyStyle={{ padding: "10px" }} hoverable>
      <Graphin
        data={data}
        layout={{ type: algo }}
        defaultNode={defaultNode}
        defaultEdge={defaultEdge}
        height={height}
        fitView={true}
      >
        <ClickBehavior />
        <Hoverable bindType="node" />
        <ZoomCanvas enableOptimize />
        <ActivateRelations trigger="click" />
        <Tooltip bindType="edge">
          <CustomTooltip />
        </Tooltip>
      </Graphin>
    </Card>
  );
};

export default GraphChart;
