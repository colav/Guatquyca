import React, { useState } from "react";

/* Utilities */
import { useNavigate } from "react-router-dom";

/* UI Components */
import { Select, Input, ConfigProvider } from "antd";

/* UI Sub-components */
const { Search } = Input;

const AFFILIATIONLIST = ["institution", "department", "faculty", "group"];

const OPTIONS = [
  {
    label: "Autor",
    value: "person",
    key: "person",
  },
  {
    label: "Departamento",
    value: "department",
    key: "department",
  },
  {
    label: "Facultad",
    value: "faculty",
    key: "faculty",
  },
  {
    label: "Grupo",
    value: "group",
    key: "group",
  },
  {
    label: "Institución",
    value: "institution",
    key: "institution",
  },
  {
    label: "Productos",
    value: "literature",
    key: "literature",
  },
  {
    label: "Proyectos",
    value: "projects",
    key: "projects",
  },
  {
    label: "Convenios",
    value: "agreements",
    key: "agreements",
  },
  {
    label: "Emprendimientos",
    value: "entrepreneurship",
    key: "entrepreneurship",
  },
];

const SearchBar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(OPTIONS[0]);

  const selectBefore = (
    <Select
      options={OPTIONS}
      labelInValue="true"
      defaultValue={OPTIONS[0]}
      onSelect={setSelected}
      popupMatchSelectWidth={158}
      listHeight={380}
    />
  );
  const searchRequest = (input) => {
    if (AFFILIATIONLIST.includes(selected.value)) {
      navigate(
        `/app/search?data=affiliations&type=${selected.value}&max=10&page=1`.concat(
          input ? `&keywords=${input}` : ""
        )
      );
    } else {
      navigate(
        `/app/search?data=${selected.value}&max=10&page=1`.concat(
          input ? `&keywords=${input}` : ""
        )
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          controlHeight: 42,
          colorFillAlter: "#fafafa",
          fontSize: 16,
        },
      }}
    >
      <Search
        addonBefore={selectBefore}
        placeholder={"Búsqueda por palabra clave"}
        onSearch={(input) => searchRequest(input)}
        enterButton
        bordered
      />
    </ConfigProvider>
  );
};

export default SearchBar;
