import React from "react";

/* Icons */
import { BankOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Typography, Tooltip } from "antd";

/* Utilities */
import { Link } from "react-router-dom";

const AffiliationLinks = ({ affList }) => {
  const dateBuilder = (unixTimestamp) => {
    return unixTimestamp === -1
      ? "No disponible"
      : new Date(parseInt(unixTimestamp) * 1000).toLocaleDateString();
  };

  const TooltipBuilder = ({ start_date, end_date }) => {
    <Tooltip
      title={
        <>
          <div>Fecha de inicio: {dateBuilder(start_date)}</div>
          <div>Fecha de finalización: {dateBuilder(end_date)}</div>
        </>
      }
    />;
  };

  return (
    <>
      <Typography.Title
        className="bold"
        level={4}
        style={{ margin: 0, color: "gray" }}
      >
        <BankOutlined /> Afiliaciones:
      </Typography.Title>
      {affList.map((item) => {
        if (item.types[0]?.type === "group") {
          return (
            <div key={item.id}>
              <Tooltip
                title={
                  <>
                    <div>Fecha de inicio: {dateBuilder(item.start_date)}</div>
                    <div>
                      Fecha de finalización: {dateBuilder(item.end_date)}
                    </div>
                  </>
                }
              >
                <Link
                  className="affiliation--link"
                  to={`/app/affiliations?type=group&id=${item.id}`}
                >
                  {item.name}
                </Link>
              </Tooltip>
            </div>
          );
        } else if (item.types[0]?.type === "department") {
          return (
            <div key={item.id}>
              <Tooltip
                title={
                  <>
                    <div>Fecha de inicio: {dateBuilder(item.start_date)}</div>
                    <div>
                      Fecha de finalización: {dateBuilder(item.end_date)}
                    </div>
                  </>
                }
              >
                <Link
                  className="affiliation--link"
                  to={`/app/affiliations?type=department&id=${item.id}`}
                >
                  {item.name}
                </Link>
              </Tooltip>
            </div>
          );
        } else if (item.types[0]?.type === "faculty") {
          return (
            <div key={item.id}>
              <Tooltip
                title={
                  <>
                    <div>Fecha de inicio: {dateBuilder(item.start_date)}</div>
                    <div>
                      Fecha de finalización: {dateBuilder(item.end_date)}
                    </div>
                  </>
                }
              >
                <Link
                  className="affiliation--link"
                  to={`/app/affiliations?type=faculty&id=${item.id}`}
                >
                  {item.name}
                </Link>
              </Tooltip>
            </div>
          );
        } else
          return (
            <div key={item.id}>
              <Tooltip
                title={
                  <>
                    <div>Fecha de inicio: {dateBuilder(item.start_date)}</div>
                    <div>
                      Fecha de finalización: {dateBuilder(item.end_date)}
                    </div>
                  </>
                }
              >
                <Link
                  className="affiliation--link"
                  to={`/app/affiliations?type=institution&id=${item.id}`}
                >
                  {item.name}
                </Link>
              </Tooltip>
            </div>
          );
      })}
    </>
  );
};

export default AffiliationLinks;
