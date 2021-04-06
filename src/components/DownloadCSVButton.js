import React from "react";
const Button = require("antd/lib/button").default;
const DownloadOutlined = require("@ant-design/icons/DownloadOutlined").default;

const DownloadCSVButton = ({ data, isLoading }) => {
  const onClick = () => {
    let headers = "";
    let content = "";
    let CSV = "";
    headers = Object.keys(data[0]).join(";");
    /* for (let key of Object.keys(data[0])) {
      if (typeof data[0][key] !== "object") {
        headers += `${key};`;
      } else if (typeof data[0][key] === "object" && key === "authors") {
        
      }
    } 
    console.log(headers); */

    const items = data;
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    const csv = [
      header.join(";"), // header row first
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(";")
      ),
    ].join("\r\n");

    data.map((item) => (content += Object.values(item).join(";") + "\n"));
    CSV = headers + "\n" + encodeURI(content);
    console.log(CSV);
    let element = document.getElementById("CSVHiddenElement");
    element.href += ` ${csv}`;
    element.download = "filename.csv";
    element.click();
    element.href = "data:attachment/csv;charset=UTF-8,%EF%BB%BF";
  };

  return (
    <div>
      <a
        href="data:attachment/csv;charset=UTF-8,%EF%BB%BF"
        id="CSVHiddenElement"
        style={{ display: "none" }}
      >
        download
      </a>
      <Button
        type="link"
        id="test"
        icon={<DownloadOutlined />}
        loading={isLoading}
        onClick={onClick}
      >
        CSV
      </Button>
    </div>
  );
};

export default DownloadCSVButton;
