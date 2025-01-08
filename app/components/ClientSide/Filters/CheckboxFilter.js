"use client";

/* Components */
import ApplyFilter from "./ApplyFilter";
import DeleteFilter from "./DeleteFilter";

/* Hooks */
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/* UI Library Components */
import { Row, Checkbox } from "antd";

/* UI Library Sub-components */
const { Group: CheckboxGroup } = Checkbox;

/**
 * CheckboxFilter is a client-side functional component that provides a checkbox filter for selecting multiple items.
 * It allows users to apply and delete filters based on the selected items.
 *
 * @component
 * @param {Array} data - The data for the CheckboxGroup component.
 * @param {string} filterType - The type of filter to apply.
 * @returns {JSX.Element} The CheckboxFilter component.
 */
export default function CheckboxFilter({ data, filterType }) {
  if (!data.length)
    return "No hay datos para este filtro con los criterios previamente seleccionados.";
  const query = useSearchParams();
  const urlStatus = query.has(filterType)
    ? query.get(filterType).split(",")
    : [];

  const initialState = data.reduce((acc, { value, children }) => {
    if (children) {
      acc[value] = children
        .map((child) => child.value)
        .filter((childValue) => urlStatus.includes(childValue));
    } else {
      acc[value] = urlStatus.includes(value);
    }
    return acc;
  }, {});

  const [statusState, setStatusState] = useState(initialState);
  const [filterValue, setFilterValue] = useState(urlStatus);

  useEffect(() => {
    const combinedFilter = Object.entries(statusState).flatMap(([key, value]) =>
      value === true ? [key] : value || []
    );
    setFilterValue(combinedFilter);
  }, [statusState]);

  const handleCheckboxChange = (status, checked) => {
    setStatusState((prev) => ({
      ...prev,
      [status]: checked,
    }));
  };

  const handleGroupChange = (status, selectedValues) => {
    setStatusState((prev) => ({
      ...prev,
      [status]: selectedValues,
    }));
  };

  return (
    <>
      {data.map(({ title, value, children, label }) => {
        if (children) {
          const allChildrenChecked =
            statusState[value].length === children.length;
          const someChildrenChecked =
            statusState[value].length > 0 && !allChildrenChecked;

          return (
            <div key={value}>
              <Checkbox
                indeterminate={someChildrenChecked}
                onChange={(e) =>
                  handleGroupChange(
                    value,
                    e.target.checked ? children.map((c) => c.value) : []
                  )
                }
                checked={allChildrenChecked}
              >
                Acceso Abierto
              </Checkbox>
              <br />
              <CheckboxGroup
                options={children.map(({ title, value }) => ({
                  label: title,
                  value,
                }))}
                value={statusState[value]}
                onChange={(selectedValues) =>
                  handleGroupChange(value, selectedValues)
                }
                style={{ marginLeft: "22px" }}
              />
            </div>
          );
        }

        if (value != "unknown")
          return (
            <Checkbox
              key={value}
              checked={statusState[value] === true}
              onChange={(e) => handleCheckboxChange(value, e.target.checked)}
            >
              {title === "Cerrado" ? "Acceso cerrado" : title || label}
            </Checkbox>
          );
      })}

      <Row justify="end" style={{ marginTop: "12px" }}>
        <DeleteFilter filterType={filterType} queryParams={query} />
        <ApplyFilter
          value={filterValue}
          filterType={filterType}
          query={query}
        />
      </Row>
    </>
  );
}
