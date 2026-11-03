"use client";

/* Hooks */
import { memo } from "react";

/* lib */
import { NEUTRAL, sequentialTile } from "@/lib/observatories/palette";

/* UI Library Components */
import { Col, Row } from "antd";

const fmt = (n) => Number(n).toLocaleString("es-CO");

/**
 * Cartogram of tiles (Colombia by department, Antioquia by subregion): one `Row` per grid row and
 * one `Col` per grid column. Colour = sequential scale on log10(n + 1), as the artifact.
 *
 * @param {Object<string, number[]>} tiles - Name -> [column, row].
 * @param {{ columns: number, rows: number }} grid
 * @param {Object<string, number>} counts - Name -> value.
 * @param {string} unit - Unit of the tooltip.
 * @param {(name: string) => string} [label] - Short label of a tile.
 * @param {number} [tileHeight]
 */
function TileCartogram({ tiles, grid, counts, unit, label = (n) => n, tileHeight = 46 }) {
  const byPosition = new Map(Object.entries(tiles).map(([name, [x, y]]) => [`${x},${y}`, name]));
  const max = Math.max(1, ...Object.keys(tiles).map((n) => counts[n] || 0));
  const scale = (v) => Math.log10(v + 1) / Math.log10(max + 1);

  return (
    <div role="img" aria-label="Cartograma de mosaicos">
      {Array.from({ length: grid.rows }, (_, y) => (
        <Row key={y} wrap={false} gutter={4} style={{ marginBottom: 4 }}>
          {Array.from({ length: grid.columns }, (_, x) => {
            const name = byPosition.get(`${x},${y}`);
            const value = name ? counts[name] || 0 : 0;
            const tile = name && value ? sequentialTile(scale(value)) : { background: NEUTRAL.light, color: "inherit" };
            return (
              <Col key={x} flex={`0 0 ${100 / grid.columns}%`}>
                {name ? (
                  <div title={`${name}: ${fmt(value)} ${unit}`} style={{ ...tile, height: tileHeight, borderRadius: 4, padding: "2px 4px", fontSize: 11, lineHeight: 1.2, textAlign: "center", overflow: "hidden" }}>
                    <div>{label(name)}</div>
                    <span style={{ fontWeight: 600, color: "inherit" }}>{value ? fmt(value) : ""}</span>
                  </div>
                ) : null}
              </Col>
            );
          })}
        </Row>
      ))}
    </div>
  );
}

export default memo(TileCartogram);
