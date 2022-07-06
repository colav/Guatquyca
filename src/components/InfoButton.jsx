import React from 'react';

/* UI Library Components */
import { Modal } from 'antd';

/* Icons */
import { InfoCircleOutlined } from '@ant-design/icons';

/* Utitlites */
import { infoText } from '../utils/infoText';

const InfoButton = ({ title = 'Información', type }) => {
  const info = () => {
    Modal.info({
      title: title,
      content: infoText[type],
      width: '700px',
      maskClosable: true,
    });
  };

  return (
    <InfoCircleOutlined
      onClick={info}
      style={{ color: '#063966', fontSize: '20px' }}
    />
  );
};

export default InfoButton;
