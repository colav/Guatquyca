import React from "react";

/* Components */
import ErrorWarning from "../ErrorWarning";
import LoadingCard from "../LoadingCard";
import AuthorsHorizontalList from "../AuthorsHorizontalList";
import DocumentModal from "../DocumentModal";
import DownloadCSVButton from "../DownloadCSVButton";
import DownloadJSONButton from "../DownloadJSONButton";
import OpenAccessStatus from "../OpenAccessStatus";
import SortProduction from "../SortProduction";

/* Icons */
import { CitationsIcon } from "../../media/icons/citations";
import { CalendarOutlined, ReadOutlined } from "@ant-design/icons";

/* UI Library Components */
import { App, Card, List, Pagination, Space, Typography } from "antd";

/* Utilities */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/* UI Library Sub-components */
const { Link } = Typography;

const WorkList = ({ data }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pagination = {
    max: parseInt(searchParams.get("max")),
    page: parseInt(searchParams.get("page")),
  };
  const keywords = searchParams.get("keywords");
  const { modal } = App.useApp();

  const onPageChange = ({ page, max }) => {
    navigate(
      `${location.pathname}?data=work&max=${max}&page=${page}${
        keywords ? `&keywords=${keywords}` : ""
      }`
    );
    window.scrollTo(0, 0);
  };

  const docInfo = (title, id, status) => {
    modal.warning({
      width: "1200px",
      title: [
        title,
        " ",
        status ? <OpenAccessStatus status={status} key="0" /> : "",
      ],
      icon: null,
      okText: "Cerrar",
      content: <DocumentModal documentID={id} />,
      destroyOnClose: true,
      maskClosable: true,
      onOk() {},
    });
  };
  return (
    <Card
      style={{ marginTop: "15px" }}
      headStyle={{ backgroundColor: "#003e65", color: "white" }}
      title={"Artículos"}
      size="small"
      extra={
        data.total_results === 1
          ? `${data.total_results} resultado`
          : `${data.total_results} resultados`
      }
    >
      <List
        itemLayout="vertical"
        size="small"
        footer={
          <div style={{ textAlign: "end" }}>
            <Pagination
              size="small"
              total={data.total_results}
              onChange={(page, max) =>
                onPageChange({
                  page,
                  max,
                })
              }
              current={pagination.page}
              pageSize={pagination.max}
            />
          </div>
        }
        dataSource={data.data}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Space style={{ fontSize: 18 }}>
                {React.createElement(CalendarOutlined)}
                Publicado: {item.year_published}
              </Space>,
              <Space style={{ fontSize: 18 }}>
                {React.createElement(CitationsIcon)}
                {item?.citations_count[0]?.count === 1
                  ? `${item?.citations_count[0]?.count} citación`
                  : `${item?.citations_count[0]?.count} citaciones`}
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={[
                <Link
                  key="1"
                  onClick={() =>
                    docInfo(item.title, item.id, item.open_access_status)
                  }
                >
                  {item.title}
                </Link>,
                " ",
                item.open_access_status ? (
                  <OpenAccessStatus status={item.open_access_status} key="2" />
                ) : (
                  ""
                ),
              ]}
              description={
                <div>
                  <ReadOutlined /> {item.source.name}
                </div>
              }
            />
            Autores: {<AuthorsHorizontalList authors={item.authors} />}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default WorkList;
