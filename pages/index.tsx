import type { GetServerSidePropsContext } from "next";
import LocationCard from "../components/LocationCard";
import WeatherTable from "../components/WeatherTable";
import { getSession } from "next-auth/react";
import Layout from "../components/Layout";
import { CityInfo } from "../types";
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

const title = "Dashboard - Weather Forecast";
const description =
  "Weather Forecast dashboard for your favorite cities around the world";

type Props = {
  userSession: Session;
};

// Dynamic big components to not overbloat chunks and reduce initial bundle size.
const DynamicGraphs = dynamic(() => import("../components/LineGraph"));
const DynamicSearchBar = dynamic(() => import("../components/SearchBar"));

const Home = ({ userSession }: Props): JSX.Element => {
  console.log(userSession);
  const {
    addCity,
    removeCity,
    getSelectedCity,
    setSelectedCity,
    getUserCities,
    loading,
  } = useWeatherTable({ userSession });

  const selectedCity = getSelectedCity();
  return (
    <Layout title={title} description={description}>
      {loading && <Spinner />}
      <div
        className={
          "grid grid-flow-row md:grid-flow-col md:grid-cols-3 h-screen"
        }
      >
        <main
          className={
            "p-1 lg:p-4 md:col-span-2 grid grid-flow-row text-black gap-10 bg-blue-100"
          }
        >
          <div>
            <DynamicSearchBar onSubmit={addCity} limit={3} />
          </div>
          <h1 className={"text-4xl md:text-5xl tracking-wide"}>
            Weather <b>Forecast</b> for you,{" "}
            <b className={"font-black"}>{userSession.user.name}</b>
          </h1>
          <div className={"grid grid-cols-2 lg:grid-cols-4 gap-8"}>
            {renderLocationCards()}
          </div>
          <div className={"row-span-6"}>
            <WeatherTable data={selectedCity?.daily || null} />
          </div>
        </main>
        <aside
          className={
            "grid grid-flow-row gap-4 md:gap-12 bg-gray-900 p-1 lg:p-4"
          }
        >
          <div
            className={
              "flex justify-between items-center px-4 text-md max-h-20"
            }
          >
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
                  <p className={"text-4xl font-semibold tracking-wider"}>
                    Today
                  </p>
                  <p>{dayjs().format("dddd")}</p>
                </div>
              </div>
              <div className={"flex justify-center"}>
                <div className={"text-9xl"}>
                  {Math.floor(selectedCity?.current?.temp) || 0}
                </div>
                <span className={"text-4xl mt-3"}>°C</span>
              </div>
              <div className={"text-center"}>
                {selectedCity?.name || "Nowhere"},{" "}
                {convertAlpha2CodeToCountry(selectedCity?.country) || "NW"}
              </div>
              <div className={"flex justify-around gap-4"}>
                <span>
                  Feels like{" "}
                  {Math.floor(selectedCity?.current?.feels_like) || 0}
                </span>
                <span className={"px-5"}>
                  <BsDot size={24} className={"inline"} />
                </span>
                <span>
                  Sunset{" "}
                  {dayjs(selectedCity?.current?.sunset).format("HH:mm") ||
                    "00:00"}
                </span>
              </div>
            </div>
          </div>
          <div className={"row-span-6 overflow-hidden"}>
            <DynamicGraphs data={selectedCity?.hourly || null} interval={2} />
          </div>
        </aside>
      </div>
    </Layout>
  );

  function renderLocationCards() {
    const cities = getUserCities()?.map((city: CityInfo) => (
      <LocationCard
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
  // Middleware handles redirects, so we assume the user is authenticated already
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
