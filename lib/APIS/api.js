/**
 * getData is a server-side function component for fetching data from a specified URL.
 *
 * @param {string} url - The URL from which to fetch data.
 *
 * @returns {Object} The data fetched from the URL.
 *
 * @throws {Error} When the fetch request is not successful.
 */
export default async function getData(url) {
  console.log(
    `|X|X|X|X| SSR Component fetched: ${process.env.API_URL}${url} |X|X|X|X|`
  );
  const response = await fetch(
    `${process.env.API_URL}${url}`
    /* {
      cache: "force-cache",
    } */
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
