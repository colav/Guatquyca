"use client";

/* Context */
import { useAuth } from "@/app/context/AuthContext";

/* Icons */
import {
  UserOutlined,
  LogoutOutlined,
  CloudUploadOutlined,
  TeamOutlined,
} from "@ant-design/icons";

/* Next */
import { useRouter } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Dropdown, Button, Typography, Divider } from "antd";

const { Text } = Typography;

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Si no hay usuario, no renderizamos nada
  if (!user) return null;

  const isAdmin = user.role === "admin";

  const roleLabel = isAdmin ? "Administrador" : user.role;
  const institutionLabel = user.institution || "Institución no definida";

  const mainAction = {
    label: isAdmin ? "Usuarios" : "Carga de datos",
    icon: isAdmin ? <TeamOutlined /> : <CloudUploadOutlined />,
    path: isAdmin ? "/admin/users" : "/submit",
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    {
      key: "main",
      icon: mainAction.icon,
      label: mainAction.label,
      onClick: () => router.push(mainAction.path),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      dropdownRender={(menu) => (
        <div className={styles.dropdown_wrapper}>
          <div className={styles.dropdown_header}>
            <Text strong>{roleLabel}</Text>
            <br />
            <Text type="primary" className={styles.institution}>
              {institutionLabel}
            </Text>
          </div>

          <Divider style={{ margin: "0" }} />

          <div className={styles.dropdown_menu}>{menu}</div>
        </div>
      )}
      menu={{ items: menuItems }}
    >
      <Button
        shape="circle"
        icon={<UserOutlined />}
        size="large"
        id={styles.user_button}
        aria-label="Menú de usuario"
      />
    </Dropdown>
  );
}
