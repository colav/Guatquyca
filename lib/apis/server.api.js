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
  const apiURL = process.env.API_URL;
  const fullUrl = `${apiURL}${url}`;

  console.log(`Fetching data from ${fullUrl}`);

  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return { data, fullUrl };
}
