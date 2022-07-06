import React, { useState, useEffect } from 'react';

/* Components */
import FilterMultipleSelect from './FilterMultipleSelect';
import YearsRangeFilter from './YearsRangeFilter';

/* UI Library Components */
import { Button, Menu } from 'antd';

/* Icons */
import {
  BankOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

/* Utilities */
/* import { useHistory } from 'react-router-dom'; */

/* UI Library Sub-components */
const { SubMenu } = Menu;

const FilterMenu = ({ core, onClose }) => {
  /* const history = useHistory(); */
  const [institutions, setInstitutions] = useState('');
  const [groups, setGroups] = useState('');
  const [years, setYears] = useState('');
  const rootSubmenuKeys = ['institutions', 'groups', 'years'];
  const [openKeys, setOpenKeys] = React.useState(['']);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  /*   const onClick = (type) => {
    const URL = new URLSearchParams(history.location.search);
    let filteredURL = `${history.location.pathname}?`;

    filteredURL += URL.has('data') ? `data=${URL.get('data')}` : '';
    filteredURL += URL.has('id') ? `id=${URL.get('id')}` : '';
    filteredURL += URL.has('keywords')
      ? `&keywords=${URL.get('keywords')}`
      : '';
    if (type !== 'institutions') {
      filteredURL += URL.has('institution')
        ? `&institution=${URL.get('institution')}`
        : '';
    }
    if (type !== 'groups') {
      filteredURL += URL.has('group') ? `&group=${URL.get('group')}` : '';
    }
    if (type !== 'years') {
      filteredURL += URL.has('start_year')
        ? `&start_year=${URL.get('start_year')}`
        : '';
      filteredURL += URL.has('end_year')
        ? `&end_year=${URL.get('end_year')}`
        : '';
    }

    if (type === 'institutions' && core.filters.institutions && institutions) {
      filteredURL += `&institution=${institutions}`;
    }
    if (type === 'groups' && core.filters.groups && groups) {
      filteredURL += `&group=${groups}`;
    }
    if (type === 'years' && core.filters.start_year && years) {
      filteredURL += `&start_year=${years.start_year}&end_year=${years.end_year}`;
    }
    core.setURL(filteredURL);
    history.push(filteredURL);
    onClose();
  }; */

  useEffect(() => {
    //core.setFilters(null);
    setInstitutions('');
    setGroups('');
    setYears('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [core.URL]);

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectable={false}
    >
      {core.filters?.institutions ? (
        <SubMenu
          key="institutions"
          title="Instituciones"
          icon={<BankOutlined />}
        >
          <Menu.Item key="1" style={{ height: 'auto' }}>
            <FilterMultipleSelect
              list={core.filters?.institutions}
              setFilter={setInstitutions}
            />
            <div className="filter__button">
              <Button
                size="small"
                type="primary"
                /*  onClick={() => onClick('institutions')} */
                disabled={institutions ? false : true}
              >
                Aplicar Filtro
              </Button>
            </div>
          </Menu.Item>
        </SubMenu>
      ) : (
        <SubMenu
          key="institutions"
          title="Instituciones"
          icon={<BankOutlined />}
          disabled={true}
        />
      )}
      {core.filters?.groups ? (
        <SubMenu key="groups" title="Grupos" icon={<TeamOutlined />}>
          <Menu.Item key="2" style={{ height: 'auto' }}>
            <FilterMultipleSelect
              list={core.filters?.groups}
              setFilter={setGroups}
            />
            <div className="filter__button">
              <Button
                size="small"
                type="primary"
                /* onClick={() => onClick('groups')} */
                disabled={groups ? false : true}
              >
                Aplicar Filtro
              </Button>
            </div>
          </Menu.Item>
        </SubMenu>
      ) : (
        <SubMenu
          key="groups"
          title="Grupos"
          icon={<TeamOutlined />}
          disabled={true}
        />
      )}
      {core.filters?.start_year ? (
        <SubMenu key="years" title="Rango de años" icon={<CalendarOutlined />}>
          <Menu.Item key="3" style={{ height: 'auto' }}>
            {core.filters?.start_year && (
              <YearsRangeFilter filters={core.filters} setYears={setYears} />
            )}
            <div className="filter__button">
              <Button
                size="small"
                type="primary"
                /* onClick={() => onClick('years')} */
                disabled={years ? false : true}
              >
                Aplicar Filtro
              </Button>
            </div>
          </Menu.Item>
        </SubMenu>
      ) : (
        <SubMenu
          key="years"
          title="Rango de años"
          icon={<CalendarOutlined />}
          disabled={true}
        />
      )}
    </Menu>
  );
};

export default FilterMenu;
