/* Icons */
import { LinkOutlined } from "@ant-design/icons";
import openalex from "../../icons/openalex";

/* UI Library Components */
import { Badge, Button, Tooltip } from "antd";

/**
 * OpenalexProfilesHandler is a server-side functional component.
 * It handles the display of Openalex profiles.
 *
 * @param {Object[]} openalexProfiles - An array of Openalex profile objects.
 * Each object represents a profile with its own unique ID.
 */
export default function OpenalexProfilesHandler({ openalexProfiles }) {
  /**
   * profilesParser is a function that maps through the profiles and returns a link for each profile.
   *
   * @returns {JSX.Element[]} An array of JSX elements, each containing a link to a profile.
   */
  const profilesParser = () => {
    return openalexProfiles.map((profile, index) => (
      <div key={index}>
        <a href={profile.id} target="_blank" rel="noreferrer">
          <LinkOutlined /> Perfil {index + 1}
        </a>
      </div>
    ));
  };

  const button = <Button type="link" icon={openalex()} />;

  if (openalexProfiles.length === 1) {
    return (
      <a
        key={openalexProfiles[0].id}
        href={openalexProfiles[0].id}
        target="_blank"
        rel="noreferrer"
      >
        {button}
      </a>
    );
  } else {
    return (
      <Tooltip title={profilesParser()} color="white" trigger="click">
        <Badge count={openalexProfiles.length} size="small" color="blue">
          {button}
        </Badge>
      </Tooltip>
    );
  }
}
