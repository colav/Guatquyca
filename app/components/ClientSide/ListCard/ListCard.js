"use client";

/* Next */
import Link from "next/link";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card, Empty, List } from "antd";

/* Utilities */
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/**
 * ListCard is a client-side function component that displays a list of items in a Card component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of items in the list. This is used to determine the title of the Card and the href of the Link.
 * @param {Array} props.list - The list of items to display. Each item should be an object with an 'id' property.
 * @returns {JSX.Element} A Card component that displays the list of items.
 */
export default function ListCard({ type, list }) {
  const listLength = list.length;

  return (
    <Card
      hoverable
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px" },
      }}
      title={`${listLength} ${
        listLength === 1 ? SINGULAR_TITLES[type] : TITLES[type]
      }`}
    >
      <div className={styles.listCard_container}>
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
                        ? `/person/${item.id}/research/products`
                        : `/affiliation/${type}/${item.id}/affiliations`
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
      </div>
    </Card>
  );
}
