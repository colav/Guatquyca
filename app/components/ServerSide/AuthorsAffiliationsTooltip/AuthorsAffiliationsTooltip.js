/* Next.js */
import Link from "next/link";

/* Components */
import AuthorsExternalProfiles from "../ExternalProfiles/AuthorsExternalProfiles";

/* lib */
import { APIRequest } from "@/lib/APIS/clientAPI";

/**
 * AuthorsAffiliationsTooltip is a server-side function component that displays an author's name and affiliations.
 *
 * @param {Object} author - An object representing an author. It should have properties like 'id', 'full_name', and 'affiliations'.
 * @returns {JSX.Element} A fragment containing the author's name and a list of their affiliations.
 */
export default function AuthorsAffiliationsTooltip({ author }) {
  const [state] = APIRequest(`/app/person/${author.id}`);
  const { id, full_name } = author;

  if (state.isError) {
    return "No hay información disponible";
  }
  if (state.isLoading) {
    return null;
  }
  return (
    <>
      <div>
        <div>
          {id ? (
            <Link href={`/person/${id}/research/products`}>{full_name}</Link>
          ) : (
            <span style={{ color: "black" }}>
              <b>{full_name}</b>
            </span>
          )}
        </div>
        {state.data.data.affiliations.map((item) => {
          const { id, name, types } = item;
          const type = types[0]?.type;
          let link;

          switch (type) {
            case "group":
              link = `/affiliation/group/${id}/research/products`;
              break;
            case "department":
              link = `/affiliation/department/${id}/affiliations`;
              break;
            case "faculty":
              link = `/affiliation/faculty/${id}/affiliations`;
              break;
            default:
              link = `/affiliation/institution/${id}/affiliations`;
          }

          return (
            <div key={id}>
              <Link href={link}>• {name}</Link>
            </div>
          );
        })}
      </div>
      <div>
        <AuthorsExternalProfiles profilesList={state.data.data.external_ids} />
      </div>
    </>
  );
}
