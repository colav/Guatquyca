/* Components */
import SearchBar from "@/app/components/ClientSide/SearchBar/SearchBar";
import StatsBar from "./StatsBar";

/* Icons */
import { ReadOutlined, SearchOutlined } from "@ant-design/icons";

/* React */
import { Suspense } from "react";

/* Styles */
import styles from "./styles.module.css";

export default function HeroSection({ data }) {
  return (
    <section className={styles.hero}>
      <div className={styles.hero_bg_grid} aria-hidden />

      <div className={styles.hero_inner}>
        <div className={styles.hero_badge}>
          <ReadOutlined />
          &nbsp; Explorador de Fuentes
        </div>

        <h1 className={styles.hero_title}>
          Encuentra fuentes académicas
          <br />
          <span className={styles.hero_accent}>a nivel mundial</span>
        </h1>

        <p className={styles.hero_sub}>
          Explora más de 270.000 opciones: revistas, repositorios, conferencias
          y más, con métricas de impacto, acceso abierto y producción de
          investigadores colombianos.
        </p>

        <div className={styles.search_wrapper}>
          <Suspense>
            <SearchBar defaultEntity="sources" />
          </Suspense>
        </div>

        <p className={styles.hero_hint}>
          Escribe el nombre de una revista, repositorio, plataforma de libros
          electrónicos, o haz clic en <SearchOutlined /> para explorar el
          catálogo completo.
        </p>
        {data && (
          <section>
            <StatsBar data={data} />
          </section>
        )}
      </div>
    </section>
  );
}
