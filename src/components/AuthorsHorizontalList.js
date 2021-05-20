import React, { useState } from "react";
import history from "../history";
import { Link, Router } from "react-router-dom";
import { APIKEY, DATA } from "../constants/routes";
const Button = require("antd/lib/button").default;
const Divider = require("antd/lib/divider").default;
const notification = require("antd/lib/notification").default;

const AuthorsHorizontalList = (authorsList, setCurrentURL) => {
  const [authorsQuantity, setAuthorsQuantity] = useState(10);
  const [showingAll, setShowingAll] = useState(false);

  const onClick = () => {
    if (showingAll === false) {
      setAuthorsQuantity(authorsList.length);
    } else {
      setAuthorsQuantity(10);
    }
    setShowingAll(!showingAll);
  };

  const URL = (type, id) => {
    if (type === "faculty") {
      return `/app/faculties?${APIKEY}&${DATA}&id=${id}`;
    }
    return `/app/${type}s?${APIKEY}&${DATA}&id=${id}`;
  };

  const openNotification = (author) => {
    notification.open({
      style: { width: 450, border: "2px solid #DCDCD5" },
      message: (
        <Router history={history}>
          <Link
            style={{ fontSize: 21 }}
            to={`/app/authors?${APIKEY}&${DATA}&id=${author.id}`}
            onClick={() =>
              setCurrentURL(`/app/authors?${APIKEY}&${DATA}&id=${author.id}`)
            }
          >
            {author.full_name}
          </Link>
          <br />
          {author.affiliations.length > 0 ? (
            <Link
              to={`/app/institutions?${APIKEY}&${DATA}&id=${author.affiliations[0].id}`}
              onClick={() =>
                setCurrentURL(
                  `/app/institutions?${APIKEY}&${DATA}&id=${author.affiliations[0].id}`
                )
              }
            >
              {author.affiliations[0].name}
            </Link>
          ) : (
            ""
          )}
        </Router>
      ),
      description:
        author.affiliations.length > 0
          ? author.affiliations[0].branches.map((item) => (
              <Router key={item.id} history={history}>
                <Divider style={{ margin: 2 }} />
                <Link
                  style={{ fontSize: 15 }}
                  to={URL(item.type, item.id)}
                  onClick={() => setCurrentURL(URL(item.type, item.id))}
                >
                  {item.name}
                </Link>
              </Router>
            ))
          : "",
      onClick: () => {
        notification.destroy(author.id);
      },
    });
  };

  return (
    <div>
      {authorsList.slice(0, authorsQuantity).map((author) => (
        <Button
          key={author.id}
          type="link"
          onClick={() => openNotification(author)}
        >
          {author.full_name}
        </Button>
      ))}
      <Divider type="vertical" />
      {authorsList.length > 10 ? (
        <Button onClick={onClick} type="dashed">
          {showingAll ? "Mostrar menos" : `Mostrar todos ${authorsList.length}`}
        </Button>
      ) : (
        ""
      )}
    </div>
  );
};

export default AuthorsHorizontalList;
