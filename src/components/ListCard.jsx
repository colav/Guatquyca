import React from 'react';

/* Utilities */
import { Link } from 'react-router-dom';
import { titles } from '../utils/titles';

/* UI Library Components */
import { Card, List } from 'antd';

const ListCard = ({ type, list }) => {
  return (
    <Card
      hoverable
      size="small"
      style={{ height: '431px' }}
      title={titles[type]}
    >
      <div className="list-card--container">
        <List
          size="small"
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                id={item.id}
                description={
                  <Link
                    to={`/app/${type}?apikey=colavudea&data=info&id=${item.id}`}
                  >
                    {item.full_name}
                    {item.name}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default ListCard;
