"use client";

/* Hooks */
import React, { useEffect, useRef } from "react";

/* Libraries */
import { Graph, Circle, ExtensionCategory, register } from "@antv/g6";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Empty } from "antd";

/**
 * BreathingCircle custom node
 */
class BreathingCircle extends Circle {
  onCreate() {
    const halo = this.shapeMap.halo;
    halo?.animate([{ lineWidth: 0 }, { lineWidth: 19 }], {
      duration: 4000,
      iterations: Infinity,
      direction: "alternate",
    });
  }
}

register(ExtensionCategory.NODE, "breathing-circle", BreathingCircle);

/**
 * GraphChartOnHome
 *
 * Renders a custom graph visualization using AntV G6 for the home page.
 * Displays nodes and edges representing entities such as authors, institutions, products, etc.
 * Nodes are grouped by clusters and visually highlighted with hulls.
 * Tooltips are shown only for nodes, providing detailed information.
 * If no data is provided, an Ant Design Empty state is rendered.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.data - Data object containing counts and metadata for nodes.
 * @returns {JSX.Element} The graph visualization or an empty state.
 *
 */
const GraphChartOnHome = ({ data }) => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);

  if (!data) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Datos insuficientes"
        style={{ marginTop: "170px" }}
      />
    );
  }

  const centerX = 400;
  const centerY = 300;

  const graphData = {
    nodes: [
      {
        id: "authors",
        description: `${data.total_authors?.toLocaleString("es-CO")}\nAutores`,
        tooltip: {
          title: "Autores",
          content:
            "En ImpactU aplicamos procesos rigurosos para garantizar la unicidad de los autores. Al integrar múltiples bases de datos, contrastamos la información con registros de talento humano e identificadores académicos, lo que nos permite reconocer a cada investigador de manera única. Además, incluimos a los autores internacionales que colaboran con investigadores colombianos, ofreciendo una visión completa de las redes de colaboración.",
        },
        data: { cluster: "a" },
        style: { size: 180, x: centerX, y: centerY - 40, labelFontSize: 18 },
      },
      {
        id: "institutions",
        description: `${data.total_institutions?.toLocaleString(
          "es-CO"
        )}\nInstituciones`,
        tooltip: {
          title: "Instituciones",
          content:
            "Reunimos instituciones de Colombia y del mundo identificadas a partir de las coautorías de los investigadores. Esto permite visualizar con qué universidades y centros de investigación internacionales se colabora, en qué áreas temáticas y con qué intensidad, ofreciendo una perspectiva global de la producción científica vinculada al país.",
        },
        data: { cluster: "b" },
        style: {
          size: 140,
          x: centerX - 240,
          y: centerY - 110,
          labelFontSize: 18,
        },
      },
      {
        id: "groups",
        description: `${data.total_groups?.toLocaleString("es-CO")}\nGrupos`,
        tooltip: {
          title: "Grupos de investigación",
          content:
            "Son la base reconocida para organizar la ciencia en Colombia. En ImpactU se integran y enriquecen con datos de múltiples fuentes, permitiendo conocer su producción, colaboraciones y áreas de especialización dentro del ecosistema académico.",
        },
        data: { cluster: "b" },
        style: {
          size: 110,
          x: centerX - 250,
          y: centerY - 290,
          labelFontSize: 18,
        },
      },
      {
        id: "faculties",
        description: `${data.total_faculties?.toLocaleString(
          "es-CO"
        )}\nUnidades\nAcadémicas`,
        tooltip: {
          title: "Unidades Académicas",
          content:
            "Integramos las facultades de las universidades fundadoras de ImpactU, como primer paso para mapear la organización académica de las instituciones. A medida que más universidades se sumen al proyecto, se incorporarán nuevas facultades, ampliando la visión de la investigación en el contexto de cada unidad académica.",
        },
        data: { cluster: "b" },
        style: {
          size: 80,
          x: centerX - 380,
          y: centerY + 10,
          labelFontSize: 13,
          labelOffsetY: -3,
        },
      },
      {
        id: "departments",
        description: `${data.total_departments?.toLocaleString(
          "es-CO"
        )}\nSubunidades\nAcadémicas`,
        tooltip: {
          title: "Subunidades Académicas",
          content:
            "Incluimos departamentos e institutos que permiten explorar la producción científica con un nivel de detalle único. Esta granularidad facilita identificar qué áreas específicas dentro de una institución generan conocimiento, algo que otros sistemas CRIS usualmente no ofrecen al limitar la búsqueda a nivel de institución o autor.",
        },
        data: { cluster: "b" },
        style: {
          size: 100,
          x: centerX - 170,
          y: centerY + 60,
          labelFontSize: 16,
          labelOffsetY: -1,
        },
      },
      {
        id: "products",
        description: `${data.total_products?.toLocaleString(
          "es-CO"
        )}\nProductos`,
        tooltip: {
          title: "Productos",
          content:
            "La plataforma integra y enriquece productos académicos de múltiples fuentes nacionales e internacionales (OpenAlex, ScienTI, Wikidata, Scimago, DOAJ, Datos Abiertos Minciencias, Google Scholar, ROR y bases institucionales). Cada registro es normalizado, mejorado y clasificado bajo el estándar de tipologías de ImpactU, garantizando una visión completa y consistente de la producción científica en Colombia.",
        },
        data: { cluster: "c" },
        style: {
          size: 200,
          x: centerX + 250,
          y: centerY - 240,
          labelFontSize: 18,
        },
      },
      {
        id: "patents",
        description: `${data.total_patents?.toLocaleString("es-CO")}\nPatentes`,
        tooltip: {
          title: "Patentes",
          content:
            "Integramos la información de patentes registrada en los datos abiertos de Minciencias, lo que permite visualizar los resultados de investigación con potencial de transferencia tecnológica y aplicación práctica.",
        },
        data: { cluster: "c" },
        style: {
          size: 75,
          x: centerX + 400,
          y: centerY - 120,
          labelFontSize: 17,
        },
      },
      {
        id: "projects",
        description: `${data.total_projects?.toLocaleString(
          "es-CO"
        )}\nProyectos`,
        tooltip: {
          title: "Proyectos",
          content:
            "Reunimos proyectos de investigación a partir de los datos abiertos de Minciencias y de las bases institucionales propias de cada universidad. Esto permite conocer las iniciativas científicas en curso y finalizadas, visibilizar sus resultados y conectar la producción académica con los esfuerzos de investigación que la originan.",
        },
        data: { cluster: "c" },
        style: {
          size: 105,
          x: centerX + 380,
          y: centerY + 20,
          labelFontSize: 18,
        },
      },
      {
        id: "news",
        description: `${data.total_institutions?.toLocaleString(
          "es-CO"
        )}\nNoticias`,
        tooltip: {
          title: "Noticias",
          content:
            "Gracias a un modelo de inteligencia artificial entrenado específicamente para este propósito, identificamos y recopilamos de forma automática todas las menciones y apariciones de nuestros autores en medios de comunicación y prensa digital. Esta capa de información complementa la producción científica tradicional al permitir a los usuarios conocer el impacto social, la visibilidad pública y la proyección mediática de la investigación, más allá del ámbito académico.",
        },
        data: { cluster: "c" },
        style: {
          size: 75,
          x: centerX + 220,
          y: centerY + 60,
          labelFontSize: 17,
        },
      },
      {
        id: "sources",
        description: `${data.total_sources?.toLocaleString("es-CO")}\nFuentes`,
        tooltip: {
          title: "Fuentes",
          content:
            "Identificamos diversas fuentes de información que abarcan revistas académicas, conferencias, series de libros, repositorios y plataformas de libros electrónicos, entre otras. Una de las fortalezas de ImpactU es que permite filtrar con precisión, por ejemplo, las revistas de acceso diamante, facilitando así el análisis del ecosistema de comunicación científica y sus diferentes canales de difusión.",
        },
        data: { cluster: "d" },
        style: {
          size: 100,
          x: centerX + 15,
          y: centerY - 260,
          labelFontSize: 18,
        },
      },
      {
        id: "open_access",
        description: `${data.total_open_access?.toLocaleString(
          "es-CO"
        )}\nAcceso\nAbierto`,
        tooltip: {
          title: "Acceso Abierto",
          content:
            "Identificamos todas las rutas de acceso abierto —Verde, Híbrido, Diamante, Dorado y Bronce— al integrar información de múltiples bases de datos. Cuando un mismo producto aparece con diferentes clasificaciones según la fuente, priorizamos siempre la mejor opción disponible. Además, facilitamos el acceso directo mediante enlaces al PDF, al DOI o al handle en repositorios institucionales.",
        },
        data: { cluster: "e" },
        style: {
          size: 130,
          x: centerX + 120,
          y: centerY - 420,
          labelFontSize: 18,
        },
      },
    ],

    edges: [
      { source: "authors", target: "institutions" },
      { source: "authors", target: "products" },
      { source: "institutions", target: "faculties" },
      { source: "institutions", target: "departments" },
      { source: "institutions", target: "groups" },
      { source: "departments", target: "faculties" },
      { source: "authors", target: "faculties" },
      { source: "authors", target: "departments" },
      { source: "authors", target: "groups" },
      { source: "authors", target: "patents" },
      { source: "authors", target: "projects" },
      { source: "authors", target: "news" },
      { source: "products", target: "sources" },
      { source: "products", target: "open_access" },
      { source: "sources", target: "open_access" },
    ],
  };

  const groupedNodesByCluster = graphData.nodes.reduce((acc, node) => {
    const cluster = node.data.cluster;
    acc[cluster] ||= [];
    acc[cluster].push(node.id);
    return acc;
  }, {});

  const createStyle = (baseColor) => ({
    fill: baseColor,
    stroke: baseColor,
    labelFill: "#fff",
    labelPadding: 4,
    labelBackgroundFill: baseColor,
    labelBackgroundRadius: 3,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = new Graph({
      container: containerRef.current,
      data: graphData,
      animation: false,
      node: {
        type: "breathing-circle",
        style: {
          halo: true,
          labelText: (d) => d.description,
          labelPlacement: "middle",
          labelFill: "#262626",
          labelFontWeight: 600,
        },
        palette: { field: "cluster" },
      },
      layout: false,
      plugins: [
        {
          type: "tooltip",
          getContent: (e, items) => {
            if (!items.length) return "";
            const item = items[0];

            if (!item.tooltip) return "";

            return `
        <div style="
          padding: 6px 10px; 
          max-width: 360px;
          font-family: 'Montserrat', sans-serif;
        ">
          <b style="
            font-size: 16px;
            font-family: 'Montserrat', sans-serif;
          ">${item?.tooltip?.title}</b>
          <p style="
            margin: 4px 0; 
            font-size: 13px;
            font-family: 'Montserrat', sans-serif;
          ">${item?.tooltip?.content}</p>
        </div>
      `;
          },
        },
        {
          key: "hull-a",
          type: "hull",
          members: groupedNodesByCluster["a"],
          labelText: "person",
          ...createStyle("#1783FF"),
        },
        {
          key: "hull-b",
          type: "hull",
          members: groupedNodesByCluster["b"],
          labelText: "affiliations",
          ...createStyle("#00C9C9"),
        },
        {
          key: "hull-c",
          type: "hull",
          members: groupedNodesByCluster["c"],
          labelText: "research",
          ...createStyle("#F08F56"),
        },
        {
          key: "hull-d",
          type: "hull",
          members: groupedNodesByCluster["d"],
          labelText: "sources",
          ...createStyle("#D580FF"),
        },
        {
          key: "hull-e",
          type: "hull",
          members: groupedNodesByCluster["e"],
          labelText: "open_access",
          ...createStyle("#7863FF"),
        },
      ],
      autoFit: "view",
    });

    graphRef.current = graph;
    graph.render();

    setTimeout(() => {
      graph.fitView(40);
    }, 0);

    return () => {
      graph.destroy();
      graphRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} className={styles.graph_container} />;
};

export default GraphChartOnHome;
