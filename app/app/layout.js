/* Components */
import HeadSearch from "@/app/components/ServerSide/Header/HeaderSearchBar";

/**
 * Renders the layout component.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @returns {ReactNode} The rendered layout component.
 */
export default function Layout({ children }) {
  return (
    <>
      <HeadSearch />
      <div className="margin_15">{children}</div>
    </>
  );
}
