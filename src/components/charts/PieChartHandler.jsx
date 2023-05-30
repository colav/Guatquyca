import React, { useState, useEffect } from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';
import PieChart from './PieChart';
import TreemapChart from './TreemapChart';

/* UI Library Components */
import { Card, Select } from 'antd';

/* Utilities */
import { APIRequest } from '../../apis/colav';
import { useLocation, useSearchParams } from 'react-router-dom';

const PLOTLIST = {
  institution: [
    {
      label: '20 palabras más usuales en los títulos de la producción',
      value: 'title_words',
    },
    { label: 'Citas acumuladas de las facultades', value: 'citations_faculty' },
    { label: 'Artículos de las facultades', value: 'products_faculty' },
    { label: 'Gastos de APC proyectado según facultad', value: 'apc_faculty' },
    { label: 'Índice H de las facultades', value: 'h_faculty' },
    {
      label: 'Citas acumuladas de los departamentos',
      value: 'citations_department',
    },
    { label: 'Artículos de los departamentos', value: 'products_department' },
    {
      label: 'Gastos de APC proyectado según departamento',
      value: 'apc_department',
    },
    { label: 'Índice H de los departamentos', value: 'h_department' },
    {
      label: 'Citas acumuladas de los grupos de investigación',
      value: 'citations_group',
    },
    {
      label: 'Artículos de los grupos de investigación',
      value: 'products_group',
    },
    {
      label: 'Gastos de APC proyectado según grupo de investigación',
      value: 'apc_group',
    },
    { label: 'Índice H de los grupos de investigación', value: 'h_group' },
    { label: 'Artículos según editorial', value: 'products_publisher' },
    { label: 'Artículos según temas', value: 'products_subject' },
    {
      label: 'Productos según base de datos de origen',
      value: 'products_database',
    },
    { label: 'Artículos según tipo de acceso abierto', value: 'products_oa' },
    { label: 'Productos según sexo', value: 'products_sex' },
    {
      label: 'Productos según rango de edad de los autores',
      value: 'products_age',
    },
    {
      label: 'Artículos según categoría asignada en el Scienti',
      value: 'scienti_rank',
    },
    {
      label: 'Artículos en revistas rankeadas en cuartiles de Scimago',
      value: 'scimago_rank',
    },
    {
      label: 'Artículos en revistas de la misma institución del autor',
      value: 'published_institution',
    },
  ],
  group: [
    {
      label: '20 palabras más usuales en los títulos de la producción',
      value: 'title_words',
    },
    { label: 'Artículos según editorial', value: 'products_publisher' },
    { label: 'Artículos según temas', value: 'products_subject' },
    {
      label: 'Productos según base de datos de origen',
      value: 'products_database',
    },
    { label: 'Artículos según su acceso', value: 'products_oa' },
    { label: 'Artículos según tipo de acceso abierto', value: 'products_oa' },
    { label: 'Productos según sexo', value: 'products_sex' },
    {
      label: 'Productos según rango de edad de los autores',
      value: 'products_age',
    },
    {
      label: 'Artículos según categoría asignada en el Scienti',
      value: 'scienti_rank',
    },
    {
      label: 'Artículos en revistas rankeadas en cuartiles de Scimago',
      value: 'scimago_rank',
    },
    {
      label: 'Artículos en revistas de la misma institución del autor',
      value: 'published_institution',
    },
  ],
  department: [
    {
      label: 'Citas acumuladas de los grupos de investigación',
      value: 'citations_group',
    },
    {
      label: 'Artículos de los grupos de investigación',
      value: 'products_group',
    },
    {
      label: 'Gastos de APC proyectado según grupo de investigación',
      value: 'apc_group',
    },
    { label: 'Índice H de los grupos de investigación', value: 'h_group' },
    { label: 'Artículos según editorial', value: 'products_publisher' },
    { label: 'Artículos según temas', value: 'products_subject' },
    {
      label: 'Productos según base de datos de origen',
      value: 'products_database',
    },
    { label: 'Artículos según su acceso', value: 'products_oa' },
    { label: 'Artículos según tipo de acceso abierto', value: 'products_oa' },
    { label: 'Productos según sexo', value: 'products_sex' },
    {
      label: 'Productos según rango de edad de los autores',
      value: 'products_age',
    },
    {
      label: 'Artículos según categoría asignada en el Scienti',
      value: 'scienti_rank',
    },
    {
      label: 'Artículos en revistas rankeadas en cuartiles de Scimago',
      value: 'scimago_rank',
    },
    {
      label: 'Artículos en revistas de la misma institución del autor',
      value: 'published_institution',
    },
  ],
  faculty: [
    {
      label: '20 palabras más usuales en los títulos de la producción',
      value: 'title_words',
    },
    { label: 'Índice H de las facultades', value: 'h_faculty' },
    {
      label: 'Citas acumuladas de los departamentos',
      value: 'citations_department',
    },
    { label: 'Artículos de los departamentos', value: 'products_department' },
    {
      label: 'Gastos de APC proyectado según departamento',
      value: 'apc_department',
    },
    { label: 'Índice H de los departamentos', value: 'h_department' },
    {
      label: 'Citas acumuladas de los grupos de investigación',
      value: 'citations_group',
    },
    {
      label: 'Artículos de los grupos de investigación',
      value: 'products_group',
    },
    {
      label: 'Gastos de APC proyectado según grupo de investigación',
      value: 'apc_group',
    },
    { label: 'Índice H de los grupos de investigación', value: 'h_group' },
    { label: 'Artículos según editorial', value: 'products_publisher' },
    { label: 'Artículos según temas', value: 'products_subject' },
    {
      label: 'Productos según base de datos de origen',
      value: 'products_database',
    },
    { label: 'Artículos según su acceso', value: 'products_oa' },
    { label: 'Artículos según tipo de acceso abierto', value: 'products_oa' },
    { label: 'Productos según sexo', value: 'products_sex' },
    {
      label: 'Productos según rango de edad de los autores',
      value: 'products_age',
    },
    {
      label: 'Artículos según categoría asignada en el Scienti',
      value: 'scienti_rank',
    },
    {
      label: 'Artículos en revistas rankeadas en cuartiles de Scimago',
      value: 'scimago_rank',
    },
    {
      label: 'Artículos en revistas de la misma institución del autor',
      value: 'published_institution',
    },
  ],
};

const PieChartHandler = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState(PLOTLIST[type][1].value);
  const [state, setUrl] = APIRequest(
    `${location.pathname}${location.search}&plot=${selectedPlot}`
  );

  useEffect(() => {
    setUrl(`${location.pathname}${location.search}&plot=${selectedPlot}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlot]);

  const handleChange = (value) => {
    setSelectedPlot(value);
  };

  return (
    <Card
      size="small"
      headStyle={{ backgroundColor: '#003e65', color: 'white' }}
      bodyStyle={{ padding: '10px', height: '420px' }}
      hoverable
      extra={
        <Select
          size="small"
          defaultValue={selectedPlot}
          style={{
            width: 420,
          }}
          onChange={handleChange}
          options={PLOTLIST[type]}
        />
      }
    >
      <div className="chart">
        {state.isLoading ? (
          <LoadingCard height={'100%'} />
        ) : state.data.plot.length > 5 ? (
          <TreemapChart data={state.data.plot} />
        ) : (
          <PieChart data={state.data.plot} content={state.data?.openSum} />
        )}
        {state.isError ? <ErrorWarning /> : ''}
      </div>
    </Card>
  );
};

export default PieChartHandler;
