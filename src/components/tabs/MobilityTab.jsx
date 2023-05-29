import React from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';

/* Utilities */
import { APIRequest } from '../../apis/colav';
import { useLocation } from 'react-router-dom';

const MobilityTab = () => {
  const location = useLocation();
  const [state] = APIRequest(
    `${location.pathname}${location.search}&data=mobility`
  );

  if (state.isError) {
    return <ErrorWarning />;
  }
  if (state.isLoading) {
    return <LoadingCard />;
  }
  return <div>MobilityTab</div>;
};

export default MobilityTab;
