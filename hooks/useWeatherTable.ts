import { memo, useCallback, useEffect, useState } from "react";
import { CityData, CityInfo } from "../types";
import { fetchCitiesData, updateUserCities } from "../services/requestHelper";
import { Session } from "next-auth";

const fetchIntervalInSeconds = 60;

/**
 * @param initial.userSession - user session
 *
 * @throws Error if user session is not provided
 *
 * @description - This hook is supposed to be handling user interactions and fetching data but idk anymore some crackhead wrote it
 * @todo - REWRITE ASAP COZ THIS IS SPAGHETTI NAPOLI WITH PARMEZAN ON TOP
 */
export const useWeatherTable = (initial: { userSession: Session }) => {
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [cityInfoList, setCityInfoList] = useState<CityInfo[]>([]);
  const [cityDataList, setCityDataList] = useState<CityData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  if (!initial.userSession) {
    throw new Error("User session is not defined");
  }

  // Initial update on first load
  useEffect(() => {
    setLoading(true);

    const getUserCities = async () => {
      setLoading(true);
      const userCities = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/cities`,
        {
          headers: {
            Authorization: initial.userSession.user.uid || "unauthenticated",
          },
        }
      );
      const userCitiesData = await userCities.json();

      if (userCities.ok) {
        console.log(userCitiesData);
        setCityInfoList(userCitiesData);
      }
      setLoading(false);
    };
    getUserCities();
  }, []);

  // Update everytime list change and/or after interval
  useEffect(() => {
    if (cityInfoList.length === 0) return;

    updateCitiesData();
    const interval = setInterval(
      updateCitiesData,
      fetchIntervalInSeconds * 1000
    );
    return () => clearInterval(interval);
  }, [cityInfoList]);

  const addCity = useCallback(
    (city: CityInfo) => {
      if (cityInfoList.findIndex((c) => c.name === city.name) > -1) return;

      // for api calls..
      if (cityInfoList.length >= 4)
        return alert("You can only observe 4 cities at the time!");

      console.log("adding city=", city);

      const updatedCityList = [...cityInfoList, city];

      setCityInfoList(updatedCityList);
      setSelectedCity(null);

      console.log("updated city list=", updatedCityList);
      console.log("updating for uid", initial.userSession.user.uid);
      // Firebase
      //@ts-ignore - TS doesn't know about the next-auth types
      updateUserCities(initial.userSession, updatedCityList);
    },
    [cityInfoList, selectedCity]
  );

  const removeCity = useCallback(
    (city: CityInfo) => {
      if (cityInfoList.length == 1)
        return alert("You cannot have less than 1 city in list!");

      const updatedCityList = cityInfoList.filter((c) => c.id !== city.id);
      setCityInfoList(updatedCityList);

      // update selected city
      if (selectedCity?.id === city.id) setCurrentCity(updatedCityList[0]);

      // Firebase
      //@ts-ignore - TS doesn't know about the next-auth types
      updateUserCities(initial.userSession, updatedCityList);
    },
    [cityInfoList, selectedCity]
  );

  function setCityDataCallback(cityData: CityData[]) {
    setCityDataList(cityData);
    if (!selectedCity) {
      const firstCity = {
        ...cityInfoList[0],
        ...cityData[0],
      };
      setCurrentCity(firstCity);
    }
  }

  async function updateCitiesData() {
    fetchCitiesData(cityInfoList, setCityDataCallback);
  }

  function getSelectedCity() {
    if (!selectedCity) return null;
    return {
      ...selectedCity,
      ...cityInfoList.find((c) => c.id === selectedCity?.id),
    };
  }

  // merges 2 arrays  - cityInfoList and cityDataList
  // rewrite asap
  function getUserCities() {
    return cityInfoList.map((cityInfo, i) => {
      return {
        ...cityInfo,
        ...cityDataList[i],
      };
    });
  }

  const setCurrentCity = useCallback((city: CityInfo) => {
    setSelectedCity(city);
  }, []);

  return {
    addCity,
    removeCity,
    setSelectedCity: setCurrentCity,
    getSelectedCity,
    getUserCities,
    loading,
  };
};
