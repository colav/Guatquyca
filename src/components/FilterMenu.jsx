import React from 'react';

/* Components */
import YearsRangeFilter from './YearsRangeFilter';

/* UI Library Components */
import { Menu } from 'antd';

const FilterMenu = ({ core, onClose }) => {
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

  const filters = { start_year: 1990, end_year: 2020 };

  const items = [
    {
      label: 'Rango de años',
      key: '0',
      disabled: true,
      children: [
        {
          label: 'Año de inicio',
          key: '0-0',
          children: [
            {
              label: (
                <div style={{ width: '100%' }}>
                  <YearsRangeFilter filters={filters} />
                </div>
              ),
              key: '0-0-0',
            },
          ],
        },
        {
          label: 'Año de finalización',
          key: '0-1',
          children: [
            {
              label: <YearsRangeFilter filters={filters} />,
              key: '0-1-0',
            },
          ],
        },
      ],
    },
    {
      label: 'Institución',
      key: '1',
      disabled: true,
      children: [
        {
          label: 'Tipo',
          key: '1-0',
          children: [
            { label: 'Empresa', key: '1-0-0' },
            { label: 'Gobierno', key: '1-0-1' },
            { label: 'Universidad', key: '1-0-2' },
            { label: 'Otras', key: '1-0-3' },
          ],
        },
        {
          label: 'Origen',
          key: '1-1',
          children: [
            { label: 'Nacional', key: '1-1-0' },
            { label: 'Extranjera', key: '1-1-1' },
          ],
        },
      ],
    },
    {
      label: 'Facultad',
      disabled: true,
      key: '2',
    },
    {
      label: 'Departamento',
      disabled: true,
      key: '3',
    },
    {
      label: 'Grupo de investigación',
      disabled: true,
      key: '4',
    },
    {
      label: 'Investigador Principal',
      disabled: true,
      key: '5',
    },
    {
      label: 'País',
      disabled: true,
      key: '6',
    },
    {
      label: 'Tipo de Producto',
      disabled: true,
      key: '7',
      children: [
        {
          label: 'Generación de conocimiento',
          key: '7-0',
          children: [
            { label: 'Artículo de Investigación', key: '7-0-0' },
            { label: 'Libro', key: '7-0-1' },
            { label: 'etc.', key: '7-0-2' },
          ],
        },
        {
          label: 'Técnico o tecnológico',
          key: '7-1',
          children: [
            { label: 'Secreto Industrial', key: '7-1-0' },
            { label: 'etc', key: '7-1-1' },
          ],
        },
        {
          label: 'Apropiación Social',
          key: '7-2',
          children: [
            { label: 'Libro de divulgación', key: '7-2-0' },
            { label: 'etc', key: '7-2-1' },
          ],
        },
        {
          label: 'Formación',
          key: '7-3',
          children: [
            { label: 'Trabajo de grado', key: '7-3-0' },
            { label: 'Tesis de maestría', key: '7-3-1' },
            { label: 'etc', key: '7-3-2' },
          ],
        },
      ],
    },
    {
      label: 'Acceso',
      key: '8',
      disabled: true,
      children: [
        {
          label: 'Cerrado',
          key: '8-0',
        },
        {
          label: 'Abierto',
          key: '8-1',
          children: [
            { label: 'Dorado', key: '8-1-0' },
            { label: 'Verde', key: '8-1-1' },
            { label: 'Bronce', key: '8-1-2' },
            { label: 'Híbrido', key: '8-1-3' },
            { label: 'Sin identificar', key: '8-1-4' },
          ],
        },
      ],
    },
    {
      label: 'Bases de dato de origen',
      key: '9',
      disabled: true,
      children: [
        { label: 'WoS', key: '9-0' },
        { label: 'Scopus', key: '9-1' },
        { label: 'Scienti', key: '9-2' },
        { label: 'Lens', key: '9-3' },
        { label: 'Scielo', key: '9-4' },
        { label: 'D-Space', key: '9-5' },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"
      openKeys={openKeys}
      items={items}
      onOpenChange={onOpenChange}
      selectable={false}
    />
  );
};

export default FilterMenu;
