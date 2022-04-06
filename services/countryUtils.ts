const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

/**
 *
 * @param {string} alpha2Code - The alpha2Code of the country
 * @returns {string} - The name of the country
 *
 * @description - Returns the full name of the country
 */
export function convertAlpha2CodeToCountry(alpha2Code?: string): string | null {
  let countryCode: string = countries.getName(alpha2Code?.toLowerCase(), "en");
  return countryCode ?? null;
}
