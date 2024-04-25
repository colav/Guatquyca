/**
 * Flag is a server-side function component that displays a flag image for a given country.
 *
 * @param {string} country - The name of the country for which to display the flag.
 * @param {string} country_code - The country code for the flag image URL.
 * @returns {JSX.Element} An img element that displays the flag of the given country.
 */
export default function Flag({ country, countryCode }) {
  return (
    <img
      alt={`flag of ${country}`}
      title={country}
      src={`https://flagcdn.com/28x21/${countryCode.toLowerCase()}.png`}
    />
  );
}
