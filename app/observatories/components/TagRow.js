"use client";

/**
 * Row of tags of the header of a board (Q-19): the space between rows is the same as the space between tags (8 px both ways),
 * so a second line does not stick to the first. The tags lose their own right margin; the gap does the spacing.
 */
export default function TagRow({ children }) {
  return (
    <div className="obs-tag-row" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
      <style>{".obs-tag-row .ant-tag{margin:0}"}</style>
      {children}
    </div>
  );
}
