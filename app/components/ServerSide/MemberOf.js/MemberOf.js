/* UI Library Components */
import { Col, Button, Space, Row } from "antd";

/* Icons */
import { IdcardOutlined } from "@ant-design/icons";
import ASCUN from "../../icons/ascun";
import CONSORTIA from "../../icons/consortia";
import CCYK from "../../icons/ccyk";

/* Data */
import networks_universities_colombia from "@/lib/Utils/networks_universities_colombia.json";

/* Styles */
import styles from "./styles.module.css";

/* Icon mapping */
const icons = {
  CCYK: CCYK(),
  CONSORTIA: CONSORTIA(),
  ASCUN: ASCUN(),
};

/**
 * MemberOf Component
 *
 * Displays the networks a university is a member of, based on its ID.
 * It shows a set of icon buttons for each network, each linking to the network's URL.
 *
 * @param {string|number} id - The university ID to look up memberships for.
 * @returns {JSX.Element|null} A Col with network membership buttons, or null if no memberships found.
 */
export default function MemberOf({ id }) {
  if (!networks_universities_colombia.members_of[id]?.networks) {
    return null;
  }

  const memberships = networks_universities_colombia.members_of[id].networks;

  return (
    <Col xs={24} md={6} lg={7} xl={5}>
      <h2 className={styles.title}>
        <IdcardOutlined /> Miembro de:
      </h2>
      <Space size={[6, 10]} wrap>
        {memberships.map((item) => (
          <a href={item.url} target="_blank" rel="noreferrer">
            <Button
              key={item.network}
              style={{ alignItems: "flex-start", padding: "0" }}
              type="link"
              icon={icons[item.name]}
            />
          </a>
        ))}
      </Space>
    </Col>
  );
}
