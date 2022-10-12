import React from 'react';

/* Components */
import DocumentList from '../DocumentList';
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';

/* Utilities */
import { APIRequest } from '../../apis/clustercien';
import { useLocation } from 'react-router-dom';

const ProductsTab = ({ core }) => {
  const location = useLocation();
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&apikey=colavudea&data=production`
  );

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return <LoadingCard />;
  }
  return <DocumentList data={state.data} core={core} />;
};

export default ProductsTab;
