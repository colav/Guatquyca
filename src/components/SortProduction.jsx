import React from 'react';

/* Utilities */

/* UI Library Components */
const Select = require('antd/lib/select').default;

const { Option } = Select;

const SortProduction = ({ parsedURL, setUrl, setProductionURL, core }) => {
  /* function handleChange(value) {
    let filteredURL = history.location.pathname;
    if ("sort" in parsedURL) {
      parsedURL["sort"] = value;
      filteredURL += `?${queryString.stringify(parsedURL)}`;
    } else {
      filteredURL += `?${queryString.stringify(parsedURL)}&sort=${value}`;
    }
    if (history.location.pathname === "/app/search") {
      history.push(filteredURL);
      core.setCurrentURL(filteredURL);
    } else {
      setProductionURL(filteredURL);
      setUrl(filteredURL);
    }
  } */

  return (
    <Select
      size="small"
      placeholder="Organizar"
      style={{ width: 115, marginLeft: '20px' }}
      /* onChange={handleChange} */
    >
      <Option value="citations">Más citado</Option>
      <Option value="year">Más reciente</Option>
    </Select>
  );
};

export default SortProduction;
