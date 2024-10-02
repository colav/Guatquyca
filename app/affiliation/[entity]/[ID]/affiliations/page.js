/* Components */
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
 * Page is an asynchronous function component that fetches data based on provided parameters and displays it using
 * the TopMenu and ListCard components.
 *
 * @param {Object} params - The parameters used to fetch data.
 * @returns {JSX.Element} A fragment that contains a TopMenu component and a Row component that maps over the
 * fetched data to display a ListCard component for each item.
 */
export default async function Page({ params }) {
  const URL = `/app/affiliation/${params.entity}/${params.ID}/affiliations`;
  const data = await getData(URL);
  let keys = Object.keys(data).filter((key) => data[key].length > 0);

  if (params.ID === "66b583a37102ee7e0fcda11d") {
    keys = keys.filter((key) => key !== "departments");
  }

  return (
    <>
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
