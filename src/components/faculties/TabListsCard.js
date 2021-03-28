import React, { useState } from "react";
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../../constants/routes";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const List = require("antd/lib/list").default;

const TabListsCard = ({ tabObjects, tabContent, setCurrentURL }) => {
  const [selectedKey, setSelectedKey] = useState(tabObjects[0].key);
  const onSelectedKey = (key) => {
    setSelectedKey(key);
  };

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card
        style={{ height: "431px" }}
        size="small"
        tabList={tabObjects}
        activeTabKey={selectedKey}
        onTabChange={(key) => onSelectedKey(key)}
      >
        <List
          size="small"
          pagination={{
            pageSize: 7,
            simple: true,
            position: "bottom",
            hideOnSinglePage: true,
          }}
          dataSource={tabContent[selectedKey]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                id={item.id}
                description={
                  <Link
                    to={`/app/${selectedKey}?${APIKEY}&${DATA}&id=${item.id}`}
                    onClick={() =>
                      setCurrentURL(
                        `/app/${selectedKey}?${APIKEY}&${DATA}&id=${item.id}`
                      )
                    }
                  >
                    {item.full_name}
                    {item.name}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </Col>
  );
};

export default TabListsCard;
