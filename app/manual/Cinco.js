/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/**
 * Cinco is a server-side functional component that renders a section of text and an image.
 *
 * The text section describes the concept of the university as an entity interdependent on its environment, as conceived by ImpactU. It includes a reference to the Manual de Valencia 2017 and the institutional missions of the university in Colombia: teaching, research, and extension. It also mentions the balance and feedback between these missions according to the current institutional self-assessment models of Mineducación. The text section ends with a reference to the organization model that guides the construction of the ImpactU platform.
 *
 * The image illustrates the conceptual model of ImpactU.
 *
 * @returns {JSX.Element} A fragment containing a paragraph element, an image, and another paragraph element. The first paragraph contains the text section. The image represents the conceptual model of ImpactU. The second paragraph contains a caption for the image and a link to the principles of ImpactU.
 */
export default function Cinco() {
  return (
    <>
      <p className={styles.normal_text}>
        <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b> concibe la Universidad como una entidad
        interdependiente de su entorno y obligada a relacionarse con otros
        actores institucionales no académicos que permitan desarrollar procesos
        de transferencia de conocimiento a la sociedad (Manual de Valencia
        2017). A este modelo hemos agregado las misiones institucionales a las
        que está encomendada la Universidad en Colombia: la docencia, la
        investigación y la extensión. De acuerdo con los modelos de
        autoevaluación institucionales vigentes de Mineducación, estas misiones
        deben guardar equilibrio y retroalimentarse. De manera esquemática puede
        verse la gráfica 3 para ilustrar el modelo de organización que orienta
        la construcción de la plataforma de <b id={styles.impact}>Impact</b>
        <b id={styles.u}>U</b>.
      </p>
      <Image
        alt="Modelo conceptual de ImpactU"
        width={720}
        height={802}
        src={"/media/graf01.png"}
        quality={100}
        className={styles.img}
      />
      <p className={styles.normal_text}>
        Gráfico 3. Modelo conceptual de ImpactU.{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://impactu.colav.co/principles"
        >
          https://impactu.colav.co/principles
        </a>
      </p>
    </>
  );
}
