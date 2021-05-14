import React from "react";

/* Utilities */
import history from "../history";
const queryString = require("query-string");

/* UI Library Components */
const Select = require("antd/lib/select").default;

const { Option } = Select;

const SortProduction = ({ core, setKey }) => {
  function handleChange(value) {
    let parsedQueryURL = queryString.parse(history.location.search);
    let filteredURL = history.location.pathname;
    if ("sort" in parsedQueryURL) {
      parsedQueryURL["sort"] = value;
      filteredURL += `?${queryString.stringify(parsedQueryURL)}`;
    } else {
      filteredURL += `${history.location.search}&sort=${value}`;
    }
    history.push(filteredURL);
    core.setCurrentURL(filteredURL);
    setKey("4");
  }

  return (
    <Select
      size="small"
      placeholder="Organizar"
      style={{ width: 115, marginLeft: "20px" }}
      onChange={handleChange}
    >
      <Option value="citations">Más citado</Option>
      <Option value="year">Más reciente</Option>
    </Select>
  );
};

export default SortProduction;
