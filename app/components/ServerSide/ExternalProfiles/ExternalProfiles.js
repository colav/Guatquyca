/* Icons */
import openalex from "../../icons/openalex";
import ror from "../../icons/ror";
import cvlac from "../../icons/cvlac";
import isni from "../../icons/isni";
import fundref from "../../icons/fundref";
import ucas from "../../icons/ucas";
import ukprn from "../../icons/ukprn";
import gruplac from "../../icons/gruplac";
import wikidata from "../../icons/wikidata";
import wikipedia from "../../icons/wikipedia";
import { LinkOutlined, UserOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Space } from "antd";

/**
 * ExternalProfiles is a function component that displays a list of external profiles.
 * It constructs a dictionary of external sources with their corresponding icons and URLs.
 * It also includes a helper function, URLMaker, that constructs the URL for an external profile.
 *
 * @param {Array} idsList - The list of external profiles to display.
 */
export default function ExternalProfiles({ idsList, entity }) {
  const excludedSources = [
    "mag",
    "orgref",
    "nit",
    "minciencias",
    "hesa",
    "grid",
    "logo",
  ];

  const uniqueIdsList = idsList.reduce((acc, item) => {
    if (!item?.source || excludedSources.includes(item.source)) {
      return acc;
    }

    const existingIndex = acc.findIndex(
      (profile) => profile.source === item.source,
    );

    if (existingIndex === -1) {
      acc.push(item);
      return acc;
    }

    const existingProfile = acc[existingIndex];
    const shouldReplace = !existingProfile.url && item.url;

    if (shouldReplace) {
      acc[existingIndex] = item;
    }

    return acc;
  }, []);

  const external = {
    scienti:
      entity === "group"
        ? {
            icon: gruplac(),
            URL: "https://scienti.minciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=",
          }
        : {
            icon: cvlac(),
            URL: "https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=",
          },
    openalex: { icon: openalex(), URL: null },
    ror: { icon: ror(), URL: null },
    wikidata: { icon: wikidata(), URL: "https://www.wikidata.org/wiki/" },
    isni: { icon: isni(), URL: "https://isni.org/isni/" },
    fundref: {
      icon: fundref(),
      URL: "https://search.crossref.org/search/funders?from_ui=yes&id=",
    },
    ucas: {
      icon: ucas(),
      URL: "https://www.ucas.com/explore/search/providers?query=",
    },
    ukprn: {
      icon: ukprn(),
      URL: "https://www.ukrlp.co.uk/ukrlp/ukrlp_provider.page_pls_provDetails?x=&pv_status=VERIFIED&pv_vis_code=L&pn_p_id=",
    },
    site: {
      icon: (
        <LinkOutlined
          style={{
            fontSize: "28px",
            verticalAlign: "bottom",
            color: "#328181",
          }}
        />
      ),
      URL: null,
    },
    wikipedia: { icon: wikipedia(), URL: null },
  };

  /**
   * URLMaker is a helper function that constructs the URL for an external profile.
   * It removes any spaces from the ID and appends it to the URL of the source.
   * For the sources "openalex", "scopus", and "ror", it returns the ID as is.
   *
   * @param {string} source - The source of the external profile.
   * @param {string} id - The ID of the external profile.
   * @returns {string} - The constructed URL.
   */
  const URLMaker = (source, id) => {
    if (!id) return null;
    // Remove any spaces from the ID
    const fixedID = String(id).replace(/\s+/g, "");
    if (source === "openalex" || source === "scopus" || source === "ror") {
      return fixedID;
    }
    const base = external[source]?.URL;
    return base ? `${base}${fixedID}` : null;
  };

  /**
   * renderedButtons is a helper function that maps over the idsList and returns a list of buttons for each external profile.
   * It filters out profiles from certain sources ("mag", "orgref", "nit", "minciencias", "hesa") and only creates buttons for the rest.
   * Each button is a link that opens in a new tab and has an icon corresponding to the source of the external profile.
   *
   * @param {Array} idsList - The list of external profiles to display.
   * @returns {Array} - The list of buttons for each external profile.
   */
  const renderedButtons = (profilesList) => {
    return profilesList.map((item) => {
      const href = item.url || URLMaker(item.source, item.id);

      if (!href) {
        return null;
      }

      const icon = external[item.source]?.icon;

      return (
        <a
          href={href}
          key={`${item.source}-${href}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            style={{
              alignItems: "flex-start",
              padding: "0",
              width: "28px",
              height: "28px",
            }}
            type="link"
            icon={icon}
          />
        </a>
      );
    });
  };

  return (
    <>
      <h2 style={{ margin: "0 0 5px 0", color: "gray" }}>
        <UserOutlined /> Perfil externo:
      </h2>
      {uniqueIdsList?.length > 0 ? (
        <Space size={[5, 8]}>{renderedButtons(uniqueIdsList)}</Space>
      ) : (
        <p className={styles.noData}>No disponible</p>
      )}
    </>
  );
}
