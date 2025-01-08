/* React */
import { Suspense } from "react";

/* Components */
import ChartsHandler from "@/app/components/ClientSide/Charts/ChartsHandler";
import FilterPanel from "@/app/components/ClientSide/Filters/FilterPanel";
import Loading from "@/app/loading";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";
import WorkList from "@/app/components/ServerSide/WorkList/WorkList";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import plotListFilter from "@/lib/Utils/plotListFilter";

/**
 * ProductsOnPersonPage is a server-side functional component that fetches data based on provided parameters and displays it using
 * various components including TopMenu, ResearchTabs, ChartsHandler, FilterPanel, and WorkList.
 *
 * @param {Object} searchParams - The search parameters used to fetch data.
 * @param {Object} params - The parameters used to fetch data.
 * @returns {JSX.Element} A fragment that contains a FilterPanel component, TopMenu component, ResearchTabs component, multiple ChartsHandler components,
 * and a Suspense component that wraps the WorkList component.
 */
export default function ProductsOnPersonPage({ searchParams, params }) {
  const filteredPlots = plotListFilter("person");
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <FilterPanel />
      <TopMenu person={true} currentTab={"research"} />
      <ResearchTabs activeTab="products" entity={"person"} />
      <Row gutter={15} style={{ marginBottom: "15px" }}>
        <Col xs={24} sm={24} md={12}>
          <ChartsHandler plotlist={filteredPlots.slice(0, 4)} />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ChartsHandler plotlist={filteredPlots.slice(4, 8)} />
        </Col>
      </Row>
      <Suspense fallback={<Loading />} key={key}>
        <WorkList searchParams={searchParams} params={params} entity="person" />
      </Suspense>
    </div>
  );
}
