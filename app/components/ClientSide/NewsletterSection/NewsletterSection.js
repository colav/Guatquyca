/* Icons */
import { NotificationOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Col, Row } from "antd";

/**
 * NewsletterSection
 *
 * Full-width call-to-action band inviting users to check ImpactU's periodic
 * newsletters. Mirrors the visual language of OurDataSection (background
 * band spanning the full width of the page, no Card wrapper).
 *
 * @returns {JSX.Element}
 */
export default function NewsletterSection() {
  return (
    <Row justify="center" align="middle" className={styles.newsletter_section}>
      <Col xs={24} sm={22} md={18} lg={14} xl={12}>
        <div className={styles.content_container}>
          <NotificationOutlined className={styles.icon} />
          <h1 className={styles.main_title}>Boletines ImpactU</h1>
          <h3 className={styles.subtitle}>
            Novedades, avances y análisis de nuestros datos
          </h3>
          <p className={styles.description}>
            Publicamos boletines periódicos con las novedades, avances y
            análisis de los datos de <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b>. Consulta las últimas ediciones y entérate de
            lo nuevo antes que nadie.
          </p>
          <Link href="/newsletters">
            <Button type="primary" size="large" icon={<NotificationOutlined />}>
              Ver boletines
            </Button>
          </Link>
        </div>
      </Col>
    </Row>
  );
}
