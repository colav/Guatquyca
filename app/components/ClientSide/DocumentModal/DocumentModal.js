"use client";

/* Components */
import AuthorsHorizontalList from "../AuthorsHorizontalList/AuthorsHorizontalList";
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";

/* Icons */
import { ReadOutlined } from "@ant-design/icons";

/* lib */
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";
import URLBuilder from "@/lib/URLBuilder";
import { APIRequest } from "@/lib/clientAPI";

/* Styles */
import style from "./styles.module.css";

/* UI Library Components */
import { Divider, Descriptions } from "antd";
import SubjectsTags from "../../ServerSide/SubjectsTags/SubjectsTags";

/**
 * DocumentModal is a function client-side component that displays detailed information about a document.
 *
 * @param {string} documentID - The ID of the document.
 *
 * @returns {JSX.Element} A Modal containing the document's information.
 * If an error occurs while fetching the document's information, an Error component is returned.
 * If the document's information is still loading, a Loading component is returned.
 */
export default function DocumentModal({ documentID }) {
  const URL = URLBuilder(`/app/work/${documentID}`, { section: "info" });
  const [state] = APIRequest(URL);

  if (state.isError) {
    return <Error />;
  }

  if (state.isLoading) {
    return <Loading />;
  }

  const {
    authors,
    abstract,
    year_published,
    language,
    citations_count,
    source,
    subjects,
    volume,
    issue,
    external_ids,
    external_urls,
    openalex_url,
  } = state.data.data;
  const { name, serials } = source || {};
  const { pissn, issn, scimago, scienti, openalex } = serials || {};

  const articleItems = [
    {
      key: "1",
      label: "Año de publicación",
      children: year_published || "No disponible",
    },
    { key: "2", label: "Idioma", children: language || "No disponible" },
    {
      key: "3",
      label: "Citaciones",
      children: citations_count || "No disponible",
    },
    {
      key: "4",
      label: "Perfil OpenAlex",
      children: openalex_url ? (
        <a href={openalex_url} target="_blank" rel="noreferrer">
          {openalex_url}
        </a>
      ) : (
        "No disponible"
      ),
    },
  ];

  const sourceItems = [
    { key: "4", label: "Revista", children: name || "No disponible" },
    { key: "5", label: "Volumen", children: volume || "No disponible" },
    { key: "6", label: "Issue", children: issue || "No disponible" },
    { key: "7", label: "pISSN", children: pissn || "No disponible" },
    { key: "8", label: "ISSN", children: issn || "No disponible" },
    { key: "9", label: "Scimago", children: scimago || "No disponible" },
    { key: "10", label: "Scienti", children: scienti || "No disponible" },
    {
      key: "11",
      label: "Perfil OpenAlex",
      children: openalex ? (
        <a href={openalex} target="_blank" rel="noreferrer">
          {openalex}
        </a>
      ) : (
        "No disponible"
      ),
    },
  ];

  return (
    <div>
      <h4 className={style.margin_5}>Autores: </h4>
      {authors.length ? (
        <AuthorsHorizontalList authors={authors} />
      ) : (
        "No disponible"
      )}
      <h4 className={style.margin_5}>Temas: </h4>
      <SubjectsTags subjectsList={subjects} />
      <h4 className={style.margin_5}>Abstract:</h4>
      <p>{abstract || "No disponible"}</p>
      <Descriptions items={articleItems} />
      <Descriptions
        bordered
        size="small"
        items={RenderedExternalIDs(external_ids).concat(
          RenderedExternalURLs(external_urls)
        )}
      />
      <Divider className={style.margin_15} />
      <h4 className={style.margin_5}>
        <ReadOutlined /> Información de la Revista:
      </h4>
      <Descriptions items={sourceItems} />
    </div>
  );
}
