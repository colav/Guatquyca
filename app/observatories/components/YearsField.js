"use client";

/* Components */
import Field from "./Field";
import { FilterSelect } from "./FilterSelect";

/**
 * «Temporalidad» (F77b): the two years of four digits, the same piece in the three boards. The handlers must keep their identity
 * (`stable` of `useStableChange`) so the selects do not re-render for nothing.
 *
 * @param {{ value: number, label: string }[]} options - Years of the board.
 * @param {number} yearFrom
 * @param {number} yearTo
 * @param {Function} onYearFrom - Called with the year chosen.
 * @param {Function} onYearTo
 */
export default function YearsField({ options, yearFrom, yearTo, onYearFrom, onYearTo }) {
  return (
    <Field label="Temporalidad">
      <div style={{ display: "flex", gap: 8 }}>
        <FilterSelect style={{ width: 94 }} popupMatchSelectWidth showSearch={false} allowClear={false} aria-label="Año inicial" options={options} value={yearFrom} onChange={onYearFrom} />
        <FilterSelect style={{ width: 94 }} popupMatchSelectWidth showSearch={false} allowClear={false} aria-label="Año final" options={options} value={yearTo} onChange={onYearTo} />
      </div>
    </Field>
  );
}
