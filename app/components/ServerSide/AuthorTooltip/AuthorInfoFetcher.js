/* Component */
import AuthorsExternalProfiles from "../ExternalProfiles/AuthorsExternalProfiles";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";

/**
 * AuthorsInfoFetcher is a server-side functional component that fetches and displays external profiles for a given author.
 *
 * @param {string} id - The ID of the author to fetch information for.
 * @returns {JSX.Element|null} The AuthorsExternalProfiles component with the author's external profiles, or null if loading or error.
 */
export default function AuthorsInfoFetcher({ id }) {
  const [state] = APIRequest(`/app/person/${id}`);

  if (state.isError || state.isLoading) {
    return null;
  }
  return (
    <AuthorsExternalProfiles profilesList={state.data.data.external_ids} />
  );
}
