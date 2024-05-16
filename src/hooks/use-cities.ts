import { Country, State, City } from "country-state-city";

export const allCities = City.getCitiesOfCountry("VN")?.map((city) => ({
  label: city.name,
  country: Country.getCountryByCode(city.countryCode)?.name,
}));
