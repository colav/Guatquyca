import React, { useState } from "react";
import history from "../history";
import { SEARCH, APIKEY } from "../constants/routes";
const Select = require("antd/lib/select").default;
const Input = require("antd/lib/input").default;

const options = [
  {
    label: "Autor",
    value: "authors",
    key: "authors",
  },
  {
    label: "Departamento",
    value: "departments",
    key: "departments",
  },
  {
    label: "Facultad",
    value: "faculties",
    key: "faculties",
  },
  {
    label: "Grupo",
    value: "groups",
    key: "groups",
  },
  {
    label: "Institución",
    value: "institutions",
    key: "institutions",
  },
  {
    label: "Literatura",
    value: "literature",
    key: "literature",
  },
];

const SearchBar = ({ setCurrentURL }) => {
  const [selected, setSelected] = useState(options[0]);

  const searchRequest = (input) => {
    setCurrentURL(
      `${SEARCH}${APIKEY}&data=${selected.value}&max=10&page=1`.concat(
        input ? `&keywords=${input}` : ""
      )
    );
    history.push(
      `${SEARCH}${APIKEY}&data=${selected.value}&max=10&page=1`.concat(
        input ? `&keywords=${input}` : ""
      )
    );
  };

  return (
    <Input.Search
      addonBefore={
        <Select
          options={options}
          labelInValue="true"
          defaultValue={options[0]}
          onSelect={setSelected}
          dropdownMatchSelectWidth={127}
        />
      }
      placeholder={"Ingresa palabra clave"}
      onSearch={searchRequest}
      enterButton
      size="large"
    />
  );
};

export default SearchBar;
