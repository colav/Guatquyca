/* Components */
import HomeContent from "./components/HomeContent";

export const metadata = { title: "Observatorios | ImpactU" };

/**
 * Home of the observatories. The page is a server component (it exports the metadata); the
 * content is a client component because it uses Ant Design.
 */
export default function ObservatoriesPage() {
  return <HomeContent />;
}
