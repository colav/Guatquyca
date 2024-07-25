import { Col } from "antd";

export default function SCImago({ scimago }) {
  return (
    <Col xs={24} md={5}>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.scimagojr.com/journalsearch.php?q=${scimago}&tip=sid&clean=0`}
        title="SCImago Journal &amp; Country Rank"
      >
        <img
          border="0"
          src={`https://www.scimagojr.com/journal_img.php?id=${scimago}`}
          alt="SCImago Journal &amp; Country Rank"
        />
      </a>
    </Col>
  );
}
