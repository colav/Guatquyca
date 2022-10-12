import React from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';

/* Utilities */
import { APIRequest } from '../../apis/clustercien';
import { useLocation } from 'react-router-dom';

const NewsTab = () => {
  const location = useLocation();
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&apikey=colavudea&data=projects`
  );

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return <LoadingCard />;
  }
  return <div>NewsTab</div>;
};

export default NewsTab;
