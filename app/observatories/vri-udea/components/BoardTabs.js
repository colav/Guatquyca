"use client";

/* Next */
import { useRouter } from "next/navigation";

/* UI Library Components */
import { Tabs } from "antd";

/* Constants (names of the boards as titled in each board; provisional texts, D-106 Q4) */
export const BOARD_TABS = [
  { key: "board-1", label: "Masa crítica temática", href: "/observatories/vri-udea/board-1" },
  { key: "board-2", label: "Colaboración, redes y hélices", href: "/observatories/vri-udea/board-2" },
  { key: "board-3", label: "Capacidades de base UdeA", href: "/observatories/vri-udea/board-3" },
];

/**
 * Tabs of the VRI-UdeA observatory (F27). Each tab goes to the route of its board, so only the
 * board of the active tab loads and each one keeps its own filters in its own URL: switching
 * tabs never carries the query string of the previous board.
 *
 * @param {{ active: "board-1"|"board-2"|"board-3" }} props
 */
export default function BoardTabs({ active }) {
  const router = useRouter();
  return (
    <Tabs
      activeKey={active}
      onChange={(key) => router.push(BOARD_TABS.find((t) => t.key === key).href)}
      items={BOARD_TABS.map(({ key, label }) => ({ key, label }))}
      style={{ marginBottom: 8 }}
    />
  );
}
