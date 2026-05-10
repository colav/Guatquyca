/* Icons */
import {
  FilterOutlined,
  ArrowRightOutlined,
  StarFilled,
} from "@ant-design/icons";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Row } from "antd";

/**
 * FiltersSection Component
 *
 * Displays an informational section about the advanced filtering capabilities of the sources search interface.
 * Includes a description of available filter options and a mockup demonstrating the filter panel UI.
 * Provides a call-to-action button to navigate to the filterable sources search page.
 *
 * @component
 * @returns {JSX.Element} The filters section with description, feature list, and mockup interface
 */
export default function FiltersSection() {
  return (
    <section className={`${styles.section} ${styles.section_filters}`}>
      <div className={styles.section_inner}>
        <Row gutter={[48, 40]} align="middle">
          <Col xs={24} lg={11}>
            <div className={styles.filters_copy}>
              <div className={styles.section_badge}>
                <FilterOutlined /> Filtros avanzados
              </div>
              <h2 className={styles.section_title}>
                Encuentra exactamente lo que buscas
              </h2>
              <p
                className={`${styles.section_sub} ${styles.section_sub_spaced}`}
              >
                Combina múltiples criterios: tipo de acceso, cuartil SCImago,
                tipo de licencia, tiempo promedio de publicación y más. Refina
                hasta dar con la fuente ideal para tu investigación.
              </p>
              <ul className={styles.filter_list}>
                {[
                  "Tópicos de investigación",
                  "Ruta de acceso (Abierto, Cerrado, Diamante…)",
                  "Cuartil SCImago (Q1 – Q4)",
                  "Tipo de licencia",
                  "Tipo de fuente",
                  "Tiempo promedio de publicación",
                  "Pago de APC (USD)",
                ].map((f) => (
                  <li key={f} className={styles.filter_item}>
                    <StarFilled className={styles.filter_star} /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/search/sources?max=10&page=1&sort=products_desc"
                className={`${styles.cta_btn} ${styles.cta_btn_spaced}`}
              >
                Explorar con filtros <ArrowRightOutlined />
              </Link>
            </div>
          </Col>
          <Col xs={24} lg={13}>
            <div className={styles.filters_mockup}>
              <div className={styles.mockup_header}>
                <span className={styles.mockup_dot} />
                <span className={styles.mockup_dot} />
                <span className={styles.mockup_dot} />
                <span className={styles.mockup_title}>Panel de filtros</span>
              </div>

              {[
                {
                  label: "Tópicos",
                  items: [
                    {
                      name: "Business, Innovation, and Economy",
                      count: "1.064",
                      indent: 0,
                    },
                    {
                      name: "History and Politics in Latin America",
                      count: "856",
                      indent: 0,
                    },
                    {
                      name: "Education and Teacher Training",
                      count: "702",
                      indent: 0,
                    },
                  ],
                },
                {
                  label: "Ruta de acceso",
                  items: [
                    { name: "Acceso Cerrado", count: "246.731", indent: 0 },
                    { name: "Acceso Abierto", count: "22.718", indent: 0 },
                    { name: "Diamante", count: "14.193", indent: 1 },
                    { name: "Dorado", count: "8.078", indent: 1 },
                    { name: "Híbrido", count: "447", indent: 1 },
                  ],
                },
                {
                  label: "Mejor cuartil SCImago",
                  items: [
                    { name: "Q1", count: "16.568", indent: 0 },
                    { name: "Q2", count: "10.210", indent: 0 },
                    { name: "Q3", count: "8.956", indent: 0 },
                    { name: "Q4", count: "4.685", indent: 0 },
                  ],
                },
              ].map((group) => (
                <div key={group.label} className={styles.mockup_group}>
                  <div className={styles.mockup_group_label}>{group.label}</div>
                  {group.items.map((it) => (
                    <div
                      key={it.name}
                      className={`${styles.mockup_row} ${it.indent ? styles.mockup_row_indent : ""}`}
                    >
                      <span className={styles.mockup_check} />
                      <span className={styles.mockup_item_name}>{it.name}</span>
                      <span className={styles.mockup_item_count}>
                        {it.count}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
