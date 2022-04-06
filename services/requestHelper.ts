import { CityData, CityInfo } from "../types";
import { Session } from "next-auth";

/**
 * @description - Updates passed cities with OpenWeatherApi
 * @param cityList - list of cities to update
 * @param callback - callback function
 *
 * @returns - true if update was successful, false otherwise
 *
 * @throws - if cityList is empty
 *
 * @todo - add proper exception handling
 */
async function fetchCitiesData(
  cityList: CityInfo[],
  callback?: (updatedCities: CityData[]) => void
): Promise<boolean> {
  if (!cityList || cityList.length === 0) {
    return false;
    // throw new Error('No cities to update');
  }

  try {
    const promiseList = cityList?.map((city: CityInfo) =>
      fetch(
        "weather-forecast/api/weather?" +
          new URLSearchParams({
            lon: city.coord.lon.toString(),
            lat: city.coord.lat.toString(),
          })
      ).then((res) => res.json())
    );
    const responses: CityData[] = await Promise.all(promiseList);
    if (callback) {
      callback(responses);
    }
    return true;
  } catch (e: any) {
    console.log(e.message);
  }
  return false;
}

/**
 * @description - Updates cities id's to user matching session
 * @param userSession - user session
 * @param cityList - list of cities
 *
 * @returns - true if user cities were updated, false otherwise
 *
 * @throws - if userSession is not valid
 * @throws - if cityList is not valid
 *
 * @todo - add proper exception handling
 */
async function updateUserCities(
  userSession: Session,
  cityList: CityInfo[]
): Promise<boolean> {
  console.log("@updateUserCities: userSession: ", userSession);

  if (!userSession) {
    throw new Error("User session is not defined");
  }

  if (!cityList || cityList.length === 0) {
    throw new Error("City list is not defined");
  }
  console.log("@updateUserCities: cityList: ", cityList);

  const cityIds = cityList.map((city) => city.id);

  try {
    const response = await fetch("/weather-forecast/api/cities", {
      method: "POST",
      headers: {
        authorization: userSession.user.uid || "unauthenticated",
      },
      body: JSON.stringify({
        cities: cityIds,
      }),
    });
    return response.ok;
  } catch (e: any) {
    console.log(e.message);
  }
  return false;
}

export { fetchCitiesData, updateUserCities };
