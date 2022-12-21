import React from 'react';

/* UI Library Components */
import { DatePicker } from 'antd';

/* Utilities */
import moment from 'moment';
/* import { useHistory } from 'react-router-dom'; */

/* UI Library Sub-components */
const { RangePicker } = DatePicker;

const YearsRangeFilter = ({ filters, setYears }) => {
  /* const history = useHistory();
  const URL = new URLSearchParams(history.location.search); */

  /*   const renderedDefaultValue = () => {
    if (URL.has('start_year') && URL.has('end_year')) {
      return [
        moment(URL.get('start_year'), 'YYYY'),
        moment(URL.get('end_year'), 'YYYY'),
      ];
    } else {
      return [
        moment(filters.start_year, 'YYYY'),
        moment(filters.end_year, 'YYYY'),
      ];
    }
  }; */

  const onChange = (moment, years) => {
    setYears({ start_year: years[0], end_year: years[1] });
  };

  function disabledDate(current) {
    return (
      current < moment(filters.start_year, 'YYYY') ||
      current > moment(filters.end_year, 'YYYY')
    );
  }

  return (
    <>
      <RangePicker
        picker="year"
        showTime
        allowClear={false}
        allowEmpty
        format="YYYY"
        size="large"
        /* defaultValue={renderedDefaultValue} */
        onChange={onChange}
        disabledDate={disabledDate}
      />
    </>
  );
};

export default YearsRangeFilter;
