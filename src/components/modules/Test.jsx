import React, { useState, useEffect } from 'react';

/* UI Components */
import { AutoComplete, Row, Col, InputNumber, Radio } from 'antd';

/* Utilities */
import { APIRequest } from '../../apis/colav';
import { ElasticAPIRequest } from '../../apis/elastic';

const Test = () => {
  const [state, setUrl] = APIRequest(
    `/app/search?data=affiliations&type=institution&max=5&page=1`
  );
  const [max, setMax] = useState('5');
  const [input, setInput] = useState('');
  const [elasticState, setElasticInput] = ElasticAPIRequest(input, max);
  const [api, setApi] = useState('mongo');
  const [options, setOptions] = useState([]);

  const onSelect = (event) => {
    console.log(event);
  };

  const onInputChange = (n) => {
    setMax(n);
  };

  const onRadioChange = (e) => {
    setApi(e.target.value);
  };

  const onSearch = (input) => {
    setInput(input);
  };

  useEffect(() => {
    if (input === '') {
      setUrl(`/app/search?data=affiliations&type=institution&max=5&page=1`);
    } else if (api === 'mongo' && input.slice(-1) !== ' ') {
      setUrl(
        `/app/search?data=affiliations&type=institution&max=${max}&page=1&keywords=${input}`
      );
    } else if (api === 'elastic' && input.slice(-1) !== ' ') {
      setElasticInput(input, max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, max]);

  useEffect(() => {
    if (api === 'mongo') {
      setOptions(
        state.data?.data?.map((item, i) => {
          return { value: item.name, id: item._id, key: i };
        })
      );
    } else {
      console.log(elasticState.data);
      setOptions(
        elasticState.data?.suggest['affiliation-suggest'][0]?.options?.map(
          (item, i) => {
            return {
              value: item._source.name,
              id: item._source.id,
              key: i,
            };
          }
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, elasticState]);

  return (
    <>
      <Row justify={'center'} align={'middle'}>
        <p>BD a consultar:</p>
        <Radio.Group
          onChange={onRadioChange}
          value={api}
          style={{ marginLeft: '20px' }}
        >
          <Radio value={'mongo'}>Mongo</Radio>
          <Radio value={'elastic'}>Elastic</Radio>
        </Radio.Group>
      </Row>
      <Row justify={'center'} align={'middle'}>
        <p>Cantidad máxima de resultados: (1-50)</p>
        <Col style={{ width: '40px', marginLeft: '20px' }}>
          <InputNumber
            min={1}
            max={50}
            defaultValue={5}
            onChange={onInputChange}
            style={{ textAlign: 'center' }}
          />
        </Col>
      </Row>
      <Row justify={'center'} align={'middle'}>
        <Col span={8}>
          <AutoComplete
            options={options}
            onSearch={(input) => onSearch(input)}
            onSelect={(event) => onSelect(event)}
            style={{
              width: '100%',
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Test;

/* "Universidad 00",
    "Universidad 01",
    "Universidad 02",
    "Universidad 03",
    "Universidad 04",
    */
