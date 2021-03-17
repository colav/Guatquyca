import React, { useEffect } from "react";
import AuthorsKeywords from "./AuthorsKeywords";
import ErrorWarning from "./ErrorWarning";
import history from "../history";
import LoadingCard from "./LoadingCard";
import URLBuilder from "../helpers/URLBuilder";
import { APIKEY, DATA, LOGOUDEA } from "../constants/routes";
import { APIRequest } from "../apis/clustercien";
import { Link } from "react-router-dom";
import { renderedAffiliation } from "../helpers/renderedAffiliation";
import { renderedTitle } from "../helpers/renderedTitle";
const Avatar = require("antd/lib/avatar").default;
const Card = require("antd/lib/card").default;
const List = require("antd/lib/list").default;
const queryString = require("query-string");

const SearchResultList = ({ currentURL, setCurrentURL }) => {
  const [state, setUrl] = APIRequest(currentURL);
  const parsed = queryString.parse(currentURL);

  window.addEventListener("popstate", () => {
    setCurrentURL(URLBuilder);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentURL(URLBuilder);
    setUrl(currentURL);
  }, [currentURL, setUrl, setCurrentURL]);

  const renderedItemName = (item) => {
    if (!item.abbreviations || item.abbreviations.length === 0) {
      return `${item.name || item.full_name}`;
    } else if (item.abbreviations.length === 1) {
      return `${item.name || item.full_name} (${item.abbreviations})`;
    }
    return null;
  };

  const onClick = (url) => {
    setCurrentURL(url);
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
    setCurrentURL(URLBuilder);
  };

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
      bodyStyle={{ padding: "14px 8px" }}
    >
      <List
        itemLayout="vertical"
        size="large"
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
              avatar={<Avatar shape="square" size={60} src={LOGOUDEA} />}
              title={
                <Link
                  to={`/app/${parsed.data}?${APIKEY}&${DATA}&id=${item.id}`}
                >
                  <span
                    onClick={() =>
                      onClick(
                        `/app/${parsed.data}?${APIKEY}&${DATA}&id=${item.id}`
                      )
                    }
                  >
                    {renderedItemName(item)}
                  </span>
                </Link>
              }
              description={renderedAffiliation(
                state.data.filters.affiliations.length
                  ? state.data.filters.affiliations[0].name ||
                      item.affiliation.name
                  : "null"
              )}
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
