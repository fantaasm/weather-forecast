import {GiWaterDrop} from "react-icons/gi"
import Image from "next/image"
import MinMaxLine from "./MinMaxLine";
import {Weather} from "../types/weather";
import {BsDot} from "react-icons/bs";
import {weekDays} from "../util/dateUtils";

type Props = {
  data?: Weather[]
}


const WeatherTable = ({data}: Props): JSX.Element => {

  if (!data) {
    return <h1>Please add a city to the list to display stats</h1>
  }

  return (
    <div className={"-mt-2 overflow-auto"}>
      <div className="flex justify-between pb-4">

        <button className={"font-extrabold flex flex-col items-center"}>
          <div>Week</div>
          <BsDot size={24} />
        </button>

        <button disabled={true}
                className={"text-gray-500 opacity-80 flex flex-col items-center"}>
          <div>Month</div>
          <div><BsDot size={24} /></div>
        </button>
        <button disabled={true}
                className={"text-gray-500 opacity-80 flex flex-col items-center"}>
          <div>3 months</div>
          <div><BsDot size={24} /></div>
        </button>
        <button disabled={true}
                className={"text-gray-500 opacity-80 flex flex-col items-center"}>
          <div>6 months</div>
          <div><BsDot size={24} /></div>
        </button>
      </div>


      <div className={"grid grid-cols-6 md:grid-cols-7 items-center gap-y-2 sm:gap-y-6 justify-center text-center text-gray-700 font-semibold"}>
        {data.slice(0, weekDays.length).map((day, i) => {
          return (
            <>
              <span className={"text-left overflow-hidden"}>{weekDays[new Date(day.dt * 1000).getDay()]}</span>
              <div>
                <GiWaterDrop color={"blue"}
                             className={"inline"}
                             size={18}
                             fill={"blue"} />
                <span className={"pl-2"}>{day.humidity}%</span>
              </div>
              <div className={"relative w-full h-full"}>
                <Image src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                       alt={"icon"}
                       layout={"fill"}
                       objectFit={"contain"} />
              </div>
              <span className={"text-gray-500 opacity-80"}>
            {Math.floor(day.temp.min)}°C
          </span>
              <div className={"md:col-span-2 flex items-center"}>
                <MinMaxLine min={Math.floor(day.temp.min)}
                            max={Math.floor(day.temp.max)} />
              </div>
              <b className={"text-right"}>{Math.floor(day.temp.max)}°C</b>
            </>)
        })}
      </div>
    </div>
  );
}

export default WeatherTable