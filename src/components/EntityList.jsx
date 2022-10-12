import React from 'react';

/* Components */
import SortSearchResults from './SortSearchResults';

/* UI Library Components */
import { Avatar, Card, Col, List, Row, Space } from 'antd';

/* Icons */
import {
  BankOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { CitationsIcon } from '../media/icons/citations';

/* Utilities */
import { Link } from 'react-router-dom';
import { titles } from '../utils/titles';

const EntityList = ({ data, type, tools }) => {
  const onPageChange = ({ page, pageSize }) => {
    tools.setPagination({ page: page, max: pageSize });
    window.scrollTo(0, 0);
  };

  return (
    <Row align="center">
      <Col span={24}>
        <Card
          headStyle={{ backgroundColor: '#003e65', color: 'white' }}
          size="small"
          bodyStyle={{ padding: '10px 0 10px 10px' }}
          title={titles[type]}
          extra={
            <div>
              <p className="white-text">
                {data.total_results}{' '}
                {data.total_results === 1 ? 'resultado' : 'resultados'}
              </p>
              <SortSearchResults tools={tools} key="1" />
            </div>
          }
        >
          <List
            itemLayout="vertical"
            size="large"
            dataSource={data.data}
            pagination={{
              size: 'small',
              position: 'bottom',
              total: data.total_results,
              onChange: (page, pageSize) =>
                onPageChange({
                  page,
                  pageSize,
                }),
              hideOnSinglePage: true,
              current: tools.pagination.page,
              pageSize: tools.pagination.max,
            }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CalendarOutlined)}
                    Publicaciones: {item.papers_count || item.products_count}
                  </Space>,
                  <Space style={{ fontSize: 18 }}>
                    {React.createElement(CitationsIcon)}
                    Citado: {item.citations_count}
                  </Space>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    type === 'institutions' ? (
                      item.logo ? (
                        <Avatar size={48} src={item.logo} />
                      ) : (
                        <Avatar
                          className="avatar"
                          size={48} /* src={item.logo} */
                        >
                          U
                        </Avatar>
                      )
                    ) : (
                      <Avatar
                        className="avatar"
                        size={{
                          xs: 40,
                          sm: 50,
                          md: 60,
                          lg: 60,
                          xl: 60,
                          xxl: 60,
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    )
                  }
                  title={
                    <Link
                      className="searchResult--link"
                      to={`/app/${type}?id=${item.id}`}
                      /* onClick={() => core.setURL(`/app/${type}?id=${item.id}`)} */
                    >
                      {item.name}
                    </Link>
                  }
                  description={
                    type !== 'institutions' ? (
                      <>
                        {type === 'authors' && item.affiliation?.group?.name ? (
                          <div>
                            <TeamOutlined />{' '}
                            <Link
                              className="affiliation--link"
                              to={`/app/groups?id=${item.affiliation?.group?.id}`}
                              /* onClick={() =>
                                core.setURL(
                                  `/app/groups?id=${item.affiliation?.group?.id}`
                                )
                              } */
                            >
                              {item.affiliation?.group?.name}
                            </Link>
                          </div>
                        ) : (
                          ''
                        )}
                        {item.affiliation?.institution?.name && (
                          <div>
                            <BankOutlined />{' '}
                            <Link
                              className="affiliation--link"
                              to={`/app/institutions?id=${item.affiliation?.institution?.id}`}
                              /*  onClick={() =>
                                core.setURL(
                                  `/app/institutions?id=${item.affiliation?.institution?.id}`
                                )
                              } */
                            >
                              {item.affiliation?.institution?.name}
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      ''
                    )
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default EntityList;
