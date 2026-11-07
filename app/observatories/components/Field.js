"use client";

/* Components */
import FilterHelp from "./FilterHelp";

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 2 };

/** Label + control of the bar of filters (F77, the same piece in the three boards). The width comes from the grid of `FilterRows`. */
export default function Field({ label, children, help = null }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <label style={labelStyle}>{label}</label>
        {help ? <FilterHelp label={label}>{help}</FilterHelp> : null}
      </div>
      {children}
    </div>
  );
}
