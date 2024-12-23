"use client";

/* Components */
import AuthorsListOnModal from "../AuthorsHorizontalList/AuthorsListOnModal";
import CitationsBadges from "../CitationsBadges/CitationsBadges";
import Error from "@/app/error";
import Loading from "@/app/loading";
import SCImago from "../SCImago/SCImago";
import SubjectsTags from "../../ServerSide/SubjectsTags/SubjectsTags";

/* Icons */
import {
  FilePdfOutlined,
  FileTextOutlined,
  ReadOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";

/* lib */
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";
import { APIRequest } from "@/lib/APIS/clientAPI";

/* Styles */
import style from "./styles.module.css";

/* UI Library Components */
import { Col, Divider, Descriptions, Row, Button, Space } from "antd";

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
    open_access,
  } = state.data.data;
  const { name, serials, scimago_quartile } = source || {};
  const { pissn, issn, scimago, scienti, openalex } = serials || {};

  const articleItems = [
    {
      key: "1",
      label: "Año de publicación",
      children: year_published || "No disponible",
    },
    { key: "2", label: "Idioma", children: language || "No disponible" },
  ];

  const sourceItems = [
    { key: "4", label: "Revista", children: name || "No disponible" },
    {
      key: "5",
      label: "Cuartil año de publicación",
      children: scimago_quartile || "No disponible",
    },
    { key: "6", label: "Volumen", children: volume || "No disponible" },
    { key: "7", label: "Issue", children: issue || "No disponible" },
    { key: "8", label: "pISSN", children: pissn || "No disponible" },
    { key: "9", label: "ISSN", children: issn || "No disponible" },
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
      <Space>
        {open_access.url && (
          <Button
            type="default"
            size="small"
            icon={<FilePdfOutlined />}
            href={open_access.url}
            target="_blank"
          >
            PDF
          </Button>
        )}
        <Button
          type="default"
          size="small"
          icon={<FileTextOutlined />}
          href={`${process.env.NEXT_PUBLIC_CLIENT_API}/app/work/${documentID}`}
          target="_blank"
        >
          JSON
        </Button>
      </Space>
      <h4 className={style.margin_5}>
        <TeamOutlined /> Autores:{" "}
      </h4>
      {authors.length ? (
        <AuthorsListOnModal authors={authors} />
      ) : (
        "No disponible"
      )}
      <h4 className={style.margin_5}>
        <TagsOutlined /> Temas:{" "}
      </h4>
      {subjects.length ? (
        <SubjectsTags subjectsList={subjects} />
      ) : (
        "No disponible"
      )}
      <h4 className={style.margin_5}>Abstract:</h4>
      <p>{abstract || "No disponible"}</p>
      {citations_count.length && (
        <CitationsBadges
          citationsCount={citations_count}
          doi={
            external_ids.find((externalId) => externalId.source === "doi")?.id
          }
          showTitle={true}
        />
      )}
      <Descriptions size="small" items={articleItems} />
      <Descriptions
        column={5}
        bordered
        size="small"
        items={RenderedExternalIDs(external_ids).concat(
          RenderedExternalURLs(external_urls)
        )}
      />
      <Divider className={style.margin_10} />
      <div className={style.source_container}>
        <h4 className={style.margin_5}>
          <ReadOutlined /> Información de la Revista:
        </h4>
        <Row>
          {scimago ? (
            <>
              <SCImago scimago={scimago} />
              <Col xs={24} md={19}>
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
