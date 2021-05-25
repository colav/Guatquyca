import React, { useEffect } from "react";

/* Components */
import AuthorsKeywords from "./AuthorsKeywords";
import ErrorWarning from "./ErrorWarning";
import LoadingCard from "./LoadingCard";

/* Constants */
import { APIKEY, DATA } from "../constants/routes";

/* Utilities */
import history from "../history";
import URLBuilder from "../helpers/URLBuilder";
import { APIRequest } from "../apis/clustercien";
import { Link } from "react-router-dom";
import { renderedAffiliation } from "../helpers/renderedAffiliation";
import { renderedTitle } from "../helpers/renderedTitle";
const queryString = require("query-string");

/* UI Library Components */
const Avatar = require("antd/lib/avatar").default;
const Card = require("antd/lib/card").default;
const List = require("antd/lib/list").default;

/* Icons */
const ReadOutlined = require("@ant-design/icons/ReadOutlined").default;

const SearchResultList = ({ core }) => {
  const [state, setUrl] = APIRequest(core.currentURL);
  const parsed = queryString.parse(core.currentURL);

  window.addEventListener("popstate", () => {
    core.setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    core.setCurrentURL(URLBuilder);
    setUrl(core.currentURL);
  }, [core.currentURL, setUrl, core.setCurrentURL, core]);

  const renderedItemName = (item) => {
    if (!item.abbreviations || item.abbreviations.length === 0) {
      return `${item.name || item.full_name}`;
    } else if (item.abbreviations.length === 1) {
      return `${item.name || item.full_name} (${item.abbreviations})`;
    }
    return null;
  };

  const onClick = (url) => {
    core.setCurrentURL(url);
  };

  const onPageChange = (page, pageSize) => {
    const parsed = queryString.parse(history.location.search);
    const newQuery = {
      ...parsed,
      max: pageSize.toString(),
      page: page.toString(),
    };
    history.push(
      `${history.location.pathname}?${queryString.stringify(newQuery)}`
    );
    core.setCurrentURL(URLBuilder);
  };

  const logoPathFinder = (item) => {
    if (item.affiliation && item.affiliation.logo_url) {
      return item.affiliation.logo_url;
    } else if (item.logo) {
      return item.logo;
    } else {
      return <ReadOutlined style={{ color: "gray", fontSize: "30px" }} />;
    }
  };

  if (!state.isLoading) {
    setTimeout(() => {
      core.setFilters(state.data.filters);
    }, 10);
  }

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return (
    <Card
      title={renderedTitle(parsed.data)}
      extra={
        state.data.total_results || state.data.count
          ? (state.data.total_results || state.data.count) + " resultados"
          : null
      }
      bodyStyle={{ padding: "15px 20px 25px 15px" }}
    >
      <List
        itemLayout="vertical"
        pagination={{
          size: "small",
          position: "bottom",
          total: state.data.total_results || state.data.count,
          onChange: onPageChange,
          hideOnSinglePage: true,
          current: parsed.page ? parseInt(parsed.page) : 1,
          pageSize: parsed.max ? parsed.max : 100,
        }}
        dataSource={state.data.data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar shape="square" size={60} src={logoPathFinder(item)} />
              }
              title={
                <Link
                  to={`/app/${parsed.data}?${APIKEY}&${DATA}&id=${item.id}`}
                  onClick={() =>
                    onClick(
                      `/app/${parsed.data}?${APIKEY}&${DATA}&id=${item.id}`
                    )
                  }
                >
                  {renderedItemName(item)}
                </Link>
              }
              description={
                item.affiliation
                  ? renderedAffiliation(
                      item.affiliation.name,
                      item.affiliation.id,
                      core.setCurrentURL
                    )
                  : ""
              }
            />
            {parsed.data === "authors" ? (
              <AuthorsKeywords keywords={item.keywords} />
            ) : null}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SearchResultList;
