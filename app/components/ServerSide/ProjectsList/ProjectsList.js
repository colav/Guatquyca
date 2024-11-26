/* Components */
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import ProjectItem from "../../ClientSide/ProjectItem/ProjectItem";
import SortSearchResults from "../../ClientSide/SortSearchResults/SortSearchResults";

/* Styles */
import styles from "./styles.module.css";

/* UI Library Components */
import { Card } from "antd";

/* Utilities */
import ClientLogger from "@/lib/Utils/clientLogger";
import getData from "@/lib/APIS/api";
import URLBuilder from "@/lib/Utils/URLBuilder";
import { SINGULAR_TITLES, TITLES } from "@/lib/constants";

/**
 * ProjectsList is a server-side functional component that fetches and displays a list of projects related to a specific entity.
 *
 * @component
 * @param {Object} searchParams - The search parameters used to fetch the projects.
 * @param {Object} params - The parameters passed to the component.
 * @param {string} entity - The entity for which the projects are displayed.
 * @returns {JSX.Element} The rendered component.
 */
export default async function ProjectsList({ searchParams, params, entity }) {
  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/projects", searchParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/projects`,
      searchParams
    );
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/projects`,
      searchParams
    );
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Proyectos disponibles para esta perfil." />;
  }
  return (
    <Card
      id="list"
      size="small"
      styles={{
        header: { backgroundColor: "#003e65", color: "white" },
        body: { padding: "10px 0 5px 0" },
      }}
      title={`${data.total_results} ${
        data.total_results === 1
          ? SINGULAR_TITLES["project"]
          : TITLES["projects"]
      }`}
      extra={<SortSearchResults searchParams={searchParams} type="projects" />}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <ProjectItem key={item.id} item={item} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={searchParams}
      />
      <ClientLogger url={fullUrl} />
    </Card>
  );
}
