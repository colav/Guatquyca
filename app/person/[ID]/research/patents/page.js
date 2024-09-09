/* Components */
import PatentsList from "@/app/components/ClientSide/InvestigationLists/PatentsList";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/* Utilities */
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";

/**
 * PatentsOnPersonPage is an asynchronous function component that fetches data based on provided parameters and displays it using
 * the TopMenu and ListCard components.
 *
 * @param {Object} params - The parameters used to fetch data.
 * @returns {JSX.Element} A fragment that contains a TopMenu component and a Row component that maps over the
 * fetched data to display a ListCard component for each item.
 */
export default async function PatentsOnPersonPage({ params }) {
  return (
    <>
      <TopMenu person={true} currentTab="research" />
      <ResearchTabs activeTab="patents" entity={"person"} />
      <PatentsList params={params} />
    </>
  );
}
