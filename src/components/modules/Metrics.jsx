import React from 'react';

/* UI Library Components */
import { Col, Divider, Row } from 'antd';

/* Components */
import MetricsTable from '../MetricsTable';

const Metrics = ({ core }) => {
  setTimeout(() => {
    core.setHome(false);
  }, 10);

  return (
    <Row justify="center" style={{ marginTop: '30px' }}>
      <Col xs={20} lg={14}>
        <Divider id="home__divider--title">Métricas Responsables</Divider>
      </Col>
      <Col span={18}>
        <MetricsTable />
      </Col>
      <Col span={18} style={{ marginTop: '20px' }}>
        <h3>Referencias Bibliográficas</h3>
        <ul>
          <li>
            Cuartas, G. V., Uribe-Tirado, A., Restrepo-Quintero, D.,
            Ochoa-Gutierrez, J., Pallares, C., Gómez-Molina, H. F.,
            Suárez-Tamayo, M., & Calle, J. (2019). Hacia un modelo de medición
            de la ciencia desde el Sur Global: Métricas responsables. Palabra
            Clave (La Plata), 8(2), e068-e068.{' '}
            <a
              href="https://doi.org/10.24215/18539912e068"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.24215/18539912e068
            </a>
          </li>
          <li>
            DORA (2012). San Francisco Declaration on Research Assessment.
            Disponible en:{' '}
            <a href="https://sfdora.org/read/" target="_blank" rel="noreferrer">
              https://sfdora.org/read/
            </a>
          </li>
          <li>
            Hicks, D., Wouters, P., Waltman, L. et al. Bibliometrics: The Leiden
            Manifesto for research metrics. Nature 520, 429–431 (2015).{' '}
            <a
              href="https://doi.org/10.1038/520429a"
              target="_blank"
              rel="noreferrer"
            >
              https://doi.org/10.1038/520429a
            </a>
          </li>
          <li>
            Tejada, M.A., Chalela, S., & Pallares, C. (2021). ABC de las
            Métricas Responsables. Consorcio Colombia. Disponible en:{' '}
            <a
              href="https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s"
              target="_blank"
              rel="noreferrer"
            >
              https://www.youtube.com/watch?v=bVfaRX0AFJc&t=3551s
            </a>
          </li>
          <li>
            Wilsdon, J. (2016). The metric tide: The independent review of the
            role of metrics in research assessment & management. (p. 180).{' '}
            <a
              href="https://responsiblemetrics.org/the-metric-tide/"
              target="_blank"
              rel="noreferrer"
            >
              https://responsiblemetrics.org/the-metric-tide/
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  );
};

export default Metrics;
