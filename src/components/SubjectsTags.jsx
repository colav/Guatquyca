import React from "react";

/* UI Library Components */
import { Space, Tag } from "antd";

const SubjectsTags = ({ subjectsList }) => {
  return (
    <div style={{ margin: "8px 15px" }}>
      <Space size={[0, 8]} wrap>
        {subjectsList.map((subject) => {
          return (
            <Tag bordered={false} key={subject.id}>
              {subject.name}
            </Tag>
          );
        })}
      </Space>
    </div>
  );
};

export default SubjectsTags;
