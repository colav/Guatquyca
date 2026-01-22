"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input, Alert, Col, Row, Typography, Spin } from "antd";

import { useAuth } from "@/app/context/AuthContext";
import { loginRequest } from "@/lib/apis/auth.api";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();

  const router = useRouter();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async ({ email, password }) => {
    setError(null);
    setSubmitting(true);

    try {
      const result = await loginRequest(email, password);

      if (!result.success) {
        setError(result.error || "Error de autenticación");
        setSubmitting(false);
        return;
      }

      login({ role: result.rol, institution: result.institution });
      router.push(result.rol === "admin" ? "/admin/users" : "/submit");
    } catch (e) {
      setError(e.message || "Error inesperado. Intenta nuevamente.");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const reason = searchParams.get("reason");

    if (reason === "expired") {
      setError("Tu sesión expiró. Por favor inicia sesión nuevamente.");
    }
  }, [searchParams]);

  return (
    <Row justify="center" align="middle" style={{ minHeight: "60vh" }}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Title level={4} style={{ textAlign: "center" }}>
          Iniciar sesión
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Ingresa con tu correo institucional
        </Text>

        <Spin spinning={submitting}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item
              label="Correo"
              name="email"
              rules={[
                { required: true, message: "Ingresa tu correo" },
                { type: "email", message: "Correo inválido" },
              ]}
            >
              <Input placeholder="correo@institucion.edu.co" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Ingresa tu contraseña" }]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={submitting}
            >
              Entrar
            </Button>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
}
