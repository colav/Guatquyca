/* Charts */
import GraphChartOnHome from "../Charts/GraphCharts/GraphChartOnHome";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import getData from "@/lib/APIS/api";

/**
 * OurDataSection
 *
 * Asynchronous React component that displays the "Nuestros datos" section.
 * Fetches research data from the API and renders a responsive layout with a graph visualization and descriptive text.
 * Uses Ant Design's Row and Col for layout, and applies custom styles.
 *
 * @async
 * @function
 * @returns {Promise<JSX.Element>} The rendered section with a graph and description.
 *
 */
export default async function OurDataSection() {
  const URL = "/app/info";
  const { data } = await getData(URL);

  return (
    <Row
      justify="space-evenly"
      align="middle"
      gutter={[20, 20]}
      className={styles.our_data_section}
    >
      <Col
        xs={{ span: 24, order: 2 }}
        sm={{ span: 24, order: 2 }}
        md={{ order: 2 }}
        lg={{ span: 14, order: 1 }}
        xl={13}
        xxl={12}
      >
        {data ? <GraphChartOnHome data={data} /> : null}
      </Col>
      <Col
        xs={{ span: 24, order: 1 }}
        sm={{ span: 24, order: 1 }}
        md={{ span: 23, order: 1 }}
        lg={{ span: 9, order: 2 }}
        xl={10}
        xxl={8}
      >
        <div className={styles.content_container}>
          <h1 className={styles.main_title}>Nuestros datos</h1>
          <h3 className={styles.subtitle}>
            Toda la investigación de Colombia en un mismo lugar
          </h3>
          <p className={styles.description}>
            La información científica y académica en Colombia suele estar
            dispersa en múltiples fuentes, con diferencias en la forma en que se
            registran autores, instituciones y productos.{" "}
            <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> integra y normaliza estos metadatos en un
            mismo lugar, convirtiéndose en la plataforma con la mayor cantidad
            de productos e información sobre la investigación en Colombia. Aquí
            es posible descubrir conexiones, capacidades y colaboraciones que
            revelan el verdadero alcance de la producción académica del país.
          </p>
        </div>
      </Col>
    </Row>
  );
}
