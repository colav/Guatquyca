/**
 * Flag is a server-side functional component that displays a flag image for a given country.
 *
 * @param {string} country - The name of the country for which to display the flag.
 * @param {string} countryCode - The country code for the flag image URL.
 * @param {string} [size="28x21"] - The size of the flag image.
 * @returns {JSX.Element} An img element that displays the flag of the given country.
 */
export default function Flag({ country, countryCode, size = "28x21" }) {
  return (
    <img
      alt={`flag of ${country}`}
      title={country}
      src={`https://flagcdn.com/${size}/${countryCode.toLowerCase()}.png`}
    />
  );
}
