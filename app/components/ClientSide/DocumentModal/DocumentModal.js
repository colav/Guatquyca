"use client";

/* Hooks */
import { useState, useEffect } from "react";

/* Components */
import AuthorsHorizontalList from "../AuthorsHorizontalList/AuthorsHorizontalList";
import Loading from "@/app/app/loading";

/* lib */
import RenderedExternalIDs from "@/lib/RenderedExternalIDs";
import RenderedExternalURLs from "@/lib/RenderedExternalURLs";

/* UI Library Components */
import { Divider, Descriptions, Typography } from "antd";

/* UI Library Sub-components */
const { Text, Paragraph } = Typography;

/**
 * Renders a modal with information about a document.
 * @param {string} props.documentID - The ID of the document to fetch and display information for.
 * @returns {JSX.Element} - The DocumentModal component.
 */
export default function DocumentModal({ documentID }) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://apis.impactu.colav.co:8010/app/work/${documentID}?section=info`
      );
      const { data } = await res.json();
      setData(data);
      setLoading(false);
    };
    console.log(
      `http://apis.impactu.colav.co:8010/app/work/${documentID}?section=info`
    );
    fetchData();
  }, [documentID]);

  if (isLoading) return <Loading />;
  if (!data) return <p>Información no disponible.</p>;

  /* Destructure the data object for easier access to its properties */
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
  } = data;

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
