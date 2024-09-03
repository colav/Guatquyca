/* Components */
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* UI Library Components */
import { Col, Row } from "antd";

/* Components */
import ChartsHandler from "@/app/components/ClientSide/Charts/ChartsHandler";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import WorkListOnEntity from "@/app/components/ClientSide/WorkListOnEntity/WorkListOnEntity";

/* Utilities */
import plotListFilter from "@/lib/Utils/plotListFilter";

/**
 * ProductsOnPersonPage is a server-side function component for displaying the products on a person page.
 *
 * @param {Object} params - The parameters for the person page.
 *
 * @returns {JSX.Element} A div element containing the TopMenu, ResearchTabs, and WorkListOnEntity components.
 * It also contains a set of charts rendered by the DistributionChartsHandler, PercentageChartsHandler, MapChartsHandler, and GraphChartsHandler components.
 */
export default function ProductsOnPersonPage({ params }) {
  const filteredPlots = plotListFilter("person");

  return (
    <div>
      <TopMenu person={true} currentTab={"research"} />
      <ResearchTabs activeTab="products" />
      <Row gutter={15} style={{ marginBottom: "15px" }}>
        <Col xs={24} sm={24} md={12}>
          <ChartsHandler plotlist={filteredPlots.slice(0, 4)} />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ChartsHandler plotlist={filteredPlots.slice(4, 8)} />
        </Col>
      </Row>
      <WorkListOnEntity params={params} />
    </div>
  );
}
