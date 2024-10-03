/* Components */
import ClientLogger from "@/lib/Utils/clientLogger";
import EmptyAffiliations from "@/app/components/ClientSide/EmptyAffiliations/EmptyAffiliations";
import ListCard from "@/app/components/ClientSide/ListCard/ListCard";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* Lib */
import getData from "@/lib/APIS/api";

/* UI Library Components */
import { Col, Row } from "antd";

/* Utilities */
import { SINGULAR } from "@/lib/constants";

/**
 * Page is an asynchronous function component that fetches data based on provided parameters
 * and displays it using the TopMenu and ListCard components. If no data is found, it displays
 * the EmptyAffiliations component.
 *
 * @component
 * @param {Object} params - The parameters used to fetch data.
 * @param {string} params.entity - The entity type to fetch data for.
 * @param {string} params.ID - The ID of the entity to fetch data for.
 * @returns {JSX.Element} A fragment that contains a TopMenu component and a Row component that
 * maps over the fetched data to display a ListCard component for each item, or an EmptyAffiliations
 * component if no data is found.
 * @example
 * return (
 *   <Page params={{ entity: "institution", ID: "12345" }} />
 * )
 */
export default async function AffiliationsPage({ params }) {
  const URL = `/app/affiliation/${params.entity}/${params.ID}/affiliations`;
  const { data, fullUrl } = await getData(URL);

  /* let keys = Object.keys(data).filter((key) => data[key].length > 0); */
  let keys = Object.keys(data).filter((key) => data[key]);
  if (params.ID === "66f6f44899b6ea475f3be52f") {
    keys = keys.filter((key) => key !== "departments");
  }

  return (
    <>
      <ClientLogger url={fullUrl} />
      <TopMenu currentTab="affiliations" />
      <Row style={{ marginTop: "15px" }} gutter={15} justify="center">
        {keys.length === 0 ? (
          <EmptyAffiliations />
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
