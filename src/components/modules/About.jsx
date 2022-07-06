import React from 'react';

/* Images */
import graf01 from '../../media/graf01.png';

/* Logos */
import doaj from '../../media/doaj.svg';
import google from '../../media/google.svg';
import lens from '../../media/lens.svg';
import ma from '../../media/ma.svg';
import scielo from '../../media/scielo.svg';
import scopus from '../../media/scopus.svg';
import unpayw from '../../media/unpaywall.svg';
import wos from '../../media/wos.svg';

/* UI Library Components */
import { Col, Divider, Image, Row, Typography } from 'antd';

/* UI Library Sub-components*/
const { Title, Paragraph, Link, Text } = Typography;

const About = () => {
  const logos = [wos, scopus, ma, lens, doaj, scielo, google, unpayw];

  const renderedLogos = () => {
    return logos.map((logo) => (
      <Col xs={24} md={10} key={logo}>
        <Image preview={false} src={logo} />
      </Col>
    ));
  };

  return (
    <Row gutter={[20, 20]} justify="center">
      <Col xs={24} md={16} style={{ marginTop: '40px' }}>
        <Title level={3}>Acerca de ImpactU</Title>
        <Divider style={{ marginBottom: '10px' }} />
      </Col>
      <Col xs={24} md={9}>
        <Paragraph>
          {<Text strong>ImpactU</Text>} es una plataforma colaborativa regional
          para la creación de modelos que evidencien la vinculación de la
          investigación, la docencia y la extensión con el entorno a través de
          la producción de diferentes tipos de documentos resultados de las tres
          misiones universitarias.
        </Paragraph>
        <Title level={5}>El sistema utiliza datos de:</Title>
        <Row
          gutter={[20, 20]}
          justify="space-around"
          align="middle"
          style={{ marginTop: '30px' }}
        >
          {renderedLogos()}
        </Row>
        <Paragraph>
          Además de algunos portales de noticias y bases de datos internas de
          las Universidades que colaboran.
        </Paragraph>
      </Col>
      <Col xs={24} md={7}>
        <Image src={graf01} style={{ maxWidth: '600px' }} />
      </Col>
      <Col xs={24} md={16} style={{ marginTop: '0px' }}>
        <Paragraph>
          {<Text strong>ImpactU</Text>} es un proyecto creado y desarrollado por
          el{' '}
          {
            <Link strong href="http://colav.udea.edu.co" target="_blank">
              Colav
            </Link>
          }{' '}
          de la {<Text strong>Universidad de Antioquia</Text>} en colaboración
          con la {<Text strong>Universidad Autónoma Latinoamericana</Text>} y la{' '}
          {<Text strong>Universidad Externado de Colombia.</Text>} Su propósito
          es acercarse a un modelo de métricas responsables con los principios
          de multidimensionalidad en donde se identifican diferentes niveles
          organizacionales, se mezclan diferentes bases de datos para
          desfragmentar la información universitaria dispersa, y se observan
          diferentes aspectos de la producción especialmente orientados a la
          vinculación con el entorno; diálogo entre instrumentos de evaluación y
          métricas y tomadores de decisiones; pertinencia institucional;
          apertura de datos e infraestructuras; y conciencia geográfica de
          situación para la investigación en relación con la docencia y la
          extensión, desde el Sur Global y Latinoamérica en particular.
        </Paragraph>
        <Paragraph>
          Esta propuesta se plantea tres tipos de estrategias metodológicas:
          trabajo colaborativo entre administrativos e investigadores para
          definir un marco más preciso de métricas pertinentes a las
          instituciones, la constitución de una comunidad de desarrollo para
          proveer la infraestructura necesaria (
          {<Link href="http://www.github.com/colav">GitHub @Colav</Link>}),
          comunidades para el diseño de métricas adecuadas a la toma de
          decisiones.
        </Paragraph>
        <Title level={5}>
          El espíritu del proyecto es colaborativo y está abierto a que los
          usuarios de la plataforma no sólo para que consulten su información,
          sino también, para que puedan usar y ayudar en la creación de
          softwares que la alimenten y enriquezcan. Así mismo, al ser un
          proyecto experimental, hay espacio para alianzas temporales o
          estratégicas con distintas instituciones para resolver problemas
          asociados con modelos métricos que puedan adecuarse a las necesidades
          de los tomadores de decisiones.
        </Title>
        <br />
        <Paragraph>
          Inicialmente la plataforma está adaptada para la consulta en detalle
          de la {<Text strong>Universidad de Antioquia</Text>},{' '}
          {<Text strong>Universidad Autónoma Latinoamericana</Text>} y la{' '}
          {<Text strong>Universidad Externado de Colombia</Text>}, pero contiene
          todos los datos disponibles de la producción Colombiana disponibles en
          las bases utilizadas en esta etapa. El instrumento es de fácil
          escalabilidad a otras instituciones nacionales con algunos datos
          mínimos de los docentes vinculados a cada entidad.
        </Paragraph>
      </Col>
    </Row>
  );
};

export default About;
