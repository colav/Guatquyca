/* Icons */
import {
  FilterOutlined,
  GlobalOutlined,
  RiseOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/**
 * HighlightsSection Component
 *
 * Displays a grid of four key feature highlights about the sources explorer platform.
 * Each highlight includes an icon, title, and description emphasizing platform capabilities
 * including advanced filtering, global coverage, responsible metrics, and open data access.
 *
 * @component
 * @returns {JSX.Element} Grid section with four feature highlight cards
 */
const HIGHLIGHTS = [
  {
    icon: <FilterOutlined />,
    title: "Filtros avanzados",
    desc: "Filtra por cuartil SCImago, tipo de acceso, licencia y más.",
  },
  {
    icon: <GlobalOutlined />,
    title: "Cobertura global",
    desc: "Fuentes de más de 180 países con producción colombiana asociada.",
  },
  {
    icon: <RiseOutlined />,
    title: "Métricas responsables",
    desc: "Indicadores alineados con los principios de evaluación responsable.",
  },
  {
    icon: <ExperimentOutlined />,
    title: "Datos abiertos",
    desc: "Todos los datos están disponibles para descarga y reutilización.",
  },
];

export default function HighlightsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.section_inner}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>
            Herramientas para investigadores y gestores
          </h2>
          <p className={styles.section_sub}>
            Todo lo que necesitas para evaluar y comparar fuentes de forma
            responsable.
          </p>
        </div>

        <div className={styles.highlights_grid}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className={styles.highlight_card}>
              <div className={styles.highlight_icon}>{h.icon}</div>
              <h4 className={styles.highlight_title}>{h.title}</h4>
              <p className={styles.highlight_desc}>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
