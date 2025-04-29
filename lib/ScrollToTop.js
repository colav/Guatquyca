"use client";

/* Hooks */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop Component
 *
 * This component ensures that the page scrolls to the top whenever the route changes.
 * It uses the `usePathname` hook from Next.js to detect route changes and triggers
 * a smooth scroll to the top of the page.
 *
 * @component
 * @returns {null} This component does not render any visible UI.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
