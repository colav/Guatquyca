import React from 'react';

/* Components */
import { WarningModal } from './WarningModal';

/* UI Library Components */
import { Button, ConfigProvider } from 'antd';

/* Icons */
import DownloadOutlined from '@ant-design/icons';

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#9D3715',
        },
      }}
    >
      <Button
        icon={<DownloadOutlined />}
        type="dashed"
        shape="round"
        href={'/app' /* CSV_URL */}
        onClick={WarningModal}
      >
        CSV
      </Button>
    </ConfigProvider>
  );
};

export default DownloadCSVButton;
