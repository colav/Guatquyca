import React from 'react';

/* Components */
import AuthorsHorizontalList from './AuthorsHorizontalList';
import DocumentModal from './DocumentModal';
import DownloadCSVButton from './DownloadCSVButton';
import DownloadJSONButton from './DownloadJSONButton';
import OpenAccessStatus from './OpenAccessStatus';
import SortProduction from './SortProduction';

/* Icons */
import { CitationsIcon } from '../media/icons/citations';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons';

/* UI Library Components */
import { Card, List, Modal, Space, Typography } from 'antd';

/* UI Library Sub-components */
const { Link } = Typography;

const DocumentList = ({
  data,
  core,
  parsedURL,
  setProductionURL,
  onPageChange,
  setUrl,
}) => {
  const docInfo = (title, id, status) => {
    Modal.info({
      width: '1200px',
      title: [
        title,
        ' ',
        status ? <OpenAccessStatus status={status} key="0" /> : '',
      ],
      closable: true,
      icon: null,
      okText: 'Cerrar',
      content: <DocumentModal documentID={id} />,
      onOk() {},
    });
  };

  if (data.data.length && data.data[0].title) {
    return (
      <Card
        size="small"
        extra={[
          data.total_results ? data.total_results + ' resultado(s)' : null,
          <SortProduction
            key="1"
            parsedURL={parsedURL}
            setProductionURL={setProductionURL}
            setUrl={setUrl}
            core={core}
          />,
        ]}
        actions={
          data.total_results > 0
            ? [
                <DownloadCSVButton key="1" parsedURL={parsedURL} />,
                <DownloadJSONButton key="2" parsedURL={parsedURL} />,
              ]
            : ''
        }
        title={'Artículos'}
      >
        <div id="productionListContainer">
          <List
            itemLayout="vertical"
            size="small"
            pagination={{
              size: 'small',
              position: 'bottom',
              total: data.total_results,
              /* onChange: (page, pageSize) =>
                onPageChange({
                  page,
                  pageSize,
                  setCurrentURL: core.setCurrentURL,
                }),
              hideOnSinglePage: true,
              current: parseInt(parsedURL.page),
              pageSize: parsedURL.max, */
            }}
            dataSource={data.data}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CalendarOutlined)}
                    Publicado: {item.year_published}
                  </Space>,
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CitationsIcon)}
                    {item.citations_count === 1
                      ? `${item.citations_count} citación`
                      : `${item.citations_count} citaciones`}
                  </Space>,
                ]}
              >
                <List.Item.Meta
                  title={[
                    <Link
                      key="1"
                      onClick={() =>
                        docInfo(item.title, item.id, item.open_access_status)
                      }
                    >
                      {item.title}
                    </Link>,
                    ' ',
                    item.open_access_status ? (
                      <OpenAccessStatus
                        status={item.open_access_status}
                        key="2"
                      />
                    ) : (
                      ''
                    ),
                  ]}
                  description={
                    <div>
                      <ReadOutlined /> {item.source.name}
                    </div>
                  }
                />
                Autores:{' '}
                {AuthorsHorizontalList(item.authors, core.setCurrentURL)}
              </List.Item>
            )}
          ></List>
        </div>
      </Card>
    );
  } else {
    return (
      <Card title={'Artículos'} size="small">
        <List></List>
      </Card>
    );
  }
};

export default DocumentList;
