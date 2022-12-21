import React, { useState, useEffect } from 'react';

/* UI Library Components */
import { Card, Select } from 'antd';

/* Libraries */
import { Column } from '@ant-design/charts';

const StackedColumnChart = ({ title, total = 400, height = 420 }) => {
  const [data, setData] = useState([
    {
      year: '1991',
      value: 10000000,
      type: 'Público',
    },
    {
      year: '1992',
      value: 6000000,
      type: 'Público',
    },
    {
      year: '1993',
      value: 30000000,
      type: 'Público',
    },
    {
      year: '1994',
      value: 50000000,
      type: 'Público',
    },
    {
      year: '1995',
      value: 40000000,
      type: 'Público',
    },
    {
      year: '1996',
      value: 80000000,
      type: 'Público',
    },
    {
      year: '1997',
      value: 50000000,
      type: 'Público',
    },
    {
      year: '1998',
      value: 20000000,
      type: 'Público',
    },
    {
      year: '1999',
      value: 100000000,
      type: 'Público',
    },
    {
      year: '1991',
      value: 30000000,
      type: 'Privado',
    },
    {
      year: '1992',
      value: 40000000,
      type: 'Privado',
    },
    {
      year: '1993',
      value: 50000000,
      type: 'Privado',
    },
    {
      year: '1994',
      value: 50000000,
      type: 'Privado',
    },
    {
      year: '1995',
      value: 90000000,
      type: 'Privado',
    },
    {
      year: '1996',
      value: 60000000,
      type: 'Privado',
    },
    {
      year: '1997',
      value: 70000000,
      type: 'Privado',
    },
    {
      year: '1998',
      value: 90000000,
      type: 'Privado',
    },
    {
      year: '1999',
      value: 130000000,
      type: 'Privado',
    },
  ]);

  let config_a = {
    data: data,
    isStack: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    appendPadding: [10, 10, 10, 10],
    legend: { layout: 'vertical', position: 'right' },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
    yAxis: {
      label: {
        formatter: (v) =>
          `$ ${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s}.`),
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: `$ ${datum.value}`.replace(
            /\d{1,3}(?=(\d{3})+$)/g,
            (s) => `${s}.`
          ),
        };
      },
    },
  };

  let config_b = {
    data: data,
    xField: 'year',
    yField: 'value',
    appendPadding: [10, 10, 10, 10],
    legend: { layout: 'vertical', position: 'right' },
    columnWidthRatio: 0.6,
    columnBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    xAxis: {
      label: {
        autoRotate: false,
        style: { fontSize: 11 },
      },
    },
  };

  /* const [config, setConfig] = useState(config_a); */

  const handleChange = (e) => {
    e === 'a'
      ? setData([
          {
            year: '1991',
            value: 10000000,
            type: 'Público',
          },
          {
            year: '1992',
            value: 6000000,
            type: 'Público',
          },
          {
            year: '1993',
            value: 30000000,
            type: 'Público',
          },
          {
            year: '1994',
            value: 50000000,
            type: 'Público',
          },
          {
            year: '1995',
            value: 40000000,
            type: 'Público',
          },
          {
            year: '1996',
            value: 80000000,
            type: 'Público',
          },
          {
            year: '1997',
            value: 50000000,
            type: 'Público',
          },
          {
            year: '1998',
            value: 20000000,
            type: 'Público',
          },
          {
            year: '1999',
            value: 100000000,
            type: 'Público',
          },
          {
            year: '1991',
            value: 30000000,
            type: 'Privado',
          },
          {
            year: '1992',
            value: 40000000,
            type: 'Privado',
          },
          {
            year: '1993',
            value: 50000000,
            type: 'Privado',
          },
          {
            year: '1994',
            value: 50000000,
            type: 'Privado',
          },
          {
            year: '1995',
            value: 90000000,
            type: 'Privado',
          },
          {
            year: '1996',
            value: 60000000,
            type: 'Privado',
          },
          {
            year: '1997',
            value: 70000000,
            type: 'Privado',
          },
          {
            year: '1998',
            value: 90000000,
            type: 'Privado',
          },
          {
            year: '1999',
            value: 130000000,
            type: 'Privado',
          },
        ])
      : setData([
          {
            year: '1991',
            value: 3,
          },
          {
            year: '1992',
            value: 4,
          },
          {
            year: '1993',
            value: 3.5,
          },
          {
            year: '1994',
            value: 5,
          },
          {
            year: '1995',
            value: 4.9,
          },
          {
            year: '1996',
            value: 6,
          },
          {
            year: '1997',
            value: 7,
          },
          {
            year: '1998',
            value: 9,
          },
          {
            year: '1999',
            value: 13,
          },
        ]);
  };

  return (
    <Card
      size="small"
      title={'Barras'}
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: height }}
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
              label: 'Cantidad financiada de sector público y privado por año',
            },
            {
              value: 'b',
              label: 'Cantidad de proyectos por año',
            },
            {
              value: 'tesis',
              label: 'Consultas a tesis',
            },
            {
              value: 'tesis2',
              label: 'Visualizaciones a tesis',
            },
          ]}
        />
      }
    >
      <div className="chart">
        <Column {...config_a} />
      </div>
    </Card>
  );
};
export default StackedColumnChart;
