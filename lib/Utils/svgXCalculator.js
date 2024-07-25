/**
 * Calculates the X position for an SVG element based on the length of a given number.
 * The function assumes a base X position for a 5-digit number and adjusts the position
 * based on the actual length of the number provided.
 *
 * @param {number} number - The number whose length is used to calculate the X position.
 * @returns {number} The calculated X position, adjusted based on the length of the number.
 */
export default function calculateXPosition(number) {
  const baseXPosition = 77; // Base X position for a 5-digit number
  const numberLength = number.toString().length;
  const adjustmentPerDigit = 3.5; // Adjustment per digit difference from 6 digits
  const adjustment = (6 - numberLength) * adjustmentPerDigit; // Calculate adjustment

  return baseXPosition + adjustment; // Return adjusted X position
}
