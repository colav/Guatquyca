/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";
import WorkList from "@/app/components/ServerSide/WorkList/WorkList";

/**
 * GeoProductsPage renders the products of a city or a state.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - Should include 'entity' ("city" or "state") and 'ID'.
 * @returns {JSX.Element} The top menu and the list of works.
 */
export default function GeoProductsPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <TopMenu geo currentTab="research" />
      <Suspense fallback={<Loading />} key={key}>
        <WorkList searchParams={searchParams} params={params} entity="geo" />
      </Suspense>
    </div>
  );
}
