"use client";

import { Modal, Form, Input, message } from "antd";
import { useState, useEffect } from "react";

/* APIs */
import { createAdminUser, updateAdminUser } from "@/lib/apis/admin.api";

/* Hooks */
import { useSessionExpired } from "@/lib/hooks/useSessionExpired";

/* Components */
import InstitutionSearch from "./InstitutionSearch";

/**
 * UserFormModal component
 *
 * Modal form for creating or editing an admin user.
 * Handles form validation, submission, and session expiration.
 * Uses InstitutionSearch for institution selection when creating a user.
 *
 * @component
 * @param {boolean} open - Whether the modal is open
 * @param {"create"|"edit"} [mode="create"] - Form mode: "create" or "edit"
 * @param {Object|null} [user=null] - User object to edit (if mode is "edit")
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onCreated - Callback after user is created/updated
 * @returns {JSX.Element} The user form modal
 *
 * @example
 * <UserFormModal
 *   open={open}
 *   mode="create"
 *   user={null}
 *   onClose={closeModal}
 *   onCreated={refreshUsers}
 * />
 */
export default function UserFormModal({
  open,
  mode = "create",
  user = null,
  onClose,
  onCreated,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleSessionExpired = useSessionExpired();

  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (isEdit && user) {
      form.setFieldsValue({
        email: user.email,
        rol: user.rol,
        institution: user.institucion,
        ror_id: user.ror_id,
      });
    } else {
      form.resetFields();
    }
  }, [open, isEdit, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEdit) {
        const payload = {
          email: values.email,
          rol: values.rol,
        };

        await updateAdminUser(user.email, payload);
        message.success("Usuario actualizado correctamente", 6);
      } else {
        const payload = {
          institution: values.institution,
          ror_id: values.ror_id,
          rol: values.rol,
        };

        await createAdminUser(values.email, payload);
        message.success("Usuario creado correctamente", 6);
      }

      form.resetFields();
      onCreated();
      onClose();
    } catch (err) {
      if (err?.status === 401 || err?.message === "SESSION_EXPIRED") {
        handleSessionExpired();
      } else if (err?.message) {
        message.error(err.message, 6);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Editar usuario" : "Crear nuevo usuario"}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={isEdit ? "Guardar cambios" : "Crear"}
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form} preserve={false}>
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: "Ingrese el correo" },
            { type: "email", message: "Email inválido" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Rol"
          name="rol"
          rules={[{ required: true, message: "Seleccione un rol" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Institución"
          name="institution"
          rules={
            isEdit
              ? []
              : [{ required: true, message: "Seleccione una institución" }]
          }
        >
          {isEdit ? (
            <Input disabled />
          ) : (
            <InstitutionSearch
              onSelect={({ institution, ror_id }) => {
                form.setFieldsValue({ institution, ror_id });
              }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="ror_id"
          hidden
          rules={isEdit ? [] : [{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
