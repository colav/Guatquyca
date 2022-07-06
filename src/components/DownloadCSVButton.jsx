import React from 'react';

/* Components */
import { WarningModal } from './WarningModal';

/* UI Library Components */
import { Button } from 'antd';

/* Icons */
import DownloadOutlined from '@ant-design/icons';

/* Utilities */
import _ from 'lodash';
import { useLocation } from 'react-router-dom';

const DownloadCSVButton = () => {
  /*  const location = useLocation();
  let URL = _.omit(parsedURL, ['max', 'page']);
  URL['data'] = 'csv'; */
  /* let CSV_URL = `${location.pathname}?${queryString.stringify(URL)}`; */

  /* let URL = _.omit(parsedURL, ['max', 'page']);
  URL['data'] = 'csv';
  let CSV_URL = `${BASE_URL}${
    history.location.pathname
  }?${queryString.stringify(URL)}`; */

  return (
    <Button
      icon={<DownloadOutlined />}
      type="dashed"
      shape="round"
      style={{ color: '#9D3715' }}
      href={'/app' /* CSV_URL */}
      onClick={WarningModal}
    >
      CSV
    </Button>
  );
};

export default DownloadCSVButton;
