/* Next */
import Link from "next/link";
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Row, Col } from "antd";

export const allies = [
  {
    href: "/affiliation/institution/03bp5hc83/affiliations",
    src: "/media/logo_udea.svg",
    alt: "Logotipo Universidad de Antioquia",
  },
  {
    href: "/affiliation/institution/05tkb8v92/affiliations",
    src: "/media/logo_unaula.svg",
    alt: "Logotipo Universidad Autónoma Latinoamericana",
  },
  {
    href: "/affiliation/institution/02xtwpk10/affiliations",
    src: "/media/logo_uec.svg",
    alt: "Logotipo Universidad Externado de Colombia",
  },
  {
    href: "/affiliation/institution/00jb9vg53/affiliations",
    src: "/media/logo_univalle.svg",
    alt: "Logotipo Universidad del Valle",
  },
  {
    href: "https://ascun.org.co/",
    src: "/media/logo_ascun.svg",
    alt: "Logotipo Asociación Colombiana de Universidades - ASCUN",
    external: true,
  },
  {
    href: "/affiliation/institution/04cmc9894/affiliations",
    src: "/media/logo_upn.svg",
    alt: "Logotipo Universidad Pedagógica Nacional",
  },
  /*   {
    href: "/affiliation/institution/0108mwc04/affiliations",
    src: "/media/logo_urosario.svg",
    alt: "Logotipo Universidad del Rosario",
  }, */
  {
    href: "/affiliation/institution/02yr3f298/affiliations",
    src: "/media/logo_fucs.svg",
    alt: "Logotipo Fundación Universitaria de Ciencias de la Salud",
  },
];

export default function AlliesSection() {
  return (
    <Row gutter={[85, 12]} justify="center" align="middle">
      <Col span={24} id={styles.title}>
        • Aliados •
      </Col>
      {allies.map((ally, index) => (
        <LinkLogo ally={ally} index={index} key={index} />
      ))}
    </Row>
  );
}

function LinkLogo({ ally, index }) {
  return (
    <>
      <Col
        xs={12}
        sm={8}
        md={6}
        lg={{ flex: "0 0 14%" }}
        xl={{ flex: "0 0 14%" }}
        className={styles.logoContainer}
      >
        <Link href={ally.href}>
          <Image
            className={styles.logo}
            src={ally.src}
            alt={ally.alt}
            width={220}
            height={90}
          />
        </Link>
      </Col>
      {(index + 1) % 7 === 0 && <Col xs={0} sm={0} md={0} lg={0} xl={24} />}
    </>
  );
}
