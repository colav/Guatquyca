import React, { useState } from "react";
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../../constants/routes";
const List = require("antd/lib/list").default;
const Card = require("antd/lib/card").default;

const TabListsCard = ({ tabObjects, tabContent, setCurrentURL }) => {
  const [selectedKey, setSelectedKey] = useState(tabObjects[0].key);
  const onSelectedKey = (key) => {
    setSelectedKey(key);
  };

  return (
    <Card
      style={{ width: "100%" }}
      size="small"
      tabList={tabObjects}
      activeTabKey={selectedKey}
      onTabChange={(key) => onSelectedKey(key)}
    >
      <List
        size="small"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
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
  );
};

export default TabListsCard;
