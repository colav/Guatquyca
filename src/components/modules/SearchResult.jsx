import React, { useEffect } from 'react';

/* Components */
/* import AuthorsKeywords from './AuthorsKeywords';
import ErrorWarning from './ErrorWarning';
import LoadingCard from './LoadingCard'; */

/* Constants */
/* import { APIKEY, DATA } from '../constants/routes'; */

/* Utilities */
import { APIRequest } from '../../apis/clustercien';
import { useLocation } from 'react-router-dom';
/* import URLBuilder from '../helpers/URLBuilder';
import { Link } from 'react-router-dom';
import { onPageChange } from '../helpers/onPageChange';
import { renderedAffiliation } from '../helpers/renderedAffiliation';
import { renderedTitle } from '../helpers/renderedTitle';
import DocumentList from './DocumentList';
import history from '../history';
const queryString = require('query-string'); */

/* UI Library Components */
import { Avatar, Card, List } from 'antd';

/* Icons */
import { ReadOutlined } from '@ant-design/icons';

const SearchResult = ({ core }) => {
  const location = useLocation();
  const [state, setUrl] = APIRequest(
    location.pathname + location.search + '&apikey=colavudea'
  );
  console.log(state);

  useEffect(() => {
    setUrl(location.pathname + location.search + '&apikey=colavudea');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
};

export default SearchResult;
