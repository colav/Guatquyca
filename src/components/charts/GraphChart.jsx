import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/* UI Library Components */
import { Card } from 'antd';

/* Componentes */
import InfoButton from '../infoButton';

/* Libraries */
import G6 from '@antv/g6';

const GraphChart = ({ data, title, height = 622 }) => {
  const ref = useRef(null);

  useEffect(() => {
    let graph = null;
    if (!graph) {
      graph = new G6.Graph({
        container: ReactDOM.findDOMNode(ref.current),
        width: 2000,
        height: 600,
        modes: {
          default: [
            {
              type: 'zoom-canvas',
              enableOptimize: true,
              optimizeZoom: 0.9,
            },
            {
              type: 'drag-canvas',
              enableOptimize: true,
            },
            {
              type: 'tooltip',
              formatText(model) {
                return `Grado: ${model.degree}`;
              },
            },
            {
              type: 'edge-tooltip',
              formatText(model) {
                return `${model.coauthorships} ${
                  model.coauthorships > 1 ? 'coautorías' : 'coautoría'
                }`;
              },
            },
            'drag-node',
            /* "activate-relations", */
          ],
        },
        layout: {
          type: 'gForce' /* data.nodes.length > 50 ? "forceAtlas2" : "gForce" */,
          preventOverlap: true,
        },
        defaultNode: {
          style: { stroke: '#00A283', fill: '#00E4A9', fillOpacity: 0.6 },
          labelCfg: {
            style: { fontSize: 8 },
            position: 'bottom',
            offset: 1,
          },
        },
        defaultEdge: {
          style: {
            stroke: '#e8e7e3',
          },
        },
      });
    }
    graph.data(data);
    graph.render();
  }, [data]);

  return (
    <Card
      size="small"
      title={title}
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: height }}
      extra={<InfoButton title={title} type={'graph'} />}
    >
      <div className="chart">
        <div ref={ref}></div>
      </div>
    </Card>
  );
};

export default GraphChart;
