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
 * ProductsOnEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, charts, and a work list.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function ProductsOnEntityPage({ searchParams, params }) {
  const filteredPlots = plotListFilter(params.entity);
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <FilterPanel />
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
      <Suspense fallback={<Loading />} key={key}>
        <WorkList
          searchParams={searchParams}
          params={params}
          entity="affiliation"
        />
      </Suspense>
    </div>
  );
}
