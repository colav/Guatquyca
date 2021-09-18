import React from "react";

/* UI Library Components */
const Select = require("antd/lib/select").default;

const SelectOption = Select.Option;

const GraphLayoutSelector = ({ layout, setLayout, len }) => {
  let layouts = [];

  len > 100
    ? (layouts = [
        { type: "grid" },
        { type: "circular" },
        { type: "radial" },
        { type: "concentric" },
        { type: "forceAtlas2" },
      ])
    : (layouts = [
        { type: "graphin-force" },
        { type: "grid" },
        { type: "circular" },
        { type: "radial" },
        { type: "force" },
        { type: "gForce" },
        { type: "concentric" },
        { type: "forceAtlas2" },
      ]);

  const handleChange = (value) => {
    setLayout(value);
  };

  return (
    <div>
      <Select style={{ width: "120px" }} value={layout} onChange={handleChange}>
        {layouts.map((item) => {
          const { type } = item;
          return (
            <SelectOption key={type} value={type}>
              {type}
            </SelectOption>
          );
        })}
      </Select>
    </div>
  );
};

export default GraphLayoutSelector;
