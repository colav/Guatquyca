/* Components */
import TabAlianzas from "./TabAlianzas";
import TabDatos from "./TabDatos";
import TabFuentes from "./TabFuentes";
import TabPresentacion from "./TabPresentacion";
import TabPrincipios from "./TabPrincipios";

/* UI Library Components */
import { Col, Divider, Row, Tabs } from "antd";

export const metadata = {
  title: "Acerca de ImpactU",
  description:
    "ImpactU es un laboratorio de I+D que impulsa la evaluación responsable de la investigación en Colombia. Nuestra plataforma CRIS facilita la gestión científica con un enfoque en ciencia abierta y diversidad.",
};

const items = [
  {
    key: "1",
    label: "Presentación",
    children: <TabPresentacion />,
  },
  {
    key: "2",
    label: "Fuentes de información y entidades",
    children: <TabFuentes />,
  },
  {
    key: "3",
    label: "Nuestros datos",
    children: <TabDatos />,
  },
  {
    key: "4",
    label: "Alianzas y proyectos",
    children: <TabAlianzas />,
  },
  {
    key: "5",
    label: "Principios",
    children: <TabPrincipios />,
  },
];

/**
 * About is a "server-side" function component that displays the "About" page.
 *
 * @returns {JSX.Element} A static page with components from Ant Design library that contains
 * information about ImpactU and a list of logos.
 */
export default function About() {
  return (
    <Row justify="center">
      <Col xs={24} md={16}>
        <h1 style={{ textAlign: "center" }}>Acerca de ImpactU</h1>
        <Divider />
      </Col>
      <Col xs={24} md={16}>
        <Tabs defaultActiveKey="1" items={items} centered />
      </Col>
    </Row>
  );
}
