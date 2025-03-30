/* Next.js */
import Link from "next/link";

/* Components */
import AuthorInfoFetcher from "./AuthorInfoFetcher";

/**
 * AuthorsAffiliationsTooltip is a server-side function component that displays an author's name and affiliations.
 *
 * @param {Object} author - An object representing an author. It should have properties like 'id', 'full_name', and 'affiliations'.
 * @returns {JSX.Element} A fragment containing the author's name and a list of their affiliations.
 */
export default function AuthorsTooltip({ author }) {
  const { id, full_name } = author;

  console.log(author);

  return (
    <>
      <div>
        <div style={{ color: "black" }}>
          {id ? (
            <Link
              href={`/person/${id}/research/products?max=10&page=1&sort=citations_desc`}
            >
              {full_name}
            </Link>
          ) : (
            <span>
              <b>{full_name}</b>
            </span>
          )}
        </div>
        {author.affiliations.map((item) => {
          const { id, name, types } = item;
          const type = types[0]?.type;
          let link;

          switch (type) {
            case "group":
              link = `/affiliation/group/${id}/research/products?max=10&page=1&sort=citations_desc`;
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

          if (item.name)
            return (
              <div key={id}>
                <Link href={link}>• {name}</Link>
              </div>
            );
        })}
      </div>
      {author.id && <AuthorInfoFetcher id={id} />}
    </>
  );
}
