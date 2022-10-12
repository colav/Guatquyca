import React, { useState } from 'react';

/* Components */
import ShowMoreButton from './ShowMoreButton';

/* Utilities */
import { Link } from 'react-router-dom';

/* UI Library Components */
import { Button, Divider, Tooltip } from 'antd';

/* Icons */
import { BankOutlined, TeamOutlined } from '@ant-design/icons';

const AuthorsHorizontalList = ({ authorsList, core }) => {
  /*   const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [showingAll, setShowingAll] = useState(false);

  const showContent = (author) => {
    return (
      <div>
        <div>
          <Link
            style={{ fontSize: 15, textDecoration: 'underline' }}
            to={`/app/authors?id=${author.id}`}
            onClick={() => core.setURL(`/app/authors?id=${author.id}`)}
          >
            {author.full_name}
          </Link>
        </div>
        {author.affiliation?.institution?.name && (
          <div>
            <Link
              style={{ fontSize: 12, textDecoration: 'underline' }}
              to={`/app/institutions?id=${author.affiliation?.institution?.id}`}
              onClick={() =>
                core.setURL(
                  `/app/institutions?id=${author.affiliation?.institution?.id}`
                )
              }
            >
              <BankOutlined style={{ marginRight: '10px', color: 'gray' }} />
              {author.affiliation?.institution?.name}
            </Link>
          </div>
        )}
        {author.affiliation?.group?.name && (
          <div>
            <Link
              style={{ fontSize: 12, textDecoration: 'underline' }}
              to={`/app/groups?id=${author.affiliation?.group?.id}`}
              onClick={() =>
                core.setURL(`/app/groups?id=${author.affiliation?.group?.id}`)
              }
            >
              <TeamOutlined style={{ marginRight: '10px', color: 'gray' }} />
              {author.affiliation?.group?.name}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {authorsList.slice(0, authorsQuantity).map((author) => (
        <Tooltip
          title={() => showContent(author)}
          color="white"
          trigger="click"
          key={author.id}
        >
          <Button type="link">{author.full_name}</Button>
        </Tooltip>
      ))}
      <Divider type="vertical" />
      {authorsList.length > 10 && (
        <ShowMoreButton
          showingAll={showingAll}
          setAuthorsQuantity={setAuthorsQuantity}
          setShowingAll={setShowingAll}
          length={authorsList.length}
        />
      )}
    </div>
  ); */
};

export default AuthorsHorizontalList;
