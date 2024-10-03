/* UI Library Components */
import { Table } from "antd";

/* UI Library Sub-components */
const Column = Table;

/**
 * HomeTable is a "server-side" function component that displays a table with search examples.
 *
 * @returns {JSX.Element} A table component.
 */
export default function HomeTable() {
  const searchExamples = [
    {
      key: "1",
      search: "Autor",
      example: '"Diego Alejandro Restrepo"',
    },
    {
      key: "2",
      search: "Institución",
      example: '"Universidad de Antioquia"',
    },
    {
      key: "3",
      search: "Unidades Académicas",
      example: '"Facultad de Ciencias Exactas y Naturales"',
    },
    {
      key: "4",
      search: "Subunidades Académicas",
      example: '"Instituto de Física"',
    },
    {
      key: "5",
      search: "Grupo",
      example: "inmunología",
    },
    {
      key: "6",
      search: "Patentes",
      example: "artificial",
    },
    {
      key: "7",
      search: "Productos",
      example: "dark matter",
    },
    {
      key: "8",
      search: "Proyectos",
      example: "genética",
    },
    {
      key: "9",
      search: "Otros Productos",
      example: "actores",
    },
    {
      key: "10",
      search: "Convenios",
      example: "Módulo en desarrollo, próximamente disponible.",
    },
    {
      key: "11",
      search: "Emprendimientos",
      example: "Módulo en desarrollo, próximamente disponible.",
    },
  ];

  return (
    <Table dataSource={searchExamples} pagination={false} bordered size="small">
      <Column title="Buscar por" dataIndex="search" />
      <Column title="Ejemplo" dataIndex="example" />
    </Table>
  );
}
