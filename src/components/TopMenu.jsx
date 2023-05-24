import React, { useEffect } from "react";

/* Hooks */
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

/* UI Library Components */
import { Menu } from "antd";

const TopMenu = ({ current, setCurrent }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setCurrent(searchParams.get("section"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const items = [
    { label: "Afiliaciones", key: "affiliations" },
    { label: "Investigación", key: "research" },
    { label: "Extensión", key: "extension" },
    { label: "Cooperación", key: "cooperation" },
  ];

  const defaultTab = {
    cooperation: "agreements",
    extension: "entrepreneurship",
    research: "products",
  };

  const onSelect = (item) => {
    if (Object.keys(defaultTab).includes(item.key)) {
      navigate(
        `${location.pathname}?type=${searchParams.get(
          "type"
        )}&id=${searchParams.get("id")}&section=${item.key}&tab=${
          defaultTab[item.key]
        }`
      );
    } else
      navigate(
        `${location.pathname}?type=${searchParams.get(
          "type"
        )}&id=${searchParams.get("id")}&section=${item.key}`
      );
  };

  return (
    <div className="topMenu-tabs--container">
      <Menu
        mode="horizontal"
        className="topMenu-tabs"
        selectedKeys={[current]}
        items={items}
        onSelect={onSelect}
      />
    </div>
  );
};

export default TopMenu;
