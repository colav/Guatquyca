/* Icons */
import cvlac from "../../icons/cvlac";
import linkedin from "../../icons/linkedin";
import orcid from "../../icons/orcid";
import researchgate from "../../icons/researchgate";
import scholar from "../../icons/scholar";
import scopus from "../../icons/scopus";
import ssrn from "../../icons/ssrn";
import wos from "../../icons/wos";
import { UserOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Space } from "antd";
import OpenalexProfilesHandler from "./OpenalexProfilesHandler";

const iconList = {
  researchgate: { icon: researchgate() },
  orcid: { icon: orcid() },
  scholar: { icon: scholar() },
  scopus: { icon: scopus() },
  linkedin: { icon: linkedin() },
  scienti: { icon: cvlac() },
  ssrn: { icon: ssrn() },
  wos: { icon: wos() },
  publons: { icon: wos() },
};

/**
 * `AuthorsExternalProfiles` is a server-side functional component.
 *
 * @component
 *
 * @param {Object[]} profilesList - An array of profile objects. Each object represents a profile with a source and an id.
 *
 * This component filters and reduces the profilesList to create a unique list of profiles excluding those from 'openalex'.
 * It then maps over the uniqueProfilesList to render buttons for each profile.
 */
export default function AuthorsExternalProfiles({ profilesList }) {
  const openalexProfiles = profilesList.filter(
    (profile) => profile.source === "openalex"
  );

  const uniqueProfilesList = profilesList.reduce((acc, current) => {
    const existingProfile = acc.find((item) => item.source === current.source);
    if (!existingProfile && current.source !== "openalex") {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const renderedButtons = () => {
    return uniqueProfilesList.map((item) => {
      const { source, id } = item;

      return (
        <a
          href={
            source === "scienti"
              ? `https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=${id}`
              : id
          }
          key={source}
          target="_blank"
          rel="noreferrer"
        >
          <Button type="link" icon={iconList[source]?.icon} />
        </a>
      );
    });
  };

  return (
    <>
      <h2 style={{ margin: "0 0 5px 0", color: "gray" }}>
        <UserOutlined /> Perfil externo:
      </h2>
      {profilesList?.length > 0 ? (
        <Space wrap>
          {renderedButtons(profilesList)}
          {openalexProfiles.length > 0 && (
            <OpenalexProfilesHandler openalexProfiles={openalexProfiles} />
          )}
        </Space>
      ) : (
        <p className={styles.noData}>No disponible</p>
      )}
    </>
  );
}
