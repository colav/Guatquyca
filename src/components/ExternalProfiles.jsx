import React from "react";

/* Icons */
import openalex from "../media/icons/openalex";
import orcid from "../media/icons/orcid";
import scholar from "../media/icons/scholar";
import scopus from "../media/icons/scopus";
import linkedin from "../media/icons/linkedin";
import ror from "../media/icons/ror";
import cvlac from "../media/icons/cvlac";
import isni from "../media/icons/isni";
import fundref from "../media/icons/fundref";
import ucas from "../media/icons/ucas";
import ukprn from "../media/icons/ukprn";
import researchgate from "../media/icons/researchgate";
import { UserOutlined } from "@ant-design/icons";

/* UI Library Components */
import { Button, Space, Typography } from "antd";
import wikidata from "../media/icons/wikidata";

const ExternalProfiles = ({ idsList }) => {
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
    scopus: { icon: scopus(), URL: null },
    linkedin: { icon: linkedin(), URL: null },
    scienti: {
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

  const URLMaker = (source, id) => {
    const fixedID = id.replace(/\s+/g, "");
    if (source === "openalex" || source === "scopus" || source === "ror") {
      return id;
    } else return `${external[source]?.URL}${fixedID}`;
  };

  const renderedButtons = (idsList) => {
    return idsList.map(
      (item) =>
        item.source !== "mag" &&
        item.source !== "orgref" &&
        item.source !== "nit" &&
        item.source !== "minciencias" && (
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
      <Typography.Title
        className="bold"
        level={4}
        style={{ margin: 0, color: "gray" }}
      >
        <UserOutlined /> Perfil externo:
      </Typography.Title>
      {idsList?.length ? (
        <Space wrap>{renderedButtons(idsList)}</Space>
      ) : (
        "No disponible"
      )}
    </>
  );
};

export default ExternalProfiles;
