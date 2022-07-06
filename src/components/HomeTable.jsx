import React from 'react';

/* UI Library Components */
import { Table } from 'antd';

const HomeTable = () => {
  const searchExamples = [
    {
      key: '1',
      search: 'Autor',
      example: '"Francisco Javier Lopera Restrepo"',
    },
    {
      key: '2',
      search: 'Institución',
      example: '"Universidad de Antioquia"',
    },
    {
      key: '3',
      search: 'Facultad',
      example: '"Facultad de Medicina"',
    },
    {
      key: '4',
      search: 'Departamento',
      example: '"Instituto de Física"',
    },
    {
      key: '5',
      search: 'Grupo',
      example: 'inmunología',
    },
    {
      key: '6',
      search: 'Literatura',
      example: 'dark matter',
    },
  ];

  return (
    <Table dataSource={searchExamples} pagination={false} bordered size="small">
      <Table.Column title="Buscar por" dataIndex="search" />
      <Table.Column title="Ejemplo" dataIndex="example" />
    </Table>
  );
};

export default HomeTable;
