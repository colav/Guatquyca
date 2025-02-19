/* Components */
import ClientLogger from "@/lib/Utils/clientLogger";
import EmptyCard from "@/app/components/ClientSide/EmptyCard/EmptyCard";
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

  const participants = ["00jb9vg53", "03bp5hc83", "02xtwpk10", "05tkb8v92"];
  let keys = Object.keys(data).filter((key) => data[key]);
  if (!participants.includes(params.ID)) {
    keys = keys.filter((key) => key !== "faculties" && key !== "departments");
  }
  if (params.ID === "05tkb8v92") {
    keys = keys.filter((key) => key !== "departments");
  }

  return (
    <>
      <ClientLogger url={fullUrl} />
      <TopMenu currentTab="affiliations" />
      <Row style={{ marginTop: "15px" }} gutter={15} justify="center">
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
