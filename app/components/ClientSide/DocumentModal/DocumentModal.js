"use client";

/* Components */
import AuthorsList from "../AuthorsHorizontalList/AuthorsList";
import Error from "@/app/error";
import InvertedIndex from "../InvertedIndex/InvertedIndex";
import Loading from "@/app/loading";
import SCImago from "../SCImago/SCImago";
import TopicTag from "../../ServerSide/TopicTag/TopicTag";
import WorksInfo from "../WorksInfo/WorksInfo";
import WorkExternalButtons from "../WorkExternalButtons/WorkExternalButtons";

/* Icons */
import {
  ReadOutlined,
  TagsOutlined,
  TeamOutlined,
  TranslationOutlined,
} from "@ant-design/icons";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";
import { LANGUAGES } from "@/lib/constants";
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";

/* Styles */
import style from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Descriptions, Row } from "antd";

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
  const [state] = APIRequest(`/app/work/${documentID}`);

  if (state.isError) {
    return <Error />;
  }

  if (state.isLoading) {
    return <Loading />;
  }

  const {
    authors,
    authors_count,
    abstract,
    year_published,
    language,
    citations_count,
    source,
    topics,
    external_ids,
    external_urls,
    open_access,
    doi,
    bibliographic_info,
  } = state.data.data;
  const { name, scimago_quartile } = source || {};
  const { pissn, issn, scimago, openalex } = source.external_ids || {};
  const { issue, volume, start_page, end_page } = bibliographic_info || {};

  const sourceItems = [
    { key: "4", label: "Fuente", children: name || "No disponible" },
    {
      key: "5",
      label: "Cuartil año de publicación",
      children: scimago_quartile || "No disponible",
    },
    { key: "6", label: "Volumen", children: volume || "No disponible" },
    { key: "7", label: "Issue", children: issue || "No disponible" },
    {
      key: "8",
      label: "Páginas",
      children: `${start_page || "No disponible"} - ${
        end_page || "No disponible"
      }`,
    },
    { key: "9", label: "pISSN", children: pissn || "No disponible" },
    { key: "10", label: "ISSN", children: issn || "No disponible" },
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
      <WorkExternalButtons
        open_access={open_access}
        documentID={documentID}
        doi={doi}
      />
      <h4 className={style.margin_5}>
        <TranslationOutlined /> Idioma: {LANGUAGES[language]}
      </h4>
      <h4 className={style.margin_5}>
        <TeamOutlined />
      </h4>
      <AuthorsList
        authors={authors}
        authors_count={authors_count}
        workID={documentID}
      />
      <h4 className={style.margin_5}>
        <TagsOutlined /> Tópico:{" "}
      </h4>
      {topics?.length > 0 && <TopicTag topic={topics[0]} />}
      <h4 className={style.margin_5}>Abstract:</h4>
      <InvertedIndex abstract={abstract} />
      <WorksInfo
        citationsCount={citations_count}
        yearPublished={year_published}
        doi={doi}
      />
      <Descriptions
        column={5}
        bordered
        size="small"
        contentStyle={{ fontSize: "12px", padding: "5px" }}
        labelStyle={{ padding: "5px 10px" }}
        items={RenderedExternalIDs(external_ids).concat(
          RenderedExternalURLs(external_urls)
        )}
      />
      <Divider className={style.margin_10} />
      <div className={style.source_container}>
        <h4 className={style.margin_5}>
          <ReadOutlined /> Información de la Fuente:
        </h4>
        <Row>
          {scimago ? (
            <>
              <SCImago scimago={scimago} />
              <Col xs={24} md={20}>
                <Descriptions items={sourceItems} />
              </Col>
            </>
          ) : (
            <Descriptions items={sourceItems} />
          )}
        </Row>
      </div>
    </div>
  );
}
