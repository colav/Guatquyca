import React from "react";

/* UI Library Components */
import { Select } from "antd";

/* UI Library Sub-components */
const { Option } = Select;

const SortProduction = () => {
  const handleChange = (value) => {
    /* navigate(
      `${location.pathname}?data=affiliations&type=${type}&max=${max}&page=${page}&sort=${value}`
    ); */
  };

  return (
    <Select
      size="small"
      style={{ width: 145, marginLeft: "20px" }}
      defaultValue={"citations"}
      onChange={handleChange}
      disabled
    >
      <Option value="citations">Más citado</Option>
      <Option value="products">Mayor producción</Option>
    </Select>
  );
};

export default SortProduction;
