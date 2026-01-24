"use client";

/* APIs */
import { loginRequest } from "@/lib/apis/auth.api";

/* Components */
import Spinner from "@/app/components/ClientSide/Spinner/Spinner";

/* Hooks */
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Form, Input, Alert, Col, Row, Typography, Spin } from "antd";

/* UI Library Subcomponents */
const { Title, Text } = Typography;

/**
 * LoginPage component
 *
 * Renders the login form for institutional users.
 * Handles authentication, error display, and session expiration.
 * Redirects users based on their role after successful login.
 *
 * @component
 * @returns {JSX.Element} The login page
 *
 * @example
 * <LoginPage />
 */
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
        return;
      }

      login({ role: result.rol, institution: result.institution });
      router.push(result.rol === "admin" ? "/admin/users" : "/submit");
    } catch (e) {
      setError(e.message || "Error inesperado. Intenta nuevamente.");
    } finally {
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
    <Row justify="center" align="middle" className={styles.loginRow}>
      <Col xs={24} sm={18} md={12} lg={8}>
        <Title level={4} className={styles.loginTitle}>
          Iniciar sesión
        </Title>

        <Text type="secondary" className={styles.loginSubtitle}>
          Ingresa con tu correo institucional
        </Text>

        <div className={styles.loginFormWrapper}>
          {submitting && (
            <div className={styles.loginSpinnerOverlay} aria-busy="true">
              <Spinner />
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                className={styles.loginErrorAlert}
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
        </div>
      </Col>
    </Row>
  );
}
