/**
 * Limits the number of items per year to a maximum of 20.
 *
 * @param {Array} data - The array of data objects to be filtered. Each object should have an 'x' property representing the year.
 * @returns {Array} - The filtered array containing at most 20 items per year.
 */
export default function limitItemsPerYear(data) {
  const countByYear = {};

  return data.filter((item) => {
    const year = item.x;
    if (!countByYear[year]) {
      countByYear[year] = 0;
    }
    if (countByYear[year] < 20) {
      countByYear[year]++;
      return true;
    }
    return false;
  });
}
