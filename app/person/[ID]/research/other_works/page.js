/* React */
import { Suspense } from "react";

/* Components */
import Loading from "@/app/loading";
import OtherWorksList from "@/app/components/ServerSide/OtherWorksList/OtherWorksList";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/**
 * OtherWorksOnPersonPage is a server-side functional component that fetches data based on provided parameters and displays it using
 * the TopMenu and ListCard components.
 *
 * @component
 * @param {Object} searchParams - The search parameters used to fetch data.
 * @param {Object} params - The parameters used to fetch data.
 * @returns {JSX.Element} A fragment that contains a TopMenu component, ResearchTabs component, and a Suspense component that wraps the OtherWorksList component.
 */
export default async function OtherWorksOnPersonPage({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <>
      <TopMenu person={true} currentTab="research" />
      <ResearchTabs activeTab="other_works" entity={"person"} />
      <Suspense fallback={<Loading />} key={key}>
        <OtherWorksList
          searchParams={searchParams}
          params={params}
          entity="person"
        />
      </Suspense>
    </>
  );
}
