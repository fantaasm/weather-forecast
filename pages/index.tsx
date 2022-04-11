import type { GetServerSidePropsContext } from "next";
import LocationCard from "../components/LocationCard";
import WeatherTable from "../components/WeatherTable";
import { getSession } from "next-auth/react";
import Layout from "../components/Layout";
import { CityInfo, CombinedCityData } from "../types";
import ProfilePicture from "../components/ProfilePicture";
import { convertAlpha2CodeToCountry } from "../services/countryUtils";
import Image from "next/image";
import { BsDot } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import dayjs from "dayjs";
import { useWeatherTable } from "../hooks/useWeatherTable";
import { Spinner } from "../components/Spinner";
import DarkModeButton from "../components/DarkModeButton";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const title = "Dashboard - Weather Forecast";
const description = "Get the weather prediction for any city in the globe every day.";

type Props = {
  userSession: Session;
};

// Dynamic big components to not overbloat chunks and reduce initial bundle size.
const DynamicGraphs = dynamic(() => import("../components/LineGraph"));
const DynamicSearchBar = dynamic(() => import("../components/SearchBar"));
const DynamicCard = dynamic(() => import("../components/LocationCard"));

const Home = ({ userSession }: Props): JSX.Element | null => {
  const { addCity, removeCity, getSelectedCity, setSelectedCity, getUserCities, loading } = useWeatherTable({ userSession });
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set theme on first mount
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const selectedCity = getSelectedCity() as CombinedCityData;
  return (
    <Layout title={title} description={description}>
      {loading && <Spinner />}
      <div className={
          "grid grid-flow-row md:grid-flow-col md:grid-cols-3 h-screen w-screen max-w-full overflow-auto"
        }
      >
        <main className={"dark:bg-gray-800 p-1 lg:p-4 md:col-span-2 flex flex-col justify-around bg-blue-100"
          }
        >
          <div>
            <DynamicSearchBar onSubmit={addCity} limit={3} />
          </div>
          <header className={"text-4xl md:text-5xl mt-4 tracking-wide"}>
            Weather <b>Forecast</b> for you, <b className={"font-black"}>{userSession.user.name}</b>{" "}
            {theme === "dark" ? "🌙" : "☀️"}
          </header>
            <div
            className={
              "mt-6 flex items-center overflow-y-clip overflow-x-auto gap-8 w-[500px] md:w-full min-h-[365px]"
            }
          >
            {renderLocationCards()}
          </div>
          <div className={"row-span-6 mt-6 min-h-[368px]"}>
            <WeatherTable data={selectedCity?.daily || null} />
          </div>
        </main>
        <aside
          className={"grid grid-flow-row gap-4 text-white-100 md:gap-12 bg-gray-900 p-1 lg:p-4"}
        >
          <div className={"flex justify-between items-center px-4 text-md max-h-20"}>
            <div className={"hidden md:block"}>
              <DarkModeButton />
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
                <Image
                  src={`http://openweathermap.org/img/wn/${
                    selectedCity?.current?.weather[0].icon || "03d"
                  }@2x.png`}
                  alt={"clouds.png"}
                  layout={"fixed"}
                  width={52}
                  height={52}
                />
                <div>
                  <p className={"text-4xl font-semibold tracking-wider"}>Today</p>
                  <p>{dayjs().format("dddd")}</p>
                </div>
              </div>
              <div className={"flex justify-center"}>
                <div className={"text-9xl"}>{Math.floor(selectedCity?.current?.temp) || 0}</div>
                <span className={"text-4xl mt-3"}>°C</span>
              </div>
              <div className={"text-center"}>
                {selectedCity?.name || "Nowhere"},{" "}
                {convertAlpha2CodeToCountry(selectedCity?.country) || "NW"}
              </div>
              <div className={"flex justify-around gap-4"}>
                <span>Feels like {Math.floor(selectedCity?.current?.feels_like) || 0}</span>
                <span className={"px-5"}>
                  <BsDot size={24} className={"inline"} />
                </span>
                <span>
                  Sunset {dayjs(selectedCity?.current?.sunset).format("HH:mm") || "00:00"}
                </span>
              </div>
            </div>
          </div>
          <div className={"row-span-6 overflow-hidden h-[26rem]"}>
            <DynamicGraphs data={selectedCity?.hourly || null} interval={2} />
          </div>
        </aside>
      </div>
    </Layout>
  );

  function renderLocationCards() {
    const cities = getUserCities()?.map((city: CityInfo) => (
      <DynamicCard
        key={city.id}
        city={city}
        isSelected={getSelectedCity()?.id === city?.id}
        deleteCity={removeCity}
        selectCity={setSelectedCity}
      />
    ));
    const itemsToAdd: number = 4 - cities.length;
    for (let i = 0; i < itemsToAdd; i++) {
      cities.push(<LocationCard addCity={addCity} key={i} />);
    }
    return cities;
  }
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userSession = await getSession(context);

  if (!userSession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userSession,
    },
  };
}
