/* Components */
import CardWrapper from "../../ClientSide/CardWrapper/CardWrapper";
import EmptyCard from "../../ClientSide/EmptyCard/EmptyCard";
import PaginationController from "../../ClientSide/PaginationController/PaginationController";
import ProjectItem from "../../ClientSide/ProjectItem/ProjectItem";

/* Styles */
import styles from "./styles.module.css";

/* Utilities */
import ClientLogger from "@/lib/utils/clientLogger";
import getData from "@/lib/apis/server.api";
import URLBuilder from "@/lib/utils/URLBuilder";
import { ensureSearchParamsOrRedirect } from "@/lib/utils/searchRedirect";

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
  let pathname = "";
  if (entity === "search") {
    pathname = "/search/projects";
  } else if (entity === "affiliation") {
    pathname = `/affiliation/${params.entity}/${params.ID}/research/projects`;
  } else {
    pathname = `/person/${params.ID}/research/projects`;
  }

  const correctedParams = ensureSearchParamsOrRedirect(
    searchParams,
    "projects",
    pathname,
  );

  let URL = "";
  if (entity === "search") {
    URL = URLBuilder("/app/search/projects", correctedParams);
  } else if (entity === "affiliation") {
    URL = URLBuilder(
      `/app/affiliation/${params.entity}/${params.ID}/research/projects`,
      correctedParams,
    );
  } else {
    URL = URLBuilder(
      `/app/person/${params.ID}/research/projects`,
      correctedParams,
    );
  }
  const { data, fullUrl } = await getData(URL);

  if (!data.data.length) {
    return <EmptyCard text="No hay Proyectos disponibles para esta perfil." />;
  }
  return (
    <CardWrapper
      searchParams={correctedParams}
      total_results={data.total_results}
      type="projects"
      csv={false}
      apiExpert={false}
    >
      <ul className={styles.ul}>
        {data.data.map((item) => (
          <ProjectItem key={item.id} item={item} />
        ))}
      </ul>
      <PaginationController
        totalItems={data.total_results}
        searchParams={correctedParams}
      />
      <ClientLogger url={fullUrl} />
    </CardWrapper>
  );
}
