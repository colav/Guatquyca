import { redirect } from "next/navigation";

/**
 * The profile of a city or a state opens on its affiliations tab.
 */
export default function GeoPage({ params }) {
  redirect(`/geo/${params.entity}/${params.ID}/affiliations`);
}
