"use client";

import { useEffect, useRef, useState } from "react";

/* Icons */
import { FilterOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, ConfigProvider, Drawer } from "antd";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import URLBuilder from "@/lib/Utils/URLBuilder";

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onClick = () => {
    console.log(pathname.slice(0, 7));
    if (pathname.slice(0, 7) === "/search") {
      const cleanURL = URLBuilder(pathname, {
        max: query.get("max"),
        page: query.get("page"),
        sort: query.get("sort"),
      });
      router.push(cleanURL);
    }
    onClose();
  };

  console.log(pathname);
  console.log(query.toString());

  const prevQueryRef = useRef();
  useEffect(() => {
    if (
      pathname !== "/" ||
      (prevQueryRef.current &&
        JSON.stringify(prevQueryRef.current) !== JSON.stringify(query))
    ) {
      console.log("Enviar la petición al servidor");
    }
    prevQueryRef.current = query;
  }, [query]);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: "0 0 8px 8px",
          },
        }}
      >
        <Button
          size="large"
          icon={<FilterOutlined />}
          onClick={showDrawer}
          id={styles.fixedWidget}
          type="primary"
        >
          Filtros
        </Button>
      </ConfigProvider>
      <Drawer
        title={
          <>
            <FilterOutlined /> Filtros
          </>
        }
        placement="left"
        onClose={onClose}
        open={visible}
        width={500}
        zIndex={10000}
        footer={<Button onClick={onClick}>Limpiar filtros</Button>}
        styles={{
          footer: {
            textAlign: "right",
          },
        }}
      />
    </>
  );
}
