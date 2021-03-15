import React, { useEffect, useState } from "react";
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
const Button = require("antd/lib/button").default;
const Card = require("antd/lib/card").default;
const List = require("antd/lib/list").default;
const queryString = require("query-string");

const SearchResultList = ({ currentURL, setCurrentURL }) => {
  const [buttonFlag, setButtonFlag] = useState(false);
  const [state, setUrl] = APIRequest(currentURL);
  const parsed = queryString.parse(currentURL);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentURL]);

  useEffect(() => {
    setCurrentURL(URLBuilder);
  }, [setCurrentURL]);

  useEffect(() => {
    setUrl(currentURL);
  }, [currentURL, setUrl]);

  const renderedItemName = (item) => {
    if (!item.abbreviations || item.abbreviations.length === 0) {
      return `${item.name || item.full_name}`;
    } else if (item.abbreviations.length === 1) {
      return `${item.name || item.full_name} (${item.abbreviations})`;
    }
    return null;
  };

  const onPageChange = (total, range) => {
    window.scrollTo(0, 0);
    if (
      total === range[1] &&
      state.data.total_results &&
      total !== state.data.total_results
    ) {
      setTimeout(() => {
        setButtonFlag(true);
      }, 100);
    } else {
      setTimeout(() => {
        setButtonFlag(false);
      }, 100);
    }
  };

  const loadMoreContent = () => {
    const currentPage = state.data.page;
    if (currentPage === 1) {
      history.push(currentURL + "&page=2");
      setCurrentURL(URLBuilder);
    } else {
      history.push(currentURL + (currentPage + 1).toString());
      setCurrentURL(URLBuilder);
    }
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
      actions={
        buttonFlag
          ? [
              <Button type="primary" onClick={() => loadMoreContent()}>
                Cargar más resultados
              </Button>,
            ]
          : null
      }
    >
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          size: "small",
          position: "bottom",
          hideOnSinglePage: true,
          showTotal: (total, range) => onPageChange(total, range),
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
                  {renderedItemName(item)}
                </Link>
              }
              description={renderedAffiliation(
                state.data.filters.affiliations.length
                  ? state.data.filters.affiliations[0].name
                  : "null"
              )}
            />
            {parsed.data === "author" ? (
              <AuthorsKeywords keywords={item.keywords} />
            ) : null}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default SearchResultList;
