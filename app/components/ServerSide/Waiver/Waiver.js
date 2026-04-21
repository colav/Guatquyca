/* Icons */
import { LinkOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Tag } from "antd";

/**
 * Waiver is a server-side functional component that displays a link to a waiver policy using a tag and icon.
 *
 * @component
 * @param {Object} waiver - Waiver information object.
 * @param {string} waiver.url - URL to the waiver policy.
 * @returns {JSX.Element} The rendered waiver link as a tag.
 */
export default function Waiver({ waiver }) {
  return (
    <a href={waiver.url} target="_blank" rel="noopener noreferrer">
      <Tag>
        <LinkOutlined /> Waiver
      </Tag>
    </a>
  );
}
