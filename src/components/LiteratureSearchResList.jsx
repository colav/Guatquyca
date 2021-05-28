import React from "react";

/* Components */
import DocumentModal from "./DocumentModal";

/* Utilities */
import { renderedTitle } from "../helpers/renderedTitle";
import { onPageChange } from "../helpers/onPageChange";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const Modal = require("antd/lib/modal").default;
const List = require("antd/lib/list").default;
const Typography = require("antd/lib/typography").default;

const LiteratureSearchResList = ({ data, parsed, setCurrentURL }) => {
  const docInfo = (title, id, status) => {
    Modal.info({
      width: "1200px",
      title: [title],
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
      title={renderedTitle(parsed.data)}
      extra={
        data.total_results || data.count
          ? (data.total_results || data.count) + " resultados"
          : null
      }
      bodyStyle={{ padding: "15px 20px 25px 15px" }}
    >
      <List
        itemLayout="vertical"
        pagination={{
          size: "small",
          position: "bottom",
          total: data.total_results || data.count,
          onChange: (page, pageSize) =>
            onPageChange({ page, pageSize, setCurrentURL: setCurrentURL }),
          hideOnSinglePage: true,
          current: parsed.page ? parseInt(parsed.page) : 1,
          pageSize: parsed.max ? parsed.max : 100,
        }}
        dataSource={data.data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Typography.Link
                  key="1"
                  onClick={() =>
                    docInfo(item.title, item.id, item.open_access_status)
                  }
                >
                  {item.title}
                </Typography.Link>
              }
              /* description={
                item.affiliation
                  ? renderedAffiliation(
                      item.affiliation.name,
                      item.affiliation.id,
                      core.setCurrentURL
                    )
                  : ""
              } */
            />
            {/* {parsed.data === "authors" ? (
              <AuthorsKeywords keywords={item.keywords} />
            ) : null} */}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default LiteratureSearchResList;
