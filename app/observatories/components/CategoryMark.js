"use client";

/* lib */
import { CATEGORY_MARKS, darken } from "@/lib/observatories/palette";
import { shapePath } from "@/lib/observatories/shapes";

/**
 * Small figure of a category (shape, fill with the colour of the category and a 1 px border of a
 * darker tone). The same one in the legend of the scatter and in the table of rules.
 *
 * @param {string} category - Value of CATEGORY.
 * @param {number} [size] - Side of the square that holds it (px).
 */
export default function CategoryMark({ category, size = 14 }) {
  const mark = CATEGORY_MARKS[category] || CATEGORY_MARKS.lowCapacity;
  const r = size / 2 - 1.5;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} aria-hidden="true" focusable="false" style={{ flex: "0 0 auto" }}>
      <path d={shapePath(mark.shape, r)} fill={mark.color} stroke={darken(mark.color)} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
