import React from 'react';

/* Hooks */
import { useSearchParams } from 'react-router-dom';
import Institutions from './Institutions';
import Departments from './Departments';
import Groups from './Groups';
import Faculties from './Faculties';

const AffiliationRouter = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  if (type === 'institution') {
    return <Institutions />;
  } else if (type === 'department') {
    return <Departments />;
  } else if (type === 'group') {
    return <Groups />;
  } else if (type === 'faculty') {
    return <Faculties />;
  }
  return 'Ruta no conectada';
};

export default AffiliationRouter;
