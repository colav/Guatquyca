import React, { useState } from "react";

/* Utilities */
import _ from "lodash";

/* UI Library Components */
const Menu = require("antd/lib/menu").default;
const Select = require("antd/lib/select").default;
const Tooltip = require("antd/lib/tooltip").default;

/* Icons */
const FlagOutlined = require("@ant-design/icons/FlagOutlined").default;

/* UI Library Sub-components*/
const { Option } = Select;
const { SubMenu } = Menu;

const CountriesFilter = (props) => {
  const [visible, setVisible] = useState(true);
  const subMenuProps = _.omit(props, "core", "setCountries");

  if (props.core.filters.countries) {
    const countriesList = [];
    props.core.filters.countries.map((country) =>
      countriesList.push(
        <Option key={country.country_code}>
          <div>
            <img
              alt={country.country}
              src={`https://flagcdn.com/20x15/${country.country_code.toLowerCase()}.png`}
            />{" "}
            {country.country} ({country.country_code})
          </div>
        </Option>
      )
    );

    setTimeout(() => setVisible(false), 2000);

    const onChange = (e) => {
      const countriesList = e.join(" ");
      props.setCountries(countriesList);
    };

    return (
      <SubMenu
        {...subMenuProps}
        icon={
          <Tooltip
            visible={visible}
            placement="right"
            title={"Nuevo filtro disponible"}
          >
            <FlagOutlined style={{ color: "#B3FFB8" }} />
          </Tooltip>
        }
        title="Países"
        style={{ paddingLeft: "0px" }}
      >
        <Menu.Item style={{ height: "auto", padding: "0px 10px 10px 0px" }}>
          <Select
            mode="multiple"
            size="small"
            style={{ width: "100%" }}
            placeholder="selecciona los países"
            showArrow={true}
            onChange={onChange}
            /* defaultValue={countriesList} */
            optionLabelProp="label"
          >
            {countriesList}
          </Select>
        </Menu.Item>
      </SubMenu>
    );
  }
  return (
    <SubMenu
      {...subMenuProps}
      disabled
      icon={<FlagOutlined />}
      title="Países"
    />
  );
};

export default CountriesFilter;
