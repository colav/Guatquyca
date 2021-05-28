import React from "react";

/* Components */
import AuthorsHorizontalList from "./AuthorsHorizontalList";
import DocumentModal from "./DocumentModal";
import DownloadCSVButton from "./DownloadCSVButton";
import DownloadJSONButton from "./DownloadJSONButton";
import OpenAccessStatus from "./OpenAccessStatus";
import SortProduction from "./SortProduction";

/* Utilities */
import { renderedTitle } from "../helpers/renderedTitle";
import { onPageChange } from "../helpers/onPageChange";

/* Icons */
import { CitationsIcon } from "../icons/citations";
const CalendarOutlined = require("@ant-design/icons/CalendarOutlined").default;
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

/* UI Library Components */
const Card = require("antd/lib/card").default;
const List = require("antd/lib/list").default;
const Modal = require("antd/lib/modal").default;
const Space = require("antd/lib/space").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components */
const { Link } = Typography;

const DocumentList = ({ data, core, type, setKey, parsedURL }) => {
  const docInfo = (title, id, status) => {
    Modal.info({
      width: "1200px",
      title: [
        title,
        " ",
        status ? <OpenAccessStatus status={status} key="0" /> : "",
      ],
      closable: true,
      icon: null,
      okText: "Cerrar",
      content: <DocumentModal documentID={id} />,
      onOk() {},
    });
  };

  return (
    <Card
      size="small"
      extra={[
        data.total_results ? data.total_results + " resultado(s)" : null,
        <SortProduction key="1" core={core} setKey={setKey} />,
      ]}
      actions={
        data.total_results > 0
          ? [
              <DownloadCSVButton key="1" data={data.data} />,
              <DownloadJSONButton key="2" data={data.data} />,
            ]
          : ""
      }
      title={`Producción ${renderedTitle(type)}`}
    >
      <div id="productionListContainer">
        <List
          itemLayout="vertical"
          size="small"
          pagination={{
            size: "small",
            position: "bottom",
            total: data.total_results,
            onChange: (page, pageSize) =>
              onPageChange({
                page,
                pageSize,
                setCurrentURL: core.setCurrentURL,
              }),
            hideOnSinglePage: true,
            current: parseInt(parsedURL.page),
            pageSize: parsedURL.max,
          }}
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
                  {item.citations_count === 1
                    ? `${item.citations_count} citación`
                    : `${item.citations_count} citaciones`}
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
                    <OpenAccessStatus
                      status={item.open_access_status}
                      key="2"
                    />
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
              Autores: {AuthorsHorizontalList(item.authors, core.setCurrentURL)}
            </List.Item>
          )}
        ></List>
      </div>
    </Card>
  );
};

export default DocumentList;
