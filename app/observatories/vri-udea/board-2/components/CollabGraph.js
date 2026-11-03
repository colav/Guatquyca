"use client";

/* Hooks */
import { memo, useEffect, useRef } from "react";

/* lib */
import { CENTER_COLORS, CENTER_OTHER_COLOR, NEUTRAL } from "@/lib/observatories/palette";

/* UI Library Components */
import { Typography } from "antd";

/* Constants */
const HEIGHT = 460;
const LABELED_NODES = 10;
const fmt = (n) => Number(n).toLocaleString("es-CO");

/** Colour of a centre: the first eight in colour, the rest in grey. */
const centerColor = (centers, index) => {
  const position = centers.indexOf(index);
  return position >= 0 && position < CENTER_COLORS.length ? CENTER_COLORS[position] : CENTER_OTHER_COLOR;
};

/** Radius of a node: square root of its degree, from 3 to 16 px (as the artifact). */
const radius = (degree, maxDegree) => 3 + (13 * Math.sqrt(degree)) / Math.sqrt(maxDegree || 1);

function buildData({ nodes, links }, centers, centerNames) {
  const maxDegree = Math.max(1, ...nodes.map((n) => n.degree));
  const maxWeight = Math.max(2, ...links.map((l) => l.weight));
  const labeled = new Set([...nodes].sort((a, b) => b.degree - a.degree).slice(0, LABELED_NODES).map((n) => n.id));
  return {
    nodes: nodes.map((n) => ({
      id: String(n.id),
      data: { name: n.name, degree: n.degree, weight: n.weight, center: n.center >= 0 ? centerNames[n.center] : "" },
      style: {
        size: radius(n.degree, maxDegree) * 2,
        fill: n.center >= 0 ? centerColor(centers, n.center) : CENTER_OTHER_COLOR,
        stroke: NEUTRAL.light,
        lineWidth: 1.5,
        labelText: labeled.has(n.id) ? (n.name.length > 26 ? `${n.name.slice(0, 25)}…` : n.name) : "",
        labelFontSize: 9.5,
      },
    })),
    edges: links.map((l, i) => ({
      id: `e${i}`,
      source: String(l.source),
      target: String(l.target),
      style: { lineWidth: 0.6 + (5.4 * (l.weight - 2)) / Math.max(1, maxWeight - 2) },
    })),
  };
}

/**
 * Collaboration graph between groups, drawn with G6 (already in the platform) and the d3-force
 * layout, as measured in the diagnostic report (60 nodes). Size of a node = degree; thickness of
 * an edge = shared products; colour = research centre.
 *
 * @param {{ nodes: Object[], links: Object[] }} graph
 * @param {number[]} centers - Centre indexes in colour order (the legend).
 * @param {string[]} centerNames - Names of every centre.
 */
function CollabGraph({ graph, centers, centerNames }) {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const latest = useRef({ graph, centers, centerNames });
  latest.current = { graph, centers, centerNames };

  /* Create the graph once. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { Graph } = await import("@antv/g6");
      if (cancelled || !containerRef.current) return;
      const width = containerRef.current.clientWidth || 760;
      const { graph: g, centers: c, centerNames: names } = latest.current;
      const instance = new Graph({
        container: containerRef.current,
        width,
        height: HEIGHT,
        animation: false,
        autoResize: true,
        data: buildData(g, c, names),
        layout: {
          type: "d3-force",
          link: { distance: 40, strength: 0.4 },
          manyBody: { strength: -140 },
          center: { x: width / 2, y: HEIGHT / 2 },
          collide: { radius: 12 },
          iterations: 220,
        },
        node: { style: { labelFill: NEUTRAL.dark } },
        edge: { style: { stroke: NEUTRAL.medium, strokeOpacity: 0.7 } },
        behaviors: ["zoom-canvas", "drag-canvas", "drag-element"],
        plugins: [
          {
            type: "tooltip",
            getContent: (e, items) =>
              `<div><b>${items[0].data?.name ?? ""}</b><br>${items[0].data?.center ? `${items[0].data.center}<br>` : ""}Grado: ${fmt(items[0].data?.degree ?? 0)} grupos · ${fmt(items[0].data?.weight ?? 0)} productos compartidos</div>`,
          },
        ],
      });
      graphRef.current = instance;
      instance.render().catch(() => {});
    })();
    return () => {
      cancelled = true;
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
      }
    };
  }, []);

  /* Update the data when the filters change. */
  useEffect(() => {
    const instance = graphRef.current;
    if (!instance || instance.destroyed) return;
    instance.setData(buildData(graph, centers, centerNames));
    instance.render().catch(() => {});
  }, [graph, centers, centerNames]);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, marginBottom: 6 }}>
        {centers.slice(0, CENTER_COLORS.length).map((c, i) => (
          <span key={c}>
            <i style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: CENTER_COLORS[i], marginRight: 6 }} />
            {centerNames[c]}
          </span>
        ))}
        {centers.length > CENTER_COLORS.length ? (
          <span>
            <i style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: CENTER_OTHER_COLOR, marginRight: 6 }} />
            Otros centros
          </span>
        ) : null}
      </div>
      <div ref={containerRef} style={{ width: "100%", height: HEIGHT }} />
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6 }}>
        {fmt(graph.groupsWithCollaboration)} grupos UdeA con al menos una colaboración y {fmt(graph.pairs)} pares de grupos en el filtro actual.
      </Typography.Paragraph>
    </div>
  );
}

export default memo(CollabGraph);
