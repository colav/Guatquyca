"use client";

/* Context */
import { useAuth } from "@/app/context/AuthContext";

/* Icons */
import {
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";

/* Next */
import { useRouter } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Dropdown, Button, Typography, Divider } from "antd";

/* Utils */
import { formatName } from "@/lib/utils/formatName";

const { Text } = Typography;

/**
 * UserMenu component displays the user dropdown menu with actions such as navigating to admin or data upload pages and logging out.
 *
 * - Shows user role and institution.
 * - Main action depends on user role (admin or regular user).
 * - Provides logout functionality.
 * - Uses Ant Design Dropdown and Button components.
 *
 * Context:
 *   - user: The authenticated user object (with role, institution, etc).
 *   - logout: Function to log out the user.
 *
 * Variables:
 *   - isAdmin: Boolean indicating if the user is an admin.
 *   - roleLabel: Display label for the user's role.
 *   - institutionLabel: Display label for the user's institution.
 *   - mainAction: Object with label, icon, and path for the main menu action.
 *   - menuItems: Array of menu item objects for the dropdown.
 */
export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const roleLabel = isAdmin ? "Administrador" : formatName(user.role);
  const institutionLabel = user.institution || "Institución no definida";

  const mainAction = {
    label: isAdmin ? "Gestión de usuarios" : "Gestión de datos",
    icon: isAdmin ? <TeamOutlined /> : <ToolOutlined />,
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
