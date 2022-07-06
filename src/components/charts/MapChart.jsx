import React from 'react';

/* Libraries */
import { AreaMap } from '@ant-design/charts';

/* UI Library Compoments */
import { Card } from 'antd';

/* Componentes */
import InfoButton from '../infoButton';
import MapLegendMaker from '../../utils/MapLegendMaker';

const MapChart = ({ data, title = '', height = 600, type }) => {
  const max = Math.max(
    ...data.features.map((item) => item.properties.count)
  ).toString();

  const config = {
    map: {
      type: 'mapbox',
      style: 'blank',
    },
    source: {
      data: data,
      parser: {
        type: 'geojson',
      },
    },
    autoFit: true,
    color: {
      field: 'log_count',
      value: [
        '#f7fcf0',
        '#e0f3db',
        '#ccebc5',
        '#a8ddb5',
        '#7bccc4',
        '#4eb3d3',
        '#2b8cbe',
        '#0868ac',
        '#084081',
      ],
      scale: { type: 'quantize' },
    },
    style: {
      opacity: 1,
      stroke: '#ccc',
      lineWidth: 0.6,
      lineOpacity: 1,
    },
    state: {
      active: {
        stroke: 'white',
        lineWidth: 1.5,
        lineOpacity: 0.8,
      },
    },
    tooltip: {
      items: [
        { field: 'name', alias: 'País' },
        { field: 'count', alias: 'Cantidad' },
      ],
    },
    zoom: {
      position: 'bottomright',
    },
    legend: {
      position: 'bottomleft',
      customContent: (title, items) => {
        return MapLegendMaker(items, max);
      },
    },
  };

  return (
    <Card
      size="small"
      title={title}
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: height }}
      extra={<InfoButton title={title} type={type} />}
    >
      <div className="chart">
        <AreaMap {...config} />
      </div>
    </Card>
  );
};

export default MapChart;
