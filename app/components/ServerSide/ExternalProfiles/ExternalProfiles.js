/* Icons */
import openalex from "../../icons/openalex";
import orcid from "../../icons/orcid";
import scholar from "../../icons/scholar";
import scopus from "../../icons/scopus";
import linkedin from "../../icons/linkedin";
import ror from "../../icons/ror";
import cvlac from "../../icons/cvlac";
import isni from "../../icons/isni";
import fundref from "../../icons/fundref";
import ucas from "../../icons/ucas";
import ukprn from "../../icons/ukprn";
import gruplac from "../../icons/gruplac";
import researchgate from "../../icons/researchgate";
import wikidata from "../../icons/wikidata";
import { UserOutlined } from "@ant-design/icons";

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
  const external = {
    researchgate: {
      icon: researchgate(),
      URL: "https://www.researchgate.net/profile/",
    },
    orcid: { icon: orcid(), URL: "https://orcid.org/" },
    scholar: {
      icon: scholar(),
      URL: "https://scholar.google.com/citations?user=",
    },
    scopus: {
      icon: scopus(),
      URL: "https://www.scopus.com/authid/detail.uri?authorId=",
    },
    linkedin: { icon: linkedin(), URL: null },
    scienti:
      entity === "group"
        ? {
            icon: gruplac(),
            URL: "https://scienti.colciencias.gov.co/gruplac/jsp/visualiza/visualizagr.jsp?nro=",
          }
        : {
            icon: cvlac(),
            URL: "https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=",
          },
    minciencias: {
      icon: cvlac(),
      URL: "https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=",
    },
    openalex: { icon: openalex(), URL: null },
    ror: { icon: ror(), URL: null },
    wikidata: { icon: wikidata(), URL: "https://www.wikidata.org/wiki/" },
    isni: { icon: isni(), URL: "https://isni.org/isni/" },
    fundref: { icon: fundref(), URL: "https://search.crossref.org/funding?q=" },
    ucas: {
      icon: ucas(),
      URL: "https://www.ucas.com/explore/search/providers?query=",
    },
    ukprn: {
      icon: ukprn(),
      URL: "https://www.ukrlp.co.uk/ukrlp/ukrlp_provider.page_pls_provDetails?x=&pv_status=VERIFIED&pv_vis_code=L&pn_p_id=",
    },
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
    // Remove any spaces from the ID
    const fixedID = id.replace(/\s+/g, "");
    if (source === "openalex" || source === "scopus" || source === "ror") {
      return id;
    } else return `${external[source]?.URL}${fixedID}`;
  };

  /**
   * renderedButtons is a helper function that maps over the idsList and returns a list of buttons for each external profile.
   * It filters out profiles from certain sources ("mag", "orgref", "nit", "minciencias", "hesa") and only creates buttons for the rest.
   * Each button is a link that opens in a new tab and has an icon corresponding to the source of the external profile.
   *
   * @param {Array} idsList - The list of external profiles to display.
   * @returns {Array} - The list of buttons for each external profile.
   */
  const renderedButtons = (idsList) => {
    return idsList.map(
      (item) =>
        item.source !== "mag" &&
        item.source !== "orgref" &&
        item.source !== "nit" &&
        item.source !== "minciencias" &&
        item.source !== "hesa" && (
          <a
            href={URLMaker(item.source, item.id)}
            key={item.source}
            target="_blank"
            rel="noreferrer"
          >
            <Button type="link" icon={external[item.source]?.icon} />
          </a>
        )
    );
  };

  return (
    <>
      <h2 style={{ margin: 0, color: "gray" }}>
        <UserOutlined /> Perfil externo:
      </h2>
      {idsList?.length > 0 ? (
        <Space wrap>{renderedButtons(idsList)}</Space>
      ) : (
        <p className={styles.noData}>No disponible</p>
      )}
    </>
  );
}
