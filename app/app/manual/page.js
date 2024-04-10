/* Components */
import Alcance from "./Alcance";
import AQuien from "./AQuien";
import Glosario from "./Glosario";
import Justificacion from "./Justificacion";
import Objetivo from "./Objetivo";
import Uno from "./Uno";
import Dos from "./Dos";
import Tres from "./Tres";
import Cuatro from "./Cuatro";
import Cinco from "./Cinco";
import Seis from "./Seis";
import Siete from "./Siete";
import Ocho from "./Ocho";
import Nueve from "./Nueve";
import Diez from "./Diez";
import Bibliografia from "./Bibliografia";
import Creditos from "./Creditos";

/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Collapse, Row, ConfigProvider } from "antd";
import Fuentes from "./Fuentes";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: "1",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>Glosario</h2>
      </>
    ),
    children: <Glosario />,
  },
  {
    key: "2",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>Objetivo</h2>
      </>
    ),
    children: <Objetivo />,
  },
  {
    key: "3",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>Justificación</h2>
      </>
    ),
    children: <Justificacion />,
  },
  {
    key: "4",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>Alcance</h2>
      </>
    ),
    children: <Alcance />,
  },
  {
    key: "5",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          ¿A quién está dirigido este manual?
        </h2>
      </>
    ),
    children: <AQuien />,
  },
  {
    key: "6",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          1. ¿Qué es <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>?
        </h2>
      </>
    ),
    children: <Uno />,
  },
  {
    key: "7",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          2. ¿Qué son estrategias responsables para la medición y evaluación de
          la investigación?
        </h2>
      </>
    ),
    children: <Dos />,
  },
  {
    key: "8",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          3. ¿De qué manera una institución puede participar en{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>?
        </h2>
      </>
    ),
    children: <Tres />,
  },
  {
    key: "9",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          4. ¿Cómo opera la plataforma tipo CRIS{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>?
        </h2>
      </>
    ),
    children: <Cuatro />,
  },
  {
    key: "10",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          5. ¿Cuál es el modelo conceptual de <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>?
        </h2>
      </>
    ),
    children: <Cinco />,
  },
  {
    key: "11",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          6. ¿Cuáles son las bases de datos fuente?
        </h2>
      </>
    ),
    children: <Seis />,
  },
  {
    key: "12",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          7. ¿Cómo mejorar la evaluación institucional de la investigación?
        </h2>
      </>
    ),
    children: <Siete />,
  },
  {
    key: "13",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          8. ¿En qué apoya <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> respecto a la gobernanza sobre la información
          institucional?
        </h2>
      </>
    ),
    children: <Ocho />,
  },
  {
    key: "14",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          9. ¿Cómo se recupera y descarga información de{" "}
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b>?
        </h2>
      </>
    ),
    children: <Nueve />,
  },
  {
    key: "15",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>10. ¿Cómo realizar las consultas?</h2>
      </>
    ),
    children: <Diez />,
  },
  {
    key: "16",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          Fuentes sobre principios de métricas responsables
        </h2>
      </>
    ),
    children: <Fuentes />,
  },
  {
    key: "17",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>
          Bibliografía de interés en gobernanza sobre la información
        </h2>
      </>
    ),
    children: <Bibliografia />,
  },
  {
    key: "18",
    label: (
      <>
        <div className={styles.small_rectangle} />
        <h2 className={styles.big_title}>Créditos</h2>
      </>
    ),
    children: <Creditos />,
  },
];

export default function Page() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: { headerPadding: "25px 0 10px 15px !important" },
        },
      }}
    >
      <Row id={styles.global_container}>
        <Row justify="space-between" align="middle" id="inicio">
          <Col xs={24} lg={12}>
            <h1 id={styles.title}>
              <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b>: Laboratorio de I+D para la evaluación
              responsable de la investigación en Colombia.
            </h1>
            <p className={styles.subText}>
              Manual para implementar estrategias responsables de medición y
              evaluación con el apoyo de sistemas tipo <b>CRIS</b>.
            </p>
            <p className={styles.subSubText}>
              Datos abiertos • Software abierto • Infraestructuras colaborativas
            </p>
          </Col>
          <Col xs={24} lg={9}>
            <Image
              id={styles.hero_img}
              priority={true}
              src="/media/hero_img.png"
              alt="Logo ImpactU"
              width={600}
              height={600}
              quality={100}
            />
          </Col>
        </Row>
        <div className={styles.rectangle} />
        <Col span={24}>
          <Collapse items={items} size="large" />
        </Col>
      </Row>
    </ConfigProvider>
  );
}
