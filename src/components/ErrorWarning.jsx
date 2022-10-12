import React from 'react';

/* UI Library Components */
import { Card, Result } from 'antd';

const ErrorWarning = () => {
  return (
    <Card
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="warning"
        title="Oops!"
        subTitle={
          <>
            <b>Lo sentimos, algo salió mal con tu solicitud.</b>
            <p>Intenta nuevamente</p>
          </>
        }
      />
    </Card>
  );
};

export default ErrorWarning;
