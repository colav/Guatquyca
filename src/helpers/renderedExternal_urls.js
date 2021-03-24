const LinkOutlined = require("@ant-design/icons/LinkOutlined").default;

export const renderedExternal_urls = (external_urls) => {
  if (external_urls) {
    const actionsList = [];
    for (let i = 0; i < external_urls.length; i++) {
      actionsList.push([
        <a href={external_urls[i].url} key={i}>
          {external_urls[i].source} <LinkOutlined />
        </a>,
      ]);
    }
    return actionsList;
  }
  return "";
};
