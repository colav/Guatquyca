import React, { useEffect, useState } from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';
import EntityList from '../EntityList';

/* Utilities */
import { APIRequest } from '../../apis/clustercien';
import { useNavigate } from 'react-router';
import { useLocation, useSearchParams } from 'react-router-dom';

const SearchResult = ({ core }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ max: 10, page: 1 });
  const [sort, setSort] = useState('citations');
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&apikey=colavudea`
  );

  const [searchParams] = useSearchParams();
  const type = searchParams.get('data');

  const tools = { sort, setSort, pagination, setPagination };

  useEffect(() => {
    document.title = 'Resultados de Búsqueda - ImpactU';
  }, []);

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&apikey=colavudea`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    setPagination({ max: 10, page: 1 });
  }, [sort]);

  /*   useEffect(() => {
    navigate(
      `${location.pathname}?data=${type}&max=${pagination.max}&page=${pagination.page}&sort=${sort}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]); */

  if (state.isError) {
    return <ErrorWarning />;
  } else if (state.isLoading) {
    return <LoadingCard />;
  }
  return <EntityList data={state.data} type={type} tools={tools} />;
};

export default SearchResult;
