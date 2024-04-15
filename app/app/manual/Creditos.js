/* Next */
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

export default function Creditos() {
  return (
    <>
      <p className={styles.normal_text}>
        <b>Créditos institucionales</b>
      </p>
      <ul className={styles.normal_text}>
        <li>
          <b>Universidad de Antioquia</b>
        </li>
        <p>
          Vicerrectoría de Investigación
          <br />
          CoLaV
          <br />
          Sistema de Bibliotecas
          <br />
          Dirección de Relaciones Internacionales
          <br />
          Facultad de Ciencias Exactas y Naturales
          <br />
          Facultad de Ciencias Sociales y Humanas
          <br />
          Escuela Interamericana de Bibliotecología
        </p>
        <li>
          <b>Universidad Autónoma Latinoamericana</b>
        </li>
        <p>
          Vicerrectoría de Investigaciones
          <br />
          Dirección de Planeación, Autoevaluación y Aseguramiento de la Calidad
          <br />
          Biblioteca
        </p>
        <li>
          <b>Universidad Externado de Colombia</b>
        </li>
        <p>
          Biblioteca
          <br />
          Facultad de Finanzas, Gobierno y Relaciones Internacionales
          <br />
          Departamento de Matemática
        </p>
        <li>
          <b>Universidad del Valle</b>
        </li>
        <p>Vicerrectoría de Investigaciones</p>
      </ul>
      <br />
      <p className={styles.normal_text}>
        <b>Créditos de autoría</b>
      </p>
      <p className={styles.normal_text}>
        <b>Coordinación general de ImpactU</b>
      </p>
      <ul className={styles.normal_text}>
        <li>Gabriel Vélez Cuartas</li>
      </ul>
      <br />
      <p className={styles.normal_text}>
        <b>Redacción del Manual</b>
      </p>
      <ul className={styles.normal_text}>
        <li>Gabriel Vélez Cuartas, Universidad de Antioquia</li>
        <li>
          Walter Alonso Yepes Aristizábal, Universidad Autónoma Latinoamericana
        </li>
        <li>Eulalia Borja Bedoya, Universidad Autónoma Latinoamericana</li>
      </ul>
      <br />
      <p className={styles.normal_text}>
        <b>Revisión</b>
      </p>
      <p className={styles.normal_text}>
        <b>Equipo de métricas y proyección estratégica ImpactU</b>
      </p>
      <ul className={styles.normal_text}>
        <li>Gabriel Vélez Cuartas, Universidad de Antioquia</li>
        <li>Ana María Osorio López, Universidad de Antioquia</li>
        <li>Alejandro Uribe Tirado, Universidad de Antioquia</li>
        <li>Diego Restrepo Quintero, Universidad de Antioquia</li>
        <li>
          Walter Alonso Yepes Aristizabal, Universidad Autónoma Latinoamericana
        </li>
        <li>Eulalia Borja Bedoya, Universidad Autónoma Latinoamericana</li>
        <li>
          Julián Esteban Pérez Santa, Universidad Autónoma Latinoamericana
        </li>
        <li>Cesar Alonso Valenzuela Toledo, Universidad del Valle</li>
        <li>Luz Piedad Arrigui Fragua, Universidad del Valle</li>
        <li>Pau Torres Pachón, Universidad Externado de Colombia</li>
        <li>Alejandro Balanzó Guzmán, Universidad Externado de Colombia</li>
      </ul>
      <br />
      <p className={styles.normal_text}>
        <b>Diseño y diagramación</b>
      </p>
      <ul className={styles.normal_text}>
        <li>Luis Miguel Vargas Guevara, Desarrollador Front-End</li>
      </ul>
      <br />
      <p className={styles.normal_text}>
        <b>Equipo de Desarrollo Computacional</b>
      </p>
      <ul className={styles.normal_text}>
        <li>Diego Restrepo Quintero, Director de Desarrollo</li>
        <li>Omar Andrés Zapata Mesa, Desarrollador Full-Stack senior</li>
        <li>Luis Miguel Vargas Guevara, Desarrollador Front-End senior</li>
        <li>
          Darío Cristopher Peña Salamanca, Universidad Externado de Colombia
        </li>
        <li>Federico Vergara Gómez, Desarrollador ETL</li>
        <li>Simón García Luján, Desarrollador Back-End</li>
        <li>Ana Karina Lourido Jurado, Universidad del Valle</li>
        <li>Fidel Herney Palacios Cualcialpud, Universidad del Valle</li>
      </ul>
      <br />
      <Image
        src="/media/cc.svg"
        alt="ImpactU Búsqueda"
        width={200}
        height={71}
        quality={100}
        className={styles.cc}
      />
      <p className={styles.normal_text}>
        Manual sujeto a licencia Creative Commons Atribución 4.0 BY-NC-ND
      </p>
      <br />
      <p className={styles.normal_text}>
        <b>ImpactU</b>
      </p>
      Correo-e:{" "}
      <a target="_blank" rel="noreferrer" href="mailto:grupocolav@udea.edu.co">
        grupocolav@udea.edu.co
      </a>
      <br />
      <a target="_blank" rel="noreferrer" href="https://impactu.colav.co">
        https://impactu.colav.co
      </a>
      <p className={styles.normal_text}>
        Medellín
        <br />
        Marzo de 2024
      </p>
    </>
  );
}
