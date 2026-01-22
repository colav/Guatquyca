/* Components */
import Loading from "@/app/loading";

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
  Typography,
} from "antd";

import {
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  deactivateAdminUser,
  restoreAdminUser,
  resetAdminUserPassword,
} from "@/lib/apis/admin.api";

import { useSessionExpired } from "@/lib/hooks/useSessionExpired";

const { Title } = Typography;

/**
 * Table component to display a list of admin users.
 * Shows user ID, email, role, institution, and status.
 * Displays a loading indicator if no users are present.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.users - Users data object, expected to have a `data` array.
 * @returns {JSX.Element} The rendered users table or loading indicator.
 */
export default function UsersTable({
  users,
  onRefresh,
  onCreateUser,
  institutionFilter = "",
  onInstitutionFilterChange,
  onEditUser,
}) {
  /* const users = {
    data: [
      {
        email: "estebancogo47@gmail.com",
        id: "68e836d6bec2a0bfaece5f47",
        institucion: "Universidad de Antioquia",
        is_active: true,
        rol: "Backend",
      },
      {
        email: "prueba@impactu.co",
        id: "00jb9vg53",
        institucion: "Universidad del Valle",
        is_active: true,
        rol: "staff",
      },
      {
        email: "luismvargasg@gmail.com",
        id: "05tkb8v92",
        institucion: "Universidad Autónoma Latinoamericana",
        is_active: true,
        rol: "researcher",
      },
    ],
    success: true,
  }; */

  const handleSessionExpired = useSessionExpired();

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
      width: 110,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      width: 340,
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      width: 160,
      dataIndex: "rol",
      key: "rol",
      render: (rol) => <Tag color="blue">{rol}</Tag>,
    },
    {
      title: "Institución",
      width: 340,
      dataIndex: "institucion",
      key: "institucion",
    },
    {
      title: "Estado",
      width: 100,
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
      width: 130,
      fixed: "right",
      key: "actions",
      render: (_, user) => (
        <Space size={4}>
          {/* Editar */}
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Editar usuario"
            onClick={() => onEditUser(user)}
          />

          {/* Reset contraseña */}
          <Popconfirm
            title="¿Restablecer contraseña?"
            description="Se enviará una nueva contraseña al correo del usuario."
            onConfirm={() => handleResetPassword(user.email)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<KeyOutlined />}
              title="Restablecer contraseña"
            />
          </Popconfirm>

          {/* Activar / Desactivar */}
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
                icon={<ReloadOutlined />}
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
      <Col xs={24} md={20} lg={16}>
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

              {/* Lado derecho: acciones */}
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
        />
      </Col>
    </Row>
  );
}
