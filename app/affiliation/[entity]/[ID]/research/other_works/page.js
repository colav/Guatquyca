/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import OtherWorksList from "@/app/components/ServerSide/OtherWorksList/OtherWorksList";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/**
 * OtherWorksOnEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, and a work list.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function OtherWorksOnEntityPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="other_works" entity={params.entity} />
      <Suspense fallback={<Loading />} key={key}>
        <OtherWorksList
          searchParams={searchParams}
          params={params}
          entity="affiliation"
        />
      </Suspense>
    </div>
  );
}
