import React, { useState } from "react";

/* Utilities */
import history from "../history";
import moment from "moment";
import _ from "lodash";
const queryString = require("query-string");

/* UI Library Components */
const DatePicker = require("antd/lib/date-picker").default;
const Menu = require("antd/lib/menu").default;
const Tooltip = require("antd/lib/tooltip").default;

/* Icons */
const CalendarOutlined = require("@ant-design/icons/CalendarOutlined").default;

/* UI Library Sub-components*/
const { RangePicker } = DatePicker;
const { SubMenu } = Menu;

const YearsRangeFilter = (props) => {
  const [visible, setVisible] = useState(true);
  const subMenuProps = _.omit(props, "core", "setYears", "years");
  let parsedQueryURL = queryString.parse(history.location.search);

  if (props.core.filters.start_year && props.core.filters.end_year) {
    function disabledDate(current) {
      return (
        current < moment(props.core.filters.start_year, "YYYY") ||
        current > moment(props.core.filters.end_year, "YYYY")
      );
    }

    setTimeout(() => setVisible(false), 1200);

    const renderedDefaultValue = () => {
      if (
        "start_year" &&
        "end_year" in parsedQueryURL &&
        parsedQueryURL["start_year"] >= props.core.filters.start_year &&
        parsedQueryURL["end_year"] <= props.core.filters.end_year
      ) {
        return [
          moment(parsedQueryURL.start_year, "YYYY"),
          moment(parsedQueryURL.end_year, "YYYY"),
        ];
      } else if (
        "start_year" in parsedQueryURL &&
        parsedQueryURL["start_year"] >= props.core.filters.start_year
      ) {
        return [
          moment(parsedQueryURL.start_year, "YYYY"),
          moment(props.core.filters.end_year, "YYYY"),
        ];
      } else if (
        "end_year" in parsedQueryURL &&
        parsedQueryURL["end_year"] <= props.core.filters.end_year
      ) {
        return [
          moment(props.core.filters.start_year, "YYYY"),
          moment(parsedQueryURL.end_year, "YYYY"),
        ];
      } else {
        return [
          moment(props.core.filters.start_year, "YYYY"),
          moment(props.core.filters.end_year, "YYYY"),
        ];
      }
    };

    const onChange = (e) => {
      props.setYears({
        start_year: moment(e[0]).format("YYYY"),
        end_year: moment(e[1]).format("YYYY"),
      });
    };

    return (
      <SubMenu
        {...subMenuProps}
        icon={
          <Tooltip
            visible={visible}
            placement="right"
            title={"Nuevo filtro disponible"}
          >
            <CalendarOutlined style={{ color: "#B3FFB8" }} />
          </Tooltip>
        }
        title="Rango de años"
      >
        <Menu.Item>
          <RangePicker
            allowClear={false}
            format="YYYY"
            picker="year"
            suffixIcon=""
            defaultValue={renderedDefaultValue}
            onChange={onChange}
            disabledDate={disabledDate}
          />
        </Menu.Item>
      </SubMenu>
    );
  }

  return (
    <SubMenu
      {...subMenuProps}
      disabled
      icon={<CalendarOutlined />}
      title="Rango de Fechas"
    />
  );
};

export default YearsRangeFilter;
