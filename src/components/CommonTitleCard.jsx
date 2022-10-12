import React from 'react';

/* Utilities */
import { externalUrls } from './externalUrls';
/* import { renderedAffiliation } from '../helpers/renderedAffiliation'; */
/* import { renderedExternal_urls } from '../helpers/renderedExternal_urls'; */

/* UI Library Components */
import { Avatar, Card, Col, Typography } from 'antd';

/* Icons */
import { ReadOutlined } from '@ant-design/icons';

/* UI Library Sub-components */
const { Meta } = Card;

const CommonTitleCard = ({
  title,
  abbreviation,
  external_urls,
  institution = false,
  logo = false,
  setCurrentURL,
}) => {
  return (
    <Col span={24}>
      <Card actions={externalUrls(external_urls)} className="pattern">
        <Meta
          avatar={
            <Avatar
              size={{ xs: 60, sm: 60, md: 150, lg: 150, xl: 150, xxl: 150 }}
              src={
                logo ? (
                  logo
                ) : (
                  <ReadOutlined style={{ color: 'gray', fontSize: '40px' }} />
                )
              }
              style={{
                backgroundColor: 'white',
                padding: 10,
                border: '1px solid lightgray',
              }}
            />
          }
          description={
            <>
              <Typography.Title level={2}>
                {title} {abbreviation ? `(${abbreviation})` : ''}
              </Typography.Title>
              {/* <Typography.Title level={3}>
                {institution
                  ? renderedAffiliation(
                      institution[0].name,
                      institution[0].id,
                      setCurrentURL
                    )
                  : ''}
              </Typography.Title> */}
            </>
          }
        />
      </Card>
    </Col>
  );
};

export default CommonTitleCard;
