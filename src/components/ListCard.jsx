import React from "react";

/* Utilities */
import { Link } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";
import { renderedTitle } from "../helpers/renderedTitle";

/* UI Library Components */
const Card = require("antd/lib/card").default;
const List = require("antd/lib/list").default;

const ListCard = ({ title, list, setCurrentURL }) => {
  return (
    <Card size="small" style={{ height: "431px" }} title={renderedTitle(title)}>
      <div
        style={{ height: "359px", overflow: "auto" }}
        id="listOverflowContainer"
      >
        <List
          size="small"
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                id={item.id}
                description={
                  <Link
                    to={`/app/${title}?${APIKEY}&${DATA}&id=${item.id}`}
                    onClick={() =>
                      setCurrentURL(
                        `/app/${title}?${APIKEY}&${DATA}&id=${item.id}`
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
      </div>
    </Card>
  );
};

export default ListCard;
