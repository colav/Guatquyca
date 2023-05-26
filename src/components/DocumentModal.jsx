import React from "react";

/* Components */
import AuthorsListOnModal from "./AuthorsListOnModal";
import ErrorWarning from "./ErrorWarning";
import LoadingCard from "./LoadingCard";

/* Utilities */
import { APIRequest } from "../apis/clustercien";

/* UI Library Components */
import { Divider, Descriptions, Typography } from "antd";

/* UI Library Sub-components */
const { Text, Paragraph, Link } = Typography;

const DocumentModal = ({ documentID }) => {
  const [state] = APIRequest(`/app/work?section=info&id=${documentID}`);
  const [ellipsis] = React.useState(true);

  const renderedExternalIDs = () => {
    return state.data.data.external_ids.map((item) => (
      <Descriptions.Item key={item.source} label={`${item.source}:`}>
        {item.url && (
          <>
            URL:{" "}
            <a href={item.url} target="_blank" rel="noreferrer">
              Abrir en nueva pestaña
            </a>
            <br />
          </>
        )}
        ID: <Text copyable>{item.id}</Text>
      </Descriptions.Item>
    ));
  };

  const renderedExternalURLs = () => {
    return state.data.data.external_urls.map((item) => (
      <Descriptions.Item key={item.source} label="Link externo:">
        <Link href={item.url} target="_blank" rel="noreferrer">
          {item.source}
        </Link>
      </Descriptions.Item>
    ));
  };

  if (state.isLoading) {
    return <LoadingCard />;
  } else if (state.isError) {
    return <ErrorWarning />;
  } else
    return (
      <div>
        <Text strong>Autores: </Text>
        {<AuthorsListOnModal authors={state.data.data.authors} />}
        <Divider style={{ margin: "15px 0" }} />
        <Text strong>Abstract:</Text>
        <Paragraph
          ellipsis={
            ellipsis ? { rows: 3, expandable: true, symbol: "Más" } : false
          }
        >
          {state.data.data.abstract || "No disponible"}
        </Paragraph>
        <Divider style={{ margin: "15px 0" }} />
        <Descriptions bordered column={{ lg: 3, md: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Revista:">
            {state.data.data.source.name.name}
          </Descriptions.Item>
          <Descriptions.Item label="Idioma:">
            {state.data.data.source.name.lang || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Volumen:">
            {state.data.data.volume || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Publicado:">
            {state.data.data.year_published || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="Issue:">
            {state.data.data.issue || "No disponible"}
          </Descriptions.Item>
          <Descriptions.Item label="pISSN:">
            <Text>
              {state.data.data.source?.serials?.pissn || "No disponible"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="ISSN:">
            <Text>
              {state.data.data.source?.serials?.issn || "No disponible"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Scimago:">
            <Text>
              {state.data.data.source?.serials?.scimago || "No disponible"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Openalex:">
            {state.data.data.source?.serials?.openalex ? (
              <a
                href={state.data.data.source?.serials?.openalex}
                target="_blank"
                rel="noreferrer"
              >
                {state.data.data.source?.serials?.openalex}
              </a>
            ) : (
              "No disponible"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Citaciones:">
            {state.data.data.citations_count || "No disponible"}
          </Descriptions.Item>
          {renderedExternalIDs()}
          {renderedExternalURLs()}
        </Descriptions>
      </div>
    );
};

export default DocumentModal;
