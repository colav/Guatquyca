import React from 'react';

/* Utilities */
import { Link } from 'react-router-dom';
import { TITLES } from '../utils/constants';

/* UI Library Components */
import { Card, Empty, List } from 'antd';

const ListCard = ({ type, list }) => {
  return (
    <Card
      hoverable
      size="small"
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px' }}
      title={TITLES[type]}
    >
      <div className="list-card--container">
        {list.length ? (
          <List
            size="small"
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  id={item.id}
                  description={
                    <Link
                      to={
                        type === 'person'
                          ? `/app/person?id=${item.id}&section=research&tab=products`
                          : `/app/affiliation?type=${type}&section=affiliations&id=${item.id}`
                      }
                    >
                      {item.full_name}
                      {item.name}
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Datos insuficientes"
            style={{ marginTop: '180px' }}
          />
        )}
      </div>
    </Card>
  );
};

export default ListCard;
