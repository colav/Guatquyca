import React from "react";
import history from "../history";
const Result = require("antd/lib/result").default;
const Button = require("antd/lib/button").default;
const Card = require("antd/lib/card").default;

const ErrorWarning = () => {
  const takeMeBack = () => {
    history.goBack();
  };

  return (
    <Card
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="warning"
        title="Oops!"
        subTitle="Lo sentimos, algo salió mal con tu solicitud."
        extra={
          <Button type="primary" onClick={takeMeBack}>
            Regresar
          </Button>
        }
      />
    </Card>
  );
};

export default ErrorWarning;
