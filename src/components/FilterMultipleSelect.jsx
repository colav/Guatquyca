import React from 'react';

/* UI Library Components */
import { Select } from 'antd';

const FilterMultipleSelect = ({ list, setFilter }) => {
  const onChange = (e) => {
    const countriesList = e.join(' ');
    setFilter(countriesList);
  };

  if (list) {
    const options = list.map((item) => {
      return { label: item.name, value: item.id };
    });
    return (
      <>
        <Select
          mode="multiple"
          placeholder={'Selecciona uno o varios'}
          options={options}
          optionFilterProp="label"
          className="filter--container"
          onChange={onChange}
          autoClearSearchValue
        />
      </>
    );
  }
  return '';
};

export default FilterMultipleSelect;
