"use client";

/* Components */
import AuthorsHorizontalList from "../AuthorsHorizontalList/AuthorsHorizontalList";
import Error from "@/app/app/error";
import Loading from "@/app/app/loading";

/* lib */
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";
import URLBuilder from "@/lib/URLBuilder";
import { APIRequest } from "@/lib/clientAPI";

/* UI Library Components */
import { Divider, Descriptions, Typography } from "antd";

/* UI Library Sub-components */
const { Text, Paragraph } = Typography;

/**
 * DocumentModal is a client-side function component that fetches and displays information about a document.
 *
 * @param {string} documentID - The ID of the document to fetch and display information for.
 *
 * @returns {JSX.Element} If the API request is loading, a Loading component is displayed.
 * If the API request has an error, an Error component is displayed.
 * Otherwise, a div containing the document's authors, abstract, and other details is displayed.
 */
export default function DocumentModal({ documentID }) {
  const URL = URLBuilder(`/app/work/${documentID}`, { section: "info" });
  const [state] = APIRequest(URL);

  if (state.isError) {
    return <Error />;
  } else if (state.isLoading) {
    return <Loading />;
  } else {
    const {
      authors,
      abstract,
      source,
      language,
      volume,
      year_published,
      issue,
      citations_count,
      external_ids,
      external_urls,
    } = state.data.data;

    return (
      <div>
        <Text strong>Autores: </Text>
        {<AuthorsHorizontalList authors={authors} />}
        <Divider style={{ margin: "15px 0" }} />
        <Text strong>Abstract:</Text>
        <Paragraph>{abstract || "No disponible"}</Paragraph>
        <Divider style={{ margin: "15px 0" }} />
        <Descriptions bordered column={{ lg: 3, md: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Revista:">
            {source?.name && source?.serials?.openalex ? (
              <div>
                {source.name}
                <br />
                <a
                  href={source.serials.openalex}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.serials.openalex}
                </a>
              </div>
            ) : (
              "No disponible"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Idioma:">
            {language || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Volumen:">
            {volume || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Publicado:">
            {year_published || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Issue:">
            {issue || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="pISSN:">
            <Text>{source?.serials?.pissn || "No disponible"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="ISSN:">
            <Text>{source?.serials?.issn || "No disponible"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Scimago:">
            <Text>{source?.serials?.scimago || "No disponible"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Scienti:">
            <Text>{source?.serials?.scienti || "No disponible"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Citaciones:">
            {citations_count || "No disponible"}
          </Descriptions.Item>
          {RenderedExternalIDs(external_ids)}
          {RenderedExternalURLs(external_urls)}
        </Descriptions>
      </div>
    );
  }
}
