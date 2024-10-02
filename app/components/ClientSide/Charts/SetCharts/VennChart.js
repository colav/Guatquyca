"use client";

/* React */
import { useMemo } from "react";

/* Libraries */
import { VennDiagram, extractFromExpression } from "@upsetjs/react";
import { Empty } from "antd";

// Utility function to format numbers
function formatNumber(num) {
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    return `${thousands}k`;
  }
  return num.toString();
}

export default function VennChart({ data }) {
  // Check if the data contains the 'minciencias' key
  const isValidData = data && data.hasOwnProperty("minciencias");

  const { sets, combinations } = useMemo(() => {
    if (!isValidData) return { sets: [], combinations: [] };
    return extractFromExpression([
      {
        sets: ["Datos Abiertos Minciencias"],
        cardinality: data.minciencias,
        color: "#ffe682",
      },
      {
        sets: ["ScienTI"],
        cardinality: data.scienti,
        color: "#ffa0f0",
      },
      {
        sets: ["Google Académico"],
        cardinality: data.scholar,
        color: "#aac8ff",
      },
      {
        sets: ["OpenAlex"],
        cardinality: data.openalex,
        color: "#8cffe6",
      },
      {
        sets: ["Google Académico", "ScienTI"],
        cardinality: data.scienti_scholar,
        color: "#ff907a",
      },
      {
        sets: ["Google Académico", "Datos Abiertos Minciencias"],
        cardinality: data.minciencias_scholar,
        color: "#aab482",
      },
      {
        sets: ["Google Académico", "OpenAlex"],
        cardinality: data.openalex_scholar,
        color: "#8ce675",
      },
      {
        sets: ["ScienTI", "Datos Abiertos Minciencias"],
        cardinality: data.scienti_minciencias,
        color: "#aa7df0",
      },
      {
        sets: ["ScienTI", "OpenAlex"],
        cardinality: data.scienti_openalex,
        color: "#8ca0d8",
      },
      {
        sets: ["Datos Abiertos Minciencias", "OpenAlex"],
        cardinality: data.minciencias_openalex,
        color: "#5dc8e6",
      },
      {
        sets: ["Google Académico", "ScienTI", "Datos Abiertos Minciencias"],
        cardinality: data.scienti_minciencias_scholar,
        color: "#aa717a",
      },
      {
        sets: ["Google Académico", "ScienTI", "OpenAlex"],
        cardinality: data.scienti_openalex_scholar,
        color: "#8c906e",
      },
      {
        sets: ["Google Académico", "Datos Abiertos Minciencias", "OpenAlex"],
        cardinality: data.minciencias_openalex_scholar,
        color: "#5db475",
      },
      {
        sets: ["ScienTI", "Datos Abiertos Minciencias", "OpenAlex"],
        cardinality: data.scienti_minciencias_openalex,
        color: "#5d7dd8",
      },
      {
        sets: [
          "Google Académico",
          "ScienTI",
          "Datos Abiertos Minciencias",
          "OpenAlex",
        ],
        cardinality: data.minciencias_openalex_scholar_scienti,
        color: "#5d716e",
      },
    ]);
  }, [data]);

  // Calculate width and height based on window dimensions
  const chartWidth = Math.min(window.innerWidth * 0.8, 700);

  return isValidData ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}
    >
      <VennDiagram
        id="venn-chart"
        sets={sets}
        combinations={combinations}
        width={chartWidth}
        height={420}
        exportButtons={false}
        textColor="#4f5a63"
        fontSizes={{ valueLabel: "11px", setLabel: "14px" }}
        strokeColor="white"
      />
    </div>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Datos insuficientes"
      style={{ marginTop: "170px" }}
    />
  );
}
