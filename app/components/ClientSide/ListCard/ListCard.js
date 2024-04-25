"use client";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Empty, List } from "antd";

/* Utilities */
import { TITLES } from "@/lib/constants";

/**
 * ListCard is a client-side function component that displays a list of items in a Card component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of items in the list. This is used to determine the title of the Card and the href of the Link.
 * @param {Array} props.list - The list of items to display. Each item should be an object with an 'id' property.
 * @returns {JSX.Element} A Card component that displays the list of items.
 */
export default function ListCard({ type, list }) {
  return (
    <Card
      hoverable
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px" },
      }}
      title={TITLES[type]}
    >
      <div className={styles.listCard_container}>
        {list.length ? (
          <List
            size="small"
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  id={item.id}
                  description={
                    <Link
                      prefetch={false}
                      href={
                        type === "person"
                          ? `/app/person/${item.id}/research/products`
                          : `/app/affiliation/${type}/${item.id}/affiliations`
                      }
                    >
                      {item.full_name}
                      {item.name}
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Datos insuficientes"
            style={{ marginTop: "180px" }}
          />
        )}
      </div>
    </Card>
  );
}
