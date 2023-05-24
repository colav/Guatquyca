import React from "react";

/* Components */
import AffiliationLinks from "../AffiliationLinks";
import ExternalProfiles from "../ExternalProfiles";
import SortSearchResults from "../SortSearchResults";

/* Hooks */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/* Icons */
import { FileOutlined } from "@ant-design/icons";
import { CitationsIcon } from "../../media/icons/citations";

/* UI Library Components */
import { Avatar, Card, Col, List, Row, Statistic, Typography } from "antd";

/* Utilities */
import { Link } from "react-router-dom";
import { TITLES } from "../../utils/constants";

const PersonList = ({ data, type, tools }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pagination = {
    max: parseInt(searchParams.get("max")),
    page: parseInt(searchParams.get("page")),
  };
  const keywords = searchParams.get("keywords");

  const onPageChange = ({ page, max }) => {
    navigate(
      `${location.pathname}?data=person&max=${max}&page=${page}${
        keywords ? `&keywords=${keywords}` : ""
      }`
    );
    window.scrollTo(0, 0);
  };

  return (
    <Row align="center">
      <Col span={24}>
        <Card
          headStyle={{
            backgroundColor: "#003e65",
            color: "white",
            fontSize: "18px",
          }}
          bodyStyle={{ padding: "10px 0 10px 10px" }}
          title={TITLES[type]}
          extra={
            <div>
              <p className="white-text">
                {data.total_results === 1
                  ? `${data.total_results} resultado`
                  : `${data.total_results} resultados`}
              </p>
              <SortSearchResults tools={tools} key="1" />
            </div>
          }
        >
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data.data}
            pagination={{
              size: "small",
              position: "bottom",
              total: data.total_results,
              onChange: (page, max) =>
                onPageChange({
                  page,
                  max,
                }),
              hideOnSinglePage: true,
              current: pagination.page,
              pageSize: pagination.max,
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      className="avatar"
                      shape="square"
                      size={{
                        xs: 40,
                        sm: 50,
                        md: 60,
                        lg: 60,
                        xl: 60,
                        xxl: 70,
                      }}
                    >
                      {item.name?.charAt(0) || item.full_name?.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <>
                      <Link
                        className="searchResult--link"
                        to={`/app/${type}?id=${item._id}`}
                      >
                        {item.name || item.full_name}
                      </Link>
                    </>
                  }
                  description={
                    <Row align={"top"} gutter={[30, 10]}>
                      <Col xs={24} lg={6}>
                        {item?.affiliations?.length ? (
                          <AffiliationLinks affList={item.affiliations} />
                        ) : (
                          "No disponible"
                        )}
                      </Col>
                      <Col xs={24} lg={6}>
                        <ExternalProfiles idsList={item.external_ids} />
                      </Col>
                      <Col xs={24} lg={6}>
                        <Typography.Title
                          className="bold"
                          level={4}
                          style={{ margin: 0, color: "gray" }}
                        >
                          {React.createElement(FileOutlined)} Publicaciones:{" "}
                        </Typography.Title>
                        <Statistic
                          value={
                            item.papers_count ||
                            item.products_count ||
                            "No disponible"
                          }
                        />
                      </Col>
                      <Col xs={24} lg={6}>
                        <Typography.Title
                          className="bold"
                          level={4}
                          style={{ margin: 0, color: "gray" }}
                        >
                          {React.createElement(CitationsIcon)} Citado:{" "}
                        </Typography.Title>
                        <Statistic
                          value={item.citations_count || "No disponible"}
                        />
                      </Col>
                    </Row>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PersonList;
