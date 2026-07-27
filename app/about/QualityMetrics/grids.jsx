"use client";

/* Components */
import { MetricCell, MetricDualCell } from "./cells";

/* Context */
import { useToken } from "./context";

/* Icons */
import { ShareAltOutlined, DisconnectOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Typography } from "antd";

/* Utils */
import {
  CELL_W,
  LABEL_W,
  shortDate,
  INTERSECTION_COLOR,
  EXCLUSIVE_COLOR,
} from "./utils";
const { Text } = Typography;

function EtlHeader({ run, isFirst, borderLine }) {
  const tok = useToken();
  return (
    <div
      className={styles.headerCell}
      style={{ borderLeft: borderLine, boxSizing: "border-box" }}
    >
      <Text
        style={{
          fontSize: 10,
          color: isFirst ? tok.colorPrimary : tok.colorTextTertiary,
          display: "block",
          fontWeight: 500,
        }}
      >
        {isFirst ? "Última actualización" : "ETL"}
      </Text>
      <Text
        style={{
          fontSize: isFirst ? 14 : 12,
          fontWeight: isFirst ? 600 : 400,
          color: tok.colorText,
          display: "block",
        }}
      >
        {shortDate(run.db_update)}
      </Text>
    </div>
  );
}

/* ─── CompareGrid ───────────────────────────────────────────── */
export function CompareGrid({ rows, history }) {
  const tok = useToken();
  if (!rows.length) return <Text type="secondary">Sin datos.</Text>;
  const minW = LABEL_W + CELL_W * history.length;
  const borderLine = `0.5px solid ${tok.colorSplit}`;

  return (
    <div className={styles.scrollContainer}>
      {/* header */}
      <div
        className={styles.headerRow}
        style={{
          minWidth: minW,
          borderBottom: borderLine,
          background: tok.colorFillAlter,
        }}
      >
        <div
          className={styles.headerLabelColumn}
          style={{ boxSizing: "border-box" }}
        />
        {history.map((run, i) => (
          <EtlHeader
            key={i}
            run={run}
            isFirst={i === 0}
            borderLine={borderLine}
          />
        ))}
      </div>

      {/* rows */}
      {rows.map((row, rowIndex) => (
        <div
          key={row.key}
          className={styles.tableRow}
          style={{
            minWidth: minW,
            borderBottom: rowIndex < rows.length - 1 ? borderLine : undefined,
          }}
        >
          <div
            className={styles.rowLabelCell}
            style={{
              background: tok.colorBgContainer,
              borderRight: borderLine,
              boxSizing: "border-box",
            }}
          >
            <Text
              className={styles.rowLabelText}
              style={{ fontWeight: row.isTotal ? 500 : 400 }}
            >
              {row.label}
            </Text>
          </div>
          {row.values.map((cell, i) => (
            <div
              key={i}
              className={styles.rowValueCell}
              style={{
                borderLeft: i > 0 ? borderLine : undefined,
                boxSizing: "border-box",
              }}
            >
              <MetricCell
                {...cell}
                isTotal={row.isTotal}
                lowerIsBetter={row.lowerIsBetter}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── ProvenanceGrid ────────────────────────────────────────── */
export function ProvenanceGrid({ rows, history }) {
  const tok = useToken();
  if (!rows.length) return <Text type="secondary">Sin datos.</Text>;
  const minW = LABEL_W + CELL_W * history.length;
  const borderLine = `0.5px solid ${tok.colorSplit}`;

  return (
    <div className={styles.scrollContainer}>
      {/* header */}
      <div
        className={styles.headerRow}
        style={{
          minWidth: minW,
          borderBottom: borderLine,
          background: tok.colorFillAlter,
        }}
      >
        {/* legend */}
        <div
          className={styles.provenanceLegend}
          style={{ boxSizing: "border-box" }}
        >
          <div className={styles.provenanceLegendItem}>
            <ShareAltOutlined
              className={styles.provenanceLegendIcon}
              style={{ color: INTERSECTION_COLOR }}
            />
            <Text
              style={{
                fontSize: 11,
                lineHeight: 1.4,
                color: tok.colorTextTertiary,
              }}
            >
              <Text
                style={{ fontSize: 11, color: tok.colorText, fontWeight: 500 }}
              >
                Intersección:{" "}
              </Text>
              Registros que aparecen al menos en estas fuentes. % sobre el total
              de la colección.
            </Text>
          </div>
          <div className={styles.provenanceLegendItem}>
            <DisconnectOutlined
              className={styles.provenanceLegendIcon}
              style={{ color: EXCLUSIVE_COLOR }}
            />
            <Text
              style={{
                fontSize: 11,
                lineHeight: 1.4,
                color: tok.colorTextTertiary,
              }}
            >
              <Text
                style={{ fontSize: 11, color: tok.colorText, fontWeight: 500 }}
              >
                Exclusiva:{" "}
              </Text>
              Del total anterior, los que no se cruzaron con ninguna otra base.
              % sobre la intersección.
            </Text>
          </div>
        </div>

        {/* ETL headers */}
        {history.map((run, i) => (
          <EtlHeader
            key={i}
            run={run}
            isFirst={i === 0}
            borderLine={borderLine}
          />
        ))}
      </div>

      {/* rows */}
      {rows.map((row, rowIndex) => (
        <div
          key={row.key}
          className={styles.tableRow}
          style={{
            minWidth: minW,
            borderBottom: rowIndex < rows.length - 1 ? borderLine : undefined,
          }}
        >
          <div
            className={styles.rowLabelCell}
            style={{
              background: tok.colorBgContainer,
              borderRight: borderLine,
              boxSizing: "border-box",
            }}
          >
            <Text className={styles.rowLabelText}>{row.label}</Text>
          </div>
          {row.values.map((cell, i) => (
            <div
              key={i}
              className={styles.rowValueCell}
              style={{
                borderLeft: i > 0 ? borderLine : undefined,
                boxSizing: "border-box",
              }}
            >
              <MetricDualCell {...cell} sourceKey={row.key} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
