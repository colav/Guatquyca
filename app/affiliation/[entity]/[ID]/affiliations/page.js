/* Components */
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
  // Filter out any keys that have a falsy value
  const keys = Object.keys(data).filter((key) => data[key]);

  return (
    <>
      <TopMenu currentTab="affiliations" />
      <Row style={{ marginTop: "15px" }} gutter={15}>
        {keys.map((item) => (
          <Col xs={24} md={24 / keys.length} key={item}>
            <ListCard type={SINGULAR[item]} list={data[item]} />
          </Col>
        ))}
      </Row>
    </>
  );
}
