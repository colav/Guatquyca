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
 * StatusFilter dynamically handles the filtering logic for any status types provided in the data.
 *
 * @param {Array} data - Array containing status options with their children (if any).
 * @returns {JSX.Element} The StatusFilter component.
 */
export default function StatusFilter({ data }) {
  const query = useSearchParams();
  const urlStatus = query.has("status") ? query.get("status").split(",") : [];

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
      {data.map(({ title, value, children }) => {
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
              {title === "Cerrado" ? "Acceso cerrado" : title}
            </Checkbox>
          );
      })}

      <Row justify="end" style={{ marginTop: "20px" }}>
        <DeleteFilter filterType="status" queryParams={query} />
        <ApplyFilter value={filterValue} filterType="status" query={query} />
      </Row>
    </>
  );
}
