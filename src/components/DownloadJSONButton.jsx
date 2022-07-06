import React from 'react';

/* Components */
import { WarningModal } from './WarningModal';

/* UI Library Components */
import { Button } from 'antd';

/* Icons */
import DownloadOutlined from '@ant-design/icons';

const DownloadJSONButton = ({ parsedURL }) => {
  /*   let URL = _.omit(parsedURL, ['max', 'page']);
  URL['data'] = 'json';
  let JSON_URL = `${BASE_URL}${
    history.location.pathname
  }?${queryString.stringify(URL)}`; */

  return (
    <Button
      icon={<DownloadOutlined />}
      type="dashed"
      shape="round"
      style={{ color: '#9D3715' }}
      href={'/app' /* JSON_URL */}
      onClick={WarningModal}
    >
      JSON
    </Button>
  );
};

export default DownloadJSONButton;
