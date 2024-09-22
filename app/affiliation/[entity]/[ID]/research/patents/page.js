/* Components */
import PatentsList from "@/app/components/ClientSide/InvestigationLists/PatentsList";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/**
 * PatentsEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, charts, and a work list.
 *
 * @component
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.entity - The entity for which the products are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default function PatentsEntityPage({ params }) {
  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="patents" entity={params.entity} />
      <PatentsList />
    </div>
  );
}
