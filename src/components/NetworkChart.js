import React, { useEffect, useState } from "react";
import AnyChart from "anychart-react";
import ErrorWarning from "./ErrorWarning";
import history from "../history";
import LoadingCard from "./LoadingCard";
import { APIRequest } from "../apis/clustercien";
const Card = require("antd/lib/card").default;
const Col = require("antd/lib/col").default;
const notification = require("antd/lib/notification").default;
const queryString = require("query-string");

const NetworkChart = () => {
  let parsedGlobalURL = queryString.parse(history.location.search);
  parsedGlobalURL["data"] = "citations";
  const builtURL = `${history.location.pathname}?${queryString.stringify(
    parsedGlobalURL
  )}`;
  const [productionURL, setProductionURL] = useState(builtURL);
  const [state, setUrl] = APIRequest(builtURL);
  let parsedLocalURL = queryString.parseUrl(productionURL);

  useEffect(() => {
    setUrl(productionURL);
  }, [setUrl, productionURL]);

  /*   var data = {
    nodes: [
      { id: "Kate Austin", height: "30" },
      { id: "Reece Gray" },
      { id: "Darren Burch" },
      { id: "Leslie Bailey" },
      { id: "Nova Fisher" },

      { id: "Jack Austin", height: "50" },
      { id: "Jamie Montoya" },
      { id: "Sawyer Mack" },
      { id: "Hugo Love" },

      { id: "Sophie Lilly", height: "30" },
      { id: "Ivy Mcintyre" },
      { id: "Evie West" },

      { id: "Elsie Mcbride", height: "20" },
      { id: "Jude Mcbride" },
    ],

    edges: [
      { from: "Kate Austin", to: "Reece Gray", weight: 0.2, cited: "20" },
      { from: "Kate Austin", to: "Darren Burch", weight: 1, cited: "100" },
      { from: "Kate Austin", to: "Leslie Bailey", weight: 0.8, cited: "80" },
      { from: "Kate Austin", to: "Nova Fisher", weight: 1, cited: "100" },
      { from: "Kate Austin", to: "Jack Austin", weight: 0.9, cited: "90" },

      { from: "Jack Austin", to: "Jamie Montoya", weight: 0.2, cited: "20" },
      { from: "Jack Austin", to: "Sawyer Mack", weight: 0.9, cited: "90" },
      { from: "Jack Austin", to: "Hugo Love", weight: 0.1, cited: "10" },
      { from: "Jack Austin", to: "Sophie Lilly", weight: 0.3, cited: "30" },
      { from: "Jack Austin", to: "Elsie Mcbride", weight: 1, cited: "100" },

      { from: "Elsie Mcbride", to: "Jude Mcbride", weight: 0.5, cited: "50" },

      { from: "Sophie Lilly", to: "Ivy Mcintyre", weight: 0.76, cited: "76" },
      { from: "Sophie Lilly", to: "Evie West", weight: 0.98, cited: "98" },

      { from: "Sawyer Mack", to: "Jamie Montoya", weight: 0.9, cited: "90" },
    ],
  }; */

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  /* console.log(state.data.data.network); */
  let eCache = "";
  const openNotification = (e) => {
    console.log(e);
    if (e.index !== eCache.index) {
      eCache = e;
      notification.open({
        duration: 10,
        message: "Notification Title",
        description: e.id,
      });
    }
  };

  const complexSettings = {
    type: "graph",
    container: "container",
    data: state.data.data.network,
    background: {
      stroke: {
        color: "#EAEAE6",
      },
    },
    nodes: {
      selected: {
        fill: openNotification,
      },
      fill: "#FBDD7E",
      stroke: "1px white",
      tooltip: {
        format: "{%title}",
      },
      /* labels: {
        fontSize: 12,
        fontColor: "#0F1A24",
        format: "{%title}",
      }, */
      hovered: {
        fill: "#FFC820",
        stroke: "#39658C",
      },
    },
    edges: {
      /* stroke: (e) => `${data.edges[e.index].weight * 10} #eaeae6`, */
      tooltip: {
        format: "De: {%from}\nA: {%to}\nCitas: {%cited}",
      },
      /* hovered: {
        stroke: (e) => `${data.edges[e.index].weight * 10} #39658C`,
      }, */
    },
  };
  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
      <Card
        /* loading={state.isLoading} */
        title="Card title"
        bodyStyle={{ padding: "10px" }}
        hoverable
      >
        <Card
          bordered={false}
          type="inner"
          cover={
            <div id="container">
              <AnyChart
                {...complexSettings}
                style={{ transformOrigin: "250px 250px" }}
              />
            </div>
          }
          style={{ width: "100%", height: "350px" }}
        ></Card>
      </Card>
    </Col>
  );
};

export default NetworkChart;
