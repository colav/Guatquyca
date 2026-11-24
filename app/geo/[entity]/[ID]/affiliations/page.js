/* Components */
import ClientLogger from "@/lib/utils/clientLogger";
import EmptyCard from "@/app/components/ClientSide/EmptyCard/EmptyCard";
import ListCard from "@/app/components/ClientSide/ListCard/ListCard";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* Lib */
import getData from "@/lib/apis/server.api";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import { SINGULAR } from "@/lib/constants";

/**
 * GeoAffiliationsPage lists the institutions, groups (and cities, for a state)
 * that belong to a city or a state.
 *
 * @param {Object} params - Should include 'entity' ("city" or "state") and 'ID'.
 * @returns {JSX.Element} The top menu and a card per non-empty list.
 */
export default async function GeoAffiliationsPage({ params }) {
  const URL = `/geo/${params.entity}/${params.ID}/affiliations`;
  const { data, fullUrl } = await getData(URL);

  const keys = Object.keys(data).filter(
    (key) => Array.isArray(data[key]) && data[key].length > 0,
  );

  return (
    <>
      <ClientLogger url={fullUrl} />
      <TopMenu geo currentTab="affiliations" />
      <Row style={{ marginTop: "15px" }} gutter={[15, 15]} justify="center">
        {keys.length === 0 ? (
          <EmptyCard />
        ) : (
          keys.map((item) => (
            <Col xs={24} md={24 / keys.length} key={item}>
              <ListCard type={SINGULAR[item]} list={data[item]} />
            </Col>
          ))
        )}
      </Row>
    </>
  );
}
