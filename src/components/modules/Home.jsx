import React, { useEffect } from 'react';

/* Components */
import HomeTable from '../HomeTable';
import SearchBar from '../SearchBar';
import { ReactComponent as Banner } from '../../media/banner.svg';

/* UI Library Components */
import { Card, Col, Row, Typography } from 'antd';

/* Icons */
import { LinkOutlined } from '@ant-design/icons';

/* Utils */
import { Link } from 'react-router-dom';
import { APIRequest } from '../../apis/clustercien';

/* UI Library Sub-components*/
const { Title } = Typography;

const Home = ({ core }) => {
  const [state] = APIRequest('/app/ourdata?apikey=colavudea');
  console.log(state);
  useEffect(() => {
    document.title = 'ImpactU';
    core.setHome(true);
    return () => {
      core.setHome(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Banner id="home__banner" />
      <Row justify="space-around" align="middle">
        <Col flex sm={24} xl={10} xxl={8}>
          <div id="home__head--title">
            <Title>Bienvenido a ImpactU</Title>
            <Title level={2}>
              Métricas sobre la producción universitaria y su relación con el
              entorno en Colombia.
            </Title>
          </div>
        </Col>
        <Col
          sm={24}
          xl={12}
          xxl={10}
          style={{ margin: '20px 5px 0 5px', textAlign: 'center' }}
        >
          <Card size="small" style={{ borderRadius: '10px' }} hoverable>
            <Title level={4}>
              La información puede ser consultada por autores, instituciones,
              facultades, departamentos, grupos de investigación o productos.
            </Title>
            <div className="searchbar--container">
              <SearchBar core={core} />
            </div>
            <div id="home__table--container">
              <HomeTable />
            </div>
            <p
              style={{ textAlign: 'left', padding: '0 16px', marginBottom: 0 }}
            >
              * Los indicadores aquí presentados buscan cumplir con los
              principios de métricas responsables, para mayor información por
              favor sigue este{' '}
              <Link
                to="/app/metrics"
                /*  onClick={() => core.setURL('/app/metrics')} */
              >
                enlace <LinkOutlined />
              </Link>
              .
            </p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
