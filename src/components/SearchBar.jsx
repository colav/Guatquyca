import React, { useState } from 'react';

/* Utilities */
import { useNavigate } from 'react-router';

/* UI Components */
import { Select, Input } from 'antd';

const OPTIONS = [
  {
    label: 'Autor',
    value: 'authors',
    key: 'authors',
  },
  {
    label: 'Departamento',
    value: 'departments',
    key: 'departments',
  },
  {
    label: 'Facultad',
    value: 'faculties',
    key: 'faculties',
  },
  {
    label: 'Grupo',
    value: 'groups',
    key: 'groups',
  },
  {
    label: 'Institución',
    value: 'institutions',
    key: 'institutions',
  },
  {
    label: 'Literatura',
    value: 'literature',
    key: 'literature',
  },
];

const SearchBar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(OPTIONS[0]);

  const searchRequest = (input) => {
    /*     setCurrentURL(
      `/app/search?data=${selected.value}&max=10&page=1`.concat(
        input ? `&keywords=${input}` : ''
      )
    ); */
    navigate(
      `/app/search?data=${selected.value}&max=10&page=1`.concat(
        input ? `&keywords=${input}` : ''
      )
    );
  };

  return (
    <Input.Search
      addonBefore={
        <Select
          options={OPTIONS}
          labelInValue="true"
          defaultValue={OPTIONS[0]}
          onSelect={setSelected}
          dropdownMatchSelectWidth={127}
        />
      }
      placeholder={'Búsqueda por palabra clave'}
      onSearch={(input) => searchRequest(input)}
      enterButton
      size="large"
    />
  );
};

export default SearchBar;
