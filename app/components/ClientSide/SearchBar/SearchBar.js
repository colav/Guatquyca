"use client";

/* Next */
import { useRouter } from "next/navigation";

import { useState } from "react";

/* UI Components */
import { Select, Input, ConfigProvider } from "antd";

/* UI Sub-components */
const { Search } = Input;

const AFFILIATIONLIST = ["institution", "department", "faculty", "group"];

const OPTIONS = [
  {
    label: "Autor",
    value: "person",
    key: "person",
  },
  {
    label: "Institución",
    value: "institution",
    key: "institution",
  },
  {
    label: "Unidad Académica",
    value: "faculty",
    key: "faculty",
  },
  {
    label: "Subunidad Académica",
    value: "department",
    key: "department",
  },
  {
    label: "Grupo",
    value: "group",
    key: "group",
  },
  {
    label: "Productos",
    value: "works",
    key: "works",
  },
  {
    label: "Proyectos",
    value: "projects",
    key: "projects",
    disabled: true,
  },
  {
    label: "Convenios",
    value: "agreements",
    key: "agreements",
    disabled: true,
  },
  {
    label: "Emprendimientos",
    value: "entrepreneurship",
    key: "entrepreneurship",
    disabled: true,
  },
];

/**
 * SearchBar is a "client-side" function component that displays a search bar.
 *
 * @returns {JSX.Element} A search bar component.
 */
export default function SearchBar() {
  const router = useRouter();
  const [selected, setSelected] = useState(OPTIONS[0]);

  const selectBefore = (
    <Select
      options={OPTIONS}
      labelInValue="true"
      defaultValue={OPTIONS[0]}
      onSelect={setSelected}
      popupMatchSelectWidth={215}
      listHeight={380}
    />
  );

  const searchRequest = (input) => {
    if (AFFILIATIONLIST.includes(selected.value)) {
      router.push(
        `/app/search/affiliations/${selected.value}?max=10&page=1&sort=citations`.concat(
          input ? `&keywords=${input}` : ""
        )
      );
    } else {
      router.push(
        `/app/search/${selected.value}?max=10&page=1&sort=citations`.concat(
          input ? `&keywords=${input}` : ""
        )
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          controlHeight: 42,
          colorFillAlter: "#fafafa",
          fontSize: 16,
        },
      }}
    >
      <Search
        addonBefore={selectBefore}
        placeholder={"Búsqueda por palabra clave"}
        onSearch={(input) => searchRequest(input)}
        enterButton
      />
    </ConfigProvider>
  );
}
