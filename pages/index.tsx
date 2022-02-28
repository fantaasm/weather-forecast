import type {GetServerSidePropsContext} from 'next'
import {useCallback, useEffect, useState} from "react";
import LocationCard from "../components/LocationCard";
import WeatherTable from "../components/WeatherTable";
import SearchBar from "../components/SearchBar";
import {getSession} from "next-auth/react";
import axios, {AxiosResponse} from "axios";
import Layout from "../components/Layout";
import {CityData, CityInfo} from "../types/weather";
import ProfilePicture from "../components/ProfilePicture";
import {getCurrentDateString, getDateFromUnix} from "../util/dateUtils";
import {convertAlpha2CodeToCountry} from "../util/countryUtils";
import Image from "next/image"
import LineGraph from "../components/LineGraph";
import {BsDot} from "react-icons/bs";
import {GiHamburgerMenu} from "react-icons/gi";
import {Session} from "next-auth";

const fetchIntervalInSeconds = 60
const title = "Dashboard"
const description = "Page description"

type Props = {
  userCityList?: CityInfo[]
  userSession:Session
}

const Home = ({userCityList,userSession}: Props): JSX.Element => {
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null)
  const [cityInfoList, setCityInfoList] = useState<CityInfo[]>([])
  const [cityDataList, setCityDataList] = useState<CityData[]>([])


  // Initial update on first load
  useEffect(() => {
    if (!userCityList) return

    setCityInfoList(userCityList)
    setSelectedCity(userCityList[0])
  }, [])

  // Update everytime list change and/or after interval
  useEffect(() => {
    if (cityInfoList.length === 0) return

    updateCities()
    const interval = setInterval(updateCities, fetchIntervalInSeconds * 1000)
    return () => clearInterval(interval)
  }, [cityInfoList])


  const addCity = useCallback(
    (city: CityInfo) => {

      if (cityInfoList.findIndex(c => c.name === city.name) > -1) return

      // for api calls..
      if (cityInfoList.length >= 4) return alert("You can only observe 4 cities at the time!")

      const updatedCityList = [...cityInfoList, city]

      setCityInfoList(updatedCityList)
      setSelectedCity(city)

      // Firebase
      updateFirebase(userSession?.user, updatedCityList)
    }, [cityInfoList, selectedCity]
  );


  const setCurrentCity = useCallback(
    (city: CityInfo) => {
      setSelectedCity(city)
    }, [])

  const removeCity = useCallback(
    (city: CityInfo) => {

      if (cityInfoList.length == 1) return alert("You cannot have less than 1 city in list!")

      const updatedCityList = cityInfoList.filter(c => c.id !== city.id);
      setCityInfoList(updatedCityList)

      // update selected city
      if (selectedCity?.id === city.id) setCurrentCity(updatedCityList[0])

      // Firebase
      updateFirebase(userSession?.user, updatedCityList)
    }, [cityInfoList, selectedCity]);


  // if (status === "loading") {
  //   return <h1>Loading</h1>
  // }

  const currentCityData: CityData | null = findCityData(selectedCity)

  const renderLocationCards = () => {

    const cities = cityInfoList.map((city: CityInfo) => <LocationCard key={city.id} city={city} isSelected={selectedCity?.id === city?.id} deleteCity={removeCity} selectCity={setCurrentCity} />)

    const itemsToAdd: number = 4 - cities.length
    for (let i = 0; i < itemsToAdd; i++) {
      cities.push(<LocationCard addCity={addCity} key={i}/>)
    }
    return cities
  }

  return (
    <Layout title={title} description={description}>
      <div className={"grid grid-flow-row md:grid-flow-col md:grid-cols-3 h-screen"}>
        <div className={"p-1 lg:p-4 md:col-span-2 grid grid-flow-row text-black gap-10 bg-blue-100"}>
          <div>
            <SearchBar onSubmit={addCity} limit={3} />
          </div>
          <h1 className={"text-4xl md:text-5xl tracking-wide"}>Weather <b>Forecast</b></h1>
          <div className={"grid grid-cols-2 lg:grid-cols-4 gap-8"}>
            {renderLocationCards()}
          </div>
          <div className={"row-span-6"}>
            <WeatherTable data={currentCityData?.daily} />
          </div>
        </div>
        <div className={"grid grid-flow-row gap-4 md:gap-12 bg-gray-900 p-1 lg:p-4"}>
          <div className={"flex justify-between items-center px-4 text-md max-h-20"}>
            <div className={"hidden md:block"}>
              <span>Notifications</span>
              <span className={"ml-4"}>Places</span>
            </div>
              <button className={"block md:hidden"}>
                <GiHamburgerMenu size={32} />
              </button>
            <div className={"flex items-center gap-4"}>
              <span>{userSession.user?.name}</span>
              <ProfilePicture session={userSession} />
            </div>
          </div>
          <div className={"mx-auto py-8"}>
            <div className={"flex flex-col gap-4"}>
              <div className={"flex gap-2 items-center justify-center"}>
                <Image src={`http://openweathermap.org/img/wn/${currentCityData?.current.weather[0].icon || '03d'}@2x.png`}
                       alt={"clouds.png"} layout={"fixed"} width={52} height={52} />
                <div>
                  <p className={"text-4xl font-semibold tracking-wider"}>Today</p>
                  <p>{getCurrentDateString()}</p>
                </div>
              </div>
              <div className={"flex justify-center"}>
                <div className={"text-9xl"}>{Math.floor(currentCityData?.current.temp) || 0}</div>
                <span className={"text-4xl mt-3"}>°C</span>
              </div>
              <div className={"text-center"}>{selectedCity?.name || "Nowhere"}, {convertAlpha2CodeToCountry(selectedCity?.country) || "NW"}</div>
              <div className={"flex justify-around gap-4"}>
                <span>Feels like {Math.floor(currentCityData?.current.feels_like) || 0}</span>
                <span className={"px-5"}>
                  <BsDot size={24} className={"inline"} />
                </span>
                <span>Sunset {getDateFromUnix(currentCityData?.current.sunset).getHours() || "00"}:{getDateFromUnix(currentCityData?.current.sunset).getMinutes() || "00"}</span>
              </div>
            </div>
          </div>
          <div className={"row-span-6 overflow-hidden"}>
            <LineGraph data={currentCityData?.hourly} interval={2} />
          </div>
        </div>
      </div>
    </Layout>
  )

  async function updateCities(): Promise<void> {
    try {
      const promiseList: Promise<AxiosResponse>[] = cityInfoList.map(city => axios.get(`/api/weather`, {
        params: {
          lon: city.coord.lon,
          lat: city.coord.lat
        }
      }).then(res => res.data))

      const responses: CityData[] = await Promise.all(promiseList)

      setCityDataList(responses)
    } catch (e: any) {
      console.log(e.message)
    }
  }

  function findCityData(city: CityInfo | null): CityData | null {
    if (!city) return null

    const index = cityInfoList.findIndex(c => c.id === city?.id)
    return index > -1 ? cityDataList[index] : null
  }
}

async function updateFirebase(user: any, cityList: CityInfo[]) {

  console.log("user=",user)
  const cityIds = cityList.map(city => city.id);

  await axios.post("/api/cities", {userId: user.uid, cities: cityIds}, {
    // headers: {
    //   Authorization: token || 'unauthenticated'
    // }
  })
    .then(res => console.log("Saved"))
    .catch(error => console.log(error.message))
}

export default Home

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context);

  if (!userSession) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const userId: number = userSession.user.uid

  let userCityList = []

  try {
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/cities`, {
        params: {
          userId: userId
        },
        // headers: {
        //   Authorization: jti || 'unauthenticated'
        // }
      })

    userCityList = response.data
  } catch (error: any) {
    console.log("Something went wrong:", error.message)
  }

  return {
    props: {
      userCityList,
      userSession
    }
  }
}