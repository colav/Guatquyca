import React from "react";

/* Constanst */
import { APIKEY, DATA } from "../../constants/routes";

/* Utilities */
import { Link } from "react-router-dom";
import { renderedAffiliation } from "../../helpers/renderedAffiliation";

/* Icons */
import orcid from "../../icons/orcid";
import researcherid from "../../icons/researcherid";
import scholar from "../../icons/scholar";
import scopus from "../../icons/scopus";
const TeamOutlined = require("@ant-design/icons/TeamOutlined").default;

/* UI Library Components */
const Button = require("antd/lib/button").default;
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const Space = require("antd/lib/space").default;
const Typography = require("antd/lib/typography").default;

const AuthorsTitleCard = ({ state, setCurrentURL }) => {
  const URL = (type, id) => {
    if (type === "faculty") {
      return `/app/faculties?${APIKEY}&${DATA}&id=${id}`;
    }
    return `/app/${type}s?${APIKEY}&${DATA}&id=${id}`;
  };

  const iconList = {
    orcid: orcid(),
    scholar: scholar(),
    scopus: scopus(),
    researcherid: researcherid(),
  };

  const renderedButtons = (URLList) => {
    return URLList.map((item) => (
      <Button
        type="link"
        key={item.source}
        href={item.url}
        icon={iconList[item.source]}
      />
    ));
  };

  const renderedActions = [
    Object.keys(state.faculty).length > 0 ? (
      <Link
        to={URL(state.faculty.type, state.faculty.id)}
        onClick={() => setCurrentURL(URL(state.faculty.type, state.faculty.id))}
      >
        <TeamOutlined /> {state.faculty.name}
      </Link>
    ) : (
      ""
    ),
    Object.keys(state.department).length > 0 ? (
      <Link
        to={URL(state.department.type, state.department.id)}
        onClick={() =>
          setCurrentURL(URL(state.department.type, state.department.id))
        }
      >
        <TeamOutlined /> {state.department.name}
      </Link>
    ) : (
      ""
    ),
    Object.keys(state.group).length > 0 ? (
      <Link
        to={URL(state.group.type, state.group.id)}
        onClick={() => setCurrentURL(URL(state.group.type, state.group.id))}
      >
        <TeamOutlined /> {state.group.name}
      </Link>
    ) : (
      ""
    ),
  ];

  return (
    <Col xs={24} sm={24} md={18} lg={19} xl={20} xxl={21}>
      <Card actions={renderedActions}>
        <Typography.Title level={2}>
          {state.full_name}{" "}
          {state.country ? (
            <img
              style={{ paddingBottom: "3px" }}
              alt={`flag of ${state.country}`}
              title={state.country}
              src={`https://flagcdn.com/28x21/${state.country_code.toLowerCase()}.png`}
            />
          ) : (
            ""
          )}
        </Typography.Title>
        <Space wrap>{renderedButtons(state.external_urls)}</Space>
        <Typography.Title level={3}>
          {renderedAffiliation(state.affiliation.name, setCurrentURL)}
        </Typography.Title>
      </Card>
    </Col>
  );
};

export default AuthorsTitleCard;
