/* React */
import { Suspense } from "react";

/* Components */
import ChartsHandler from "@/app/components/ClientSide/Charts/ChartsHandler";
import Loading from "@/app/loading";
import WorkList from "@/app/components/ServerSide/WorkList/WorkList";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import plotListFilter from "@/lib/utils/plotListFilter";

export default function ProductPage({ searchParams, params }) {
  const filteredPlots = plotListFilter("source");
  const key = JSON.stringify(searchParams);

  return (
    <div style={{ marginTop: "20px" }}>
      <div>
        <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
          <Col xs={24} sm={24} md={12}>
            <ChartsHandler plotlist={filteredPlots.slice(0, 4)} />
          </Col>
          <Col xs={24} sm={24} md={12}></Col>
        </Row>
      </div>
      <Suspense fallback={<Loading />} key={key}>
        <WorkList searchParams={searchParams} params={params} entity="source" />
      </Suspense>
    </div>
  );
}
