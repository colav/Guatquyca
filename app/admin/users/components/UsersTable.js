/* APIs */
import {
  deactivateAdminUser,
  restoreAdminUser,
  resetAdminUserPassword,
} from "@/lib/apis/admin.api";

/* Icons */
import {
  CheckCircleTwoTone,
  EditOutlined,
  RetweetOutlined,
  StopOutlined,
} from "@ant-design/icons";

/* Hooks */
import { useSessionExpired } from "@/lib/hooks/useSessionExpired";

/* UI Library Components */
import {
  Input,
  Table,
  Tag,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";

/* Utils */
import { formatName } from "@/lib/utils/formatName";

/**
 * Table component to display and manage a list of admin users.
 *
 * Features:
 * - Shows user ID, email, role, institution, and status.
 * - Allows filtering by institution.
 * - Provides actions to edit, deactivate/reactivate, and reset password for users.
 * - Handles loading state and session expiration.
 *
 * @component
 * @param {{data: Array<Object>}} users - Users data object, expected to have a `data` array of user objects
 * @param {Function} onRefresh - Callback to refresh the user list after actions
 * @param {Function} onCreateUser - Callback to trigger user creation modal/form
 * @param {string} [institutionFilter] - Current filter value for institution search
 * @param {Function} onInstitutionFilterChange - Callback to update the institution filter value
 * @param {Function} onEditUser - Callback to trigger user edit modal/form, receives the user object
 * @returns {JSX.Element} The rendered users table or loading indicator
 *
 * @example
 * <UsersTable
 *   users={{ data: [{ id: 1, email: 'a@b.com', ... }] }}
 *   onRefresh={refreshFn}
 *   onCreateUser={openCreateModal}
 *   institutionFilter={filter}
 *   onInstitutionFilterChange={setFilter}
 *   onEditUser={openEditModal}
 * />
 */
export default function UsersTable({
  users,
  onRefresh,
  onCreateUser,
  institutionFilter = "",
  onInstitutionFilterChange,
  onEditUser,
}) {
  const handleSessionExpired = useSessionExpired();

  const loading = !users || !users.data;

  const dataSource = (users?.data || []).filter((user) =>
    user.institucion?.toLowerCase().includes(institutionFilter.toLowerCase()),
  );

  const handleDeactivate = async (email) => {
    try {
      await deactivateAdminUser(email);
      message.success("Usuario desactivado");
      onRefresh();
    } catch (err) {
      if (err.status === 401 || err.message === "SESSION_EXPIRED") {
        handleSessionExpired();
      } else {
        message.error("Error al desactivar usuario");
      }
    }
  };

  const handleRestore = async (email) => {
    try {
      await restoreAdminUser(email);
      message.success("Usuario reactivado");
      onRefresh();
    } catch (err) {
      if (err.status === 401 || err.message === "SESSION_EXPIRED") {
        handleSessionExpired();
      } else {
        message.error("Error al reactivar usuario");
      }
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await resetAdminUserPassword(email);
      message.success("La contraseña fue restablecida y enviada por correo");
    } catch (err) {
      if (err?.status === 401 || err?.message === "SESSION_EXPIRED") {
        handleSessionExpired();
      } else {
        message.error("Error al restablecer la contraseña");
      }
    }
  };

  const columns = [
    {
      title: "ID (ROR)",
      align: "center",
      width: 74,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      width: 250,
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      width: 150,
      dataIndex: "rol",
      key: "rol",
      render: (rol) => <Tag color="blue">{formatName(rol)}</Tag>,
    },
    {
      title: "Institución",
      width: 250,
      dataIndex: "institucion",
      key: "institucion",
    },
    {
      title: "Estado",
      align: "center",
      width: 65,
      dataIndex: "is_active",
      key: "is_active",
      filters: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.is_active === value,
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Activo</Tag>
        ) : (
          <Tag color="red">Inactivo</Tag>
        ),
    },
    {
      title: "Acciones",
      width: 85,
      fixed: "right",
      key: "actions",
      render: (_, user) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Editar usuario"
            onClick={() => onEditUser(user)}
          />

          <Popconfirm
            title="¿Restablecer contraseña?"
            description="Se enviará una nueva contraseña al correo del usuario."
            onConfirm={() => handleResetPassword(user.email)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<RetweetOutlined />}
              title="Restablecer contraseña"
            />
          </Popconfirm>

          {user.is_active ? (
            <Popconfirm
              title="¿Desactivar usuario?"
              description="El usuario no podrá iniciar sesión."
              onConfirm={() => handleDeactivate(user.email)}
            >
              <Button
                type="text"
                danger
                icon={<StopOutlined />}
                title="Desactivar usuario"
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="¿Reactivar usuario?"
              onConfirm={() => handleRestore(user.email)}
            >
              <Button
                type="text"
                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                title="Reactivar usuario"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Row justify="center" style={{ marginTop: "40px" }}>
      <Col xs={24} xxl={16}>
        <Table
          title={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Input
                  placeholder="Buscar institución"
                  allowClear
                  value={institutionFilter}
                  onChange={(e) => onInstitutionFilterChange(e.target.value)}
                  style={{ width: 182 }}
                />
              </div>

              <Button type="primary" onClick={onCreateUser}>
                Crear usuario
              </Button>
            </div>
          )}
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          bordered
          tableLayout="fixed"
          scroll={{ x: 1200 }}
          size="small"
          loading={loading}
        />
      </Col>
    </Row>
  );
}
