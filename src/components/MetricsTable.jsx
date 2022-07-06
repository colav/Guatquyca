import React from 'react';

/* UI Library Components */
import { Table } from 'antd';

/* UI Library Sub-components */
const { Column } = Table;

const MetricsTable = () => {
  const dataSource = [
    {
      key: '1',
      principle: 'Robustez',
      source: 'Metric Tide',
      description:
        'Las métricas deben estar basadas en los mejores datos posibles en términos de precisión y cobertura.',
      observation:
        'Las métricas de esta plataforma tienen un alto nivel de cobertura en las fuentes de información utilizadas, gracias a las metodologías de extracción e integración del CoLaV.',
      fulfill: 'Sí',
    },
    {
      key: '2',
      principle: 'Humildad',
      source: 'Metric Tide Manifiesto de Leiden',
      description:
        'La evaluación cuantitativa debe apoyar, pero no reemplazar, el análisis cualitativo y experto.',
      observation:
        'La plataforma pretende apoyar la toma de decisiones para investigación en salud, pero no está diseñada para ser un mecanismo de evaluación.',
      fulfill: 'No aplica',
    },
    {
      key: '3',
      principle: 'Transparencia',
      source: 'Metric Tide DORA Manifiesto de Leiden',
      description:
        'La recolección de datos y los procesos analíticos deben estar abiertos y transparentes, para que aquellos que son evaluados puedan verificar sus resultados.',
      observation:
        'Los procesos y herramientas de CoLaV están construidas bajo principios abiertos, disponibles en repositorios de libre acceso y descarga. Asimismo, las metodologías están documentadas.',
      fulfill: 'Sí',
    },
    {
      key: '4',
      principle: 'Diversidad',
      source: 'Metric Tide DORA Manifiesto de Leiden',
      description:
        'Dar cuenta de variedad por área, y usar una amplia cantidad de indicadores para dar cuenta de la pluralidad de la investigación y diversidad en las carreras de investigación a lo largo del sistema.',
      observation:
        'Las múltiples fuentes de información y los distintos tipos de productos dan cuenta de la diversidad en la producción. Si bien se manejan tres indicadores centrales (cantidad, citaciones, coautoría), estos son aplicados a distintos tipos de productos para reflejar la diversidad en trayectorias y producción.',
      fulfill: 'Sí',
    },
    {
      key: '5',
      principle: 'Reflexividad',
      source: 'Metric Tide Manifiesto de Leiden',
      description:
        'Reconocer y anticipar los efectos potenciales y sistémicos de los indicadores, y actualizarles de manera acorde.',
      observation:
        'Los indicadores están enfocados a la toma de decisiones y no a la evaluación. En ese sentido, no se ha realizado un análisis de efectos potenciales y sistémicos de los indicadores.',
      fulfill: 'No',
    },
    {
      key: '6',
      principle: 'Selección colectiva',
      source: 'Scope',
      description:
        'La definición de las métricas debe ser un proceso construido de manera colaborativa con usuarios y quienes son medidos.',
      observation:
        'Las métricas fueron evaluadas por expertos quienes hicieron recomendaciones sobre el enfoque de presentación y priorización en los análisis.',
      fulfill: 'Sí',
    },
    {
      key: '7',
      principle: 'Buenas prácticas',
      source: 'Proyecto Métricas Responsables',
      description:
        'La comunidad interactúa permanentemente para mejorar el uso de las métricas.',
      observation:
        'Las métricas no están orientadas a la evaluación y, por su enfoque de sistema de información, no se plantea construcción de comunidad.',
      fulfill: 'No aplica',
    },
    {
      key: '8',
      principle: 'Adaptación al contexto',
      source: 'Manifiesto de Leiden',
      description:
        'Las métricas contemplan el contexto y se ajustan para incorporar las características del sistema y las instituciones.',
      observation:
        'Las métricas están ajustadas de acuerdo a las necesidades de tomadores de decisión, prioridades de política y características del sistema colombiano de ciencia, tecnología e innovación.',
      fulfill: 'Sí',
    },
    {
      key: '9',
      principle: 'Comparación responsable',
      source: 'Proyecto Métricas Responsables',
      description:
        'La comparación se enfoca en identificar buenas prácticas, no a posicionarse.',
      observation:
        'Los indicadores permiten analizar individualmente el desempeño, identificando las buenas prácticas, pero no forzando la comparación en términos de ránquines.',
      fulfill: 'Sí',
    },
    {
      key: '10',
      principle: 'Mejora del sistema',
      source: 'Proyecto Métricas Responsables',
      description:
        'Las métricas proveen información para mejorar el funcionamiento del sistema para cumplir objetivos.',
      observation:
        'Las métricas dan información sobre el desempeño del sistema, lo que posibilita la toma de decisiones por parte de cada actor.',
      fulfill: 'Sí',
    },
    {
      key: '11',
      principle: 'Apertura',
      source: 'DORA Manifiesto de Leiden',
      description:
        'Proveer una licencia que permite el uso irrestricto de los datos y provisión de acceso computacional a los datos.',
      observation:
        'Los procesos y herramientas de CoLaV están construidas bajo principios abiertos, disponibles en repositorios de libre acceso y descarga. Asimismo, las metodologías están documentadas.',
      fulfill: 'Sí',
    },
    {
      key: '12',
      principle: 'Excelencia para la investigación de interés local',
      source: 'Manifiesto de Leiden',
      description:
        'Las métricas deben proteger las investigaciones de interés local.',
      observation:
        'La plataforma está construida para evaluar si las investigaciones contribuyen, o se alinean, a la solución de objetivos de política y los ODS.',
      fulfill: 'Sí',
    },
  ];
  return (
    <Table
      style={{ marginTop: '40px' }}
      dataSource={dataSource}
      rowKey="key"
      bordered
      pagination={false}
    >
      <Column title="Principio" dataIndex="principle" />
      <Column title="Fuente" dataIndex="source" />
      <Column title="Descripción" dataIndex="description" />
      <Column title="Observación" dataIndex="observation" />
      <Column title="Cumple" dataIndex="fulfill" />
    </Table>
  );
};

export default MetricsTable;
