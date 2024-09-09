/* Components */
import OtherWorksList from "@/app/components/ClientSide/InvestigationLists/OtherWorksList";
import ResearchTabs from "@/app/components/ClientSide/ResearchTabs/ResearchTabs";
import TopMenu from "@/app/components/ClientSide/TopMenu/TopMenu";

/**
 * OtherWorksOnEntityPage component renders the products related to a specific entity.
 * It includes a top menu, research tabs, charts, and a work list.
 *
 * @component
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.entity - The entity for which the products are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default function OtherWorksOnEntityPage({ params }) {
  return (
    <div>
      <TopMenu currentTab={"research"} />
      <ResearchTabs activeTab="other_works" entity={params.entity} />
      <OtherWorksList params={params} />
    </div>
  );
}
