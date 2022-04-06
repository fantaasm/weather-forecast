export const weekDays: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * @description - Converts epoch time to a date string in 12 hour format
 * @param {number} x - Epoch time
 *
 * @returns {string} - Date string in 12 hour format
 */
export function convertTimeToHumanReadable(x: number): string {
  const date = new Date(x * 1000);
  return convertFrom24To12Format(date.getHours());
}

/**
 * @description - Converts 24 hour time to 12 hour time
 * @param {number} time24 - 24 hour time
 *
 * @returns {string} - 12 hour time
 */
function convertFrom24To12Format(time24: number): string {
  const period = +time24 < 12 ? "AM" : "PM";
  const hours = +time24 % 12 || 12;
  return `${hours} ${period}`;
}
