import React from 'react';

/* Icons */
import { open_access_icon } from '../media/icons/open_access';

/* UI Library Components */
const Tag = require('antd/lib/tag').default;
const Tooltip = require('antd/lib/tooltip').default;

const OpenAccessStatus = ({ status }) => {
  const labels = {
    hybrid: 'Híbrido',
    green: 'Verde',
    gold: 'Dorado',
    closed: 'Cerrado',
    bronze: 'Bronce',
  };

  const colors = {
    hybrid: 'geekblue',
    green: 'green',
    gold: 'gold',
    closed: 'gray',
    bronze: 'volcano',
  };

  return (
    <Tooltip title={labels[status]}>
      <Tag icon={React.createElement(open_access_icon)} color={colors[status]}>
        {status === 'closed' ? 'Acceso Cerrado' : 'Acceso Abierto'}
      </Tag>
    </Tooltip>
  );
};

export default OpenAccessStatus;
