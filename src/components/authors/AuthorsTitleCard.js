import React from "react";
import { APIKEY, DATA } from "../../constants/routes";
import { Link } from "react-router-dom";
import { renderedAffiliation } from "../../helpers/renderedAffiliation";
const Button = require("antd/lib/button").default;
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const TeamOutlined = require("@ant-design/icons/TeamOutlined").default;
const Typography = require("antd/lib/typography").default;

const AuthorsTitleCard = ({ state, setCurrentURL }) => {
  const URL = (type, id) => {
    if (type === "faculty") {
      return `/app/faculties?${APIKEY}&${DATA}&id=${id}`;
    }
    return `/app/${type}s?${APIKEY}&${DATA}&id=${id}`;
  };

  const renderedButtons = (URLList) => {
    return URLList.map((item) => (
      <Button key={item.source} href={item.url}>
        {item.source}
      </Button>
    ));
  };

  return (
    <Col
      xs={24}
      sm={24}
      md={18}
      lg={19}
      xl={20}
      xxl={21}
      style={{ padding: "0 5" }}
    >
      <Card
        actions={[
          <Link
            to={URL(state.group.type, state.group.id)}
            onClick={() => setCurrentURL(URL(state.group.type, state.group.id))}
          >
            <TeamOutlined /> {state.group.name}
          </Link>,
          <Link
            to={URL(state.department.type, state.department.id)}
            onClick={() =>
              setCurrentURL(URL(state.department.type, state.department.id))
            }
          >
            <TeamOutlined /> {state.department.name}
          </Link>,
          <Link
            to={URL(state.faculty.type, state.faculty.id)}
            onClick={() =>
              setCurrentURL(URL(state.faculty.type, state.faculty.id))
            }
          >
            <TeamOutlined /> {state.faculty.name}
          </Link>,
        ]}
      >
        <Typography.Title level={2}>
          {state.full_name}{" "}
          {state.country ? (
            <img
              style={{ paddingBottom: "3px" }}
              alt={`flag of ${state.country}`}
              title={state.country}
              src={`https://www.countryflags.io/${state.country_code}/flat/32.png`}
            />
          ) : (
            ""
          )}
        </Typography.Title>
        <Typography.Title level={3}>
          {renderedAffiliation(state.affiliation.name)}
        </Typography.Title>
        {renderedButtons(state.external_urls)}
      </Card>
    </Col>
  );
};

export default AuthorsTitleCard;
