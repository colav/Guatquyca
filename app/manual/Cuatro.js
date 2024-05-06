/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * Cuatro is a server-side functional component that renders a section of text, an image, and a subsection of text.
 *
 * The first text section describes the design of the ImpactU platform, which is based on a multi-level actor model associated with different types of documents involved in the research process.
 *
 * The image shows the operational model of ImpactU.
 *
 * The subsection includes a subtitle "4.1. ¿Qué tecnología Utiliza ImpactU?" and a paragraph describing the technology used by ImpactU. The paragraph includes two links: one to the MongoDB website and one to the Guatquyca repository on GitHub.
 *
 * @returns {JSX.Element} A fragment containing multiple paragraph elements, a heading element, an image, and two links. Each paragraph and heading represents a part of the text section or subsection. The image represents the operational model of ImpactU. The links lead to the MongoDB website and the Guatquyca repository.
 */
export default function Cuatro() {
  return (
    <>
      <p className={styles.normal_text}>
        La plataforma de <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> está diseñada con base en un modelo de actores
        multinivel asociados a diferentes tipos de documentos que hacen parte
        del proceso de investigación sea como resultados o como parte del
        proceso investigativo. En el gráfico 1 se señalan los diferentes tipos
        de actores y documentos contenidos en la plataforma, que se constituyen
        en información básica relacionada con el proceso de investigación. Cabe
        anotar que algunos de los productos en procesamiento se relacionan en
        diferentes misiones relativas a la investigación como emprendimientos,
        convenios, movilidad y noticias. La proyección de{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> es la integración de la información relativa a
        todas las misiones universitarias relacionadas con la investigación.
      </p>
      <Image
        alt="Modelo operacional de ImpactU"
        width={1278}
        height={732}
        src={"/media/grafico_1.svg"}
        className={styles.img}
      />
      <p className={styles.normal_text}>
        Gráfico 1. Modelo operacional de ImpactU.
      </p>
      <h3 className={styles.subTitle}>
        4.1. ¿Qué tecnología Utiliza <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>?
      </h3>
      <p className={styles.normal_text}>
        Esta información es procedente de diferentes bases de datos.{" "}
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> recibe esta información y la traduce a formato
        json procesada por tecnología MongoDB{" "}
        <a target="_blank" rel="noreferrer" href="https://www.mongodb.com/es">
          https://www.mongodb.com/es
        </a>
        , que permite el diseño de bases de datos no lineales, más económicas al
        procesamiento de la información. La información dispuesta en este
        formato alimenta el lago de datos en el que se mezclan y procesan. Como
        resultado se obtiene una base de datos enriquecida y se visualiza en un
        Frontend (Guatquyca en nuestro caso{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/colav/guatquyca"
        >
          https://github.com/colav/guatquyca
        </a>
        ) que permite filtrar la información y recuperar indicadores en un
        tablero de control. Así mismo, es posible recuperar la información
        visualizada en formato <b>CSV</b> y <b>JSON</b>.{" "}
      </p>
      <Image
        alt="Flujo de procesamiento de datos sobre artículos resultados de investigación"
        width={1278}
        height={732}
        src={"/media/grafico_2.svg"}
        className={styles.img}
      />
      <p className={styles.normal_text}>
        Gráfico 2. Flujo de procesamiento de datos sobre artículos resultados de
        investigación.
      </p>
      <p className={styles.normal_text}>
        Los datos y métricas se ponen a disposición de los procesos de
        seguimiento y evaluación de la investigación para responder a
        autoevaluación institucional, seguimiento a objetivos, metas de planes
        de desarrollo institucionales y evaluar de manera responsable los
        indicadores que tienen plataformas métricas y evaluación científica como
        el Ministerio de Ciencia, Tecnología e Innovación (Minciencias) a través
        de sus desarrollos ScienTI u otros <i>ránkings</i> y rúbricas nacionales
        e internacionales.
      </p>
    </>
  );
}
