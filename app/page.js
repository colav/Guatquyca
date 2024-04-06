/* Components */
import HomeTable from "@/app/components/ServerSide/HomeTable/HomeTable";
import SearchBar from "@/app/components/ClientSide/SearchBar/SearchBar";
import Head from "@/app/components/ServerSide/Header/Header";

/* Icons */
import { LinkOutlined } from "@ant-design/icons";

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
      <Head />
      <div id={styles.content_container}>
        <Image
          priority={true}
          src={"/media/banner.svg"}
          alt="Colav texture"
          width={1920}
          height={1080}
          id={styles.banner}
        />
        <Row justify="space-around">
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
                <SearchBar />
              </div>
              <div id={styles.table_container}>
                <HomeTable />
              </div>
              <p id={styles.disclaimer}>
                * Los indicadores aquí presentados buscan cumplir con los
                principios de métricas responsables, para más información sigue
                este{" "}
                <Link href="/app/metrics">
                  enlace.
                  <LinkOutlined />
                </Link>
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
