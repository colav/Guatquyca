/* Components */
import DistributionChartsHandler from "@/app/components/ClientSide/Charts/DistributionCharts/DistributionChartsHandler";
import GraphChartsHandler from "@/app/components/ClientSide/Charts/GraphCharts/GraphChartsHandler";
import MapChartsHandler from "@/app/components/ClientSide/Charts/MapCharts/MapChartsHandler";
import PercentageChartsHandler from "@/app/components/ClientSide/Charts/PercentageCharts/PercentageChartsHandler";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";
import WorkListOnEntity from "@/app/components/ClientSide/WorkListOnEntity/WorkListOnEntity";

/* UI Library Components */
import { Col, Row } from "antd";

/**
 * ProductsOnEntityPage is a server-side function component for displaying the products on an entity page.
 *
 * @param {Object} params - The parameters for the entity page.
 *
 * @returns {JSX.Element} A div element containing the TopMenu, ResearchTabs, and WorkListOnEntity components.
 * Depending on the entity type, it also contains a set of charts rendered by the DistributionChartsHandler,
 * PercentageChartsHandler, and MapChartsHandler components.
 */
export default function ProductsOnEntityPage({ params }) {
  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="products" />
      {params.entity === "institution" ? (
        <div>
          <Row gutter={15} style={{ marginBottom: "15px" }}>
            <Col xs={24} sm={24} md={8}>
              <DistributionChartsHandler entity={params.entity} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <PercentageChartsHandler entity={params.entity} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <MapChartsHandler entity={params.entity} />
            </Col>
            {/* <Col xs={24} sm={24} md={12}>
              <GraphChartsHandler entity={params.entity} />
            </Col> */}
          </Row>
        </div>
      ) : (
        <div>
          <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
            <Col xs={24} sm={24} md={8}>
              <DistributionChartsHandler entity={params.entity} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <PercentageChartsHandler entity={params.entity} />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <MapChartsHandler entity={params.entity} />
            </Col>
          </Row>
        </div>
      )}
      <WorkListOnEntity params={params} />
    </div>
  );
}
