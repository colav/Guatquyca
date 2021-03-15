import React from "react";
const Tag = require("antd/lib/tag").default;

const AuthorsKeywords = ({ keywords }) => {
  if (keywords) {
    return (
      <div>
        {keywords.slice(0, 15).map((tag) => (
          <Tag color="volcano" key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
    );
  }
  return null;
};

export default AuthorsKeywords;
