"use client";

/* Hooks */
import { memo, useEffect, useRef, useState } from "react";

/* Components & lib */
import FillHeight from "@/app/observatories/components/FillHeight";
import { BRAND, CENTER_COLORS, CENTER_OTHER_COLOR, NEUTRAL } from "@/lib/observatories/palette";
import { graphLabels, graphTooltip, GRAPH_VARIANTS, groupAnchors, ringPositions } from "@/lib/observatories/collabGraph";

/* UI Library Components */
import { Typography } from "antd";

/* Constants */
const REF_HEIGHT = 460;
const MIN_HEIGHT = 520;
const MAX_HEIGHT = 760;
const fmt = (n) => Number(n).toLocaleString("es-CO");

/** Colour of a centre: the first eight in colour, the rest in grey. */
const centerColor = (centers, index) => {
  const position = centers.indexOf(index);
  return position >= 0 && position < CENTER_COLORS.length ? CENTER_COLORS[position] : CENTER_OTHER_COLOR;
};

/** Radius of a node: square root of its degree, from 3 to 16 px (as the artifact). */
const radius = (degree, maxDegree) => 3 + (13 * Math.sqrt(degree)) / Math.sqrt(maxDegree || 1);

/** Group of a node: the position of its centre in the legend (the first eight), the last group for the others and for no centre. */
const groupOf = (node, centers) => {
  const position = node.center >= 0 ? centers.indexOf(node.center) : -1;
  return position >= 0 && position < CENTER_COLORS.length ? position : CENTER_COLORS.length;
};

function buildData({ nodes, links }, centers, centerNames, preset) {
  const maxDegree = Math.max(1, ...nodes.map((n) => n.degree));
  const maxWeight = Math.max(2, ...links.map((l) => l.weight));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return {
    nodes: nodes.map((n) => ({
      id: String(n.id),
      data: { name: n.name, degree: n.degree, weight: n.weight, center: n.center >= 0 ? centerNames[n.center] : "", color: n.center >= 0 ? centerColor(centers, n.center) : CENTER_OTHER_COLOR, group: groupOf(n, centers), radius: radius(n.degree, maxDegree) },
      style: {
        size: radius(n.degree, maxDegree) * 2,
        fill: n.center >= 0 ? centerColor(centers, n.center) : CENTER_OTHER_COLOR,
        stroke: NEUTRAL.light,
        lineWidth: 1.5,
        labelText: "",
        ...(preset && preset[n.id] ? { x: preset[n.id].x, y: preset[n.id].y } : {}),
      },
    })),
    edges: links.map((l, i) => ({
      id: `e${i}`,
      source: String(l.source),
      target: String(l.target),
      /* Q-25 (d): the edge carries its own data, so its tooltip says the two groups and the shared products. */
      data: {
        sourceName: byId.get(l.source)?.name ?? "",
        targetName: byId.get(l.target)?.name ?? "",
        sourceCenter: byId.get(l.source)?.center >= 0 ? centerNames[byId.get(l.source).center] : "",
        targetCenter: byId.get(l.target)?.center >= 0 ? centerNames[byId.get(l.target).center] : "",
        weight: l.weight,
      },
      style: { lineWidth: 0.6 + (5.4 * (l.weight - 2)) / Math.max(1, maxWeight - 2), increasedLineWidthForHitTesting: 8 },
    })),
  };
}

/** Layout of the variant: «ref» is the one of before (F92 reference), A and C pull each centre to its own anchor, B is preset. */
function layoutOf(variant, data, centers, width, height) {
  if (variant === "B") return undefined;
  if (variant === "ref") {
    return { type: "d3-force", link: { distance: 40, strength: 0.4 }, manyBody: { strength: -140 }, center: { x: width / 2, y: height / 2 }, collide: { radius: 12 }, iterations: 220 };
  }
  const groups = new Map(data.nodes.map((n) => [n.id, n.data.group]));
  const anchors = groupAnchors([...new Set(groups.values())].sort((a, b) => a - b), width, height);
  const anchorOf = (n) => anchors.get(groups.get(n.id)) ?? { x: width / 2, y: height / 2 };
  const sizes = new Map(data.nodes.map((n) => [n.id, n.data.radius]));
  return {
    type: "d3-force",
    x: { x: (n) => anchorOf(n).x, strength: 0.32 },
    y: { y: (n) => anchorOf(n).y, strength: 0.32 },
    link: { distance: 70, strength: (e) => (groups.get(String(e.source?.id ?? e.source)) === groups.get(String(e.target?.id ?? e.target)) ? 0.2 : 0.015) },
    manyBody: { strength: -260 },
    collide: { radius: (n) => (sizes.get(n.id) ?? 8) + 6, strength: 1, iterations: 3 },
    center: false,
    iterations: 320,
  };
}

/**
 * Collaboration graph between groups, drawn with G6 (already in the platform). Size of a node = degree; thickness of an edge =
 * shared products; colour = research centre. F92 (Q-25): four arrangements behind the test parameter `?grafo=`: «ref» (the one of
 * before, 460 px), «A» (each centre is pulled to an anchor of an ellipse), «B» (a ring per centre) and «C» (A with a soft hull in the
 * colour of each centre). Without the parameter the reference is drawn: Luis chooses. The canvas takes the height of the panel
 * (520 px at least); labels have a white background and only the biggest nodes that do not overlap carry one.
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
  const [variant, setVariant] = useState("ref");
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* The variant of the test parameter (read once in the browser). */
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("grafo");
    if (v && GRAPH_VARIANTS.includes(v)) setVariant(v);
  }, []);

  /* Create the graph when the variant or the size of the canvas changes (by more than 24 px). */
  useEffect(() => {
    if (!size.w || !size.h) return undefined;
    let cancelled = false;
    (async () => {
      const { Graph } = await import("@antv/g6");
      if (cancelled || !containerRef.current) return;
      const t0 = performance.now();
      const { graph: g, centers: c, centerNames: names } = latest.current;
      const width = size.w;
      const height = variant === "ref" ? REF_HEIGHT : size.h;
      const preset = variant === "B" ? ringPositions(g.nodes.map((n) => ({ id: n.id, group: groupOf(n, c), r: radius(n.degree, Math.max(1, ...g.nodes.map((m) => m.degree))), degree: n.degree })), width, height) : null;
      const data = buildData(g, c, names, preset);
      const groups = new Map();
      data.nodes.forEach((n) => groups.set(n.data.group, [...(groups.get(n.data.group) || []), n.id]));
      const hulls = variant === "C"
        ? [...groups.entries()].filter(([, ids]) => ids.length >= 2).map(([group, ids]) => {
            const color = group < CENTER_COLORS.length ? CENTER_COLORS[group] : CENTER_OTHER_COLOR;
            return { type: "hull", key: `hull-${group}`, members: ids, fill: color, fillOpacity: 0.12, stroke: color, strokeOpacity: 0.4, lineWidth: 1, padding: 12, corner: "smooth" };
          })
        : [];
      const font = typeof document !== "undefined" ? getComputedStyle(document.body).fontFamily : "sans-serif";
      const instance = new Graph({
        container: containerRef.current,
        width,
        height,
        animation: false,
        autoResize: false,
        data,
        ...(layoutOf(variant, data, c, width, height) ? { layout: layoutOf(variant, data, c, width, height) } : {}),
        node: { style: { labelFill: NEUTRAL.dark, labelFontSize: 10.5, labelFontFamily: font, labelPlacement: "bottom", labelBackground: true, labelBackgroundFill: BRAND.white, labelBackgroundOpacity: 0.85, labelBackgroundRadius: 3, labelPadding: [1, 3] } },
        edge: { style: { stroke: NEUTRAL.medium, strokeOpacity: 0.7 } },
        behaviors: ["zoom-canvas", "drag-canvas", "drag-element"],
        plugins: [
          ...hulls,
          {
            type: "tooltip",
            getContent: async (e, items) => graphTooltip(e.targetType, items[0]?.data || {}, font),
            style: { ".tooltip": { visibility: "hidden", padding: "0", background: "transparent", boxShadow: "none" } },
          },
        ],
      });
      graphRef.current = instance;
      let labeled = false;
      instance.on("afterrender", () => {
        if (labeled || instance.destroyed) return;
        labeled = true;
        const placed = data.nodes.map((n) => ({ id: n.id, name: n.data.name, degree: n.data.degree, r: n.data.radius, ...(() => { const [x, y] = instance.getElementPosition(n.id); return { x, y }; })() }));
        const chosen = graphLabels(placed);
        instance.updateNodeData(data.nodes.map((n) => ({ id: n.id, style: { labelText: chosen.get(n.id) || "" } })));
        /* the new arrangements are fitted to the canvas (the biggest cluster never leaves it); the reference stays as it was */
        (variant === "ref" ? Promise.resolve() : instance.fitView({ when: "always", direction: "both" }, false).then(() => instance.zoomBy(0.92, false))).catch(() => {}).then(() => instance.draw()).catch(() => {});
        if (containerRef.current) {
          containerRef.current.dataset.drawMs = String(Math.round(performance.now() - t0));
          containerRef.current.dataset.variant = variant;
        }
      });
      containerRef.current.__g6 = instance;
      instance.render().catch(() => {});
    })();
    return () => {
      cancelled = true;
      if (graphRef.current) {
        try {
          graphRef.current.destroy();
        } catch {
          /* already destroyed */
        }
        graphRef.current = null;
      }
    };
  }, [variant, size.w, size.h, graph, centers, centerNames]);

  return (
    <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
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
      <FillHeight min={variant === "ref" ? REF_HEIGHT : MIN_HEIGHT} max={variant === "ref" ? REF_HEIGHT : MAX_HEIGHT}>
        {(h) => <GraphCanvas containerRef={containerRef} height={h} onSize={(w, hh) => setSize((s) => (Math.abs(s.w - w) > 24 || Math.abs(s.h - hh) > 24 || !s.w ? { w, h: hh } : s))} />}
      </FillHeight>
      <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 6 }}>
        {fmt(graph.groupsWithCollaboration)} grupos UdeA con al menos una colaboración y {fmt(graph.pairs)} pares de grupos en el filtro actual.
      </Typography.Paragraph>
    </div>
  );
}

/** The element of the canvas: it tells its size to the graph. */
function GraphCanvas({ containerRef, height, onSize }) {
  useEffect(() => {
    const node = containerRef.current;
    if (node) onSize(Math.round(node.clientWidth), Math.round(height));
  }, [height, containerRef, onSize]);
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => onSize(Math.round(node.clientWidth), Math.round(node.clientHeight)));
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef, onSize]);
  return <div ref={containerRef} data-testid="collab-graph" style={{ width: "100%", height }} />;
}

export default memo(CollabGraph);
