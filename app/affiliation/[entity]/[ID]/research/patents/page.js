/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";
import PatentsList from "@/app/components/ServerSide/PatentsList/PatentsList";

/**
 * PatentsEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, charts, and a work list.
 *
 * @param {Object} searchParams - The search parameters used to fetch the works.
 * @param {Object} params - The parameters passed to the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function PatentsEntityPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="patents" entity={params.entity} />
      <Suspense fallback={<Loading />} key={key}>
        <PatentsList
          searchParams={searchParams}
          params={params}
          entity="affiliation"
        />
      </Suspense>
    </div>
  );
}
