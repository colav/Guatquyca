import { LinkOutlined } from '@ant-design/icons';

const title = {
  website: 'Sitio Web',
  gruplac: 'GrupLAC',
  scholar: 'Google Académico',
  wikipedia: 'Wikipedia',
  site: 'Sitio Web',
};

export const externalUrls = (external_urls) => {
  if (external_urls) {
    const actionsList = [];
    for (let i = 0; i < external_urls.length; i++) {
      actionsList.push([
        <a href={external_urls[i].url} key={i} target="_blank" rel="noreferrer">
          {title[external_urls[i].source]
            ? title[external_urls[i].source]
            : external_urls[i].source}{' '}
          <LinkOutlined />
        </a>,
      ]);
    }
    return actionsList;
  }
  return '';
};
