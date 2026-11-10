"use client";

/* Hooks */
import { memo, useEffect, useRef, useState } from "react";

/* Components & lib */
import FillHeight from "@/app/observatories/components/FillHeight";
import { BRAND, CENTER_COLORS, CENTER_OTHER_COLOR, NEUTRAL } from "@/lib/observatories/palette";
import { detectCommunities, graphLabelsAround, graphTooltip, groupAnchors } from "@/lib/observatories/collabGraph";

/* UI Library Components */
import { Typography } from "antd";

/* Constants */
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

function buildData({ nodes, links }, centers, centerNames, partition) {
  const maxDegree = Math.max(1, ...nodes.map((n) => n.degree));
  const maxWeight = Math.max(2, ...links.map((l) => l.weight));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  /* Q-33 (e): the collaborators of each node in this graph, and how many of them are of another centre. */
  const neighbours = new Map(nodes.map((n) => [n.id, []]));
  for (const l of links) {
    neighbours.get(l.source)?.push(l.target);
    neighbours.get(l.target)?.push(l.source);
  }
  return {
    nodes: nodes.map((n) => ({
      id: String(n.id),
      data: { name: n.name, degree: n.degree, weight: n.weight, center: n.center >= 0 ? centerNames[n.center] : "", color: n.center >= 0 ? centerColor(centers, n.center) : CENTER_OTHER_COLOR, radius: radius(n.degree, maxDegree), neighbours: neighbours.get(n.id).length, otherCenter: neighbours.get(n.id).filter((m) => byId.get(m)?.center !== n.center).length, community: partition.get(n.id) + 1 },
      style: {
        size: radius(n.degree, maxDegree) * 2,
        fill: n.center >= 0 ? centerColor(centers, n.center) : CENTER_OTHER_COLOR,
        stroke: NEUTRAL.light,
        lineWidth: 1.5,
        labelText: "",
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

/*
 * Look of the graph, approved by Luis (D-221, F97 capture `grafo_D2.png`): do not change without asking.
 * D_HULL: the hull of a community is faint (fill 0.05, thin outline, 4 px margin, rounded corner).
 * D_SPREAD: the anchors of the communities sit on an ellipse with this share of half the canvas.
 * D_PULL: strength of the pull of each node to the anchor of its community.
 * D_BETWEEN_WEAKER / D_BETWEEN_LONGER: an edge between two communities pulls this much less and is this much longer than one inside.
 */
const D_HULL = { fill: NEUTRAL.dark, fillOpacity: 0.05, stroke: NEUTRAL.dark, strokeOpacity: 0.35, lineWidth: 1, padding: 4, corner: "rounded" };
const D_SPREAD = 0.85;
const D_PULL = 0.4;
const D_BETWEEN_WEAKER = 0.15;
const D_BETWEEN_LONGER = 1.8;
/* zoom applied after fitting the graph to the canvas: the highest value with which no hull touches the border */
const FIT_ZOOM = 0.88;

/** Layout of the graph: weight-proportional force with a pull to the anchor of each community (Q-33 b, Q-38). */
function layoutOf(data, width, height) {
  /* Q-33 (b): no anchors by centre; the pull of an edge is proportional to its weight, so the groups that collaborate most end up together. */
  const weights = new Map(data.edges.map((e) => [e.id, e.data.weight]));
  const maxWeight = Math.max(1, ...weights.values());
  const sizesD = new Map(data.nodes.map((n) => [n.id, n.data.radius]));
  const weightOf = (e) => (weights.get(e.id) ?? 1) / maxWeight;
  /* a mild pull of each node towards the anchor of ITS COMMUNITY (not of its centre), so the communities do not interleave and their hulls can be read */
  const communityOf = new Map(data.nodes.map((n) => [n.id, n.data.community]));
  const anchorsD = groupAnchors([...new Set(communityOf.values())].sort((a, b) => a - b), width, height, D_SPREAD);
  const ends = new Map(data.edges.map((e) => [e.id, [communityOf.get(e.source), communityOf.get(e.target)]]));
  const between = (e) => { const p = ends.get(e.id); return p ? p[0] !== p[1] : false; };
  const anchorOfD = (n) => anchorsD.get(communityOf.get(n.id)) ?? { x: width / 2, y: height / 2 };
  return {
    type: "d3-force",
    /* an edge between two communities pulls less and is longer than one inside a community, so the communities do not melt into one */
    link: { distance: (e) => (120 - 80 * Math.sqrt(weightOf(e))) * (between(e) ? D_BETWEEN_LONGER : 1), strength: (e) => (0.05 + 0.95 * Math.sqrt(weightOf(e))) * (between(e) ? D_BETWEEN_WEAKER : 1) },
    manyBody: { strength: -200 },
    collide: { radius: (n) => (sizesD.get(n.id) ?? 8) + 6, strength: 1, iterations: 3 },
    x: { x: (n) => anchorOfD(n).x, strength: D_PULL },
    y: { y: (n) => anchorOfD(n).y, strength: D_PULL },
    center: false,
    iterations: 400,
  };
}

/**
 * Collaboration graph between groups, drawn with G6 (already in the platform). Size of a node = degree; thickness of an edge =
 * shared products; colour of a node = research centre; grey hull = community of collaboration (Louvain on the weighted edges). F98
 * (D-221): this is the only arrangement (it was the option D of F94 and F97). The canvas takes the height of the panel (520 px at
 * least); the labels go around each node and zooming in shows the ones that did not fit.
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
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* Create the graph when the size of the canvas changes (by more than 24 px). */
  useEffect(() => {
    if (!size.w || !size.h) return undefined;
    let cancelled = false;
    (async () => {
      const { Graph } = await import("@antv/g6");
      if (cancelled || !containerRef.current) return;
      const t0 = performance.now();
      const { graph: g, centers: c, centerNames: names } = latest.current;
      const width = size.w;
      const height = size.h;
      const partition = detectCommunities(g.nodes, g.links);
      const data = buildData(g, c, names, partition);
      /* Q-33 (c): the hull of D is the one of each community, in neutral grey */
      const hulls = [...new Set(partition.values())]
        .map((k) => ({ k, ids: data.nodes.filter((n) => partition.get(Number(n.id)) === k || partition.get(n.id) === k).map((n) => n.id) }))
        .filter(({ ids }) => ids.length >= 2)
        .map(({ k, ids }) => ({ type: "hull", key: `hull-community-${k}`, members: ids, ...D_HULL, label: true, labelText: `Comunidad ${k + 1}`, labelPlacement: "top", labelFontSize: 11, labelFill: NEUTRAL.dark }));
      const font = typeof document !== "undefined" ? getComputedStyle(document.body).fontFamily : "sans-serif";
      const instance = new Graph({
        container: containerRef.current,
        width,
        height,
        animation: false,
        autoResize: false,
        data,
        layout: layoutOf(data, width, height),
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
        /* the graph is fitted to the canvas (no hull touches the border) */
        instance.fitView({ when: "always", direction: "both" }, false).then(() => instance.zoomBy(FIT_ZOOM, false)).catch(() => {}).then(() => {
          /* Q-33 (d): in D almost every node has its name (abbreviated to 22 characters); the labels that overlap are hidden by degree, and zooming in shows the missing ones */
          let shown = "";
          const relabel = () => {
            if (instance.destroyed) return;
            const scale = 1 / (instance.getZoom() || 1);
            const all = graphLabelsAround(placed, { scale, maxChars: 22 });
            const key = [...all.entries()].map(([id, l]) => `${id}${l.placement}`).join(",");
            if (key === shown) return;
            shown = key;
            instance.updateNodeData(data.nodes.map((n) => ({ id: n.id, style: { labelText: all.get(n.id)?.text || "", labelPlacement: all.get(n.id)?.placement || "bottom" } })));
            instance.draw().catch(() => {});
          };
          relabel();
          let timer = null;
          instance.on("aftertransform", () => { clearTimeout(timer); timer = setTimeout(relabel, 120); });
          return undefined;
        }).then(() => instance.draw()).catch(() => {});
        if (containerRef.current) {
          containerRef.current.dataset.hullStyle = JSON.stringify(D_HULL);
          containerRef.current.dataset.drawMs = String(Math.round(performance.now() - t0));
          containerRef.current.dataset.variant = "D";
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
  }, [size.w, size.h, graph, centers, centerNames]);

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
      <FillHeight min={MIN_HEIGHT} max={MAX_HEIGHT}>
        {(h) => <GraphCanvas containerRef={containerRef} height={h} onSize={(w, hh) => setSize((s) => (Math.abs(s.w - w) > 24 || Math.abs(s.h - hh) > 24 || !s.w ? { w, h: hh } : s))} />}
      </FillHeight>
      <Typography.Text type="secondary" data-testid="community-legend" style={{ fontSize: 12, display: "block", marginTop: 6 }}>
          Comunidad (envolvente gris): grupos que colaboran más entre sí. El color de cada grupo es el de su centro: una comunidad con varios colores reúne grupos de áreas distintas.
      </Typography.Text>
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
