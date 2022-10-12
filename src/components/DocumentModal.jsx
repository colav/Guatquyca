import React from 'react';

/* Components */
import AuthorsListOnModal from './AuthorsListOnModal';

/* Utilities */
import { APIRequest } from '../apis/clustercien';

/* UI Library Components */
import { Divider, Descriptions, Spin, Typography } from 'antd';

/* UI Library Sub-components */
const { Text, Paragraph, Link } = Typography;

const DocumentModal = ({ documentID }) => {
  const [state] = APIRequest(`/app/documents?&data=info&id=${documentID}`);
  const [ellipsis] = React.useState(true);

  const renderedExternalIDs = () => {
    return state.data.data.external_ids.map((item) => (
      <Descriptions.Item key={item.source} label={`${item.source}:`}>
        {item.url && (
          <>
            URL:{' '}
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
    return <Spin />;
  } else
    return (
      <div>
        <Text strong>Autores: </Text>
        <AuthorsListOnModal authors={state.data.data.authors} />
        <Divider style={{ margin: '15px 0' }} />
        <Text strong>Abstract</Text>
        <Paragraph
          ellipsis={
            ellipsis ? { rows: 3, expandable: true, symbol: 'Más' } : false
          }
        >
          {state.data.data.abstract}
        </Paragraph>
        <Divider style={{ margin: '15px 0' }} />
        <Descriptions bordered column={{ lg: 3, md: 2, sm: 2, xs: 1 }}>
          <Descriptions.Item label="Revista:">
            {state.data.data.source.name}
          </Descriptions.Item>
          <Descriptions.Item label="pISSN:">
            {state.data.data.source?.serials?.pissn && (
              <Text copyable>
                {state.data.data.source?.serials?.pissn || 'No disponible'}
              </Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="eISSN:">
            {state.data.data.source?.serials?.eissn && (
              <Text copyable>{state.data.data.source?.serials?.eissn}</Text>
            )}
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
          {renderedExternalURLs()}
        </Descriptions>
      </div>
    );
};

export default DocumentModal;
