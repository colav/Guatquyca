/* React */
import { Suspense } from "react";

/* Components */
import DisclaimerModal from "./components/ClientSide/DisclaimerModal/DisclaimerModal";
import HomeTable from "./components/ServerSide/HomeTable/HomeTable";
import SearchBar from "./components/ClientSide/SearchBar/SearchBar";

/* Icons */
import { DownloadOutlined, LinkOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";
import Image from "next/image";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Col, Row } from "antd";

export default function Home() {
  return (
    <>
      <DisclaimerModal />
      <div id={styles.content_container} className="margin_15">
        <Row justify="space-around">
          <Col span={24}>
            <Image
              priority={true}
              src={"/media/banner.svg"}
              alt="Colav texture"
              width={1920}
              height={1080}
              id={styles.banner}
            />
          </Col>
          <Col flex sm={24} xl={10} xxl={8}>
            <div id={styles.head_title}>
              <h1 style={{ marginBottom: "15px", fontSize: "38px" }}>
                Bienvenido a ImpactU
              </h1>
              <h2 style={{ fontSize: "30px" }} className={styles.marginTop_0}>
                Laboratorio de I+D para la evaluación responsable de la
                investigación en Colombia.
              </h2>
            </div>
          </Col>
          <Col sm={24} xl={12} xxl={12} id={styles.card_container}>
            <Card size="small" hoverable>
              <h3 className={styles.marginTop_0}>
                La información puede ser consultada por autores, instituciones,
                unidades académicas, subunidades académicas, grupos de
                investigación, productos, proyectos, convenios y
                emprendimientos.
              </h3>
              <div id={"searchbar_container"}>
                <Suspense>
                  <SearchBar />
                </Suspense>
              </div>
              <div id={styles.table_container}>
                <HomeTable />
              </div>
              <p id={styles.disclaimer}>
                * Los indicadores aquí presentados buscan cumplir con los
                principios de métricas responsables, para más información sigue
                este{" "}
                <Link href="/metrics">
                  enlace.
                  <LinkOutlined />
                </Link>
              </p>
            </Card>
          </Col>
        </Row>
      </div>
      <br />
      <Row
        justify="center"
        align="middle"
        id={styles.cta}
        className={styles.margin_top_50}
      >
        <Col xs={24} md={10} lg={8} xl={7} xxl={5}>
          <Image
            id={styles.manual_cover}
            priority={true}
            src="/media/manual_cover.png"
            alt="Logo ImpactU"
            width={297}
            height={385}
            quality={100}
          />
        </Col>
        <Col xs={24} md={9} lg={7} xl={6} xxl={4}>
          <h2>
            ¿Quieres descubrir todo lo que <b id={styles.impact}>Impact</b>
            <b id={styles.u}>U</b> tiene para ofrecerte?
          </h2>
          <DownloadOutlined />{" "}
          <a href="/files/Manual_impactu.pdf" download="Manual ImpactU.pdf">
            Descarga nuestro manual completo en formato PDF aquí.
          </a>
          <div style={{ marginTop: "20px" }}>
            <LinkOutlined />{" "}
            <Link href="/manual">O visita nuestro manual en línea aquí.</Link>
          </div>
        </Col>
        <Row justify={"center"} className={styles.margin_top_50}>
          <Col xs={24} md={16} style={{ textAlign: "center" }}>
            <h1>
              Si deseas mejorar tus datos institucionales en{" "}
              <b id={styles.impact}>Impact</b>
              <b id={styles.u}>U</b>, puedes ponerte en contacto con nosotros:
              grupocolav@udea.edu.co.
            </h1>
            <br />
            <DownloadOutlined />{" "}
            <a
              href="/files/Formato_Obtencion_Datos_Institucionales.pdf"
              download="Formato_Obtencion_Datos_Institucionales.pdf"
            >
              Descarga nuestro formato para la obtención de información básica
              institucional.
            </a>
          </Col>
        </Row>
      </Row>
    </>
  );
}
