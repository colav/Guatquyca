import React from 'react';

/* Components */
import ExternalProfiles from '../ExternalProfiles';
import ExternalURL from '../ExternalURL';
import SortSearchResults from '../SortSearchResults';

/* Hooks */
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

/* Icons */
import { FileOutlined } from '@ant-design/icons';
import { CitationsIcon } from '../../media/icons/citations';

/* UI Library Components */
import { Avatar, Card, Col, List, Row, Statistic, Typography } from 'antd';

/* Utilities */
import { Link } from 'react-router-dom';
import { TITLES } from '../../utils/constants';

const EntityList = ({ data, type, tools }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pagination = {
    max: parseInt(searchParams.get('max')),
    page: parseInt(searchParams.get('page')),
  };

  const onPageChange = ({ page, pageSize }) => {
    navigate(
      `${location.pathname}?data=affiliations&type=${type}&max=${pageSize}&page=${page}`
    );
    window.scrollTo(0, 0);
  };

  return (
    <Row align="center">
      <Col span={24}>
        <Card
          headStyle={{ backgroundColor: '#003e65', color: 'white' }}
          bodyStyle={{ padding: '10px 0 10px 10px' }}
          title={TITLES[type]}
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
              current: pagination.page,
              pageSize: pagination.max,
            }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.logo}
                      shape="square"
                      className="avatar"
                      size={{
                        xs: 40,
                        sm: 50,
                        md: 60,
                        lg: 60,
                        xl: 60,
                        xxl: 70,
                      }}
                    >
                      {item.name?.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <>
                      <Link
                        className="searchResult--link"
                        to={
                          type === 'group'
                            ? `/app/affiliation?type=${type}&id=${item._id}&section=research&tab=products`
                            : `/app/affiliation?type=${type}&id=${item._id}&section=affiliations`
                        }
                      >
                        {item.name}
                      </Link>{' '}
                      {item.addresses?.length ? (
                        <img
                          style={{ paddingBottom: '3px' }}
                          alt={`flag of ${item.addresses[0]?.country}`}
                          title={item.addresses[0]?.country}
                          src={`https://flagcdn.com/28x21/${item.addresses[0]?.country_code.toLowerCase()}.png`}
                        />
                      ) : (
                        ''
                      )}
                    </>
                  }
                  description={
                    <Row align={'top'} gutter={[30, 10]}>
                      <Col xs={24} lg={6}>
                        <ExternalURL URLList={item.external_urls} />
                      </Col>
                      <Col xs={24} lg={6}>
                        <ExternalProfiles idsList={item.external_ids} />
                      </Col>
                      <Col xs={24} lg={6}>
                        <Typography.Title
                          className="bold"
                          level={4}
                          style={{ margin: 0, color: 'gray' }}
                        >
                          {React.createElement(FileOutlined)} Publicaciones:{' '}
                        </Typography.Title>
                        <Statistic
                          value={
                            item.papers_count ||
                            item.products_count ||
                            'No disponible'
                          }
                        />
                      </Col>
                      <Col xs={24} lg={6}>
                        <Typography.Title
                          className="bold"
                          level={4}
                          style={{ margin: 0, color: 'gray' }}
                        >
                          {React.createElement(CitationsIcon)} Citado:{' '}
                        </Typography.Title>
                        <Statistic
                          value={item.citations_count || 'No disponible'}
                        />
                      </Col>
                    </Row>
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
