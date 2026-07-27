/* Next.js */
import { notFound } from "next/navigation";

/* Components */
import AboutTabs from "../AboutTabs";
import { tabs, tabKeys } from "../tabs";

/* UI Library Components */
import { Col, Divider, Row } from "antd";

/**
 * Generates metadata for the About page based on the active tab.
 *
 * @param {Object} params - The parameters object containing the active tab.
 * @param {string} params.tab - The key of the active tab.
 * @returns
 */
export async function generateMetadata({ params }) {
  const tab = params?.tab;
  const currentTab = tabs.find((entry) => entry.key === tab);

  if (!currentTab) {
    return {
      title: "Acerca de ImpactU",
      description:
        "ImpactU es un laboratorio de I+D que impulsa la evaluación responsable de la investigación en Colombia.",
    };
  }

  return {
    title: `${currentTab.label} | ImpactU`,
    description:
      "ImpactU es un laboratorio de I+D que impulsa la evaluación responsable de la investigación en Colombia.",
  };
}

/**
 * Component for the About page.
 * @returns
 * The rendered component.
 */
export default function AboutTabPage({ params }) {
  const tab = params?.tab;

  if (!tabKeys.includes(tab)) {
    notFound();
  }

  return (
    <Row justify="center">
      <Col xs={24} md={16}>
        <h1 style={{ textAlign: "center" }}>Acerca de ImpactU</h1>
        <Divider />
      </Col>
      <Col xs={24} md={16}>
        <AboutTabs activeKey={tab} />
      </Col>
    </Row>
  );
}
