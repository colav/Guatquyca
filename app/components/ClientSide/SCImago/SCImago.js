/* UI Library Components */
import { Col } from "antd";

/**
 * SCImago is a client-side functional component that displays a link to the SCImago Journal & Country Rank page for a given SCImago ID.
 * It includes an image of the journal's rank and links to the SCImago website.
 *
 * @param {string} scimago - The SCImago ID used to generate the link and image URL.
 * @returns {JSX.Element} The SCImago component.
 */
export default function SCImago({ scimago }) {
  return (
    <Col xs={24} md={4}>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.scimagojr.com/journalsearch.php?q=${scimago}&tip=sid&clean=0`}
        title="SCImago Journal &amp; Country Rank"
      >
        <img
          width={160}
          border="0"
          src={`https://www.scimagojr.com/journal_img.php?id=${scimago}`}
          alt="SCImago Journal &amp; Country Rank"
        />
      </a>
    </Col>
  );
}
