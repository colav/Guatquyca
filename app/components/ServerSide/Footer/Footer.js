/* Icons */
import { DatabaseOutlined, GithubOutlined } from "@ant-design/icons";

/* Components */
import AlliesSection from "./AlliesSection";
import DBUpdatedAt from "./DBUpdatedAt";
import LicenseBadge from "./LicenseBadge";

/* Data */
import { footerSections, OPEN_DATA_URL } from "./footerLinks";
import packageInfo from "@/package.json";

/* Next */
import Link from "next/link";
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Layout } from "antd";

/* UI Library Sub-components */
const Footer = Layout;

/* Date of the last user interface release (dd/mm/yyyy). Update it on each release. */
const UI_UPDATED_AT = "14/11/2026";

/**
 * FooterLink renders a footer link: Next Link for internal routes, anchor for external URLs and mailto.
 *
 * @param {Object} link - The link definition from footerLinks.
 * @returns {JSX.Element} The link.
 */
function FooterLink({ link }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  if (link.mail) {
    return <a href={link.href}>{link.label}</a>;
  }
  return <Link href={link.href}>{link.label}</Link>;
}

/**
 * Foot is a "server-side" function component that displays the site footer:
 * partner and credit logos first, then the ImpactU logo with badges, the link columns
 * and the version information.
 *
 * @returns {JSX.Element} A footer component.
 */
export default function Foot() {
  return (
    <Footer id={styles.footer_container}>
      <div className={styles.partners}>
        <AlliesSection />
      </div>

      <div className={styles.credits}>
        <div className={styles.creditBlock}>
          <div className={styles.creditTitle}>Producto desarrollado por</div>
          <Image
            src="/media/logo_colav.svg"
            alt="Logotipo Colav"
            width={108}
            height={29}
          />
        </div>
        <div className={styles.creditBlock}>
          <div className={styles.creditTitle}>Operador administrativo</div>
          <Link
            href="https://www.fundacionudea.com/sitio/"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/media/logo_fua.svg"
              alt="Logotipo FUA"
              width={97}
              height={32}
              className={styles.logo}
              priority={false}
            />
          </Link>
        </div>
      </div>

      <div className={styles.top}>
        <Link href="/">
          <Image
            src="/media/logo_impactU_A.svg"
            alt="Logotipo ImpactU"
            width={130}
            height={27}
          />
        </Link>
        <div className={styles.badges}>
          <Link href="/open-source" className={styles.badge}>
            <GithubOutlined /> Código abierto
          </Link>
          <a
            href={OPEN_DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.badge}
          >
            <DatabaseOutlined /> Datos abiertos
          </a>
        </div>
      </div>

      <nav className={styles.columns} aria-label="Enlaces del pie de página">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h2 className={styles.columnTitle}>{section.title}</h2>
            <ul className={styles.linkList}>
              {section.links
                .filter((link) => !link.pending)
                .map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div>
          ImpactU versión {packageInfo.version} · Interfaz de usuario:{" "}
          {UI_UPDATED_AT} · Base de datos: <DBUpdatedAt />
        </div>
        <LicenseBadge />
      </div>
    </Footer>
  );
}
