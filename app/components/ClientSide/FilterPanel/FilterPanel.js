"use client";

/* Components */
import Loading from "@/app/loading";

/* Hooks */
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

/* Icons */
import { DownOutlined, FilterOutlined } from "@ant-design/icons";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Button, Collapse, ConfigProvider, Drawer } from "antd";

/* Utils */
import { APIRequest } from "@/lib/APIS/clientAPI";
import { filterMenuMaker } from "@/lib/Utils/filterMenuMaker";
import URLBuilder from "@/lib/Utils/URLBuilder";
import hasAppliedFilters from "@/lib/Utils/hasAppliedFilters";

/**
 * FilterPanel component provides a drawer with filter options and handles dynamic filter information.
 * It allows users to apply and clear filters, and updates the URL based on the selected filters.
 *
 * @returns {JSX.Element} The FilterPanel component.
 */
export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [state, setUrl] = APIRequest(
    `/app${pathname}/filters?${query.toString()}`
  );

  const toggleDrawer = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fixedWidget = document.querySelector("[data-fixed-widget]");
    if (fixedWidget) {
      if (visible) {
        fixedWidget.classList.add(styles.moveRight);
      } else {
        fixedWidget.classList.remove(styles.moveRight);
      }
    }
  }, [visible]);

  useEffect(() => {
    setUrl(`/app${pathname}/filters?${query.toString()}`);
  }, [query]);

  const items = filterMenuMaker(state.data);

  const onClickFilterCleaner = () => {
    const cleanURL = URLBuilder(pathname, {
      max: query.get("max"),
      page: query.get("page"),
      sort: query.get("sort"),
    });
    router.push(cleanURL);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: { lineWidthFocus: 0 },
        }}
      >
        <Button
          size="large"
          icon={<FilterOutlined />}
          onClick={toggleDrawer}
          data-fixed-widget
          id={styles.fixedWidget}
        >
          Filtros
        </Button>
      </ConfigProvider>
      <ConfigProvider theme={{ token: { motion: false } }}>
        <Drawer
          title="Panel de filtros"
          placement="left"
          onClose={onClose}
          keyboard={false}
          open={visible}
          width={400}
          zIndex={1000}
          footer={
            <Button
              disabled={hasAppliedFilters(query) ? false : true}
              onClick={onClickFilterCleaner}
            >
              Limpiar filtros
            </Button>
          }
          id={styles.drawer}
          styles={{
            footer: {
              textAlign: "right",
            },
            body: {
              padding: 0,
            },
            header: {
              padding: "10px",
            },
          }}
        >
          {state.isLoading ? (
            <Loading height="100%" text="Cargando filtros disponibles" />
          ) : (
            <Collapse
              size="small"
              expandIcon={({ isActive }) => (
                <DownOutlined rotate={isActive ? 180 : 0} />
              )}
              expandIconPosition="end"
              bordered={false}
              items={items}
              defaultActiveKey={items.map((item) => item.key)}
            />
          )}
        </Drawer>
      </ConfigProvider>
    </>
  );
}
