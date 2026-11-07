"use client";

/* UI Library Components */
import { Col } from "antd";

/* Components */
import FilterHelp from "./FilterHelp";

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 2 };

/**
 * Label + control of the bar of filters (F77, the same piece in the three boards). `span` is the width in columns of 24 from
 * `md` up.
 */
export default function Field({ label, children, span = 6, help = null }) {
  return (
    <Col xs={24} sm={12} md={span}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={labelStyle}>{label}</label>
        {help ? <FilterHelp label={label}>{help}</FilterHelp> : null}
      </div>
      {children}
    </Col>
  );
}
