/* Components */
import CooperationTabs from "@/app/components/ClientSide/CooperationTabs/CooperationTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Col, Row } from "antd";
import BarChart from "@/app/components/ClientSide/Charts/DistributionCharts/BarChart";

/* Constants */
const CARD_HEADER_STYLE = {
  backgroundColor: "#003e65",
  color: "white",
  padding: "6px",
  overflow: "visible",
};
const CARD_BODY_STYLE = { padding: "10px", height: "420px" };

export default async function AgreementsPage({ params }) {
  let data = null;
  try {
    data = (await import(`@/lib/Data/${params.ID}.json`)).default;
  } catch (e) {
    console.error(`Could not load data for ID: ${params.ID}`, e);
  }

  return (
    <>
      <TopMenu currentTab={"cooperation"} />
      <CooperationTabs activeTab={"mobility"} entity={"affiliation"} />
      <div>
        <Row gutter={[15, 15]} style={{ marginBottom: "15px" }}>
          <Col xs={24} sm={24} md={12}>
            <Card
              size="small"
              styles={{
                header: CARD_HEADER_STYLE,
                body: CARD_BODY_STYLE,
              }}
              hoverable
              title="Movilidad por tipo de acuerdo"
            >
              <div className={styles.chart}>
                <BarChart data={data?.plots[0].plot} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card
              size="small"
              styles={{
                header: CARD_HEADER_STYLE,
                body: CARD_BODY_STYLE,
              }}
              hoverable
              title="Movilidad por Institución"
            >
              <div className={styles.chart}>
                <BarChart data={data?.plots[1].plot} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
