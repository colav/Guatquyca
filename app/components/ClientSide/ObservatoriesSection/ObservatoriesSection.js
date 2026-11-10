/* Icons */
import { ArrowRightOutlined, FundProjectionScreenOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Col, Row } from "antd";

/* Texts of F122 (D-263; the proposal of architecture under D-102, Luis can change it). No figure is written by hand. */
const BOARD_NAMES = ["Masa crítica temática", "Colaboración, redes y hélices", "Capacidades de base UdeA"];

/**
 * ObservatoriesSection
 *
 * Call-to-action band between "Nuestros datos" and "Boletines ImpactU" (F122): it invites to the observatories.
 * Same visual language as the other bands (full-width, centered, Ant Design button); the only animation is a
 * slow drift of the dots and the arrow, both off with `prefers-reduced-motion`.
 *
 * @returns {JSX.Element}
 */
export default function ObservatoriesSection() {
  return (
    <Row justify="center" align="middle" className={styles.observatories_section} data-testid="observatories-cta">
      <Col xs={24} sm={22} md={20} lg={16} xl={14}>
        <section className={styles.content_container} aria-labelledby="observatories-cta-title">
          <FundProjectionScreenOutlined className={styles.icon} aria-hidden="true" />
          <h1 id="observatories-cta-title" className={styles.main_title}>
            Observatorios <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b>
          </h1>
          <p className={styles.description}>
            Explora cómo investiga la Universidad de Antioquia: sus capacidades por tema, sus colaboraciones y las bases que sostienen su producción.
          </p>
          <ul className={styles.chips} aria-label="Tableros disponibles">
            {BOARD_NAMES.map((name) => (
              <li key={name} className={styles.chip}>{name}</li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link href="/observatories/vri-udea">
              <Button type="primary" size="large" className={styles.primary_button}>
                Explorar el observatorio <ArrowRightOutlined className={styles.arrow} />
              </Button>
            </Link>
            <Link href="/observatories" className={styles.secondary_link}>
              Ver todos los observatorios
            </Link>
          </div>
        </section>
      </Col>
    </Row>
  );
}
