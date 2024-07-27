/* Icons */
import { LinkOutlined } from "@ant-design/icons";
import openalex from "../../icons/openalex";
import scholar from "../../icons/scholar";

/* UI Library Components */
import { Badge, Button, Col, Divider, Row, Tooltip } from "antd";
import MultipleProfilesInfoButton from "./MultipleProfilesInfoButton";

/**
 * OpenalexProfilesHandler is a server-side functional component.
 * It handles the display of Openalex profiles.
 *
 * @param {Object[]} openalexProfiles - An array of Openalex profile objects.
 * Each object represents a profile with its own unique ID.
 */
export default function MultipleProfilesHandler({ profiles, source }) {
  /**
   * profilesParser is a function that maps through the profiles and returns a link for each profile.
   *
   * @returns {JSX.Element[]} An array of JSX elements, each containing a link to a profile.
   */
  const profilesParser = () => {
    return profiles.map((profile, index) => (
      <div key={index}>
        <a href={profile.id} target="_blank" rel="noreferrer">
          <LinkOutlined /> Perfil {index + 1}
        </a>
      </div>
    ));
  };

  const button = (
    <Button
      type="link"
      icon={source === "Google Scholar" ? scholar() : openalex()}
    />
  );

  if (profiles.length === 1) {
    return (
      <a
        key={profiles[0].id}
        href={profiles[0].id}
        target="_blank"
        rel="noreferrer"
      >
        {button}
      </a>
    );
  } else {
    return (
      <Tooltip
        title={
          <>
            <Row justify={"space-between"}>
              <Col>
                <h4 style={{ margin: "5px 20px 0 0", lineHeight: 1 }}>
                  {source}
                </h4>
              </Col>
              <Col>
                <MultipleProfilesInfoButton source={source} />
              </Col>
            </Row>
            <Divider style={{ margin: "5px 0" }} />
            {profilesParser()}
          </>
        }
        color="white"
        trigger="click"
      >
        <Badge count={profiles.length} size="small" color="blue">
          {button}
        </Badge>
      </Tooltip>
    );
  }
}
