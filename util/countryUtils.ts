const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export function convertAlpha2CodeToCountry(alpha2Code?: string): string | null {
  let countryCode: string = countries.getName(alpha2Code?.toLowerCase(), "en");
  return countryCode ?? null
}