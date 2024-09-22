/* Components */
import ChartsHandler from "@/app/components/ClientSide/Charts/ChartsHandler";
import ProductsList from "@/app/components/ClientSide/InvestigationLists/ProductsList";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import plotListFilter from "@/lib/Utils/plotListFilter";

/**
 * ProductsOnEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, charts, and a work list.
 *
 * @component
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.entity - The entity for which the products are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default function ProductsOnEntityPage({ params }) {
  const filteredPlots = plotListFilter(params.entity);

  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="products" entity={params.entity} />
      <div>
        <Row gutter={15} style={{ marginBottom: "15px" }}>
          <Col xs={24} sm={24} md={12}>
            <ChartsHandler plotlist={filteredPlots.slice(0, 4)} />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <ChartsHandler plotlist={filteredPlots.slice(4, 8)} />
          </Col>
        </Row>
      </div>
      <ProductsList />
    </div>
  );
}
