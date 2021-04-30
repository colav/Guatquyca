import React from "react";

/* Constants */
import { TYPEDOC, DATA, APIKEY } from "../constants/routes";

/* Utilities */
import { APIRequest } from "../apis/clustercien";

/* UI Library Components */
const Divider = require("antd/lib/divider").default;
const Descriptions = require("antd/lib/descriptions").default;
const Spin = require("antd/lib/spin").default;
const Typography = require("antd/lib/typography").default;

/* UI Library Sub-components */
const { Text, Paragraph } = Typography;

const DocumentModal = ({ documentID }) => {
  const builtURL = `${TYPEDOC}?${APIKEY}&${DATA}&id=${documentID}`;
  const [state] = APIRequest(builtURL);
  const [ellipsis] = React.useState(true);

  const renderedAuthors = (authors) => {
    return authors.map((author) =>
      author.corresponding ? (
        <Text key={author.id} underline>
          {author.name},
        </Text>
      ) : (
        <Text key={author.id}> {author.name}, </Text>
      )
    );
  };

  const renderedExternalIDs = () => {
    return state.data.data.external_ids.map((item) => (
      <Descriptions.Item key={item.source} label={`${item.source} ID:`}>
        <Text copyable>{item.id}</Text>
      </Descriptions.Item>
    ));
  };

  if (state.isLoading) {
    return <Spin />;
  } else
    return (
      <div>
        <Text strong>Autores: </Text>
        {renderedAuthors(state.data.data.authors)}
        <Divider style={{ margin: "15px 0" }} />
        <Text strong>Abstract</Text>
        <Paragraph
          ellipsis={
            ellipsis ? { rows: 3, expandable: true, symbol: "Más" } : false
          }
        >
          {state.data.data.abstract}
        </Paragraph>
        <Divider style={{ margin: "15px 0" }} />
        <Descriptions bordered column={{ lg: 3, md: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Revista:">
            {state.data.data.source.name}
          </Descriptions.Item>
          <Descriptions.Item label="pISSN:">
            <Text copyable>{state.data.data.source.serials.pissn}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="eISSN:">
            <Text copyable>{state.data.data.source.serials.eissn}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Publicado:">
            {state.data.data.year_published}
          </Descriptions.Item>
          <Descriptions.Item label="Volumen:">
            {state.data.data.volume}
          </Descriptions.Item>
          <Descriptions.Item label="Issue:">
            {state.data.data.issue}
          </Descriptions.Item>
          <Descriptions.Item label="Idioma:">
            {state.data.data.language}
          </Descriptions.Item>
          <Descriptions.Item label="Citaciones:">
            {state.data.data.citations_count}
          </Descriptions.Item>
          {renderedExternalIDs()}
        </Descriptions>
      </div>
    );
};

export default DocumentModal;
