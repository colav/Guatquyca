"use client";

/* Components */
import SearchBar from "../../ClientSide/SearchBar/SearchBar";
import UserMenu from "../../ClientSide/UserMenu/UserMenu";

/* Context */
import { useAuth } from "@/app/context/AuthContext";

/* Icons */
import { UserOutlined } from "@ant-design/icons";

/* Next */
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Col, Layout, Row } from "antd";

/* UI Library Sub-components */
const Header = Layout;

/**
 * HeaderSearchBar displays the application header with logo,
 * search bar and user actions.
 */
export default function HeaderSearchBar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const isAuthenticated = Boolean(user);

  return (
    <Header id={styles.header}>
      <Row align="middle" justify="space-between">
        <Col
          xs={{ span: 18, order: 1 }}
          md={{ span: 9 }}
          lg={{ span: 8 }}
          xl={6}
          id={styles.logo_container}
        >
          <Link href="/">
            <Image
              priority
              src="/media/logo_impactU_B.svg"
              alt="Logotipo ImpactU"
              width={300}
              height={80}
              id={styles.logo}
            />
          </Link>
        </Col>

        <Col
          xs={{ span: 24, order: 3 }}
          sm={24}
          md={15}
          lg={{ span: 12, order: 2 }}
          id={styles.searchbar}
        >
          <Suspense>{pathname !== "/" ? <SearchBar /> : null}</Suspense>
        </Col>

        <Col
          xs={{ span: 6, order: 2 }}
          md={{ span: 4 }}
          xl={6}
          id={styles.user_button}
        >
          {!isAuthenticated && pathname !== "/login" && (
            <Button
              icon={<UserOutlined />}
              href="/login"
              id={styles.login_button}
            >
              Ingresar
            </Button>
          )}

          {isAuthenticated && <UserMenu />}
        </Col>
      </Row>
    </Header>
  );
}
