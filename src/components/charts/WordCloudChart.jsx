import React from 'react';

/* Libraries */
import { WordCloud } from '@ant-design/charts';

/* UI Library Components */
import { Card, Badge } from 'antd';

/* Componentes */
import InfoButton from '../infoButton';

/* Utilities */
import { useHistory } from 'react-router-dom';

const WordCloudChart = ({ title, data, core }) => {
  const history = useHistory();
  let config = {
    data: data,
    wordField: 'name',
    weightField: 'products',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [20, 100],
      rotation: 0,
    },
    tooltip: {
      customContent: (title, datum) => {
        return (
          <>
            <h3 style={{ margin: '10px 0' }}>
              <Badge color={datum[0]?.color} />
              {datum[0]?.name}
            </h3>
            <h4>Productos: &emsp; {datum[0]?.data?.datum?.products}</h4>
            <h4>Citaciones: &emsp; {datum[0]?.data?.datum?.citations}</h4>
          </>
        );
      },
    },
    random: function random() {
      return 0.5;
    },
  };

  return (
    <Card
      size="small"
      title={title}
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: '420px' }}
      hoverable
      extra={<InfoButton title="Temas" type={'subjects'} />}
    >
      <div className="chart">
        <WordCloud
          {...config}
          onReady={(plot) => {
            plot.on('plot:click', (evt) => {
              if (evt.data) {
                history.push(`/app/subjects?id=${evt.data.data.datum.id}`);
                core.setURL(`/app/subjects?id=${evt.data.data.datum.id}`);
              }
            });
          }}
        />
      </div>
    </Card>
  );
};

export default WordCloudChart;
