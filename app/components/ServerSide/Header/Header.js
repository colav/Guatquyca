/* Next */
import Link from "next/link";
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Col, Layout, Row } from "antd";

/* UI Library Sub-components */
const Header = Layout;

/**
 * Head is a "server-side" function component that displays a header.
 * It contains the logo without the search bar, it's used only in the home page.
 * @returns {JSX.Element} A header component.
 */
export default function Head() {
  return (
    <Header id={styles.header}>
      <Row align={"middle"} justify={"center"}>
        <Col xs={24} sm={24} md={8} lg={6} id={styles.logo_container}>
          <Link href="/">
            <Image
              priority={true}
              src={"/media/logo_impactU_B.svg"}
              alt="Logotipo ImpactU"
              id={styles.logo}
              width={300}
              height={80}
            />
          </Link>
        </Col>
        <Col xs={24} sm={24} md={16} lg={12} />
        <Col xs={0} lg={6} />
      </Row>
    </Header>
  );
}
