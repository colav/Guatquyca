import React, { useState } from 'react';

/* UI Library Components */
import { Drawer, Button, ConfigProvider } from 'antd';

/* Icons */
import { FilterOutlined } from '@ant-design/icons';

/* Components */
import FilterMenu from '../components/FilterMenu';

/* Utilities */
/* import { useHistory } from 'react-router-dom'; */

const FilterDrawer = ({ core }) => {
  /* const history = useHistory(); */
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  /*   const onClick = () => {
    const URL = new URLSearchParams(history.location.search);
    let filteredURL = `${history.location.pathname}?`;

    filteredURL += URL.has('data') ? `data=${URL.get('data')}` : '';
    filteredURL += URL.has('id') ? `id=${URL.get('id')}` : '';
    filteredURL += URL.has('keywords')
      ? `&keywords=${URL.get('keywords')}`
      : '';
    core.setURL(filteredURL);
    history.push(filteredURL);
    onClose();
  }; */

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: '0 0 8px 8px',
          },
        }}
      >
        <Button
          size="large"
          icon={<FilterOutlined />}
          onClick={showDrawer}
          className="fixed-widget"
          type="primary"
        >
          Filtros
        </Button>
      </ConfigProvider>
      <Drawer
        headerStyle={{ backgroundColor: '#f0f2f5' }}
        bodyStyle={{ backgroundColor: '#fafbfc', padding: 0 }}
        footerStyle={{ backgroundColor: '#f0f2f5', textAlign: 'right' }}
        title="Filtros"
        placement={'left'}
        zIndex={1001}
        onClose={onClose}
        open={visible}
        footer={
          <Button size="large" /* onClick={onClick} */>Limpiar Filtros</Button>
        }
      >
        <FilterMenu core={core} onClose={onClose} />
        <p style={{ margin: '15px' }}>
          Filtros disponibles en una próxima actualización
        </p>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
