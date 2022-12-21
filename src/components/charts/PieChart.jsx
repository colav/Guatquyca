import React, { useState } from 'react';

/* Libraries */
import { Pie } from '@ant-design/charts';

/* UI Library Components */
import { Card, Empty, Select } from 'antd';

const PieChart = ({ title, type = 'open_access' }) => {
  const [data, setData] = useState([
    { type: 'gold', value: Math.floor(Math.random() * 40 + 10) },
    { type: 'hybrid', value: Math.floor(Math.random() * 40 + 10) },
    { type: 'green', value: Math.floor(Math.random() * 40 + 10) },
    { type: 'closed', value: Math.floor(Math.random() * 40 + 10) },
    { type: 'bronze', value: Math.floor(Math.random() * 40 + 10) },
  ]);
  const bgColor = {
    hybrid: '#6448ff',
    green: '#25ff76',
    gold: '#ffc03c',
    closed: '#b4b4b4',
    bronze: '#f3663f',
  };

  const labels = {
    hybrid: 'Híbrido',
    green: 'Verde',
    gold: 'Dorado',
    closed: 'Cerrado',
    bronze: 'Bronce',
  };

  let config_a = {
    appendPadding: 20,
    data: data,
    angleField: 'value',
    colorField: 'type',
    pieStyle: { lineWidth: 3 },
    radius: 1,
    innerRadius: 0.4,
    label: {
      type: 'spider',
      content: '{value} / {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  let config_b = {
    appendPadding: 20,
    data: data,
    angleField: 'value',
    colorField: 'type',
    color: ({ type }) => {
      return bgColor[type];
    },
    pieStyle: { lineWidth: 3 },
    radius: 1,
    innerRadius: 0.4,
    tooltip: {
      formatter: (datum) => {
        return {
          name: labels[datum.type],
          value: datum.value + (datum.value === 1 ? ' Producto' : ' Productos'),
        };
      },
    },
    label: {
      type: 'spider',
      content: '{value} Productos, {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      itemName: {
        formatter: (item) => labels[item],
      },
    },
  };

  const handleChange = () => {
    setData([
      { type: 'Masculino', value: Math.floor(Math.random() * 40 + 10) },
      { type: 'Femenino', value: Math.floor(Math.random() * 40 + 10) },
    ]);
  };

  return (
    <Card
      size="small"
      title="Categórica por numérica"
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: '420px' }}
      hoverable
      extra={
        <Select
          size="small"
          defaultValue="a"
          style={{
            width: 420,
          }}
          onChange={handleChange}
          options={[
            {
              value: 'a',
              label: 'Tipo de Acceso',
            },
            {
              value: 'b',
              label: 'Cantidad de productos por facultad',
            },
            {
              value: 'c',
              label: 'Cantidad de productos por sexo',
            },
            {
              value: 'd',
              label: 'Cantidad de productos por grupo',
            },
          ]}
        />
      }
    >
      <div className="chart">
        {data.length > 0 ? (
          <Pie {...config_a} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Datos insuficientes"
          />
        )}
      </div>
    </Card>
  );
};

export default PieChart;
