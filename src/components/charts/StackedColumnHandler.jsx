import React, { useState, useEffect } from 'react';

/* Components */
import ErrorWarning from '../ErrorWarning';
import LoadingCard from '../LoadingCard';
import StackedColumnChart from './StackedColumnChart';

/* UI Library Components */
import { Card, Select } from 'antd';

/* Utilities */
import { APIRequest } from '../../apis/colav';
import { useLocation, useSearchParams } from 'react-router-dom';

const PLOTLIST = {
  institution: [
    {
      label: 'Producción de las facultades según tipo de producto',
      value: 'faculty_type',
    },
    {
      label: 'Producción de los departamentos según tipo de producto',
      value: 'department_type',
    },
    {
      label: 'Producción por grupos de investigación según tipo de producto',
      value: 'group_type',
    },
    {
      label:
        'Evolución anual de la producción según la clasificación del Scienti',
      value: 'year_type',
    },
    { label: 'Cantidad de citas anuales', value: 'year_citations' },
    { label: 'Gastos anuales en APC', value: 'year_apc' },
    {
      label: 'Artículos anuales en acceso abierto y cerrado',
      value: 'year_oa',
    },
    {
      label: 'Articulos anuales publicados en las editoriales más usadas',
      value: 'year_publisher',
    },
    {
      label: 'Índice H anual según datos de citación de Google Scholar',
      value: 'year_h',
    },
    { label: 'Productos anuales por investigadores', value: 'year_researcher' },
  ],
  group: [
    {
      label:
        'Evolución anual de la producción según la clasificación del Scienti',
      value: 'year_type',
    },
    { label: 'Cantidad de citas anuales', value: 'year_citations' },
    { label: 'Gastos anuales en APC', value: 'year_apc' },
    {
      label: 'Artículos anuales en acceso abierto y cerrado',
      value: 'year_oa',
    },
    {
      label: 'Articulos anuales publicados en las editoriales más usadas',
      value: 'year_publisher',
    },
    {
      label: 'Índice H anual según datos de citación de Google Scholar',
      value: 'year_h',
    },
    { label: 'Productos anuales por investigadores', value: 'year_researcher' },
  ],
  department: [
    {
      label: 'Producción por grupos de investigación según tipo de producto',
      value: 'group_type',
    },
    {
      label:
        'Evolución anual de la producción según la clasificación del Scienti',
      value: 'year_type',
    },
    { label: 'Cantidad de citas anuales', value: 'year_citations' },
    { label: 'Gastos anuales en APC', value: 'year_apc' },
    {
      label: 'Artículos anuales en acceso abierto y cerrado',
      value: 'year_oa',
    },
    {
      label: 'Articulos anuales publicados en las editoriales más usadas',
      value: 'year_publisher',
    },
    {
      label: 'Índice H anual según datos de citación de Google Scholar',
      value: 'year_h',
    },
    { label: 'Productos anuales por investigadores', value: 'year_researcher' },
  ],
  faculty: [
    { label: 'Índice H de las facultades', value: 'h_faculty' },
    {
      label: 'Producción por grupos de investigación según tipo de producto',
      value: 'group_type',
    },
    {
      label:
        'Evolución anual de la producción según la clasificación del Scienti',
      value: 'year_type',
    },
    { label: 'Cantidad de citas anuales', value: 'year_citations' },
    { label: 'Gastos anuales en APC', value: 'year_apc' },
    {
      label: 'Artículos anuales en acceso abierto y cerrado',
      value: 'year_oa',
    },
    {
      label: 'Articulos anuales publicados en las editoriales más usadas',
      value: 'year_publisher',
    },
    {
      label: 'Índice H anual según datos de citación de Google Scholar',
      value: 'year_h',
    },
    { label: 'Productos anuales por investigadores', value: 'year_researcher' },
  ],
};

const StackedColumnHandler = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const location = useLocation();
  const [selectedPlot, setSelectedPlot] = useState(PLOTLIST[type][0].value);
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
          value={selectedPlot}
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
        ) : (
          <StackedColumnChart data={state.data.plot} />
        )}
        {state.isError ? <ErrorWarning /> : ''}
      </div>
    </Card>
  );
};

export default StackedColumnHandler;
