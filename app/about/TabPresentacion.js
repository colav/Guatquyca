/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/*  UI Library Components */
import { Col, Divider, Row } from "antd";

export default function TabPresentacion() {
  return (
    <Row justify="start">
      <Col span={24}>
        <h3 className={styles.margin0}>Definición</h3>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> es Infraestructura Académica Abierta que ofrece
          una plataforma tipo CRIS (Current Research Information System) para
          Colombia, software de código abierto para su implementación y un
          espacio colaborativo entre las instituciones colombianas para mejorar
          sus procesos de gestión del conocimiento y evaluación científica.
        </p>
        <p>
          Los principios de operación de <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> como Infraestructura Académica Abierta:
        </p>
        <Image
          priority={true}
          src={"/media/diagrama_infra_abierta.svg"}
          alt="Infraestructura Académica Abierta"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          width={970}
          height={400}
        />
        <Divider />
        <h3 className={styles.margin0}>Gobernanza</h3>
        <p>
          <b id={styles.impact}>Impact</b>
          <b id={styles.u}>U</b> es creada y orientada por el <b>CoLaV</b> de la{" "}
          <b>Universidad de Antioquia</b>, la <b>Universidad del Valle</b>, la
          <b>Universidad Externado de Colombia</b> y la{" "}
          <b>Universidad Autónoma Latinoamericana</b>. Está en proceso de
          constitución de un consorcio nacional auspiciado por <b>ASCUN</b> que
          democratizará su propiedad entre todas las instituciones colombianas
          interesadas en la membresía.
        </p>
        <Divider />
        <h3 className={styles.margin0}>Propósitos</h3>
        <p>
          Ofrecer el sistema de información más robusto y completo sobre la
          información de investigación del país con datos abiertos. Por ejemplo:
        </p>
        <ul>
          <li>
            <a href="https://impactu.colav.co" target="_blank" rel="noreferrer">
              https://impactu.colav.co
            </a>
          </li>
          <li>
            <a
              href="https://apis.colav.co/apidoc/index.html"
              target="_blank"
              rel="noreferrer"
            >
              https://apis.colav.co/apidoc/index.html
            </a>
          </li>
        </ul>
        Promover ambientes de aprendizaje colaborativos entre las instituciones
        del país. Por ejemplo:
        <ul>
          <li>
            <a
              href="https://www.youtube.com/watch?v=xnibrCrnH-E&t=747s&pp=ygUOaW1wYWN0dSBjb3JlbWE%3D"
              target="_blank"
              rel="noreferrer"
            >
              Lanzamiento de la plataforma ImpactU - UdeA
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=1twI_ifnaTA&t=402s&pp=ygUNaW1wYWN0dSBhc2N1bg%3D%3D"
              target="_blank"
              rel="noreferrer"
            >
              Tecnologías y metodologías para la evaluación responsable de los
              impactos de la investigación - ASCUN
            </a>
          </li>
        </ul>
        Constituir un modelo de infraestructura académica abierta que sea
        replicable en otros países de la región y otros contextos territoriales
        y organizacionales. Por ejemplo:
        <ul>
          <li>
            <a href="https://github.com/colav" target="_blank" rel="noreferrer">
              https://github.com/colav
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  );
}
