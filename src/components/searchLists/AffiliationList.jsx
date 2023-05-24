import React from "react";

/* Components */
import SortSearchResults from "../SortSearchResults";

/* Hooks */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/* Icons */
import { CalendarOutlined } from "@ant-design/icons";
import { CitationsIcon } from "../../media/icons/citations";

/* UI Library Components */
import { Avatar, Card, Col, List, Row, Space } from "antd";

/* Utilities */
import { Link } from "react-router-dom";
import { TITLES } from "../../utils/constants";

const AffiliationList = ({ data, type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pagination = {
    max: parseInt(searchParams.get("max")),
    page: parseInt(searchParams.get("page")),
  };

  const onPageChange = ({ page, max }) => {
    navigate(
      `${location.pathname}?data=affiliations&type=${type}&max=${max}&page=${page}`
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
              <SortSearchResults key="1" />
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
              <List.Item
                actions={[
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CalendarOutlined)}
                    Publicaciones:{" "}
                    {item.papers_count ||
                      item.products_count ||
                      "No disponible"}
                  </Space>,
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CitationsIcon)}
                    Citado: {item.citations_count || "No disponible"}
                  </Space>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      className="avatar"
                      size={{ xs: 40, sm: 50, md: 60, lg: 60, xl: 60, xxl: 60 }}
                    >
                      {item.name?.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <>
                      <Link
                        className="searchResult--link"
                        to={`/app/${type}?id=${item._id}`}
                      >
                        {item.name}
                      </Link>
                    </>
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

export default AffiliationList;
