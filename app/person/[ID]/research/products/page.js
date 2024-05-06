/* Components */
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import WorkListOnEntity from "@/app/components/ClientSide/WorkListOnEntity/WorkListOnEntity";
import DistributionChartsHandler from "@/app/components/ClientSide/Charts/DistributionCharts/DistributionChartsHandler";
import PercentageChartsHandler from "@/app/components/ClientSide/Charts/PercentageCharts/PercentageChartsHandler";
import MapChartsHandler from "@/app/components/ClientSide/Charts/MapCharts/MapChartsHandler";
import GraphChartsHandler from "@/app/components/ClientSide/Charts/GraphCharts/GraphChartsHandler";

/**
 * ProductsOnPersonPage is a server-side function component for displaying the products on a person page.
 *
 * @param {Object} params - The parameters for the person page.
 *
 * @returns {JSX.Element} A div element containing the TopMenu, ResearchTabs, and WorkListOnEntity components.
 * It also contains a set of charts rendered by the DistributionChartsHandler, PercentageChartsHandler, MapChartsHandler, and GraphChartsHandler components.
 */
export default function ProductsOnPersonPage({ params }) {
  return (
    <div>
      <TopMenu person={true} currentTab={"research"} />
      <ResearchTabs activeTab="products" />
      <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
        <Col xs={24} sm={24} md={12}>
          <DistributionChartsHandler entity="person" />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <PercentageChartsHandler entity="person" />
        </Col>
      </Row>
      <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
        <Col xs={24} sm={24} md={12}>
          <MapChartsHandler entity="person" />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <GraphChartsHandler entity="person" />
        </Col>
      </Row>
      <WorkListOnEntity params={params} />
    </div>
  );
}
